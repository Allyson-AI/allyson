

import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";
export async function me(req: Request | ExpressRequestWithAuth, res: Response) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    // Check for existing user by email first, then by userId
    let existingUser = await User.findOne({ userId: userId })
      .select('-expoPushToken -stripeId')
      .exec();

    // Check if user exists
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: existingUser.toObject() });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
