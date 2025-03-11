
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

async function getSessions(req: ExpressRequestWithAuth | Request, res: Response): Promise<void> {
  const { page = 1, limit = 10, status, source } = req.query;
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const query: Record<string, unknown> = { userId };
    
    // Add source filter if it's "client", otherwise return only API sessions
    if (source === 'client') {
      query.source = 'client';
    } else {
      query.source = 'api';
    }
    if(status) {
      query.status = status;
    }

    const options = {
      sort: { startTime: -1 },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: 'name sessionId status startTime files cost updatedAt -_id',
    };

    const [sessions, total] = await Promise.all([
      Session.find(query, null, options),
      Session.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      sessions,
      currentPage: page,
      totalPages,
      totalSessions: total,
    });
  } catch (error) {
    console.error("Error fetching browser sessions:", error);
    res.status(500).json({ error: "Failed to fetch browser sessions" });
  }
}

export { getSessions };