import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";

export const authRouter: Router = Router();

authRouter.post("/register", registerHandler);
