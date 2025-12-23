import { goldiixClient } from "../../infra/http/goldiix/goldiix.client";

export class ProxyService {
  async forward({
    method,
    path,
    body,
    headers,
  }: {
    method: string;
    path: string;
    body: any;
    headers: any;
  }) {
    return goldiixClient.request({
      method,
      url: path, // ex: /api/v2/payment
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
