import { NextFunction, Request, RequestHandler, Response } from "express";

export type ApiHandler = (
  req: Request,
  res: Response,
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
export const apiHandler =
  (handler: ApiHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, next).catch((error) => {
      forwardError(next, error);
    });
