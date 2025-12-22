import { z } from "zod";
import { HttpError } from "../errors/http-error";
import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodType, ZodObject } from "zod";

type ParamsSchema = Record<string, string>;
type QuerySchema = Record<string, unknown>;

export interface RequestValidationSchema {
  body?: ZodObject;
  params?: ZodObject<Record<string, ZodType<string>>>;
  query?: ZodObject<Record<string, ZodType<string | string[]>>>;
}

const formattedError = (error: ZodError) => {
  return error.issues.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
};

export const validaRequest = (schema: RequestValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const parsedBody = schema.body.parse(req.body);
        req.body = parsedBody;
      }

      if (schema.params) {
        const parsedParams = schema.params.parse(req.params);
        req.params = parsedParams;
      }

      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        req.query = parsedQuery;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new HttpError(400, "Bad request", { issues: formattedError(error) }),
        );
      }
    }
  };
};
