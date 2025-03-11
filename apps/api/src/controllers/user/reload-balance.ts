import express, { Request, Response } from "express";
import Stripe from "stripe";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";
if (!process.env.STRIPE_API) {
  throw new Error('STRIPE_API environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_API, {
  apiVersion: "2023-10-16",
});

async function reloadBalance(req: ExpressRequestWithAuth | Request, res: Response) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const body = req.body;
  try {
    const user = await User.findOne({ userId: userId });
    
    if (!user || !user.stripeId) {
      return res.status(404).json({ message: "User not found or missing Stripe ID" });
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product: process.env.STRIPE_BALANCE_RELOAD_ID,
            unit_amount: Math.floor(body.amount * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
      mode: "payment",
      cancel_url: `${process.env.HOST_URL}/settings`,
      success_url: `${process.env.HOST_URL}/settings`,
    });

    return res.json({ session });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Error creating reload balance url" });
  }
}

export { reloadBalance };
