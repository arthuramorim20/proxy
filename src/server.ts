import express, { response } from "express";
import dotenv from "dotenv";
import proxyRoutes from "./modules/proxy/proxy.routes";
import webhookRoutes from "./modules/webhook/webhook.routes";
import dotenvExpand from "dotenv-expand";
import logger from "./middlewares/logger";

dotenvExpand.expand(dotenv.config());

const app = express();

app.use(express.json());
app.use(logger);

app.use(webhookRoutes);
app.use(proxyRoutes);

app.get("/health", (_, res) => {
  res.status(200).send("Proxy Funcionando!");
});

export default app;
