import express, { Request, Response } from "express";
import { handleOpenAIRequest } from "../../ai/proxy";

const v1AiRouter = express.Router();

// OpenAI API proxy endpoints
// This will handle /v1/chat/completions
v1AiRouter.post("/chat/completions", handleOpenAIRequest);

export default v1AiRouter;
