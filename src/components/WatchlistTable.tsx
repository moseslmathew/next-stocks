"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WatchlistItemType } from "@/schemas/watchlistSchema"; // Use correct type

type Stock = {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number | null;
};

export function WatchlistTable({
  items,
  userEmail,
}: {
  items: WatchlistItemType[];
  userEmail: string;
}) {
  const [data, setData] = useState(items);
  const [adding, setAdding] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newStock, setNewStock] = useState({
    stockId: "",
    symbol: "",
    name: "",
    currentPrice: "",
    targetPrice: "",
    notes: "",
  });

  // Fetch existing stocks for dropdown
  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) throw new Error("Failed to fetch stocks");
        const data: Stock[] = await res.json();
        setStocks(data);
      } catch (err) {
        console.error("❌ Error fetching stocks:", err);
      }
    }
    fetchStocks();
  }, []);

  async function handleAdd() {
    if (!userEmail) return;

    setAddingLoading(true);

    try {
      const payload = {
        email: userEmail,
        stockId: newStock.stockId || undefined,
        symbol: newStock.symbol || undefined,
        name: newStock.name || undefined,
        currentPrice: newStock.currentPrice
          ? parseFloat(newStock.currentPrice)
          : undefined,
        targetPrice: newStock.targetPrice
          ? parseFloat(newStock.targetPrice)
          : null,
        notes: newStock.notes || null,
      };

      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to add item:", text);
        throw new Error("Failed to add item");
      }

      const added = await res.json();
      setData((prev) => [added, ...prev]);
      setAdding(false);
      setNewStock({
        stockId: "",
        symbol: "",
        name: "",
        currentPrice: "",
        targetPrice: "",
        notes: "",
      });
    } catch (err) {
      console.error("❌ Add failed:", err);
      alert("Error adding item");
    } finally {
      setAddingLoading(false);
    }
  }

  return (
    <div>
      {adding ? (
        <div className="mt-4 p-4 border rounded space-y-2">
          <div className="flex flex-wrap gap-2">
            {/* Dropdown to select existing stock */}
            <select
              className="border px-2 py-1 rounded w-64"
              value={newStock.stockId}
              onChange={(e) => {
                const selected = stocks.find((s) => s.id === e.target.value);
                if (selected) {
                  setNewStock((prev) => ({
                    ...prev,
                    stockId: selected.id,
                    symbol: selected.symbol,
                    name: selected.name,
                    currentPrice: selected.currentPrice?.toString() || "",
                  }));
                } else {
                  setNewStock((prev) => ({
                    ...prev,
                    stockId: "",
                    symbol: "",
                    name: "",
                    currentPrice: "",
                  }));
                }
              }}
            >
              <option value="">Select existing stock</option>
              {stocks.map((stock) => (
                <option key={stock.id} value={stock.id}>
                  {stock.name} ({stock.symbol})
                </option>
              ))}
            </select>

            {/* Manual input for new stock */}
            {!newStock.stockId && (
              <>
                <input
                  type="text"
                  placeholder="Symbol"
                  className="border px-2 py-1 rounded w-32"
                  value={newStock.symbol}
                  onChange={(e) =>
                    setNewStock((prev) => ({ ...prev, symbol: e.target.value }))
                  }
                />
                <input
                  type="text"
                  placeholder="Name"
                  className="border px-2 py-1 rounded w-48"
                  value={newStock.name}
                  onChange={(e) =>
                    setNewStock((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  type="number"
                  placeholder="Current Price"
                  className="border px-2 py-1 rounded w-32"
                  value={newStock.currentPrice}
                  onChange={(e) =>
                    setNewStock((prev) => ({
                      ...prev,
                      currentPrice: e.target.value,
                    }))
                  }
                />
              </>
            )}

            <input
              type="number"
              placeholder="Target Price"
              className="border px-2 py-1 rounded w-32"
              value={newStock.targetPrice}
              onChange={(e) =>
                setNewStock((prev) => ({
                  ...prev,
                  targetPrice: e.target.value,
                }))
              }
            />
            <input
              type="text"
              placeholder="Notes"
              className="border px-2 py-1 rounded w-48"
              value={newStock.notes}
              onChange={(e) =>
                setNewStock((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-1 rounded flex items-center gap-2"
              disabled={
                addingLoading || (!newStock.stockId && !newStock.symbol)
              }
            >
              {addingLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></div>
              ) : (
                "Add"
              )}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="bg-gray-300 px-4 py-1 rounded"
              disabled={addingLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-1 rounded"
        >
          Add New Stock
        </button>
      )}

      {/* Watchlist table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Target Price</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.stock?.symbol ?? "—"}</TableCell>
              <TableCell>{item.stock?.name ?? "—"}</TableCell>
              <TableCell>{item.stock?.currentPrice ?? "—"}</TableCell>
              <TableCell>{item.targetPrice ?? "—"}</TableCell>
              <TableCell>{item.notes ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
