import { z } from "@chatting/common";

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
};

export type LoginUserDto = z.infer<typeof loginSchema>;
