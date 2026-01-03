import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error-handler";
import { createServiceAuthMiddleware, HttpError } from "@chatting/common";
import { env } from "./config/env";

export function createApp(): Application {
  const app = express();

  // ---- Middleware ----
  app.use(helmet());
  // TODO: Add proper cors configuration when I start with frontend
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    createServiceAuthMiddleware(env.AUTH_TOKEN, {
      ignorePaths: ["/users/health"],
    }),
  );

  // ---- Routes ----
  app.use("/health", (_req, res) => res.sendStatus(200));
  app.use("/error", () => {
    throw new HttpError(400, "Testing error", { cause: "Test" });
  });

  // ---- Error Handler -----
  app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });
  app.use(errorHandler);

  return app;
}
