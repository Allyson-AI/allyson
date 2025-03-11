
import { Request, Response } from "express";
import { ApiKey } from "../../../models/api-key";
import { ExpressRequestWithAuth } from "@clerk/express";

async function queryApiKeys(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const { page = 1, limit = 15, status, searchTerm } = req.query;
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const query: Record<string, unknown> = { userId };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // Add search filter if provided
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { keyPreview: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get total count for pagination
    const totalApiKeys = await ApiKey.countDocuments(query);
    
    // Get paginated results
    const apiKeys = await ApiKey.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: apiKeys.map((key) => ({
        id: key._id,
        name: key.name,
        keyPreview: key.keyPreview,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
        isActive: key.isActive,
      })),
      totalApiKeys,
      totalPages: Math.ceil(totalApiKeys / Number(limit)),
    });
  } catch (error) {
    console.error("Error querying documents:", error);
    res.status(500).json({ error: "Failed to query documents" });
  }
}

export { queryApiKeys };
