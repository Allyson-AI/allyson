import { Request, Response } from "express";
import * as k8s from "@kubernetes/client-node";
import fs from "fs";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";
import { getKubeConfigPath } from "../../../utils/kubeconfig";

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

    // Delete the Kubernetes resources
    const kubeConfigPath = getKubeConfigPath();
    const kc = new k8s.KubeConfig();
    kc.loadFromFile(kubeConfigPath);

    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

    // Delete deployment, service, and ingress
    try {
      await k8sApi.deleteNamespacedDeployment(
        `browser-${sessionId}`,
        "default"
      );
      await k8sCoreApi.deleteNamespacedService(
        `browser-${sessionId}`,
        "default"
      );
      await k8sNetworkingApi.deleteNamespacedIngress(
        `browser-${sessionId}`,
        "default"
      );
    } catch (error) {
      console.error("Error deleting Kubernetes resources:", error);
    }

    // Clean up the temporary kubeconfig file
    try {
      fs.unlinkSync(kubeConfigPath);
    } catch (error) {
      console.error("Error cleaning up kubeconfig:", error);
    }

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
