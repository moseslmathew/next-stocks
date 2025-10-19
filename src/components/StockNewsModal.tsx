import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Newspaper, X } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  provider: string;
  published_date: string;
}

interface NewsResponse {
  detail?: string;
}

export default function StockNewsModal({
  symbol,
  onClose,
}: {
  symbol: string | null;
  onClose: () => void;
}) {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    if (!symbol) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks/news?symbol=${symbol}`);
      const data: NewsResponse | NewsArticle[] = await res.json();

      if ("detail" in data && data.detail === "No news found") {
        setNewsData([]);
        setError("No news for this symbol");
      } else if (Array.isArray(data) && data.length > 0) {
        setNewsData(data);
      } else {
        setNewsData([]);
        setError("No news found");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch news";
      setError(errorMessage);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      fetchNews();
    }
  }, [symbol, fetchNews]);

  if (!symbol) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-h-96 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-gray-900">{symbol}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={() => fetchNews()}
              className="mt-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : newsData.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No news available</p>
          </div>
        ) : (
          <div className="overflow-y-auto p-4 space-y-3">
            {newsData.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 border rounded hover:bg-gray-50 transition"
              >
                <h4 className="text-xs font-semibold text-blue-600 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {article.summary}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
