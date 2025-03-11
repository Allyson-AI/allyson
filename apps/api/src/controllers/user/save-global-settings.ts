

import { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

async function saveGlobalSettings(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const { globalVariables, globalDetails } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { globalVariables: globalVariables, globalDetails: globalDetails } }
    );

    res.status(200).json({
      message: "Global settings saved successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error saving global settings:", errorMessage);
    res.status(500).json({ error: "Failed to save global settings" });
  }
}

export { saveGlobalSettings };
