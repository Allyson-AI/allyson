import mongoose, { Schema, Document, Model } from "mongoose";

// Define interface for ApiKey document
interface IApiKey extends Document {
  key: string;
  keyPreview: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    keyPreview: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUsed: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Add indexes for better query performance
apiKeySchema.index({ key: 1 }, { unique: true });
apiKeySchema.index({ userId: 1 });

// Update model export with proper typing
const ApiKey: Model<IApiKey> = mongoose.models.ApiKey || mongoose.model<IApiKey>("ApiKey", apiKeySchema);

export { ApiKey }; 