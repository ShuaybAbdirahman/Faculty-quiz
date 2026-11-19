import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { fetchReviews, type ReviewsData } from "../lib/api";
import { Stars } from "../components/ModernUI";
import { ReviewTile } from "../components/ReviewsComponents";

export function ReviewsScreen({ onBack }: { onBack: () => void }) {
  const { tr, trf, rtl } = useApp();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const d = await fetchReviews(50);
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const list = data ? data.items.filter((r) => r.comment.trim().length > 0) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="font-head font-bold text-[19px]">{tr("Fikirrada ardayda")}</h1>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      <main className="flex-1 px-5 py-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5D7BFF]" />
          </div>
        ) : !data ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm opacity-80">
              {tr("Lama soo qaadi karin. Hubi internetka oo mar kale isku day.")}
            </p>
            <button
              type="button"
              onClick={load}
              className="px-5 py-2.5 rounded-full bg-[#3B5BDB] text-white font-semibold text-sm cursor-pointer"
            >
              {tr("Isku day mar kale")}
            </button>
          </div>
        ) : data.count === 0 ? (
          <div className="py-16 text-center text-base opacity-80">{tr("Weli fikir ma jiro.")}</div>
        ) : (
          <div>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="font-head font-extrabold text-[40px] leading-none">
                {data.avg.toFixed(1)}
              </div>
              <div className="mt-1.5">
                <Stars value={data.avg} size={26} />
              </div>
              <p className="mt-1.5 text-sm opacity-75">{trf("{n} fikir", { n: data.count })}</p>
            </div>

            <div className="space-y-3">
              {list.map((item, idx) => (
                <ReviewTile key={idx} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
