

import { Request, Response, NextFunction } from "express";
import { ApiKey } from "../models/api-key";
import bcrypt from "bcrypt";

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    type: string;
  };
}

export const verifyApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;

  if (!apiKey) {
    return next(); // Continue to other auth methods if no API key
  }

  // Add this check for Stripe webhooks
  if (req.path === "/webhooks/stripe") {
    return next();
  }

  // Check for RevenueCat header
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1];
    if (token === process.env.REVENUECAT_AUTH_HEADER_KEY) {
      return next();
    }
  }

  try {
    // Find all active API keys
    const activeKeys = await ApiKey.find({ isActive: true });

    // Compare the provided API key with each hashed key
    let matchedKey = null;
    for (const keyDoc of activeKeys) {
      const isMatch = await bcrypt.compare(apiKey.toString(), keyDoc.key);
      if (isMatch) {
        matchedKey = keyDoc;
        break;
      }
    }

    if (!matchedKey) {
      return res.status(401).json({
        success: false,
        error: "Invalid API key",
      });
    }

    // Update last used timestamp
    await ApiKey.findByIdAndUpdate(matchedKey._id, {
      lastUsed: new Date(),
    });

    // Set auth information to match Clerk's format
    req.auth = {
      userId: matchedKey.userId.toString(),
      type: "api-key",
    };

    return next();
  } catch (error) {
    console.error("API key verification error:", error);
    res.status(500).json({
      success: false,
      error: "Error verifying API key",
    });
  }
};
