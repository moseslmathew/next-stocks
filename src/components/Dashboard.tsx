"use client";

import { useEffect, useState } from "react";
import { WatchlistTable } from "@/components/WatchlistTable";
import type { WatchlistItemType } from "@/schemas/watchlistSchema";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<WatchlistItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function fetchWatchlist(email: string) {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/watchlist?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) throw new Error("Failed to fetch watchlist");

        const data: WatchlistItemType[] = await res.json();
        setWatchlist(data);
      } catch (err) {
        console.error("❌ Error fetching watchlist:", err);
        setWatchlist([]);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      fetchWatchlist(user.primaryEmailAddress.emailAddress);
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading user...
      </div>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const username = email.split("@")[0];

  return (
    <main className="max-w-5xl mx-auto my-10 px-4 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Hi {username} 👋</h1>
        <p className="text-gray-500">Manage your watchlist</p>
      </header>

      {/* Watchlist Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Watchlist</h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 text-lg">Loading...</span>
          </div>
        ) : (
          <WatchlistTable items={watchlist} userEmail={email} />
        )}
      </section>
    </main>
  );
}
