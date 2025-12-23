import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { HttpError } from "../errors/http-error";

export type RequestValidationSchema = z.ZodObject<{
  body: z.ZodOptional<z.ZodObject>;
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  query: z.ZodOptional<z.ZodObject<Record<string, z.ZodType<string>>>>;
}>;

const formattedError = (error: z.ZodError) => {
  return error.issues.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
};

export const validaRequest = (schema: RequestValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req);
      req.body = parsed.body;
      req.params = parsed.params ?? {};
      req.query = parsed.query ?? {};

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          new HttpError(400, "Validation error", {
            issues: formattedError(error),
          }),
        );
        return;
      }

      next(error);
    }
  };
};
