
import { Request, Response } from "express";
import * as k8s from "@kubernetes/client-node";
import path from "path";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";

// Use __dirname for CommonJS
const KUBE_TEST_CONFIG_PATH = path.join(
  __dirname,
  "browser-k8-test-kubeconfig.yaml"
);
const KUBE_PRODUCTION_CONFIG_PATH = path.join(
  __dirname,
  "browser-k8-production-kubeconfig.yaml"
);

const KUBE_CONFIG_PATH =
  process.env.NODE_ENV === "production"
    ? KUBE_PRODUCTION_CONFIG_PATH
    : KUBE_TEST_CONFIG_PATH;


export async function stopSession(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const sessionId = req.params.id;

  try {
    const session = await Session.findOneAndUpdate(
      { sessionId: sessionId },
      { $set: { status: "stopped", endTime: new Date() } }
    );


    res.status(200).json({
      message: "Session stopped successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error stopping session:", errorMessage);
    res.status(500).json({ error: "Failed to stop session" });
  }
}
