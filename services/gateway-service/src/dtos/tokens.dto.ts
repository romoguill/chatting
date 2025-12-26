import { z } from "@chatting/common";

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthTokens = z.infer<typeof authTokensSchema>;
