import { Request, Response } from "express";
import * as k8s from "@kubernetes/client-node";
import path from "path";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

export async function resumeSession(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const sessionId = req.params.id;
  const { message } = req.body;

  try {
    const session = await Session.findOneAndUpdate(
      { sessionId: sessionId },
      {
        $set: { status: "active" },
        $push: { pendingInterruption: { message: message } },
      }
    );

    res.status(200).json({
      message: "Session stopped successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error stopping session:", errorMessage);
    res.status(500).json({ error: "Failed to stop session" });
  }
}
