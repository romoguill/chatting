import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

const accessTokenOpts: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN,
};

const refreshTokenOpts: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN,
};

// ----- Password management -----

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// ----- Token validation -----

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, accessTokenOpts);
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshTokenOpts);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

// ----- Misc -----

export function getTTLInDays(ttl: `${number}d`) {
  return parseInt(ttl.split("d")[0]);
}
