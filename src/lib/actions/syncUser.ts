//src/lib/actions/syncUser.ts

"use server";
import { currentUser } from "@clerk/nextjs/server";
import { upsertUserFromClerk } from "@/lib/queries/users";

export async function syncUser() {
  try {
    // Call the sync logic directly instead of making HTTP request
    const user = await currentUser();
    if (!user) {
      console.log("No authenticated user found");
      return { success: false, message: "No authenticated user" };
    }

    await upsertUserFromClerk(user);
    console.log("User synced successfully");
    return { success: true, message: "User synced successfully" };
  } catch (err) {
    console.error("Error syncing user:", err);
    throw err;
  }
}
