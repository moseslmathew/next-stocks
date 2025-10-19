// src/app/api/stocks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { name: "asc" },
    });

    // Convert BigInt to string safely
    const serialized = stocks.map((stock) => ({
      ...stock,
      id: stock.id.toString(),
      lastUpdated: stock.lastUpdated?.toISOString() ?? null,
      createdAt: stock.createdAt?.toISOString() ?? null,
      updatedAt: stock.updatedAt?.toISOString() ?? null,
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("❌ Failed to fetch stocks:", err);
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}
