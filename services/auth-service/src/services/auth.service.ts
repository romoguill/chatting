import { HttpError } from "@chatting/common";
import { RefreshToken, UserCredentials } from "../models";
import { sequelize } from "../db/sequelize";
import { CreateUserDto } from "../dtos/create-user.dto";
import {
  getTTLInDays,
  hashPassword,
  signAccessToken,
  signRefreshToken,
} from "../utils/security";
import { Transaction } from "sequelize";
import { env } from "../config/env";
import { UserDto } from "../dtos/user.dto";

interface RegisterReponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export async function register({
  email,
  password,
  displayName,
}: CreateUserDto): Promise<RegisterReponse> {
  const existingUser = await UserCredentials.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new HttpError(409, "Email already in use");
  }

  const transaction = await sequelize.transaction();
  try {
    const passwordHash = await hashPassword(password);
    // Create user with basic data
    const user = await UserCredentials.create(
      {
        email,
        displayName,
        passwordHash,
      },
      { transaction },
    );

    // Create entry for token management
    const refreshTokenResult = await createRefreshToken(user.id, transaction);

    await transaction.commit();

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({
      sub: user.id,
      tokenId: refreshTokenResult.tokenId,
    });

    return {
      accessToken,
      refreshToken,
      user: { ...user, createdAt: user.createdAt.toISOString() },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// Create refresh token with random ID and TTL = now() + xdays
export async function createRefreshToken(
  userId: string,
  transaction?: Transaction,
) {
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + getTTLInDays(env.JWT_REFRESH_EXPIRES_IN),
  );

  const tokenId = crypto.randomUUID();

  const refreshToken = await RefreshToken.create(
    { userId, tokenId, expiresAt },
    { transaction },
  );

  return refreshToken;
}
