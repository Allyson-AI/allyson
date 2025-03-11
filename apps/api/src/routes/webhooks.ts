
import express, { Request, Response } from "express";
import { stripeWebhook } from "../controllers/webhooks/stripe";
import { revenueCat } from "../controllers/webhooks/revenue-cat";

const webhookRouter = express.Router();

webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    stripeWebhook(req, res);
  }
);

webhookRouter.post(
  "/revenue-cat",
  express.json(),
  (req: Request, res: Response) => {
    revenueCat(req, res);
  }
);

export default webhookRouter;
