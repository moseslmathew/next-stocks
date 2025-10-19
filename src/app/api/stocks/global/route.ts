// src/app/api/stocks/global/route.ts
import { NextResponse } from "next/server";

type GlobalMarketData = {
  Index: string;
  Symbol: string;
  Date: string;
  Close: number;
  Open: number;
  "Change_%": number;
};

const API_BASE_URL = process.env.STOCK_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing required environment variable: STOCK_API_BASE_URL");
}

export async function GET(req: Request) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const url = `${API_BASE_URL}/stocks/global`;
    console.log(`Fetching from: ${url}`);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`API returned status ${res.status}`);
      return NextResponse.json(
        { error: "Failed to fetch global market data" },
        { status: res.status }
      );
    }

    const data: GlobalMarketData[] = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching global market data:", err);
    return NextResponse.json(
      { error: "Failed to fetch global market data" },
      { status: 500 }
    );
  }
}
