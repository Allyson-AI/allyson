

import express from "express";
import { getDocuments } from "../../controllers/v1/documents/get-documents";
import { queryDocuments } from "../../controllers/v1/documents/query-documents";
import { deleteDocuments } from "../../controllers/v1/documents/delete-documents";
import { requireAuth } from "@clerk/express";

const v1DocumentsRouter = express.Router();

v1DocumentsRouter.get("/", requireAuth(), getDocuments);
v1DocumentsRouter.get("/query", requireAuth(), queryDocuments);
v1DocumentsRouter.post("/delete", requireAuth(), deleteDocuments);

export default v1DocumentsRouter;
