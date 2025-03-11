import mongoose, { Schema, Document, Model } from "mongoose";

// Define interface for Document document
interface IDocument extends Document {
  userId?: string;
  fileName?: string;
  originalName?: string;
  size?: string;
  type?: string;
  uploadedBy?: string;
}

const documentsSchema = new mongoose.Schema(
  {
    userId: String,
    fileName: String,
    originalName: String,
    size: String,
    type: String,
    uploadedBy: String,
  },
  { timestamps: true }
);

// Add index to documentsSchema
documentsSchema.index({ userId: 1, fileName: 1 });

// Update model export with proper typing
const Documents: Model<IDocument> = mongoose.models.Documents || mongoose.model<IDocument>("Documents", documentsSchema);

export { Documents };
