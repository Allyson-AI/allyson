
import mongoose, { Schema, Document, Model } from "mongoose";

// Define interfaces for Email and SubjectLine documents
interface IEmail extends Document {
  emailType?: string;
  emailTone?: string;
  emailPurpose?: string;
  recipientRole?: string;
  email?: string;
}

interface ISubjectLine extends Document {
  emailType?: string;
  emailTone?: string;
  emailPurpose?: string;
  recipientRole?: string;
  subjectLine?: string;
}

const emailSchema = new mongoose.Schema(
  {
    emailType: String,
    emailTone: String,
    emailPurpose: String,
    recipientRole: String,
    email: String,
  },
  { timestamps: true }
);

const subjectLineSchema = new mongoose.Schema(
  {
    emailType: String,
    emailTone: String,
    emailPurpose: String,
    recipientRole: String,
    subjectLine: String,
  },
  { timestamps: true }
);

// Add indexes for better query performance
emailSchema.index({ emailType: 1, emailTone: 1, emailPurpose: 1 });
subjectLineSchema.index({ emailType: 1, emailTone: 1, emailPurpose: 1 });

// Update model exports with proper typing
const Email: Model<IEmail> = mongoose.models.Email || mongoose.model<IEmail>("Email", emailSchema);
const SubjectLine: Model<ISubjectLine> = mongoose.models.SubjectLine || mongoose.model<ISubjectLine>("SubjectLine", subjectLineSchema);

export { Email, SubjectLine };
