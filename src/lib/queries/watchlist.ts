// src/lib/queries/watchlist.ts
import { watchlistSchema } from "@/schemas/watchlistSchema";
import { prisma } from "../db";

export async function getUserWatchlist(userId: string) {
  const watchlistRaw = await prisma.watchlist.findMany({
    where: { userId },
    include: { stock: true }, // fetch related stock details
    orderBy: { addedAt: "desc" },
  });

  return watchlistSchema.parse(watchlistRaw);
}

export async function getAllWatchlists() {
  const watchlistRaw = await prisma.watchlist.findMany({
    include: { stock: true },
    orderBy: { addedAt: "desc" },
  });

  return watchlistSchema.parse(watchlistRaw);
}
