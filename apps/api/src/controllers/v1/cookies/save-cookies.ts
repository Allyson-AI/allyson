import { Request, Response } from "express";
import { Cookies } from "../../../models/cookies";
import { ExpressRequestWithAuth } from "@clerk/express";
import crypto from "crypto";

// Define a secret key for encryption (store this securely)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const IV_LENGTH = 16; // For AES, this is always 16

// Convert the hexadecimal string to a Buffer
const encryptionKeyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// Ensure the encryption key is 32 bytes
if (encryptionKeyBuffer.length !== 32) {
  throw new Error("Invalid ENCRYPTION_KEY length. It must be 32 bytes.");
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKeyBuffer, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const saveCookies = async (req: ExpressRequestWithAuth | Request, res: Response) => {
  try {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    const { url, cookies } = req.body;

    // Check if cookies for this URL and user already exist
    const existingCookies = await Cookies.findOne({ userId, url });

    if (existingCookies) {
      // If cookies exist, you can choose to update them or return a message
      return res.status(409).json({
        success: false,
        message: "Cookies for this URL already exist. Consider updating them instead.",
      });
    }

    const encryptedCookies = cookies.map((cookie: any) => ({
      ...cookie,
      value: encrypt(cookie.value),
    }));

    // If no existing cookies, save the new cookies
    const newCookies = new Cookies({
      userId,
      url,
      cookies: encryptedCookies,
    });

    await newCookies.save();

    res.status(201).json({
      success: true,
      data: newCookies,
      message: "Cookies saved successfully.",
    });
  } catch (error) {
    console.error("Error saving cookies:", error);
    res.status(500).json({
      success: false,
      error: "Error saving cookies",
    });
  }
};
