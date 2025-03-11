import connectMongoDB from "@allyson/lib/mongodb";
import { SubjectLine } from "@allyson/models/email";

export async function POST(request) {
  const { emailType, emailTone, emailPurpose, recipientRole } = await request.json();
  
  // Connect to MongoDB
  await connectMongoDB();

  // Create a query object, only including non-null/undefined fields
  const query = {};
  if (emailType) query.emailType = emailType;
  if (emailTone) query.emailTone = emailTone;
  if (emailPurpose) query.emailPurpose = emailPurpose;
  if (recipientRole) query.recipientRole = recipientRole;

  console.log("Query:", query);

  const emails = await SubjectLine.find(query);
  
  console.log("Number of matching emails:", emails.length);
  console.log("Matching emails:", emails);

  if (emails.length === 0) {
    return Response.json({ message: "No matching emails found" }, { status: 404 });
  }

  const randomEmail = emails[Math.floor(Math.random() * emails.length)];
  
  return Response.json({ randomEmail }, { status: 200 });
}