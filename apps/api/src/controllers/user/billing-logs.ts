

import { Request, Response } from "express";
import { BillingLogs } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";


export async function getBillingLogs(req: ExpressRequestWithAuth | Request, res: Response): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  try {
    const {  page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Use proper mongoose pagination
    const [billingLogs, total] = await Promise.all([
      BillingLogs.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      BillingLogs.countDocuments({ userId })
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: billingLogs,
      currentPage: page,
      totalPages,
      totalLogs: total,
    });
  } catch (error) {
    console.error("Error fetching billing logs:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching billing logs" 
    });
  }
}
