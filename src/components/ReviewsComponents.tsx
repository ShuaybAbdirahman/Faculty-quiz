import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MessageSquareText, Star } from "lucide-react";
import { faculties } from "../data/quizData";
import { useApp } from "../context/AppContext";
import { backendEnabled } from "../lib/config";
import { fetchReviews, submitReview, type ReviewItem, type ReviewsData } from "../lib/api";
import { plainFacultyName } from "../lib/i18n";
import { AccentTitle, Stars } from "./ModernUI";
import { firstName } from "../context/AppContext";

export function ReviewTile({ item, clamp = false }: { item: ReviewItem; clamp?: boolean }) {
  const { tr, tx, darkMode } = useApp();
  const displayName = item.name && item.name.trim() ? item.name.trim() : tr("Arday");
  const fac = faculties.find((f) => f.id === item.faculty);
  const facName = fac ? plainFacultyName(tx(fac.name)) : "";

  return (
    <div
      className={`rounded-[20px] p-4 flex flex-col justify-between border ${
        darkMode
          ? "bg-[#1A2238]/80 border-white/10 text-white"
          : "bg-white/90 border-slate-200 text-slate-900"
      }`}
    >
      <div>
        <Stars value={item.rating} size={17} />
        <p
          className={`mt-2 text-[14px] leading-relaxed opacity-90 whitespace-pre-wrap break-words ${
            clamp ? "line-clamp-5" : ""
          }`}
        >
          {item.comment.trim()}
        </p>
      </div>
      <div className="mt-3 flex items-start gap-2.5">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
            darkMode ? "bg-[#2C3E7A] text-[#C8D8FF]" : "bg-[#DCE4F7] text-[#1A2D6B]"
          }`}
        >
          {Array.from(displayName)[0]?.toUpperCase() || "A"}
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold truncate">{displayName}</p>
          {facName && <p className="text-xs opacity-65 line-clamp-2">{facName}</p>}
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection({ onViewAll }: { onViewAll: () => void }) {
  const { tr, trf } = useApp();
  const [data, setData] = useState<ReviewsData | null>(null);

  useEffect(() => {
    if (!backendEnabled) return;
    let active = true;
    fetchReviews(12).then((d) => {
      if (active) setData(d);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!backendEnabled || !data || data.count === 0) return null;
  const shown = data.items.filter((r) => r.comment.trim().length > 0);
  if (shown.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="px-6">
        <AccentTitle label="Waxa ay yiraahdaan ardayda" />
        <div className="mt-1.5 flex items-center gap-2 text-sm opacity-85">
          <Stars value={data.avg} size={19} />
          <span>
            {data.avg.toFixed(1)} · {trf("{n} fikir", { n: data.count })}
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto px-6 pb-1 hide-scrollbar">
        {shown.map((item, idx) => (
          <div key={idx} className="w-[290px] shrink-0 flex">
            <div className="w-full flex flex-col">
              <ReviewTile item={item} clamp />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-1">
        <button
          type="button"
          onClick={onViewAll}
          className="px-2 py-1.5 text-sm font-bold text-[#6E8BFF] hover:underline cursor-pointer"
        >
          {tr("Eeg dhammaan")}
        </button>
      </div>
    </section>
  );
}

export function ReviewCard({ facultyId }: { facultyId: string }) {
  const { tr, lang, userName, darkMode } = useApp();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(false);
  const [phase, setPhase] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSend = async () => {
    if (rating < 1 || !agree || phase === "sending") return;
    setPhase("sending");
    const ok = await submitReview({
      lang,
      rating,
      comment: comment.trim(),
      name: firstName(userName),
      faculty: facultyId,
    });
    setPhase(ok ? "done" : "error");
  };

  return (
    <div
      className={`rounded-[16px] p-4 border ${
        darkMode ? "bg-[#151D33] border-white/10" : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-2">
        <MessageSquareText className="w-5 h-5 text-[#5D7BFF] shrink-0" />
        <h3 className="font-head font-bold text-[16px]">{tr("Fikirkaaga (ikhtiyaari)")}</h3>
      </div>
      <p className="mt-1.5 text-xs opacity-75 leading-relaxed">
        {tr("Fikirkaaga wuxuu caawin doonaa ardayda kale. Waa la hubinayaa ka hor intaan la muujin.")}
      </p>

      {phase === "done" ? (
        <div className="mt-3 flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            {tr("Mahadsanid! Fikirkaaga waa la hubinayaa, marka la ansixiyo ayaa la muujin doonaa.")}
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                disabled={phase === "sending"}
                onClick={() => setRating(i)}
                className="p-1.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-9 h-9 transition-all ${
                    i <= rating
                      ? "text-[#FFB703] fill-[#FFB703] scale-110"
                      : "text-slate-400/60"
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <textarea
              value={comment}
              disabled={phase === "sending"}
              maxLength={200}
              rows={2}
              onChange={(e) => setComment(e.target.value)}
              placeholder={tr("Waxa aad ka qabto app-ka (ikhtiyaari)")}
              className={`w-full rounded-[14px] p-3 text-sm border outline-none focus:border-[#5D7BFF] resize-none ${
                darkMode
                  ? "bg-[#0E1424] border-white/15 text-white placeholder:text-white/40"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <div className="text-end text-[11px] opacity-50">{comment.length}/200</div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              disabled={phase === "sending"}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#4A6CF7] rounded"
            />
            <span className="text-sm leading-snug opacity-90">
              {tr("Waan oggolahay in fikirkayga la muujiyo marka la ansixiyo (magaca koowaad kaliya, haddii aad gelisay).")}
            </span>
          </label>

          {phase === "error" && (
            <p className="text-xs text-red-400">
              {tr("Lama diri karin. Hubi internetka oo mar kale isku day.")}
            </p>
          )}

          <button
            type="button"
            disabled={rating === 0 || !agree || phase === "sending"}
            onClick={handleSend}
            className="w-full h-12 rounded-[14px] bg-[#3B5BDB] hover:bg-[#324EC2] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
          >
            {phase === "sending" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              tr("Dir fikirka")
            )}
          </button>
        </div>
      )}
    </div>
  );
}
