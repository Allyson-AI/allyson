
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

async function querySessions(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    status = "",
    source = "",
  } = req.query;
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const query: Record<string, unknown> = { userId };

    if (searchTerm) {
      // Simple contains search, case insensitive
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { sessionId: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (status !== "" && status !== undefined) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    const sessions = await Session.find(query)
      .select("name sessionId status startTime files cost updatedAt -_id")
      .sort({ startTime: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const totalSessions = await Session.countDocuments(query);

    res.status(200).json({
      sessions,
      totalSessions,
      totalPages: Math.ceil(totalSessions / Number(limit)),
    });
  } catch (error) {
    console.error("Error querying documents:", error);
    res.status(500).json({ error: "Failed to query documents" });
  }
}

export { querySessions };
