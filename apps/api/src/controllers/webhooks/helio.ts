
import express, { Request, Response } from "express";
import { User, BillingLogs } from "../../models/user";

async function helio(req: Request, res: Response) {
  const body = req.body;
  const event = body.event;

  console.log("Received event:", event);

  try {
    const user = await User.findOne({
      userId: event.app_user_id,
    });


    return res
      .status(200)
      .json({ message: "Subscription status updated successfully" });
  } catch (e: unknown) {
    console.log(`Error updating subscription: ${(e as Error).message}`, e);
    return res
      .status(500)
      .json({
        message: "Error Updating Subscription",
        error: (e as Error).message,
      });
  }
}

export { helio };
