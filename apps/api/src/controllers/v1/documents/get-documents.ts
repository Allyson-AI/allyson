
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Helper function to check if URL is expired
async function isUrlExpired(signedUrl: string | undefined): Promise<boolean> {
  try {
    if (!signedUrl) return true;
    
    const url = new URL(signedUrl);
    const urlParams = new URLSearchParams(url.search);
    const amzDate = urlParams.get('X-Amz-Date');
    const expires = urlParams.get('X-Amz-Expires');
    
    if (!amzDate || !expires) return true;
    
    // Convert AWS datetime format to timestamp
    const dateTime = new Date(
      `${amzDate.slice(0, 4)}-${amzDate.slice(4, 6)}-${amzDate.slice(6, 8)}T${
        amzDate.slice(9, 11)}:${amzDate.slice(11, 13)}:${amzDate.slice(13, 15)}Z`
    );
    
    const expirationTime = dateTime.getTime() / 1000 + parseInt(expires);
    return Date.now() / 1000 > expirationTime - 3600; // Consider URLs that will expire within the next hour as expired
  } catch (error) {
    console.error("Error checking URL expiration:", error);
    return true; // If we can't parse the URL, assume it's expired
  }
}

async function getDocuments(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const { page = 1, limit = 10 } = req.query;
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const query: Record<string, unknown> = { userId };

    const options = {
      sort: { startTime: -1 },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: "files sessionId userId",
    };

    const [sessions, total] = await Promise.all([
      Session.find(query, null, options),
      Session.countDocuments(query),
    ]);

    // Check and refresh expired URLs for files
    const updatedSessions = await Promise.all(sessions.map(async (session) => {
      let needsUpdate = false;
      
      if (session.files?.length > 0) {
        for (const file of session.files) {
          if (await isUrlExpired(file.signedUrl)) {
            const key = `${session.userId}/sessions/${session.sessionId}/${file.filename}`;
            const command = new GetObjectCommand({
              Bucket: "allyson",
              Key: key,
            });

            const newSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 604800 }); // 7 days

            await Session.updateOne(
              { 
                sessionId: session.sessionId,
                "files.filename": file.filename 
              },
              {
                "$set": {
                  "files.$.signedUrl": newSignedUrl,
                  "files.$.timestamp": new Date()
                }
              }
            );
            needsUpdate = true;
          }
        }
      }

      // If URLs were updated, fetch the fresh session
      if (needsUpdate) {
        const updatedSession = await Session.findOne({ sessionId: session.sessionId });
        return updatedSession || session;
      }
      return session;
    }));

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      files: updatedSessions.flatMap((session) => 
        session.files.map((file) => ({
          ...file,
          sessionId: session.sessionId,
          path: undefined,
        }))
      ),
      currentPage: Number(page),
      totalPages,
      totalFiles: total,
    });
  } catch (error) {
    console.error("Error fetching browser sessions:", error);
    res.status(500).json({ error: "Failed to fetch browser sessions" });
  }
}

export { getDocuments };
