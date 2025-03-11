import mongoose, { Schema, Document, Model } from "mongoose";

// Define interface for Session document
interface ISession extends Document {
  name?: string;
  userId: string;
  sessionId: string;
  lastScreenshotUrl?: string | null;
  lastScreenshotTimestamp?: Date | null;
  status:
    | "active"
    | "inactive"
    | "completed"
    | "failed"
    | "humanInput"
    | "stopped"
    | "paused";
  success: boolean;
  messages: Array<any>;
  files: Array<any>;
  cost: number;
  allysonCost: number;
  responseQuality: "good" | "bad" | "noResponse";
  maxSteps: number;
  pendingInterruption: Array<any>;
  startTime: Date;
  endTime?: Date;
  settings: Record<string, any>;
  source: "web" | "api";
  sessionVariables: Array<any>;
  sessionDetails: string;
  globalVariables: Array<any>;
  globalDetails: string;
  podStatus: "running" | "stopped";
  vncPassword?: string;
}

const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    lastScreenshotUrl: {
      type: String,
      required: false,
      default: null,
    },
    lastScreenshotTimestamp: {
      type: Date,
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "completed",
        "failed",
        "humanInput",
        "stopped",
        "paused",
      ],
      default: "active",
    },
    source: {
      type: String,
      enum: ["client", "api"],
      default: "client",
    },
    success: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array,
      default: [],
    },
    files: {
      type: Array,
      default: [],
    },
    cost: {
      type: Number,
      default: 0,
    },
    allysonCost: {
      type: Number,
      default: 0,
    },

    responseQuality: {
      type: String,
      enum: ["good", "bad", "noResponse"],
      default: "noResponse",
    },
    maxSteps: {
      type: Number,
      default: 30,
    },
    pendingInterruption: {
      type: Array,
      default: [],
    },
    sessionVariables: {
      type: Array,
      default: [],
    },
    sessionDetails: {
      type: String,
      default: "",
    },
    globalVariables: {
      type: Array,
      default: [],
    },
    globalDetails: {
      type: String,
      default: "",
    },
    podStatus: {
      type: String,
      enum: ["running", "stopped"],
      default: "running",
    },
    vncPassword: {
      type: String,
      default: "",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    settings: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Add indexes to sessionSchema
sessionSchema.index({ userId: 1 });
sessionSchema.index({ sessionId: 1 }, { unique: true });

// Update model export with proper typing
const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);

export { Session };
