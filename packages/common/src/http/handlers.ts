import { NextFunction, Request, RequestHandler, Response } from "express";

export type ApiHandler<TParams, TQuery, TBody> = (
  req: Request<TParams, unknown, TBody, TQuery>,
  res: Response,
  next: NextFunction,
) => Promise<void>;

type ErrorForwarder = (error: Error) => void;

const toError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(String(error));
};

const forwardError = (nextFn: ErrorForwarder, error: unknown) => {
  nextFn(toError(error));
};

export const apiHandler = <TParams, TQuery, TBody>(
  handler: ApiHandler<TParams, TQuery, TBody>,
): RequestHandler<TParams, unknown, TBody, TQuery> => {
  return (req, res, next) => {
    handler(req, res, next).catch((error: unknown) =>
      forwardError(next, error),
    );
  };
};
