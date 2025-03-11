import { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

async function updateUserInDatabase(
  userId: string,
  expoPushToken: string,
  notificationSettings: { mobile: boolean; email: boolean }
) {
  await User.findOneAndUpdate(
    { userId: userId },
    { expoPushToken, notificationSettings },
    { new: true }
  );
}

async function updateNotifications(
  req: ExpressRequestWithAuth | Request,
  res: Response
) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const { expoPushToken, mobile, email } = req.body;
  if (!userId || mobile === undefined || email === undefined) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const notificationSettings = {
    mobile,
    email,
  };

  try {
    await updateUserInDatabase(userId, expoPushToken, notificationSettings);

    return res.json({ message: "Updated Successfully" });
  } catch (e) {
    console.error("Error updating user:", e);
    return res.status(500).json({ message: "Error updating user." });
  }
}

export { updateNotifications };
