
import express, { Request, Response } from "express";
import { User, BillingLogs } from "../../models/user";
import { setTimeout } from "timers/promises";

interface UpdateFields {
  $push?: {
    billingLogs: BillingLog;
  };
  [key: string]: any;
}

interface BillingLog {
  timestamp: number;
  [key: string]: any;
}

interface ProductCreditsMap {
  "5_balance_reload": number;
  "10_balance_reload": number;
  "20_balance_reload": number;
}

async function updateUserInDatabase(
  userId: string,
  updateFields: UpdateFields
) {
  let attempts = 0;
  const maxAttempts = 10;
  let delay = 200;
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempting to update user with userId: ${userId}`);
      await User.findOneAndUpdate({ userId: userId }, { $set: updateFields });
      console.log(`User with userId: ${userId} updated successfully`);
      return;
    } catch (e) {
      attempts++;
      console.log(`Attempt ${attempts} failed for userId: ${userId}`);
      if (attempts >= maxAttempts) {
        console.log(
          `Max attempts reached. Throwing error for userId: ${userId}`
        );
        throw e;
      }
      console.log(
        `Retrying database update... Attempt ${attempts}, next delay: ${delay}ms`
      );
      await setTimeout(delay);
      delay *= 2;
    }
  }
}

async function revenueCat(req: Request, res: Response) {
  const body = req.body;
  const event = body.event;

  console.log("Received event:", event);

  try {
    const user = await User.findOne({
      userId: event.app_user_id,
    });

    const productCredits: ProductCreditsMap = {
      "5_balance_reload": 5,
      "10_balance_reload": 10,
      "20_balance_reload": 20,
    };

    let creditsToAdd =
      productCredits[event.product_id as keyof ProductCreditsMap] || 0;

    let updateFields: UpdateFields = {
      $push: undefined,
    };

    let billingLog: BillingLog = {
      timestamp: Date.now(),
    };

    let newBalance = (user?.balance || 0) + creditsToAdd;

    if (event.type === "RENEWAL" || event.type === "INITIAL_PURCHASE") {
      updateFields = {
        mobileSubscription: true,
        subscribed: true,
        plan: "pro",
        balance: newBalance,
      };
      billingLog = {
        timestamp: Date.now(),
        previousBalance: user?.balance || 0,
        newBalance: newBalance,
        amount: creditsToAdd,
        type: "subscription_payment",
      };
    } else if (event.type === "NON_RENEWING_PURCHASE") {
      updateFields = {
        balance: newBalance,
      };
      billingLog = {
        timestamp: Date.now(),
        previousBalance: user?.balance || 0,
        newBalance: newBalance,
        amount: creditsToAdd,
        type: "reload",
      };
    } else if (event.type === "EXPIRATION") {
      console.log(`Event type is EXPIRATION`);
      updateFields = {
        mobileSubscription: false,
        subscribed: false,
        plan: "free",
      };
      // No billing log for expiration
    }

    if (Object.keys(updateFields).length > 0) {
      await updateUserInDatabase(event.app_user_id, updateFields);
    }

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

export { revenueCat };
