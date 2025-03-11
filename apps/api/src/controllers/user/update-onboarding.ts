import { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

async function updateOnboarding(
  req: ExpressRequestWithAuth | Request,
  res: Response
) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  try {
    await User.findOneAndUpdate(
      { userId: userId },
      { $set: { isOnboarded: true } },
      { new: true }
    );

    return res.json({ message: "Updated Successfully" });
  } catch (e) {
    console.error("Error updating user:", e);
    return res.status(500).json({ message: "Error updating user." });
  }
}

export { updateOnboarding };
