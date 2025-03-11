
import express, { Request, Response } from "express";
import crypto from "crypto";
import { ApiKey } from "../../../models/api-key";
import { ExpressRequestWithAuth } from "@clerk/express";
import bcrypt from "bcrypt";

export const createApiKey = async (req: ExpressRequestWithAuth | Request, res: Response) => {
  try {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    
    // Generate a random API key with prefix
    const randomBytes = crypto.randomBytes(24).toString("hex");
    const fullKey = `sk-allyson-${randomBytes}`;
    
    // Create preview version (first 12 chars + ... + last 4 chars)
    const keyPreview = `sk-allyson-${randomBytes.slice(0, 3)}...${randomBytes.slice(-4)}`;
    
    // Hash the full key using bcrypt instead of SHA-256
    const hashedKey = await bcrypt.hash(fullKey, 10);

    // Create new API key document
    const apiKey = new ApiKey({
      key: hashedKey,
      keyPreview,
      userId: userId,
      name: req.body.name || "Default Key",
    });

    await apiKey.save();

    res.status(201).json({
      success: true,
      data: {
        name: apiKey.name,
        key: fullKey, // Send the full unhashed key
        keyPreview: apiKey.keyPreview, // Send the preview version
        createdAt: apiKey.createdAt,
      },
      message: "API key created successfully. Please store this key safely as it won't be shown again.",
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    res.status(500).json({
      success: false,
      error: "Error creating API key",
    });
  }
};
