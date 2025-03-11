
import express from "express";
import { saveCookies } from "../../controllers/v1/cookies/save-cookies";
import { requireAuth } from "@clerk/express";
import { updateCookies } from "../../controllers/v1/cookies/update-cookies";
import { deleteCookies } from "../../controllers/v1/cookies/delete-cookies";
import { checkCookies } from "../../controllers/v1/cookies/check-cookies";

const v1CookiesRouter = express.Router();

v1CookiesRouter.post("/save", requireAuth(), saveCookies);
v1CookiesRouter.post("/check", requireAuth(), checkCookies);
v1CookiesRouter.put("/update", requireAuth(), updateCookies);
v1CookiesRouter.delete("/delete", requireAuth(), deleteCookies);

export default v1CookiesRouter; 
