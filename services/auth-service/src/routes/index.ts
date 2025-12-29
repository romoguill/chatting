import { Application } from "express";
import { authRouter } from "./auth.routes";

export const registerRoutes = (app: Application) => {
  app.use(`/auth`, authRouter);
};
