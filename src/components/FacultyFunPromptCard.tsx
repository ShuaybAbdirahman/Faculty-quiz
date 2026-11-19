import React, { useState } from "react";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
import type { FacultyMatch } from "../lib/scoring";
import { useApp } from "../context/AppContext";
import { argbToHex, hexToRgba } from "../lib/i18n";
import { getFacultyFunPrompt } from "../data/facultyFunPrompts";

export function FacultyFunPromptCard({ top }: { top: FacultyMatch[] }) {
  const { tx, txl, tr, darkMode, userName } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (top.length === 0) return null;

  const activeMatch = top[selectedIdx] ?? top[0];
  const facultyId = activeMatch.f.id;
  const prompt = getFacultyFunPrompt(facultyId);
  const hex = argbToHex(activeMatch.f.color);
  const submittedAnswer = answers[facultyId] ?? "";
  const draft = drafts[facultyId] ?? "";

  const handleSubmit = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setAnswers((prev) => ({ ...prev, [facultyId]: clean }));
    setDrafts((prev) => ({ ...prev, [facultyId]: clean }));
  };

  return (
    <section
      aria-label={tr("Su'aal Gaar ah")}
      className={`mb-5 rounded-[22px] p-4 sm:p-5 border transition-colors ${
        darkMode ? "bg-[#121B35] border-white/12" : "bg-white border-slate-200 shadow-xs"
      }`}
      style={{
        boxShadow: `0 10px 26px ${hexToRgba(hex, darkMode ? 0.16 : 0.1)}`,
      }}
    >
      {/* Congratulations Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/10">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: hexToRgba(hex, 0.18), color: hex }}
          >
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="leading-tight">
            <div className="font-head font-extrabold text-sm">
              {userName ? `${tr("Hambalyo!")} ${userName}` : tr("Hambalyo!")}
            </div>
            <div className="text-[11.5px] opacity-65">{tx(prompt.badge)}</div>
          </div>
        </div>

        {top.length > 1 && (
          <div className="flex items-center gap-1.5">
            {top.map((m, idx) => {
              const active = idx === selectedIdx;
              const mHex = argbToHex(m.f.color);
              return (
                <button
                  key={m.f.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    active
                      ? "text-white shadow-xs"
                      : darkMode
                      ? "bg-white/6 text-white/70 hover:bg-white/12"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  style={active ? { background: mHex } : undefined}
                >
                  #{idx + 1} {m.f.short}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Attention-Grabbing Witty Question */}
      <p className="mt-3.5 font-head font-bold text-[15.5px] sm:text-[16.5px] leading-snug">
        {tx(prompt.question)}
      </p>

      {/* Quick Reply Chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {txl(prompt.quickOptions).map((opt) => {
          const picked = submittedAnswer === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSubmit(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                picked
                  ? "text-white border-transparent"
                  : darkMode
                  ? "bg-white/[0.04] border-white/15 text-white/85 hover:bg-white/[0.10]"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              style={picked ? { background: hex } : undefined}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Small Answer Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(draft);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          type="text"
          value={draft}
          maxLength={80}
          onChange={(e) => setDrafts((prev) => ({ ...prev, [facultyId]: e.target.value }))}
          placeholder={tx(prompt.placeholder)}
          aria-label={tx(prompt.question)}
          className={`flex-1 min-w-0 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border outline-none transition-colors ${
            darkMode
              ? "bg-[#0A1024] border-white/15 text-white placeholder:text-white/40 focus:border-[#FFC93C]"
              : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#3B5BDB]"
          }`}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label={tr("Dir")}
          className="h-[38px] sm:h-[42px] px-3.5 rounded-xl text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-opacity shrink-0"
          style={{ background: hex }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{tr("Dir")}</span>
        </button>
      </form>

      {/* Instant Smart-Witty Insight Reveal */}
      {submittedAnswer && (
        <div
          className="mt-3 rounded-xl px-3.5 py-3 text-xs sm:text-[13px] leading-relaxed border flex items-start gap-2.5 animate-rise"
          style={{
            background: hexToRgba(hex, darkMode ? 0.14 : 0.08),
            borderColor: hexToRgba(hex, 0.35),
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: hex }} />
          <div>
            <div className="font-bold mb-0.5">
              {tr("Jawaabtaada:")} <span className="opacity-85 font-semibold">{submittedAnswer}</span>
            </div>
            <p className="opacity-90">{tx(prompt.insight)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
