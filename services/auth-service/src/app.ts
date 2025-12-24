import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error-handler";
import { HttpError } from "@chatting/common";
import { registerRoutes } from "./routes";

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
