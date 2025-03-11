
import { Request, Response } from "express";
import { ApiKey } from "../../../models/api-key";
import mongoose from "mongoose";
import { ExpressRequestWithAuth } from "@clerk/express";

export const revokeApiKey = async (req: ExpressRequestWithAuth | Request, res: Response) => {
  try {
    const { id } = req.params;
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;

    // Check if id exists first
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "API key ID is required"
      });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid API key ID"
      });
    }

    // Find and update the API key
    const apiKey = await ApiKey.findOneAndUpdate(
      {
        _id: id,
        userId: userId // Ensure the key belongs to the user
      },
      {
        isActive: false
      },
      { new: true }
    );

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: "API key not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: apiKey._id,
        name: apiKey.name,
        isActive: apiKey.isActive,
        revokedAt: new Date()
      },
      message: "API key revoked successfully"
    });
  } catch (error) {
    console.error("Error revoking API key:", error);
    res.status(500).json({
      success: false,
      error: "Error revoking API key"
    });
  }
}; 