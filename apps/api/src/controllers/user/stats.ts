

import { Request, Response } from "express";
import { Session } from "../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

async function getStats(req: ExpressRequestWithAuth | Request, res: Response): Promise<void> {
  const { days = 7 } = req.query;
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;

  try {
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    // Build the query
    const query: Record<string, unknown> = {
      userId,
      startTime: {
        $gte: startDate,
        $lte: endDate
      }
    };
    query.source = "api";

    // Get sessions and files grouped by date with costs and file sizes
    const sessions = await Session.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$startTime"
            }
          },
          sessionCount: { $sum: 1 },
          totalCost: { $sum: { $ifNull: ["$cost", 0] } },
          fileCount: {
            $sum: {
              $cond: [
                { $isArray: "$files" },
                { $size: "$files" },
                0
              ]
            }
          },
          storageUsed: {
            $sum: {
              $reduce: {
                input: { $ifNull: ["$files", []] },
                initialValue: 0,
                in: { $add: ["$$value", { $ifNull: ["$$this.size", 0] }] }
              }
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Generate array of all dates in range
    const dateArray = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateArray.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create separate arrays for each metric
    const sessionsData = dateArray.map(date => {
      const sessionData = sessions.find(s => s._id === date);
      return {
        date,
        value: sessionData ? sessionData.sessionCount : 0
      };
    });

    const filesData = dateArray.map(date => {
      const sessionData = sessions.find(s => s._id === date);
      return {
        date,
        value: sessionData ? sessionData.fileCount : 0
      };
    });

    const costsData = dateArray.map(date => {
      const sessionData = sessions.find(s => s._id === date);
      return {
        date,
        value: sessionData ? sessionData.totalCost : 0
      };
    });

    const storageData = dateArray.map(date => {
      const sessionData = sessions.find(s => s._id === date);
      return {
        date,
        value: sessionData ? sessionData.storageUsed : 0
      };
    });

    res.status(200).json({
      sessions: sessionsData,
      files: filesData,
      costs: costsData,
      storage: storageData
    });

  } catch (error) {
    console.error("Error fetching session stats:", error);
    res.status(500).json({ error: "Failed to fetch session statistics" });
  }
}

export { getStats };
