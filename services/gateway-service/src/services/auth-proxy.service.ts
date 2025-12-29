import { AUTH_HEADER, HttpError } from "@chatting/common";
import axios from "axios";
import { env } from "../config/env";
import { CreateUserDto } from "../dtos/create-user.dto";
import { AuthTokens } from "../dtos/tokens.dto";

const client = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  timeout: 10000,
});

const authHeader = {
  headers: {
    [AUTH_HEADER]: env.AUTH_TOKEN,
  },
} as const;

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserData;
}

function responseMessage(status: number, data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as Record<string, string>).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return status >= 500
    ? "Authentication service is unavailable"
    : "Unexpected error occured";
}

function handleAxiosError(error: unknown): never {
  if (!axios.isAxiosError(error) || !error.response) {
    throw new HttpError(500, "Authentication service is unavailable");
  }

  const { status, data } = error.response as { status: number; data: unknown };

  throw new HttpError(status, responseMessage(status, data));
}

export const authProxyService = {
  async register(payload: CreateUserDto): Promise<AuthResponse> {
    try {
      const response = await client.post<AuthResponse>(
        "/api/v1/auth/register",
        payload,
        authHeader,
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
