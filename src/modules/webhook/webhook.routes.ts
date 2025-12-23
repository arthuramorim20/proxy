import { Router } from "express";
import { webhookController } from "./webhook.controller";

const router = Router();

router.post("/webhooks/pix", webhookController);

export default router;
