import { Request, Response } from "express";
import { Cookies } from "../../../models/cookies";
import { ExpressRequestWithAuth } from "@clerk/express";

export const deleteCookies = async (req: ExpressRequestWithAuth | Request, res: Response) => {
  try {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    const { url } = req.body;

    await Cookies.findOneAndDelete({ userId, url });

    res.status(200).json({
      success: true,
      message: "Cookies deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting cookies:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting cookies",
    });
  }
};
