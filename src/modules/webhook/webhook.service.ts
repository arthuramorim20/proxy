import axios from "axios";

export class WebhookService {
  async forward(payload: unknown) {
    const backendUrl = process.env.BACKEND_WEBHOOK_URL;
    const internalToken = process.env.INTERNAL_TOKEN;

    if (!backendUrl) {
      throw new Error("BACKEND_WEBHOOK_URL não configurado");
    }

    if (!internalToken) {
      throw new Error("INTERNAL_TOKEN não configurado no proxy");
    }

    return axios.post(backendUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": internalToken,
      },
      timeout: 10000,
    });
  }
}
