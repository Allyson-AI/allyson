
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

async function sendMessage(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const { message } = req.body;
  const { id } = req.params;

  try {
    const session = await Session.findOneAndUpdate(
      { sessionId: id },
      { $push: { pendingInterruption: { message: message } } }
    );

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error sending message:", errorMessage);
    res.status(500).json({ error: "Failed to send message" });
  }
}

export { sendMessage };
