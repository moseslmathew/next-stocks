import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const usersSchema = z.array(userSchema);

export type UserType = z.infer<typeof userSchema>;
