import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader, RefreshCw } from "lucide-react";

interface GlobalMarketData {
  Index: string;
  Symbol: string;
  Date: string;
  Close: number;
  Open: number;
  "Change_%": number;
}

export default function GlobalMarket() {
  const [markets, setMarkets] = useState<GlobalMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGlobalMarket();
  }, []);

  async function fetchGlobalMarket() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stocks/global");
      if (!res.ok) throw new Error("Failed to fetch global market data");
      const data: GlobalMarketData[] = await res.json();
      setMarkets(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching data";
      setError(errorMessage);
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p className="text-red-900 font-medium mb-4">{error}</p>
        <button
          onClick={fetchGlobalMarket}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No global market data available</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Market Indices
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {markets[0]?.Date}
            </p>
          </div>
          <button
            onClick={fetchGlobalMarket}
            className="p-2 hover:bg-blue-50 rounded-lg transition"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-blue-600 hover:text-blue-700" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Index
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Symbol
                </th>
                <th className="text-right px-6 py-3 font-semibold text-gray-700">
                  Close Price
                </th>
                <th className="text-right px-6 py-3 font-semibold text-gray-700">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {markets.map((market, idx) => {
                const isPositive = market["Change_%"] >= 0;
                return (
                  <tr
                    key={market.Symbol}
                    className={`hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {market.Index}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                      {market.Symbol}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {market.Close.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold flex items-center justify-end gap-2 ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                          isPositive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {market["Change_%"].toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
