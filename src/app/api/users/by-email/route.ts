//app/api/users/by-email/route.ts

import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/queries/users";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 });

  try {
    const user = await getUserByEmail(email);
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
