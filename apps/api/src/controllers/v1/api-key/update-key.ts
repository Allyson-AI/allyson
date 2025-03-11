
import { Request, Response } from "express";
import { ApiKey } from "../../../models/api-key";
import { ExpressRequestWithAuth } from "@clerk/express";

export const updateApiKey = async (req: ExpressRequestWithAuth | Request, res: Response) => {
  try {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    const keyId = req.params.id;

    if (!keyId) {
      return res.status(400).json({
        success: false,
        error: "API key ID is required",
      });
    }

    const { name } = req.body;

    const apiKey = await ApiKey.findOne({ _id: keyId, userId });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: "API key not found",
      });
    }

    apiKey.name = name;
    await apiKey.save();

    res.status(200).json({
      success: true,
      data: {
        id: apiKey._id,
        name: apiKey.name,
        keyPreview: apiKey.keyPreview,
        createdAt: apiKey.createdAt,
      },
      message: "API key updated successfully",
    });
  } catch (error) {
    console.error("Error updating API key:", error);
    res.status(500).json({
      success: false,
      error: "Error updating API key",
    });
  }
}; 