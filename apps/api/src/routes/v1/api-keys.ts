
import express from "express";
import { createApiKey } from "../../controllers/v1/api-key/create-key";
import { listApiKeys } from "../../controllers/v1/api-key/list-keys";
import { revokeApiKey } from "../../controllers/v1/api-key/revoke-key";
import { requireAuth } from "@clerk/express";
import { updateApiKey } from "../../controllers/v1/api-key/update-key";
import { queryApiKeys } from "../../controllers/v1/api-key/query-keys";

const router = express.Router();

router.post("/create", requireAuth(), createApiKey);
router.get("/", requireAuth(), listApiKeys);
router.post("/revoke/:id", requireAuth(), revokeApiKey);
router.put("/:id", requireAuth(), updateApiKey);
router.get("/query", requireAuth(), queryApiKeys);

export default router; 