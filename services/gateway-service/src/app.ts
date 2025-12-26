import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServiceAuthMiddleware, HttpError } from "@chatting/common";
import { errorHandler } from "./middleware/error-handler";
import { registerRoutes } from "./routes";
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
  app.use(createServiceAuthMiddleware(env.AUTH_TOKEN));

  // ---- Routes ----
  app.use("/api/v1/health", (_req, res) => res.sendStatus(200));
  app.use("/api/v1/error", () => {
    throw new HttpError(400, "Testing error", { cause: "Test" });
  });
  registerRoutes(app);

  // ---- Error Handler -----
  app.use(errorHandler);

  return app;
}
