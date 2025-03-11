import { Request, Response } from "express";
import { Cookies } from "../../../models/cookies";
import { ExpressRequestWithAuth } from "@clerk/express";

export const checkCookies = async (
  req: ExpressRequestWithAuth | Request,
  res: Response
) => {
  try {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    const { url } = req.body;
    
    // Check if cookies for this URL and user already exist
    const existingCookies = await Cookies.findOne({ userId, url });

    if (existingCookies) {
      return res.status(200).json({
        success: true,
        data: existingCookies,
        message: "Cookies already exist.",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Cookies do not exist.",
      });
    }
  } catch (error) {
    console.error("Error checking cookies:", error);
    res.status(500).json({
      success: false,
      error: "Error checking cookies",
    });
  }
};
