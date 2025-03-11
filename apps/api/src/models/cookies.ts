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
      required: false,
    },
    expirationDate: {
      type: Number,
      required: false,
    },
    hostOnly: {
      type: Boolean,
      required: false,
    },
    httpOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    path: {
      type: String,
      required: false,
    },
    sameSite: {
      type: String,
      required: false,
    },
    secure: {
      type: Boolean,
      required: false,
    },
    session: {
      type: Boolean,
      required: false,
    },
    storeId: {
      type: String,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
  },
  { _id: false } // Disable _id for subdocuments
);

// Define main schema for an array of Cookies
const cookiesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    cookies: {
      type: [cookieSchema],
      required: false,
    },
  },
  { timestamps: true }
);

// Update model export with proper typing
const Cookies: Model<ICookie> = mongoose.models.Cookies || mongoose.model<ICookie>("Cookies", cookiesSchema);

export { Cookies }; 
