import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Compass,
  GraduationCap,
  Heart,
  Moon,
  Scale,
  SkipForward,
  Sun,
} from "lucide-react";
import { clusterNames, items, sections } from "../data/quizData";
import { useApp } from "../context/AppContext";
import {
  buildPlan,
  computeMatches,
  focusClusters,
  interestProfile,
  ratingFor,
  screeningIdx,
  type FacultyMatch,
} from "../lib/scoring";

const SECTION_ICONS = [Compass, Heart, GraduationCap, Brain, Scale];

export interface QuizOutcome {
  matches: FacultyMatch[];
  answered: number;
  planLen: number;
  profile: string[];
  ratings: number[];
}

export function QuizScreen({
  onBackHome,
  onComplete,
}: {
  onBackHome: () => void;
  onComplete: (outcome: QuizOutcome) => void;
}) {
  const { lang, rtl, darkMode, setDarkMode, tr, trf, tx, txl } = useApp();
  const [pos, setPos] = useState(0);
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<number[]>(() => screeningIdx().slice(0, 3));
  const [sel, setSel] = useState<number[]>(() => Array(items.length).fill(-1));
  const [ratings, setRatings] = useState<number[]>(() => Array(items.length).fill(-1));

  const idx = plan[pos];
  const it = items[idx];
  const secIdx = it.s;
  const sec = sections[secIdx];
  const opts = txl(it.type === "l" ? sec.sc : it.o);
  const adapt = plan.length > 3;
  const total = adapt ? plan.length : 28;

  const focus = useMemo(() => {
    if (!adapt) return [];
    const scInPlan = screeningIdx().filter((i) => plan.includes(i));
    return focusClusters(ratings, scInPlan);
  }, [adapt, plan, ratings]);

  const SectionIcon = SECTION_ICONS[secIdx] ?? Compass;

  const handleAnswer = (choice: number) => {
    if (busy) return;
    const nextSel = [...sel];
    const nextR = [...ratings];
    nextSel[idx] = choice;
    nextR[idx] = ratingFor(it, choice);

    let nextPlan = plan;
    if (it.type === "sc" && pos >= 2) {
      nextPlan = buildPlan(nextR);
    }

    setSel(nextSel);
    setRatings(nextR);
    setPlan(nextPlan);
    setBusy(true);

    window.setTimeout(() => {
      if (pos < nextPlan.length - 1) {
        setPos((p) => p + 1);
        setBusy(false);
      } else {
        const inPlan = new Set(nextPlan);
        const masked = nextR.map((v, i) => (inPlan.has(i) ? v : -1));
        const answered = masked.filter((x) => x > 0).length;
        onComplete({
          matches: computeMatches(masked, lang),
          answered,
          planLen: nextPlan.length,
          profile: interestProfile(masked, lang),
          ratings: masked,
        });
      }
    }, 300);
  };

  const handleBack = () => {
    if (busy) return;
    if (pos > 0) setPos((p) => p - 1);
    else onBackHome();
  };

  // Segmented progress bar counts
  const segments = useMemo(() => {
    const counts = sections.map((_, s) => plan.filter((i) => items[i].s === s).length);
    if (!adapt) counts.push(25);
    let start = 0;
    const out: { flex: number; value: number }[] = [];
    for (const c of counts) {
      if (c === 0) continue;
      const v = Math.min(1, Math.max(0, (pos + 1 - start) / c));
      out.push({ flex: c, value: v });
      start += c;
    }
    return out;
  }, [plan, adapt, pos]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top AppBar */}
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Back"
          >
            {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="font-head font-bold text-[19px]">{tr("Hagaha Kulliyadda")}</h1>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{tr(darkMode ? "Iftiin" : "Mugdi")}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 pt-1 pb-4">
        <div className="text-sm opacity-80">{trf("Su’aal {a} / {b}", { a: pos + 1, b: total })}</div>

        {focus.length > 0 && (
          <div className="mt-0.5 text-xs font-medium text-[#5D7BFF]">
            {trf("Su’aalaha waxaa lagu habeeyay: {c}", {
              c: focus.map((c) => tr(clusterNames[c])).join(" · "),
            })}
          </div>
        )}

        {/* Segmented Progress Bar */}
        <div className="mt-2.5 flex gap-1">
          {segments.map((seg, i) => (
            <div
              key={i}
              style={{ flexGrow: seg.flex }}
              className={`h-[7px] rounded-full overflow-hidden ${
                darkMode ? "bg-white/15" : "bg-slate-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-[#4A6CF7] transition-all duration-300"
                style={{ width: `${seg.value * 100}%` }}
              />
            </div>
          ))}
        </div>

        {/* Animated Question Body */}
        <div key={idx} className="mt-5 flex-1 animate-rise">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold ${
              darkMode ? "bg-[#24346B] text-[#B3C7FF]" : "bg-[#DCE4F7] text-[#1F3A93]"
            }`}
          >
            <SectionIcon className="w-4 h-4" />
            <span>{tx(sec.n)}</span>
          </div>

          <p className="mt-2.5 text-xs opacity-70">{tx(sec.h)}</p>

          <h2 className="mt-2.5 font-head font-extrabold text-[22px] leading-snug">{tx(it.t)}</h2>

          <div className="mt-5 space-y-3">
            {opts.map((optText, j) => {
              const selected = sel[idx] === j;
              const letter = it.type === "l" ? String(j + 1) : "ABCDE"[j];
              return (
                <button
                  key={j}
                  type="button"
                  disabled={busy}
                  onClick={() => handleAnswer(j)}
                  style={{ animationDelay: `${j * 50}ms` }}
                  className={`w-full text-start p-3.5 rounded-[16px] flex items-center gap-3 border transition-all cursor-pointer active:scale-[0.98] animate-rise ${
                    selected
                      ? darkMode
                        ? "bg-[#1F3270] border-[#6E8BFF] shadow-[0_4px_14px_rgba(93,123,255,0.28)]"
                        : "bg-[#DCE5FF] border-[#2E52D1] shadow-[0_4px_14px_rgba(46,82,209,0.18)]"
                      : darkMode
                        ? "bg-[#151D33] border-white/12 hover:border-white/25"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      selected
                        ? "bg-[#3B5BDB] text-white"
                        : darkMode
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selected ? <Check className="w-4 h-4" /> : letter}
                  </span>
                  <span className="text-[15.5px] leading-snug font-medium">{optText}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleAnswer(-1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-[#5D7BFF] hover:bg-[#5D7BFF]/10 cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
              <span>{tr("Ma hubo, ka bood")}</span>
            </button>
          </div>
        </div>

        {/* Previous Question Button */}
        {pos > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#5D7BFF] hover:bg-[#5D7BFF]/10 cursor-pointer"
            >
              {rtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{tr("Su’aashii hore")}</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
