import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import type { FacultyMatch } from "../lib/scoring";
import { useApp } from "../context/AppContext";
import { argbToHex, darkenHex, hexToRgba, plainFacultyName } from "../lib/i18n";
import { getFacultyFunPrompt } from "../data/facultyFunPrompts";
import { FacultyIcon } from "./ModernUI";

const CHOICE_LETTERS = ["A", "B", "C"];

export function FacultyFunPromptCard({ top }: { top: FacultyMatch[] }) {
  const { tx, txl, tr, trf, rtl, darkMode, userName } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  if (top.length === 0) return null;

  const activeMatch = top[selectedIdx] ?? top[0];
  const facultyId = activeMatch.f.id;
  const prompt = getFacultyFunPrompt(facultyId);
  const hex = argbToHex(activeMatch.f.color);
  const darkHex = darkenHex(hex, 0.45);

  const options = txl(prompt.quickOptions);
  const optionInsights = txl(prompt.optionInsights);
  const pickedOptionIdx = selectedOptions[facultyId];
  const hasAnswered = typeof pickedOptionIdx === "number" && pickedOptionIdx >= 0 && pickedOptionIdx < options.length;
  const answeredCount = top.filter((m) => typeof selectedOptions[m.f.id] === "number").length;
  const nextUnansweredIdx = top.findIndex((m, idx) => idx !== selectedIdx && typeof selectedOptions[m.f.id] !== "number");

  const handleSelectOption = (optionIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [facultyId]: optionIdx }));
  };

  return (
    <section
      aria-label={tr("Su'aal Gaar ah")}
      className={`mb-6 rounded-[24px] overflow-hidden border transition-colors ${
        darkMode ? "bg-[#111933] border-white/15" : "bg-white border-slate-200"
      }`}
      style={{
        boxShadow: `0 14px 34px ${hexToRgba(hex, darkMode ? 0.22 : 0.14)}`,
      }}
    >
      {/* Dynamic Colored Spotlight Header */}
      <div
        className="px-4 sm:px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          background: `linear-gradient(135deg, ${hex} 0%, ${darkHex} 100%)`,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/18 border border-white/30 flex items-center justify-center shrink-0">
            <FacultyIcon faculty={activeMatch.f} size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-head font-extrabold text-[15px] sm:text-base tracking-tight">
                {userName ? `${tr("Hambalyo!")} ${userName}` : tr("Hambalyo!")}
              </span>
              <span className="text-xs font-bold text-white/80 tabular-nums">
                #{selectedIdx + 1} · {activeMatch.percent}%
              </span>
            </div>
            <div className="text-xs text-white/85 font-medium truncate">
              {tx(prompt.badge)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {top.length > 1 && (
            <div className="flex items-center gap-1.5" role="tablist" aria-label={tr("Kulliyadaha")}>
              {top.map((m, idx) => {
                const active = idx === selectedIdx;
                const done = typeof selectedOptions[m.f.id] === "number";
                return (
                  <button
                    key={m.f.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedIdx(idx)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11.5px] font-bold cursor-pointer transition-all inline-flex items-center gap-1 ${
                      active
                        ? "bg-white text-[#14213D] shadow-sm"
                        : "bg-black/20 text-white/90 hover:bg-black/35 border border-white/20"
                    }`}
                  >
                    {done && <Check className="w-3 h-3 shrink-0" />}
                    <span>#{idx + 1} {m.f.short}</span>
                  </button>
                );
              })}
            </div>
          )}
          <span className="text-[11.5px] font-extrabold text-[#FFD86B] tabular-nums shrink-0">
            {answeredCount}/{top.length}
          </span>
        </div>
      </div>

      {/* Question & Instant 1-Tap Choice Cards */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-head font-extrabold text-[17px] sm:text-[19.5px] leading-snug">
            {tx(prompt.question)}
          </h3>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-2.5">
          {options.map((opt, idx) => {
            const picked = pickedOptionIdx === idx;
            const letter = CHOICE_LETTERS[idx] ?? String(idx + 1);
            return (
              <button
                key={`${facultyId}-${idx}`}
                type="button"
                onClick={() => handleSelectOption(idx)}
                aria-pressed={picked}
                className={`group text-start rounded-2xl p-3.5 border transition-all duration-150 cursor-pointer active:scale-[0.98] flex items-center gap-3 ${
                  picked
                    ? "text-white border-transparent shadow-md"
                    : darkMode
                    ? "bg-white/[0.04] border-white/12 text-white/90 hover:bg-white/[0.09] hover:border-white/25"
                    : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                }`}
                style={
                  picked
                    ? {
                        background: `linear-gradient(135deg, ${hex} 0%, ${darkHex} 100%)`,
                      }
                    : undefined
                }
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-head font-extrabold text-xs shrink-0 transition-colors ${
                    picked
                      ? "bg-white/22 text-white"
                      : darkMode
                      ? "bg-white/10 text-white/85 group-hover:bg-white/18"
                      : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  {picked ? <Check className="w-4 h-4" /> : letter}
                </span>
                <span className="text-[13.5px] font-bold leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Instant Distinct Response Reveal (No Send Button Needed) */}
        {hasAnswered && (
          <div
            key={`${facultyId}-${pickedOptionIdx}`}
            className="mt-4 rounded-2xl p-4 border animate-rise"
            style={{
              background: hexToRgba(hex, darkMode ? 0.14 : 0.08),
              borderColor: hexToRgba(hex, darkMode ? 0.4 : 0.28),
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: hex }} />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: darkMode ? "#FFD86B" : hex }}>
                    {tr("Doorashadaada:")} {options[pickedOptionIdx]}
                  </div>
                </div>
                <p className="text-[13.5px] sm:text-sm leading-relaxed opacity-95">
                  {optionInsights[pickedOptionIdx] ?? tx(prompt.insight)}
                </p>

                {nextUnansweredIdx >= 0 && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedIdx(nextUnansweredIdx)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold cursor-pointer hover:underline"
                      style={{ color: darkMode ? "#FFD86B" : hex }}
                    >
                      <span>
                        {trf("Eeg su'aasha #{n} ({name})", {
                          n: nextUnansweredIdx + 1,
                          name: plainFacultyName(tx(top[nextUnansweredIdx].f.name)),
                        })}
                      </span>
                      {rtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
