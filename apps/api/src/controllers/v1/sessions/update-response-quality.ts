
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

async function updateResponseQuality(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const sessionId = req.params.id;
  const { responseQuality } = req.body;
  try {
    await Session.findOneAndUpdate(
      { sessionId },
      { responseQuality: responseQuality }
    );

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error updating human input:", errorMessage);
    res.status(500).json({ error: "Failed to update human input" });
  }
}

export { updateResponseQuality };
