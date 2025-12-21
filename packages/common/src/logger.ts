import pino, { type Logger, type LoggerOptions } from "pino";

type CreateLoggerOptions = LoggerOptions & {
  name: string;
};

export const createLogger = (opts: CreateLoggerOptions): Logger => {
  const { name, ...rest } = opts;

  // Only apply prettier logging for local dev
  const transport =
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined;

  return pino({
    name,
    level: process.env.LOG_LEVEL || "info",
    transport,
    ...rest,
  });
};
