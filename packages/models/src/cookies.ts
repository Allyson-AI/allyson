import mongoose, { Schema, Document, Model } from "mongoose";

// Define interface for a single Cookie document
interface ICookie extends Document {
  domain: string;
  expirationDate: number;
  hostOnly: boolean;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite: string;
  secure: boolean;
  session: boolean;
  storeId: string;
  value: string;
}

// Define schema for a single Cookie
const cookieSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Number,
      required: true,
    },
    hostOnly: {
      type: Boolean,
      required: true,
    },
    httpOnly: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    sameSite: {
      type: String,
      required: true,
    },
    secure: {
      type: Boolean,
      required: true,
    },
    session: {
      type: Boolean,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Disable _id for subdocuments
);

// Define main schema for an array of Cookies
const cookiesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cookies: {
      type: [cookieSchema],
      required: true,
    },
  },
  { timestamps: true }
);

// Update model export with proper typing
const Cookies: Model<ICookie> = mongoose.models.Cookies || mongoose.model<ICookie>("Cookies", cookiesSchema);

export { Cookies }; 
