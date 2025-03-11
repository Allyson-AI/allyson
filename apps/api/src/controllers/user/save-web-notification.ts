import { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

async function saveWebNotification(
    req: ExpressRequestWithAuth | Request,
    res: Response
  ) {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    const { web, webSubscription } = req.body;
    if (!userId || web === undefined || webSubscription === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    try {
      await User.findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            "notificationSettings.web": web,
            "notificationSettings.webSubscription": webSubscription,
          },
        },
        { new: true }
      );
  
      console.log("Updated Successfully");
      return res.json({ message: "Updated Successfully" });
    } catch (e) {
      console.error("Error updating user:", e);
      return res.status(500).json({ message: "Error updating user." });
    }
  }
  
  export { saveWebNotification };
