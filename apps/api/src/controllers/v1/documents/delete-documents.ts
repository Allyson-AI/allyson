
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { User } from "../../../models/user";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ExpressRequestWithAuth } from "@clerk/express";

if (
  !process.env.S3_ENDPOINT ||
  !process.env.S3_ACCESS_KEY ||
  !process.env.S3_SECRET_KEY
) {
  throw new Error("Missing required S3 environment variables");
}

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: false,
  region: "nyc3",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

interface FileToDelete {
  sessionId: string;
  fileId: string;
}

interface SaveToFileAction {
  save_to_file: {
    file_path: string;
    status?: string;
  };
}

interface AgentAction {
  save_to_file?: {
    file_path: string;
    status?: string;
  };
  [key: string]: any;
}

async function deleteDocuments(
  req: ExpressRequestWithAuth | Request,
  res: Response
) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const { filesToDelete } = req.body as { filesToDelete: FileToDelete[] };
    if (!filesToDelete?.length) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    // Find the user first to track storage changes
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let totalBytesDeleted = 0;

    // Group files by sessionId for efficient querying
    const filesBySession = filesToDelete.reduce<Record<string, string[]>>(
      (acc, file) => {
        if (!acc[file.sessionId]) {
          acc[file.sessionId] = [];
        }
        acc[file.sessionId]!.push(file.fileId);
        return acc;
      },
      {}
    );

    const results = await Promise.all(
      Object.entries(filesBySession).map(async ([sessionId, fileIds]) => {
        const session = await Session.findOne({ sessionId });
        if (!session) {
          return {
            sessionId,
            error: "Session not found",
            success: false,
            files: fileIds,
          };
        }

        // Process each file in the session
        for (const fileId of fileIds) {
          const fileIndex = session.files.findIndex((f) => {
            if (!f?.id) return false;
            return f.id.toString() === fileId;
          });

          if (fileIndex !== -1) {
            const file = session.files[fileIndex];
            totalBytesDeleted += file.size || 0;

            try {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: process.env.S3_BUCKET,
                  Key: `${userId}/sessions/${sessionId}/${file.filename}`,
                })
              );

              // Update the session using MongoDB's update operation
              const updatedMessages = session.messages.map((message) => {
                if (
                  message.role === "assistant" &&
                  message.agent_data?.action?.[0]?.save_to_file
                ) {
                  return {
                    ...message,
                    agent_data: {
                      ...message.agent_data,
                      action: [
                        {
                          save_to_file: {
                            ...message.agent_data.action[0].save_to_file,
                            status: "deleted",
                          },
                        },
                      ],
                    },
                  };
                }
                return message;
              });

              await Session.updateOne(
                { sessionId: sessionId },
                {
                  $set: { messages: updatedMessages },
                  $pull: { files: { id: fileId } },
                }
              );
            } catch (err) {
              console.error("Error deleting file from S3:", err);
              continue;
            }
          }
        }

        return {
          sessionId,
          success: true,
          files: fileIds,
        };
      })
    );

    // Update user's storage usage, ensuring it doesn't go below 0
    const newStorageUsed = Math.max(
      0,
      (user.documentStorageUsed ?? 0) - totalBytesDeleted
    );
    await User.updateOne(
      { userId },
      { $set: { documentStorageUsed: newStorageUsed } }
    );

    return res.json({
      message: "Documents deletion completed",
      results,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return res.status(500).json({ message: "Error deleting documents." });
  }
}

export { deleteDocuments };
