import { Application } from "express";
import { authRouter } from "./auth.routes";

export const registerRoutes = (app: Application, basePath: string) => {
  app.use(`${basePath}/auth`, authRouter);
};
