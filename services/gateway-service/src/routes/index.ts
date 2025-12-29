import { Router } from "express";
import { authRouter } from "./auth.route";

export const registerRoutes = (app: Router, basePath?: string | "") => {
  app.use(`${basePath}/auth`, authRouter);
};
