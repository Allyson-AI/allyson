
import { Router, Request, Response } from "express";
import multer from "multer";

import { revenueCat } from "../controllers/webhooks/revenue-cat";
import { deleteAccount } from "../controllers/user/delete-account";
import { clerk } from "../controllers/user/clerk";
import { subscribe } from "../controllers/user/subscribe";
import { reloadBalance } from "../controllers/user/reload-balance";
import { billingPortal } from "../controllers/user/billing-portal";
import { getBillingLogs } from "../controllers/user/billing-logs";
import { createAccount } from "../controllers/user/create-account";
import { requireAuth, ExpressRequestWithAuth } from "@clerk/express";
import { updateNotifications } from "../controllers/user/update-notifcations";
import { getStats } from "../controllers/user/stats";
import { me } from "../controllers/user/user";
import { saveGlobalSettings } from "../controllers/user/save-global-settings";
import { saveWebNotification } from "../controllers/user/save-web-notification";
import { coinbaseReload } from "../controllers/user/coinbase-reload";
import { helioReload } from "../controllers/user/helio-reload";
import { updateOnboarding } from "../controllers/user/update-onboarding";

const userRouter = Router();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// User Routes
userRouter.get("/", requireAuth(), me);

userRouter.post("/create", requireAuth(), createAccount);

userRouter.get("/billing-logs", requireAuth(), getBillingLogs);

userRouter.post("/delete", requireAuth(), deleteAccount);

userRouter.post("/save-global-settings", requireAuth(), saveGlobalSettings);

// Subscription and Billing Routes
userRouter.post("/revenue-cat", requireAuth(), revenueCat);

userRouter.post("/subscribe", requireAuth(), subscribe);

userRouter.post("/reload-balance", requireAuth(), reloadBalance);

userRouter.post("/reload-balance-coinbase", requireAuth(), coinbaseReload);

userRouter.post("/reload-balance-helio", requireAuth(), helioReload);

userRouter.post("/billing-portal", requireAuth(), billingPortal);

userRouter.post("/clerk", requireAuth(), clerk);

userRouter.post("/update-notifications", requireAuth(), updateNotifications);

userRouter.post("/save-web-notification", requireAuth(), saveWebNotification);

userRouter.post("/update-onboarding", requireAuth(), updateOnboarding);


userRouter.get("/stats", requireAuth(), getStats);

export default userRouter;
