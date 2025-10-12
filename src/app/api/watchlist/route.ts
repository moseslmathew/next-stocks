// src/app/api/watchlist/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/queries/users";
import { getUserWatchlist } from "@/lib/queries/watchlist";
import { watchlistSchema } from "@/schemas/watchlistSchema";

// Fetch user's watchlist by email
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const watchlist = await getUserWatchlist(user.id);
    return NextResponse.json(watchlist);
  } catch (err) {
    console.error("❌ Error fetching watchlist:", err);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

// Add a new stock to user's watchlist by email
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, stockId, symbol, name, currentPrice, targetPrice, notes } =
      body;

    if (!email || (!stockId && (!symbol || !name))) {
      return NextResponse.json(
        { error: "email, symbol, and name are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stockRecord;

    if (stockId) {
      // Use existing stock
      stockRecord = await prisma.stock.findUnique({ where: { id: stockId } });
      if (!stockRecord) {
        return NextResponse.json({ error: "Stock not found" }, { status: 404 });
      }
    } else {
      // Check if stock with symbol already exists
      stockRecord = await prisma.stock.findUnique({ where: { symbol } });
      if (!stockRecord) {
        // Create new stock
        stockRecord = await prisma.stock.create({
          data: { symbol, name, currentPrice: currentPrice ?? null },
        });
      }
    }

    // Add to watchlist
    const newItem = await prisma.watchlist.create({
      data: {
        userId: user.id,
        stockId: stockRecord.id,
        targetPrice: targetPrice ?? null,
        notes: notes ?? null,
      },
      include: { stock: true },
    });

    return NextResponse.json(watchlistSchema.parse([newItem])[0]);
  } catch (err) {
    console.error("❌ POST failed:", err);
    return NextResponse.json(
      { error: "Failed to add watchlist item" },
      { status: 500 }
    );
  }
}
