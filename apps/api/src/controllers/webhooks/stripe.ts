
import express, { Request } from "express";
import type { Response } from "express";
import Stripe from "stripe";
import { BillingLogs, User, type IUser } from "../../models/user";

const stripe = new Stripe(process.env.STRIPE_API || "", {
  apiVersion: "2023-10-16",
});

// Add type for plan details
interface PlanDetails {
  id: string;
  credits: number;
  name: string;
}

// Add null checks and type safety
async function subscription(user: IUser, planId: string) {
  console.log("planId", planId);

  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeId || "",
  });

  const oldSubscription = subscriptions.data.find(
    (sub) => sub.items?.data?.[0]?.price?.id === user.planId
  );

  if (oldSubscription) {
    await stripe.subscriptions.cancel(oldSubscription.id);
    console.log(`Cancelled old subscription: ${oldSubscription.id}`);
  }

  await BillingLogs.create({
    userId: user._id,
    name: "Business Subscription",
    previousBalance: user.balance || 0,
    newBalance: (user.balance || 0) + 250,
    amount: 250,
    type: "subscription_payment",
  });

  await User.findByIdAndUpdate(user._id, {
    $inc: { balance: 250 },
    $set: {
      subscribed: true,
      plan: "Business",
      planId: process.env.STRIPE_BUSINESS_PLAN_ID,
      documentStorageLimit: 107374182400,
    },
  });
}

async function reload(user: IUser, amount: number) {
  try {
    if (!user) {
      console.log("No user provided to reload function");
      return;
    }

    const numAmount = Number(amount / 100);

    // Create billing log first
    await BillingLogs.create({
      userId: user.userId,
      name: `${numAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })} Reload`,
      previousBalance: user.balance || 0,
      newBalance: (user.balance || 0) + numAmount,
      amount: numAmount,
      type: "reload",
    });

    // Update user balance
    const updatedUser = await User.findOneAndUpdate(
      { userId: user.userId },
      { $inc: { balance: numAmount } },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      throw new Error(`Failed to update user ${user.userId}`);
    }

    return updatedUser;
  } catch (error) {
    console.error("Error in reload function:", error);
    throw error;
  }
}

async function updatePaymentMethod(paymentIntent: Stripe.PaymentIntent) {
  try {
    if (
      !paymentIntent.payment_method ||
      typeof paymentIntent.payment_method !== "string"
    )
      return;
    if (!paymentIntent.customer || typeof paymentIntent.customer !== "string")
      return;

    await stripe.paymentMethods.attach(paymentIntent.payment_method, {
      customer: paymentIntent.customer,
    });
    await stripe.customers.update(paymentIntent.customer, {
      invoice_settings: {
        default_payment_method: paymentIntent.payment_method,
      },
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
  }
}

async function cancelSubscription(user: IUser, planId: string) {
  console.log("cancel");
  // Check if the user has an active subscription with the given planId
  const subscription = await stripe.subscriptions.list({
    customer: user.stripeId,
    status: "active",
    price: planId,
  });

  if (subscription.data.length > 0 && user.planId === planId) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        subscribed: false,
        plan: "free",
        planId: "",
      },
    });
    console.log(`Subscription canceled for user ${user._id}`);
  } else {
    console.log(
      `No active subscription found for user ${user._id} with planId ${planId}`
    );
  }
}

async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    const user = await User.findOne({
      stripeId: (event.data.object as any).customer,
    });

    if (!user) {
      console.error(
        "User not found for stripeId:",
        (event.data.object as any).customer
      );
      return res.status(404).json({ error: "User not found" });
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (paymentIntent.description === process.env.STRIPE_BUSINESS_PLAN_ID) {
          break;
        }
        console.log(
          `Processing payment_intent.succeeded for user ${user.userId}`
        );
        await updatePaymentMethod(paymentIntent);

        await reload(user, paymentIntent.amount);
        break;
      }

      case "checkout.session.completed": {
        // Handle checkout session if needed
        console.log("Checkout session completed");
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.lines?.data?.[0]?.price?.id) {
          await subscription(user, invoice.lines.data[0].price.id);
        }
        break;
      }

      case "customer.subscription.deleted":
      case "invoice.payment_failed": {
        const obj = event.data.object as Stripe.Invoice;
        if (obj.lines?.data?.[0]?.price?.id) {
          await cancelSubscription(user, obj.lines.data[0].price.id);
        } else {
          console.log("Unable to determine the canceled plan ID");
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ message: "Success" });
  } catch (error: unknown) {
    console.error("Webhook Error:", error);
    if (error instanceof Error) {
      return res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }
    // Generic error message for non-Error objects
    return res.status(400).json({ error: "An unknown error occurred" });
  }
}

export { stripeWebhook };
