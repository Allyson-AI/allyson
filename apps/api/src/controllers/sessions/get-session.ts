
import { Request, Response } from "express";
import { Session } from "../../models/session";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ExpressRequestWithAuth } from "@clerk/express";

if (!process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
  throw new Error('Missing required S3 environment variables');
}

const s3Client = new S3Client({
  endpoint: `https://${process.env.S3_ENDPOINT}`,
  forcePathStyle: false,
  region: "nyc3",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Helper function to check if a signed URL is expired
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

async function getSession(req: ExpressRequestWithAuth | Request, res: Response): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const sessionId = req.params.id;

  try {
    let session = await Session.findOne({ sessionId, userId }).select('-allysonCost -pendingInterruption -podStatus');
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    let needsUpdate = false;

    // Check and refresh expired URLs for files
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
              sessionId,
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

    // Check and refresh screenshot URL
    if (session.lastScreenshotUrl && await isUrlExpired(session.lastScreenshotUrl)) {
      const key = `${session.userId}/sessions/${session.sessionId}/screenshot.png`;
      const command = new GetObjectCommand({
        Bucket: "allyson",
        Key: key,
      });

      const newScreenshotUrl = await getSignedUrl(s3Client, command, { expiresIn: 604800 }); // 7 days

      await Session.updateOne(
        { sessionId },
        {
          "$set": {
            lastScreenshotUrl: newScreenshotUrl,
            lastScreenshotTimestamp: new Date()
          }
        }
      );
      needsUpdate = true;
    }

    // If any URLs were updated, fetch the fresh session
    if (needsUpdate) {
      session = await Session.findOne({ sessionId });
    }

    // Ensure session is not null before accessing files
    if (session && session.files) {
      session.files = session.files.map(file => {
        const { path, ...rest } = file;
        return rest;
      });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error fetching browser session:", error);
    res.status(500).json({ error: "Failed to fetch browser session" });
  }
}

export { getSession };