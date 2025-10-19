// src/app/api/stocks/news/route.ts
import { NextResponse } from "next/server";

type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  published_date: string;
  provider: string;
  url: string;
  content_type: string;
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

    const url = `${API_BASE_URL}/news/${symbol}`;
    console.log(`Fetching from: ${url}`);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`API returned status ${res.status}`);
      return NextResponse.json(
        { error: "Failed to fetch stock news" },
        { status: res.status }
      );
    }

    const data: NewsArticle[] = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching stock news:", err);
    return NextResponse.json(
      { error: "Failed to fetch stock news" },
      { status: 500 }
    );
  }
}
