import { Request, Response } from "express";
import { ProxyService } from "./proxy.service";

const service = new ProxyService();

export async function proxyController(req: Request, res: Response) {
  try {
    const forwardPath = req.originalUrl.replace(/^\/pix/, "");

    console.log("➡️ Proxy forward para:", forwardPath);

    const response = await service.forward({
      method: req.method,
      path: forwardPath,
      body: req.body,
      headers: req.headers,
    });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("❌ Proxy error:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: "proxy_error" });
  }
}
