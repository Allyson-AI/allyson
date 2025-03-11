

import express, { Request, Response } from "express";
import Stripe from "stripe";
import { User } from "../../models/user";
import { clerkClient } from "@clerk/express";
import { sendWelcomeEmail } from "../../emails/welcome";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ExpressRequestWithAuth } from "@clerk/express";

// Add type checking for STRIPE_API
if (!process.env.STRIPE_API) {
  throw new Error("STRIPE_API environment variable is required");
}

const stripe = new Stripe(process.env.STRIPE_API, {
  apiVersion: "2023-10-16",
});

// Create a simple in-memory lock
const userLocks = new Map();

export const createAccount = async (
  req: Request | ExpressRequestWithAuth,
  res: Response
) => {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  // Add input validation
  if (!userId) {
    return res.status(400).json({ message: "Invalid user ID provided" });
  }

  // Acquire lock
  if (userLocks.get(userId)) {
    return res
      .status(409)
      .json({ message: "Account creation in progress. Please try again." });
  }
  userLocks.set(userId, true);

  try {
    // Fetch user details from Clerk with error handling
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (error) {
      console.error("Clerk API Error:", error);
      return res
        .status(400)
        .json({ message: "Invalid user ID or user not found" });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";

    // Check for existing user by email first, then by userId
    let existingUser = await User.findOne({ email: email }).exec();
    if (!existingUser) {
      existingUser = await User.findOne({ userId: userId }).exec();
    }

    if (existingUser) {
      return res.status(404).json({ message: "User already exists." });
    }

    // Create Stripe customer
    const stripeResponse = await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`,
    });

    // Create user
    const newUser = await User.create({
      userId: userId,
      stripeId: stripeResponse.id,
      fname: firstName,
      lname: lastName,
      email: email,
      subscribed: false,
      mobileSubscription: false,
      documentStorageUsed: 0,
      lastLogin: Date.now(),
      balance: 0,
      lastRefill: new Date(),
      plan: "free",
      isOnboarded: false,
      notificationSettings: {
        email: true,
        mobile: false,
        lastEmailNotification: new Date(),
        lastEmailSent: "welcome",
      },
    });

    const newUserResponse = newUser.toObject();

    // Remove sensitive information
    delete newUserResponse.stripeId;
    delete newUserResponse.expoPushToken;

    console.log(`New user added: ${newUser.userId}`);
    await sendWelcomeEmail(email);

    // Return user data and API key
    return res.json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release lock
    userLocks.delete(userId);
  }
};
