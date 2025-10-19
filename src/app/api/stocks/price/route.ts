// src/app/api/stocks/price/route.ts
import { NextResponse } from "next/server";

type StockPrice = {
  symbol: string;
  name: string;
  currentPrice: number | null;
  previousClose: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
  lastUpdated: string | null;
};

const API_BASE_URL = process.env.STOCK_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing required environment variable: STOCK_API_BASE_URL");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol query parameter is required" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const url = `${API_BASE_URL}/stocks/${symbol}`;
    console.log(`Fetching from: ${url}`);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`API returned status ${res.status}`);
      return NextResponse.json(
        { error: "Failed to fetch stock price" },
        { status: res.status }
      );
    }

    const data: StockPrice = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching stock price:", err);
    return NextResponse.json(
      { error: "Failed to fetch stock price" },
      { status: 500 }
    );
  }
}
