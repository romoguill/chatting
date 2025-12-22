import z, { ZodType } from "zod";

interface EnvOptions {
  source?: NodeJS.ProcessEnv;
  serviceName?: string;
}

export function createEnvSchema<T>(schema: ZodType<T>, options: EnvOptions) {
  const { source = process.env, serviceName = "service" } = options;

  const parsed = schema.safeParse(source);

  if (!parsed.success) {
    const formattedErrors = z.treeifyError(parsed.error);
    throw new Error(
      `[${serviceName}] Invalid environment variables: ${JSON.stringify(formattedErrors)}`
    );
  }

  return parsed.data;
}
