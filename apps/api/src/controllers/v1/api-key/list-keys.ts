
import { Request, Response } from "express";
import { ApiKey } from "../../../models/api-key";
import { ExpressRequestWithAuth } from "@clerk/express";

export const listApiKeys = async (
  req: ExpressRequestWithAuth | Request,
  res: Response
) => {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const { page = 1, limit = 10, status } = req.query;
  console.log(status)
  try {
    const query: Record<string, unknown> = { userId };
    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    const options = {
      sort: { createdAt: -1 },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    };

    const [apiKeys, total] = await Promise.all([
      ApiKey.find(query, null, options),
      ApiKey.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));
  
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalApiKeys: total,
      data: apiKeys.map((key) => ({
        id: key._id,
        name: key.name,
        keyPreview: key.keyPreview,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
        isActive: key.isActive,
      })),
    });
  } catch (error) {
    console.error("Error listing API keys:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving API keys",
    });
  }
};
