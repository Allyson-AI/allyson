import express, { Request, Response } from "express";
import { me } from "../../controllers/v1/user/me";
import { requireAuth } from '@clerk/express'

const v1UserRouter = express.Router();

v1UserRouter.get("/me", requireAuth(), me);

export default v1UserRouter;
