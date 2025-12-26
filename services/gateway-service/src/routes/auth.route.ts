import { apiHandler, validateRequest } from "@chatting/common";
import { Router } from "express";
import { createUserSchema } from "../dtos/create-user.dto";
import { authProxyService } from "../services/auth-proxy.service";

export const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest({ body: createUserSchema }),
  apiHandler(async (req, res, next) => {
    try {
      const payload = req.body;
      const tokens = await authProxyService.register(payload);
      res.status(201).json(tokens);
    } catch (error) {
      next(error);
    }
  }),
);
