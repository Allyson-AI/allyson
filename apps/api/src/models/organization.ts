
import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrganization extends Document {
  organizationId: string;
  organizationName: string;
  users: string[];
  admin: string;
}

const organizationSchema = new mongoose.Schema<IOrganization>(
  {
    organizationId: { type: String, required: true },
    organizationName: { type: String, required: true },
    users: { type: [String], default: [] },
    admin: { type: String, required: true },
  },
  { timestamps: true }
);

organizationSchema.index({ organizationId: 1 }, { unique: true });

const Organization: Model<IOrganization> = mongoose.models.Organization || mongoose.model<IOrganization>("Organization", organizationSchema);

export { Organization };
export type { IOrganization };
