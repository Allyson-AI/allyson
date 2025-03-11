

import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { clerkClient, ExpressRequestWithAuth } from "@clerk/express";
import { retry } from "../../utils/retry";

async function deleteAccount(
  req: Request | ExpressRequestWithAuth,
  res: Response
) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    // Delete the user from the database using its unique _id
    await User.findByIdAndDelete(user._id);

    // Ensure userId is not null before proceeding
    if (userId) {
      // Delete the user using the Clerk SDK
      try {
        await clerkClient.users.deleteUser(userId);
      } catch (error: unknown) {
        const clerkError = error as { status?: number; message?: string };
        if (clerkError.status === 404) {
          console.log(
            `Clerk user with ID ${userId} not found: ${clerkError.message}`
          );
        } else {
          throw error;
        }
      }
    } else {
      console.error("User ID is null, cannot delete user");
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Respond with a success message
    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    // Respond with an error message in case of any failures
    return res.status(500).json({ message: "Error deleting account" });
  }
}

export { deleteAccount };
