
import { Request, Response } from "express";
import * as k8s from "@kubernetes/client-node";
import path from "path";
import { ExpressRequestWithAuth } from "@clerk/express";

// Use __dirname directly since we're in CommonJS
const KUBE_CONFIG_PATH = path.join(__dirname, "browser-k8-test-kubeconfig.yaml");

export async function getSessionStatus(req: ExpressRequestWithAuth | Request, res: Response): Promise<void> {
    const auth = (req as ExpressRequestWithAuth).auth;
    const userId = auth.userId;
    const sessionId = req.params.id;

    if (!sessionId) {
        res.status(400).json({ error: "Session ID is required" });
        return;
    }

    try {
        // Initialize Kubernetes client
        const kc = new k8s.KubeConfig();
        kc.loadFromFile(KUBE_CONFIG_PATH);
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        // Get pods with the matching sessionId label
        const response = await k8sApi.listNamespacedPod(
            'default',
            undefined,
            undefined,
            undefined,
            undefined,
            `session-id=${sessionId}`
        );

        if (response.body.items.length === 0) {
            res.status(404).json({ 
                status: "not_found",
                message: "No pod found for this session ID" 
            });
            return;
        }

        const pod = response.body.items[0];
        
        if (!pod?.status) {
            res.status(500).json({
                status: "error",
                message: "Pod status not available"
            });
            return;
        }

        const podStatus = pod.status;
        const isReady = podStatus.containerStatuses?.[0]?.ready ?? false;
        
        res.status(200).json({
            status: podStatus.phase ?? "unknown",
            isReady,
        });

    } catch (error: unknown) {
        console.error("Error checking browser status:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).json({ 
            error: "Failed to check browser status",
            details: errorMessage
        });
    }
}
