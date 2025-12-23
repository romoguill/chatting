import type { NextFunction, RequestHandler } from "express";
import * as z from "zod";
import { HttpError } from "../errors/http-error";

export type BodySchema = z.ZodType;
export type ParamsSchema = z.ZodType;
export type QuerySchema = z.ZodType;

export type RequestValidation<TParams, TQuery, TBody> = {
  params?: z.ZodType<TParams>;
  query?: z.ZodType<TQuery>;
  body?: z.ZodType<TBody>;
};

const formattedError = (error: z.ZodError) => {
  return error.issues.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
};

export const validateRequest = <TParams, TQuery, TBody>(
  schemas: RequestValidation<TParams, TQuery, TBody>,
): RequestHandler<TParams, unknown, TBody, TQuery> => {
  return (req, _res, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

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
