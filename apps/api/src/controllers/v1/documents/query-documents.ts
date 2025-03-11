
import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
}

async function queryDocuments(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const { searchTerm, page = 1, limit = 10 } = req.query;
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    const query: Record<string, unknown> = { userId };

    if (searchTerm) {
      const sanitizedSearchTerm = escapeRegExp(searchTerm as string);
      query.$or = [
        { "files.filename": { $regex: sanitizedSearchTerm, $options: "i" } },
        { sessionId: { $regex: sanitizedSearchTerm, $options: "i" } },
      ];
    }

    const options = {
      sort: { createdAt: -1 },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: "files sessionId userId",
    };

    const [sessions, total] = await Promise.all([
      Session.find(query, null, options).lean(),
      Session.countDocuments(query),
    ]);

    const files = sessions.flatMap((session) =>
      session.files.map((file) => ({
        ...file,
        sessionId: session.sessionId,
        path: undefined,
      }))
    );

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      files,
      currentPage: Number(page),
      totalPages,
      totalFiles: total,
    });
  } catch (error) {
    console.error("Error querying documents:", error);
    res.status(500).json({ error: "Failed to query documents" });
  }
}

export { queryDocuments };
