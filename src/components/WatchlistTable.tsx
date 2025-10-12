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
import { WatchlistItemType } from "@/schemas/watchlistSchema";

type Stock = {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number | null;
};

type Props = {
  items: WatchlistItemType[];
  userEmail: string;
};

export function WatchlistTable({ items, userEmail }: Props) {
  const [data, setData] = useState(items);
  const [adding, setAdding] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newStock, setNewStock] = useState({
    stockId: "",
    targetPrice: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLoading, setEditingLoading] = useState(false);
  const [editStock, setEditStock] = useState({ targetPrice: "", notes: "" });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all stocks for dropdown
  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) throw new Error("Failed to fetch stocks");
        const data: Stock[] = await res.json();

        // Filter out stocks already in watchlist
        const availableStocks = data.filter(
          (s) => !items.some((w) => w.stock?.id === s.id)
        );

        setStocks(availableStocks);
      } catch (err) {
        console.error("❌ Error fetching stocks:", err);
      }
    }
    fetchStocks();
  }, [items]);

  // Add new stock
  async function handleAdd() {
    if (!userEmail || !newStock.stockId) return;
    setAddingLoading(true);

    try {
      const selectedStock = stocks.find((s) => s.id === newStock.stockId);
      if (!selectedStock) throw new Error("Stock not found");

      const payload = {
        email: userEmail,
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        currentPrice: selectedStock.currentPrice ?? null,
        targetPrice: newStock.targetPrice || null,
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
      setNewStock({ stockId: "", targetPrice: "", notes: "" });
    } catch (err) {
      console.error("❌ Add failed:", err);
      alert("Error adding item");
    } finally {
      setAddingLoading(false);
    }
  }

  // Edit functions
  function startEdit(item: WatchlistItemType) {
    setEditingId(item.id);
    setEditStock({
      targetPrice: item.targetPrice?.toString() ?? "",
      notes: item.notes ?? "",
    });
  }

  async function handleSaveEdit(id: string) {
    setEditingLoading(true);
    try {
      const res = await fetch(`/api/watchlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPrice: editStock.targetPrice || null,
          notes: editStock.notes || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated = await res.json();
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setEditingId(null);
    } catch (err) {
      console.error("❌ Edit failed:", err);
      alert("Error updating item");
    } finally {
      setEditingLoading(false);
    }
  }

  // Delete function
  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setData((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Error deleting item");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Watchlist</h2>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} stocks tracked
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            + Add Stock
          </button>
        )}
      </div>

      {/* Add Stock Form */}
      {adding && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="font-semibold text-gray-900 text-lg">Add New Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock
              </label>
              <select
                className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all shadow-sm"
                value={newStock.stockId}
                onChange={(e) =>
                  setNewStock((prev) => ({ ...prev, stockId: e.target.value }))
                }
              >
                <option value="">Select stock</option>
                {stocks.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Target Price
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all shadow-sm"
                value={newStock.targetPrice}
                onChange={(e) =>
                  setNewStock((prev) => ({
                    ...prev,
                    targetPrice: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <input
                type="text"
                placeholder="Optional"
                className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all shadow-sm"
                value={newStock.notes}
                onChange={(e) =>
                  setNewStock((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              disabled={addingLoading || !newStock.stockId}
            >
              {addingLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              {addingLoading ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium transition-all border border-gray-200 shadow-sm"
              disabled={addingLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <Table className="rounded-lg overflow-hidden shadow-sm">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-left text-gray-700">Symbol</TableHead>
            <TableHead className="text-left text-gray-700">Name</TableHead>
            <TableHead className="text-left text-gray-700">
              Current Price
            </TableHead>
            <TableHead className="text-left text-gray-700">
              Target Price
            </TableHead>
            <TableHead className="text-left text-gray-700">Notes</TableHead>
            <TableHead className="text-left text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>{item.stock?.symbol ?? "—"}</TableCell>
              <TableCell>{item.stock?.name ?? "—"}</TableCell>
              <TableCell>{item.stock?.currentPrice ?? "—"}</TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-24"
                    value={editStock.targetPrice}
                    onChange={(e) =>
                      setEditStock((prev) => ({
                        ...prev,
                        targetPrice: e.target.value,
                      }))
                    }
                  />
                ) : (
                  item.targetPrice ?? "—"
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-36"
                    value={editStock.notes}
                    onChange={(e) =>
                      setEditStock((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                ) : (
                  item.notes ?? "—"
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 disabled:opacity-60"
                      disabled={editingLoading}
                    >
                      {editingLoading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 px-3 py-1 rounded-lg"
                      disabled={editingLoading}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-yellow-400 px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation */}
      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg space-y-4 w-80 z-50 border border-gray-200">
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
          <p>Are you sure you want to delete this watchlist item?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(confirmDeleteId)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition"
              disabled={deleteLoading}
            >
              {deleteLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
