// src/lib/queries/users.ts

"use server";

import { prisma } from "../db";
import { usersSchema, UserType } from "@/schemas/userSchema";
import type { User } from "@clerk/nextjs/server";

/**
 * Fetch a user by email
 */
export async function getUserByEmail(email: string): Promise<UserType | null> {
  const userRaw = await prisma.user.findUnique({ where: { email } });
  if (!userRaw) return null;
  return usersSchema.parse([userRaw])[0];
}

/**
 * Fetch a user by Clerk ID
 */
export async function getUserByClerkId(
  clerkId: string
): Promise<UserType | null> {
  const userRaw = await prisma.user.findUnique({ where: { clerkId } });
  if (!userRaw) return null;
  return usersSchema.parse([userRaw])[0];
}

/**
 * Upsert user from Clerk
 */
export async function upsertUserFromClerk(user: User): Promise<UserType> {
  const primaryEmail = user.emailAddresses[0]?.emailAddress ?? "";
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  const userRaw = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: primaryEmail,
      name: fullName,
    },
    create: {
      clerkId: user.id,
      email: primaryEmail,
      name: fullName,
    },
  });

  return usersSchema.parse([userRaw])[0];
}
