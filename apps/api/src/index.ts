import "cross-fetch/polyfill";
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDatabase } from "./utils/db";
import { rateLimitMiddleware } from "./middleware/ratelimit";
import { createServer } from "http";
import userRouter from "./routes/user";
import sessionsRouter from "./routes/sessions";
import webhookRouter from "./routes/webhooks";
import v1UserRouter from "./routes/v1/user";
import v1SessionsRouter from "./routes/v1/sessions";
import v1DocumentsRouter from "./routes/v1/documents";
import v1ApiKeysRouter from "./routes/v1/api-keys";
import v1CookiesRouter from "./routes/v1/cookies";
import v1AiRouter from "./routes/v1/ai";
import { verifyApiKey } from "./middleware/verify-api-key";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3030;
server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

// Middleware
app.use(cors());

// Webhooks must be processed higher in the code
app.use("/webhooks", webhookRouter);

app.use(bodyParser.json());

// Apply the rate limiting middleware to all requests.
app.use(rateLimitMiddleware);
app.use(responseTime());

// Add verifyApiKey
app.use(verifyApiKey);
app.use(clerkMiddleware());

// Internal Routes
app.use("/user", userRouter);
app.use("/sessions", sessionsRouter);

// Public API
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Visit docs.allyson.ai for help." });
});
app.use("/v1/", v1UserRouter);
app.use("/v1/sessions", v1SessionsRouter);
app.use("/v1/documents", v1DocumentsRouter);
app.use("/v1/api-keys", v1ApiKeysRouter);
app.use("/v1/cookies", v1CookiesRouter);
app.use("/v1", v1AiRouter);

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  if (err.message === "Unauthenticated") {
    res.status(401).send("Unauthenticated!");
  } else {
    res.status(500).send("Something went wrong!");
  }
});

(async () => {
  try {
    await connectToDatabase();

  } catch (error) {
    console.log("Failed to connect to the database", error);
  }
})();

export default app;
