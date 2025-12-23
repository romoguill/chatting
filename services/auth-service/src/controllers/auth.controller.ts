import { apiHandler } from "@chatting/common";
import { RequestHandler } from "express";
import { register } from "../services/auth.service";

export const registerHandler: RequestHandler = apiHandler(async (req, res) => {
  const payload = req.body;
  const tokens = await register(payload);
  res.status(201).json(tokens);
});
