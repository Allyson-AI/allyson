import { Request, Response } from "express";
import { Session } from "../../../models/session";
import { ExpressRequestWithAuth } from "@clerk/express";
import * as k8s from "@kubernetes/client-node";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { V1Deployment, V1Service } from "@kubernetes/client-node";

interface HumanInput {
  title: string;
  description: string;
  value: any; // Adjust the type of 'value' as needed
}
// Use __dirname directly since we're in CommonJS
const KUBE_TEST_CONFIG_PATH = path.join(
  __dirname,
  "browser-k8-test-kubeconfig.yaml"
);
const KUBE_PRODUCTION_CONFIG_PATH = path.join(
  __dirname,
  "browser-k8-production-kubeconfig.yaml"
);
const DEPLOYMENT_DEV_TEMPLATE_PATH = path.join(
  __dirname,
  "deployment-dev.yaml"
);
const DEPLOYMENT_PROD_TEMPLATE_PATH = path.join(
  __dirname,
  "deployment-prod.yaml"
);

const KUBE_CONFIG_PATH =
  process.env.NODE_ENV === "production"
    ? KUBE_PRODUCTION_CONFIG_PATH
    : KUBE_TEST_CONFIG_PATH;

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

async function updateHumanInput(
  req: ExpressRequestWithAuth | Request,
  res: Response
): Promise<void> {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const sessionId = req.params.id;
  const { humanInputResponse, messageIndex } = req.body;
  try {
    const session = await Session.findOne({ sessionId });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    session.messages[messageIndex].human_input = humanInputResponse.map(
      (input: HumanInput) => ({
        title: input.title,
        description: input.description,
        value: input.value,
      })
    );

    session.markModified("messages");
    await session.save();
    if (session.podStatus === "stopped") {
      const kc = new k8s.KubeConfig();
      kc.loadFromFile(KUBE_CONFIG_PATH);

      const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
      const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);

      const template = fs.readFileSync(DEPLOYMENT_TEMPLATE_PATH, "utf8");

      const configYaml = template
        .replace(/\$\{SESSION_ID\}/g, sessionId)
        .replace(/\$\{USER_ID\}/g, userId)
        .replace(/\$\{OPENAI_API_KEY\}/g, process.env.OPENAI_API_KEY ?? "")
        .replace(/\$\{MONGODB_URI\}/g, process.env.MONGODB_URI ?? "")
        .replace(/\$\{MONGODB_DB_NAME\}/g, process.env.MONGODB_DB_NAME ?? "")
        .replace(
          /\$\{VAPID_PRIVATE_KEY\}/g,
          process.env.VAPID_PRIVATE_KEY ?? ""
        )
        .replace(/\$\{S3_BUCKET\}/g, process.env.S3_BUCKET ?? "")
        .replace(/\$\{ACCESS_KEY\}/g, process.env.S3_ACCESS_KEY ?? "")
        .replace(/\$\{SECRET_KEY\}/g, process.env.S3_SECRET_KEY ?? "")
        .replace(/\$\{S3_ENDPOINT\}/g, process.env.S3_ENDPOINT ?? "");
        
      const configs = yaml.loadAll(configYaml) as [V1Deployment, V1Service];
      const deployment = configs[0];

      if (!deployment?.metadata || !deployment?.spec?.template?.metadata) {
        throw new Error("Invalid deployment configuration");
      }

      const labels: { [key: string]: string } = {
        "session-id": sessionId || "",
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
    }

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error updating human input:", errorMessage);
    res.status(500).json({ error: "Failed to update human input" });
  }
}

export { updateHumanInput };
