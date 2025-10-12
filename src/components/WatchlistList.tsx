//src/components/WatchlistList.tsx

"use client";

import type { WatchlistItemType } from "@/schemas/watchlistSchema";

export function WatchlistList({
  watchlist,
}: {
  watchlist: WatchlistItemType[];
}) {
  if (watchlist.length === 0) {
    return <p className="text-gray-500">No items in your watchlist.</p>;
  }

  return (
    <ul className="space-y-3">
      {watchlist.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border p-4 shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {item.stock?.symbol} — {item.stock?.name}
              </p>
              <p className="text-sm text-gray-600">
                🎯 Target Price:{" "}
                {item.targetPrice !== null && item.targetPrice !== undefined
                  ? item.targetPrice
                  : "—"}
              </p>
              <p className="text-sm text-gray-600">
                📝 Notes: {item.notes || "—"}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Added: {item.addedAt.toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
