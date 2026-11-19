import React, { useState } from "react";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { useApp } from "../context/AppContext";
import { submitResult } from "../lib/api";

export function SaveResultCard({ ids, pcts }: { ids: string[]; pcts: number[] }) {
  const { tr, lang, darkMode } = useApp();
  const [agree, setAgree] = useState(false);
  const [phase, setPhase] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSend = async () => {
    if (!agree || phase === "sending") return;
    setPhase("sending");
    const ok = await submitResult({ lang, ids, pcts });
    setPhase(ok ? "done" : "error");
  };

  return (
    <div
      className={`rounded-[16px] p-4 border ${
        darkMode ? "bg-[#151D33] border-white/10" : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-[#5D7BFF] shrink-0" />
        <h3 className="font-head font-bold text-[16px]">
          {tr("Diiwaangeli natiijadayda (ikhtiyaari)")}
        </h3>
      </div>
      <p className="mt-1.5 text-xs opacity-75 leading-relaxed">
        {tr(
          "Saddexda kulliyadood ee kuu soo baxay iyo boqolkiiba ayaa la keydinayaa si magac la’aan ah, si kulliyadaha loo ogaado waxa ardaydu doortaan. Magac, telefoon ama meel lama keydiyo."
        )}
      </p>

      {phase === "done" ? (
        <div className="mt-3 flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            {tr("Mahadsanid! Natiijadaada waa la diiwaangeliyay.")}
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              disabled={phase === "sending"}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#4A6CF7] rounded"
            />
            <span className="text-sm leading-snug opacity-90">
              {tr("Waan oggolahay in natiijadayda la diiwaangeliyo (magac la’aan)")}
            </span>
          </label>

          {phase === "error" && (
            <p className="text-xs text-red-400">
              {tr("Lama diri karin. Hubi internetka oo mar kale isku day.")}
            </p>
          )}

          <button
            type="button"
            disabled={!agree || phase === "sending"}
            onClick={handleSend}
            className="w-full h-12 rounded-[14px] bg-[#3B5BDB] hover:bg-[#324EC2] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
          >
            {phase === "sending" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              tr("Diiwaangeli")
            )}
          </button>
        </div>
      )}
    </div>
  );
}
