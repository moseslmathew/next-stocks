"use client";

import { useEffect, useState } from "react";
import { WatchlistTable } from "@/components/WatchlistTable";
import type { WatchlistItemType } from "@/schemas/watchlistSchema";
import { useUser } from "@clerk/nextjs";

type WatchlistTableItem = {
  id: string;
  stock: {
    symbol: string;
    name: string;
    currentPrice: number | null;
  };
  targetPrice: number | null;
  notes?: string | null;
};

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<WatchlistTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function fetchWatchlist() {
      if (!isLoaded || !user) return;

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("❌ No email found for user");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/watchlist?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) throw new Error("Failed to fetch watchlist");

        const data: WatchlistItemType[] = await res.json();

        const mapped: WatchlistTableItem[] = data.map((item) => ({
          id: item.id,
          stock: {
            symbol: item.stock?.symbol ?? "",
            name: item.stock?.name ?? "",
            currentPrice: item.stock?.currentPrice ?? null,
          },
          targetPrice: item.targetPrice ?? null,
          notes: item.notes,
        }));

        setWatchlist(mapped);
      } catch (err) {
        console.error("❌ Error fetching watchlist:", err);
        setWatchlist([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading user...</div>;
  if (!user) return <div>Could not load user info.</div>;

  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const username = email.split("@")[0] || "there";

  return (
    <main className="mx-auto my-10 max-w-4xl space-y-8">
      <h1 className="text-2xl font-semibold">Hi {username}</h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <section>
          <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
          <WatchlistTable items={watchlist} userEmail={email} />
        </section>
      )}
    </main>
  );
}
