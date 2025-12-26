import "dotenv/config";

import { createEnvSchema, z } from "@chatting/common";
import { SERVICE_NAME } from "@/utils/constants";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  AUTH_SERVICE_URL: z.url().default("http://localhost:4001"),
  AUTH_TOKEN: z.string(),
});

type Env = z.infer<typeof envSchema>;

export const env: Env = createEnvSchema(envSchema, {
  serviceName: SERVICE_NAME,
});
