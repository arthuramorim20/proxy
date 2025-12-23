import axios, { AxiosInstance } from "axios";
import { getEnv } from "../../../config/env";

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

function getBasicAuthHeader() {
  const credentials = `${getEnv().GOLDIIX_PUBLIC_KEY}:${getEnv().GOLDIIX_SECRET_KEY}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

async function authenticate() {
  const { data } = await axios.post(
    `${getEnv().GOLDIIX_BASE_URL}/api/v2/auth/generate_token`,
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
    baseURL: getEnv().GOLDIIX_BASE_URL,
    timeout: 15000,
  });

  client.interceptors.request.use(async (config) => {

    if (!accessToken || !tokenExpiresAt || Date.now() >= tokenExpiresAt - 60_000) {
      await authenticate();
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

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
