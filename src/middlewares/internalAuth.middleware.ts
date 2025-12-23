import { getEnv } from "@src/config/env";
import { Request, Response, NextFunction } from "express";

export function internalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-internal-token");

  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (token !== getEnv().INTERNAL_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }

  next();
}
