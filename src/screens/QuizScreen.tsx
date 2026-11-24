import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Compass,
  GraduationCap,
  Heart,
  Lock,
  Moon,
  Scale,
  SkipForward,
  Sun,
} from "lucide-react";
import { items, sections } from "../data/quizData";
import { useApp } from "../context/AppContext";
import {
  buildPlan,
  computeMatches,
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

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (busy) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toUpperCase();
      const numIdx = ["1", "2", "3", "4", "5"].indexOf(k);
      const alphaIdx = ["A", "B", "C", "D", "E"].indexOf(k);
      const pick = numIdx >= 0 ? numIdx : alphaIdx;
      if (pick >= 0 && pick < opts.length) {
        e.preventDefault();
        handleAnswer(pick);
      } else if (e.key === "Backspace" && pos > 0) {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
      <header
        className={`border-b ${
          darkMode ? "border-white/10 bg-[#0B1226]/90" : "border-slate-200 bg-white/90"
        } backdrop-blur-md sticky top-0 z-20`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
              aria-label="Back"
            >
              {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <h1 className="font-head font-bold text-[18px]">{tr("Hagaha Kulliyadda")}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold opacity-70 tabular-nums hidden sm:inline">
              {trf("Su’aal {a} / {b}", { a: pos + 1, b: total })}
            </span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={tr(darkMode ? "Iftiin" : "Mugdi")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">{tr(darkMode ? "Iftiin" : "Mugdi")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-5 sm:px-6 pt-6 pb-10">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold opacity-80 tabular-nums">
            {trf("Su’aal {a} / {b}", { a: pos + 1, b: total })}
          </div>
          <div className="text-xs font-semibold opacity-65 tabular-nums">
            {Math.round(((pos + 1) / total) * 100)}%
          </div>
        </div>

        {adapt && total - (pos + 1) <= 2 && total - (pos + 1) > 0 ? (
          <div className="mt-1 text-xs font-bold text-emerald-500 dark:text-emerald-400 tabular-nums">
            {trf("{n} su’aalood uun baa kuu haray!", { n: total - (pos + 1) })}
          </div>
        ) : adapt && pos + 1 === Math.ceil(total / 2) ? (
          <div className="mt-1 text-xs font-bold text-[#5D7BFF]">
            {tr("Kala bar waad dhaaftay — natiijadaadu way soo dhowdahay.")}
          </div>
        ) : adapt ? (
          <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D7BFF]">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>{tr("Natiijadaadu waa ay qarsoontahay ilaa dhamaadka")}</span>
          </div>
        ) : null}

        {/* Segmented Progress Bar */}
        <div className="mt-2.5 flex gap-1.5">
          {segments.map((seg, i) => (
            <div
              key={i}
              style={{ flexGrow: seg.flex }}
              className={`h-2 rounded-full overflow-hidden ${
                darkMode ? "bg-white/12" : "bg-slate-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-[#4A6CF7] transition-all duration-300"
                style={{ width: `${seg.value * 100}%` }}
              />
            </div>
          ))}
        </div>

        {/* Question Card */}
        <div
          key={idx}
          className={`mt-6 flex-1 rounded-3xl p-5 sm:p-7 border animate-rise ${
            darkMode
              ? "bg-[#111930] border-white/10 shadow-xl"
              : "bg-white border-slate-200/90 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5D7BFF]">
            <SectionIcon className="w-4 h-4 shrink-0" />
            <span>{tx(sec.n)}</span>
          </div>

          <p className="mt-1.5 text-xs opacity-65">{tx(sec.h)}</p>

          <h2 className="mt-3 font-head font-extrabold text-[22px] sm:text-[25px] leading-snug">
            {tx(it.t)}
          </h2>

          <div className="mt-6 space-y-2.5">
            {opts.map((optText, j) => {
              const selected = sel[idx] === j;
              const letter = it.type === "l" ? String(j + 1) : "ABCDE"[j];
              return (
                <button
                  key={j}
                  type="button"
                  disabled={busy}
                  onClick={() => handleAnswer(j)}
                  className={`w-full text-start p-4 rounded-2xl flex items-center gap-3.5 border transition-all duration-150 cursor-pointer active:scale-[0.99] ${
                    selected
                      ? darkMode
                        ? "bg-[#1D306E] border-[#6E8BFF] shadow-[0_4px_16px_rgba(93,123,255,0.25)]"
                        : "bg-[#E2EAFF] border-[#3B5BDB] shadow-xs"
                      : darkMode
                        ? "bg-[#16203C] border-white/10 hover:border-white/25 hover:bg-[#1A2647]"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      selected
                        ? "bg-[#3B5BDB] text-white"
                        : darkMode
                          ? "bg-white/10 text-white/90"
                          : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {selected ? <Check className="w-4 h-4" /> : letter}
                  </span>
                  <span className="text-[15.5px] leading-snug font-medium">{optText}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between gap-3">
            {pos > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold opacity-75 hover:opacity-100 hover:bg-current/5 cursor-pointer transition-colors"
              >
                {rtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{tr("Su’aashii hore")}</span>
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              disabled={busy}
              onClick={() => handleAnswer(-1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-[#5D7BFF] hover:bg-[#5D7BFF]/10 cursor-pointer transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span>{tr("Ma hubo, ka bood")}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
