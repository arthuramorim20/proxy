import { Request, Response } from "express";
import { WebhookService } from "./webhook.service";

const service = new WebhookService();

export async function webhookController(req: Request, res: Response) {
  await service.forward(req.body);
  res.sendStatus(200);
}
