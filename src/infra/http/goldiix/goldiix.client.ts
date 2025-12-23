import axios, { AxiosInstance } from "axios";
import { env } from "../../../config/env";

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

function getBasicAuthHeader() {
  const credentials = `${env.goldiix.publicKey}:${env.goldiix.secretKey}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

async function authenticate() {
  const { data } = await axios.post(
    `${env.goldiix.baseUrl}/api/v2/auth/generate_token`,
    {},
    {
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    },
  );

  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return accessToken;
}

export function createGoldiixClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.goldiix.baseUrl,
    timeout: 15000,
  });

  // 🔐 inject bearer token
  client.interceptors.request.use(async (config) => {
    // Avoid intercepting auth requests (although the path check in authenticate might be safer, using a separate call is cleaner)
    // However, since we need to use the SAME base URL, we can just use axios directly or a separate instance.
    // Let's modify authenticate to take the baseUrl instead of the client, OR use a fresh axios call.

    // Better approach: Check if we have a token, if not/expired, get one using a plain axios call to avoid recursion.
    if (!accessToken || !tokenExpiresAt || Date.now() >= tokenExpiresAt - 60_000) {
      await authenticate();
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  // 🔁 retry automático em 401
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          await authenticate();
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return client.request(error.config);
        } catch (authError) {
          return Promise.reject(authError);
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export const goldiixClient = createGoldiixClient();
