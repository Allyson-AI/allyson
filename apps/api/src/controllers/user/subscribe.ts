

import express, { Request, Response } from "express";
import Stripe from "stripe";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

if (!process.env.STRIPE_API) {
  throw new Error("STRIPE_API environment variable is not set");
}

const stripe = new Stripe(process.env.STRIPE_API, {
  apiVersion: "2023-10-16",
});

async function subscribe(req: ExpressRequestWithAuth | Request, res: Response) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  const { plan } = req.body;
  const priceId =
    plan === "business"
      ? process.env.STRIPE_BUSINESS_PLAN_ID
      : null;

  if (!priceId) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  try {
    const user = await User.findOne({ userId: userId });

    if (!user || !user.stripeId) {
      return res
        .status(404)
        .json({ message: "User not found or missing Stripe ID" });
    }

    let session = await stripe.checkout.sessions.create({
      customer: user.stripeId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        description: priceId,
        metadata: {
          planId: priceId,
        },
      },
      metadata: {
        planId: priceId,
      },
      cancel_url: `${process.env.HOST_URL}/settings/?stripeResult=cancelled`,
      success_url: `${process.env.HOST_URL}/settings/?stripeResult=success`,
    });

    return res.json({ session });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error creating subscription url" });
  }
}

export { subscribe };
