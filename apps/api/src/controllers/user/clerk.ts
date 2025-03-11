

import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { setTimeout } from "timers/promises";
import { retry } from "../../utils/retry";

// Function to handle the deletion of a user in the database
async function removeUserInDatabase(userId: string) {
  // Find the user in the database using the userId
  let user = await retry(() => User.findOne({ userId: userId }));

  if (!user) {
    throw new Error(`User with userId ${userId} not found`);
  }

  // Delete the user from the database using its unique _id
  await retry(() => User.findByIdAndDelete(user._id));

  console.log(`Successfully deleted user and related data for userId ${userId}`);
}

// Webhook handler for Clerk events
async function clerk(req: Request, res: Response) {
  const body = req.body;
  const event = body.event;
  
  console.log("Received event:", event);

  try {
    if (event.type === "user.deleted") {
      await removeUserInDatabase(event.data.id);
      return res.status(200).json({ message: "User deleted successfully." });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error deleting user: ${errorMessage}`, error);
    return res.status(500).json({ message: "Error deleting user", error: errorMessage });
  }
}

export { clerk };
