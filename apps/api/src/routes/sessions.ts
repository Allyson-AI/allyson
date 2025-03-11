import express, { Request, Response } from "express";
import { requireAuth } from "@clerk/express";

import { getSession } from "../controllers/sessions/get-session";

const sessionsRouter = express.Router();

sessionsRouter.get("/:id", requireAuth(), getSession);

export default sessionsRouter;

