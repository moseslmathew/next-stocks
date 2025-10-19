//src/app/global-trends/page.tsx
"use client";

import GlobalMarket from "@/components/GlobalMarket";

export default function GlobalTrendsPage() {
  return (
    <main className="w-full">
      <header className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Global Market Trends
        </h1>
        <p className="text-gray-600 mt-2">Real-time global market indices</p>
      </header>
      <GlobalMarket />
    </main>
  );
}
