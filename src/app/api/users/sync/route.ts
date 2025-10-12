// src/app/api/users/sync/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { upsertUserFromClerk } from "@/lib/queries/users";

/**
 * POST /api/users/sync
 * Inserts or updates the logged-in Clerk user in Postgres
 */
export async function POST() {
  try {
    // Get the logged-in Clerk user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Upsert user in Postgres
    await upsertUserFromClerk(user);

    return NextResponse.json({ message: "User synced successfully" });
  } catch (err) {
    console.error("Failed to sync user:", err);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
