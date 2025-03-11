import { Request, Response } from "express";
import * as k8s from "@kubernetes/client-node";
import { V1Deployment, V1Ingress, V1APIService } from "@kubernetes/client-node";
import { v4 as uuidv4 } from "uuid";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { Session } from "../../../models/session";
import { User } from "../../../models/user";
import OpenAI from "openai";
import { ExpressRequestWithAuth } from "@clerk/express";
import { getKubeConfigPath } from "../../../utils/kubeconfig";

const DEPLOYMENT_DEV_TEMPLATE_PATH = path.join(
  __dirname,
  "deployment-dev.yaml"
);
const DEPLOYMENT_PROD_TEMPLATE_PATH = path.join(
  __dirname,
  "deployment-prod.yaml"
);

const DEPLOYMENT_TEMPLATE_PATH =
  process.env.NODE_ENV === "production"
    ? DEPLOYMENT_PROD_TEMPLATE_PATH
    : DEPLOYMENT_DEV_TEMPLATE_PATH;

if (
  !process.env.OPENAI_API_KEY ||
  !process.env.MONGODB_URI ||
  !process.env.MONGODB_DB_NAME
) {
  throw new Error(
    "OPENAI_API_KEY, MONGODB_URI, and MONGODB_DB_NAME are required"
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTaskName(task: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates short, descriptive names for tasks thats the user is asking the AI to complete for them. Do not use quotations in the name.",
        },
        {
          role: "user",
          content: `Generate a short, descriptive name (max 7 words) for this task: "${task}"`,
        },
      ],
      max_tokens: 20,
    });

    const content = response.choices[0]?.message?.content;
    return content?.trim() || "Unnamed Task";
  } catch (error) {
    console.error("Error generating task name:", error);
    return "Unnamed Task";
  }
}

export const startSession = async (
  req: ExpressRequestWithAuth | Request,
  res: Response
) => {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const user = await User.findOne({ userId: userId });
  if (!userId) {
    res.status(401).json({ error: "Unauthorized - User ID is required" });
    return;
  }
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (user.balance === undefined || user.balance <= 0) {
    res.status(401).json({ error: "Reload your balance." });
    return;
  }
  const { task, sessionVariables, sessionDetails, maxSteps } = req.body;
  const sessionId = uuidv4().split("-")[0] || "";

  try {
    const name = await generateTaskName(task);
    const kubeConfigPath = getKubeConfigPath();
    const kc = new k8s.KubeConfig();
    kc.loadFromFile(kubeConfigPath);

    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

    const template = fs.readFileSync(DEPLOYMENT_TEMPLATE_PATH, "utf8");

    const configYaml = template
      .replace(/\$\{SESSION_ID\}/g, sessionId)
      .replace(/\$\{USER_ID\}/g, userId)
      .replace(/\$\{OPENAI_API_KEY\}/g, process.env.OPENAI_API_KEY ?? "")
      .replace(/\$\{MONGODB_URI\}/g, process.env.MONGODB_URI ?? "")
      .replace(/\$\{MONGODB_DB_NAME\}/g, process.env.MONGODB_DB_NAME ?? "")
      .replace(/\$\{VAPID_PRIVATE_KEY\}/g, process.env.VAPID_PRIVATE_KEY ?? "")
      .replace(/\$\{S3_BUCKET\}/g, process.env.S3_BUCKET ?? "")
      .replace(/\$\{ACCESS_KEY\}/g, process.env.S3_ACCESS_KEY ?? "")
      .replace(/\$\{SECRET_KEY\}/g, process.env.S3_SECRET_KEY ?? "")
      .replace(/\$\{S3_ENDPOINT\}/g, process.env.S3_ENDPOINT ?? "");

    const configs = yaml.loadAll(configYaml) as [V1Deployment, V1APIService, V1Ingress];
    const deployment = configs[0];

    if (!deployment?.metadata || !deployment?.spec?.template?.metadata) {
      throw new Error("Invalid deployment configuration");
    }

    const labels = {
      "session-id": sessionId,
    };

    deployment.metadata.labels = {
      ...(deployment.metadata.labels || {}),
      ...labels,
    };

    if (deployment.spec.template.metadata) {
      deployment.spec.template.metadata.labels = {
        ...(deployment.spec.template.metadata.labels || {}),
        ...labels,
      };
    }

    await k8sApi.createNamespacedDeployment("default", deployment);
    await k8sCoreApi.createNamespacedService(
      "default",
      configs[1]
    );
    await k8sNetworkingApi.createNamespacedIngress(
      "default",
      configs[2]
    );

    const source = req.headers["x-api-key"] ? "api" : "client";
    const session = new Session({
      userId,
      sessionId,
      name,
      source,
      messages: [{ role: "user", content: task }],
      status: "active",
      files: [],
      sessionVariables: sessionVariables || [],
      sessionDetails: sessionDetails || "",
      globalVariables: user?.globalVariables || [],
      globalDetails: user?.globalDetails || "",
      maxSteps: maxSteps || 30,
      startTime: new Date(),
      cost: 0,
      allysonCost: 0,
      podStatus: "running",
      responseQuality: "noResponse",
    });

    await session.save();

    // Clean up the temporary kubeconfig file
    try {
      fs.unlinkSync(kubeConfigPath);
    } catch (error) {
      console.error("Error cleaning up kubeconfig:", error);
    }

    res.status(200).json({
      message: "Session started successfully",
      sessionId,
      messages: session.messages,
      status: session.status,
      name,
    });
  } catch (error) {
    console.error("Error starting browser session:", error);
    res.status(500).json({ error: "Failed to start browser session" });
  }
};
