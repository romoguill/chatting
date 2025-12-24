import type { RequestHandler } from "express";
import { HttpError } from "../errors/http-error";

const DEFAULT_HEADER_NAME = "x-service-auth" as const;

export interface ServiceAuthOpts {
  headerName: string | typeof DEFAULT_HEADER_NAME;
  ignorePaths?: string[];
}

export function createServiceAuthMiddleware(
  token: string,
  { headerName = DEFAULT_HEADER_NAME, ignorePaths = [] }: ServiceAuthOpts,
): RequestHandler {
  return (req, _res, next) => {
    if (ignorePaths) {
      return next();
    }

    const provided = req.headers[headerName];
    const reqToken = Array.isArray(provided) ? provided[0] : provided;

    if (typeof token !== "string" || reqToken !== token) {
      return next(new HttpError(401, "Unauthorized"));
    }

    next();
  };
}
