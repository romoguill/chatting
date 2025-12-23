import { apiHandler, validateRequest, z } from "@chatting/common";
import { Router } from "express";
import { register } from "../services/auth.service";

export const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest({
    body: z.object({
      email: z.string(),
      password: z.string().min(8),
      displayName: z.string().min(3),
    }),
  }),
  apiHandler(async (req, res) => {
    const payload = req.body;
    const tokens = await register(payload);
    res.status(201).json(tokens);
  }),
);
