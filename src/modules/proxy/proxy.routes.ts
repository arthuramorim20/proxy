import { Router } from "express";
import { proxyController } from "./proxy.controller";
import { internalAuth } from "../../middlewares/internalAuth.middleware";

const router = Router();

router.use(internalAuth);

router.use("/pix", proxyController);

export default router;
