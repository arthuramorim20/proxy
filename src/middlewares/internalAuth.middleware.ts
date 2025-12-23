import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function internalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-internal-token");

  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (token !== env.security.internalToken) {
    return res.status(401).json({ error: "unauthorized" });
  }

  next();
}
