import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3333"),
  INTERNAL_TOKEN: z.string(),
  GOLDIIX_BASE_URL: z.string(),
  GOLDIIX_PUBLIC_KEY: z.string(),
  GOLDIIX_SECRET_KEY: z.string(),
  BACKEND_WEBHOOK_URL: z.string(),
});



export const getEnv = (): z.infer<typeof envSchema> => {
  const parsedEnv = envSchema.safeParse(process.env);
  if (!parsedEnv.success) {
    console.error("Invalid environment variables:");
    console.error(z.treeifyError(parsedEnv.error));
    process.exit(1);
  }
  return parsedEnv.data;
}
