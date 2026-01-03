import type { RequestHandler } from "express";
import { HttpError } from "../errors/http-error";
import { AUTH_HEADER } from "../utils/constants";

export interface ServiceAuthOpts {
  headerName?: string | typeof AUTH_HEADER;
  ignorePaths?: string[];
}

export function createServiceAuthMiddleware(
  token: string,
  opts?: ServiceAuthOpts,
): RequestHandler {
  return (req, _res, next) => {
    const { headerName = AUTH_HEADER, ignorePaths = [] } = opts || {};
    if (ignorePaths) {
      return next();
    }

    const provided = req.headers[headerName];
    const reqToken = Array.isArray(provided) ? provided[0] : provided;

    if (typeof token !== "string" || reqToken !== token) {
      return next(new HttpError(401, "Unauthorized"));
    }

    return next();
  };
}
