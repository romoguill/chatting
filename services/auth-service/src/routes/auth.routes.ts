import { apiHandler, validateRequest } from "@chatting/common";
import { Router } from "express";
import { createUserSchema } from "../dtos/create-user.dto";
import { register } from "../services/auth.service";

export const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest({ body: createUserSchema }),
  apiHandler(async (req, res) => {
    const payload = req.body;
    const tokens = await register(payload);
    res.status(201).json(tokens);
  }),
);
