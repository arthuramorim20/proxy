import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}

export const env = {
  app: {
    port: Number(process.env.PORT || 3333),
  },

  security: {
    internalToken: requireEnv("INTERNAL_TOKEN"),
  },

  goldiix: {
    baseUrl: requireEnv("GOLDIIX_BASE_URL"),
    publicKey: requireEnv("GOLDIIX_PUBLIC_KEY"),
    secretKey: requireEnv("GOLDIIX_SECRET_KEY"),
  },

  backend: {
    webhookUrl: requireEnv("BACKEND_WEBHOOK_URL"),
  },
};
