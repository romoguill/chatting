import "dotenv/config";

import { createEnvSchema, z } from "@chatting/common";
import { SERVICE_NAME } from "@/utils/constants";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4001),
});

type Env = z.infer<typeof envSchema>;

export const env: Env = createEnvSchema(envSchema, {
  serviceName: SERVICE_NAME,
});
