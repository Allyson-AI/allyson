

import express, { Request, Response } from "express";
import multer from "multer";

import { startSession } from "../../controllers/v1/sessions/start-session";
import { stopSession } from "../../controllers/v1/sessions/stop-session";
import { getSessions } from "../../controllers/v1/sessions/get-sessions";
import { getSession } from "../../controllers/v1/sessions/get-session";
import { getFile } from "../../controllers/v1/sessions/get-file";
import { getSessionStatus } from "../../controllers/v1/sessions/session-status";
import { updateHumanInput } from "../../controllers/v1/sessions/update-human-input";
import { querySessions } from "../../controllers/v1/sessions/query-sessions";
import { requireAuth } from "@clerk/express";
import { sendMessage } from "../../controllers/v1/sessions/send-message";
import { updateResponseQuality } from "../../controllers/v1/sessions/update-response-quality";
import { pauseSession } from "../../controllers/v1/sessions/pause-session";
import { resumeSession } from "../../controllers/v1/sessions/resume-session";

const v1SessionsRouter = express.Router();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

v1SessionsRouter.get("/", requireAuth(), getSessions);

v1SessionsRouter.get("/query", requireAuth(), querySessions);

v1SessionsRouter.post("/new", requireAuth(), startSession);

v1SessionsRouter.post("/:id/pause", requireAuth(), pauseSession);

v1SessionsRouter.post("/:id/resume", requireAuth(), resumeSession);

v1SessionsRouter.post("/:id/stop", requireAuth(), stopSession);

v1SessionsRouter.get("/:id", requireAuth(), getSession);

v1SessionsRouter.get("/:id/status", requireAuth(), getSessionStatus);

v1SessionsRouter.put("/:id/update-human-input", requireAuth(), updateHumanInput);

v1SessionsRouter.post("/:id/send-message", requireAuth(), sendMessage);

v1SessionsRouter.put("/:id/update-response-quality", requireAuth(), updateResponseQuality);

v1SessionsRouter.post("/file", requireAuth(), getFile);

export default v1SessionsRouter;

