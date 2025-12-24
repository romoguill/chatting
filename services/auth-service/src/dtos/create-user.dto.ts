import { z } from "@chatting/common";

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  displayName: z.string().min(3),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
