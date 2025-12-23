import { Application } from "express";

export const registerRoutes = (app: Application) => {
  app.use("/api/v1/auth", authRouter);
};
