import { NextFunction, Request, RequestHandler, Response } from "express";
import { RequestValidationSchema, validaRequest } from "./validate-request";
import z from "zod";

export type ApiHandler<
  T extends RequestValidationSchema = RequestValidationSchema,
> = (
  req: Request<z.infer<T["params"]>, T["body"], T["query"]>,
  res: Response<T>,
  next: NextFunction,
) => Promise<unknown>;

type ErrorForwarder = (error: Error) => void;

const toError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(String(error));
};

const forwardError = (nextFn: ErrorForwarder, error: unknown) => {
  nextFn(toError(error));
};

// Integrate express error handling into controller util
export const apiHandler = <
  T extends RequestValidationSchema = RequestValidationSchema,
>(
  schema: T,
) => {
  return (handler: ApiHandler<T>): RequestHandler =>
    (req, res, next) =>
      validaRequest(schema)(req, res, () =>
        handler(req, res, next).catch((error) => forwardError(next, error)),
      );
};
