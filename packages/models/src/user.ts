import mongoose, { Schema, Document, Model } from "mongoose";

// Define interfaces for all document types
interface IUser extends Document {
  balance?: number;
  email?: string;
  expoPushToken?: string;
  documentStorageUsed?: number;
  fname?: string;
  isOnboarded?: boolean;
  isOnline?: boolean;
  lastLogin?: string;
  lname?: string;
  mobileSubscription?: boolean;
  notificationSettings?: {
    mobile: boolean;
    email: boolean;
    web: boolean;
    webSubscriptions: object[];
    lastMobileNotification: Date;
    lastEmailNotification: Date;
    lastEmailSent: string;
    lastWebNotification: Date;
  };
  organizationId?: string;
  plan?: string;
  planId?: string;
  revenueCatId?: string;
  stripeId?: string;
  subscribed?: boolean;
  userId?: string;
  browserSettings?: Record<string, unknown>;
  globalVariables?: Record<string, unknown>[];
  globalDetails?: string;
}

interface IBillingLogs extends Document {
  userId: string;
  name: string;
  amount: number;
  newBalance: number;
  previousBalance: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0
    },
    email: { type: String, required: true },
    expoPushToken: String,
    documentStorageUsed: { type: Number, default: 0 },
    documentStorageLimit: { type: Number, default: 1073741824 },
    fname: String,
    isOnboarded: { type: Boolean, default: false },
    lastLogin: String,
    lname: String,
    notificationSettings: {
      mobile: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
      web: { type: Boolean, default: false },
      webSubscriptions: { type: Array, default: [] },
      lastMobileNotification: Date,
      lastEmailNotification: Date,
      lastEmailSent: String,
    },
    organizationId: String,
    plan: String,
    planId: String,
    revenueCatId: String,
    stripeId: String,
    subscribed: { type: Boolean, default: false },
    userId: { type: String, required: true },
    globalVariables: {
      type: Array,
      default: [],
    },
    globalDetails: {
      type: String,
      default: "",
    },
    trainingOptIn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const billingLogsSchema = new mongoose.Schema<IBillingLogs>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    newBalance: { type: Number, required: true },
    previousBalance: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ userId: 1 }, { unique: true });
billingLogsSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

// Create and export models with proper typing
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const BillingLogs: Model<IBillingLogs> =
  mongoose.models.BillingLogs ||
  mongoose.model<IBillingLogs>("BillingLogs", billingLogsSchema);
const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export { User, BillingLogs, Notification };
export type { IUser, IBillingLogs, INotification };
