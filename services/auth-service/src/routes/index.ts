import { Application } from "express";
import { authRouter } from "./auth.routes";

export const registerRoutes = (app: Application) => {
  app.use("/api/v1/auth", authRouter);
};
