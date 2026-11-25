import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  HelpCircle,
  Lock,
  LockOpen,
  Moon,
  Scale,
  Sparkles,
  Sun,
} from "lucide-react";
import { faculties, type Faculty } from "../data/quizData";
import { useApp } from "../context/AppContext";
import { argbToHex } from "../lib/i18n";
import type { FacultyMatch } from "../lib/scoring";
import { buildComparisonMatrix, type DecisionPriorityWeights } from "../lib/careerFitInsights";
import { FacultyBanner, Footer, ProBadge } from "../components/ModernUI";
import { ProContentShield } from "../components/ProContentShield";

const PRIORITY_PRESETS: {
  id: string;
  label: string;
  weights: DecisionPriorityWeights;
}[] = [
  { id: "balanced", label: "Isku Dheellitiran", weights: { interest: 1, aptitude: 1, conditions: 1 } },
  { id: "interest", label: "Xiisaha Muhiim", weights: { interest: 3, aptitude: 1, conditions: 1 } },
  { id: "aptitude", label: "Kartida & Awoodda", weights: { interest: 1, aptitude: 3, conditions: 1 } },
  { id: "market", label: "Suuqa & Xaaladaha", weights: { interest: 1, aptitude: 1, conditions: 3 } },
];

export function CompareScreen({
  matches,
  onBack,
  onOpenPaywall,
}: {
  matches: FacultyMatch[];
  onBack: () => void;
  onOpenPaywall: () => void;
}) {
  const { tr, trf, tx, txl, rtl, darkMode, setDarkMode, proActive } = useApp();
  const [aId, setAId] = useState(matches[0]?.f.id ?? faculties[0].id);
  const [bId, setBId] = useState(matches[1]?.f.id ?? faculties[1].id);
  const [priorityId, setPriorityId] = useState<string>("balanced");

  const getF = (id: string): Faculty => faculties.find((f) => f.id === id) ?? faculties[0];
  const getM = (id: string): FacultyMatch | undefined => matches.find((m) => m.f.id === id);

  const fa = getF(aId);
  const fb = getF(bId);
  const ma = getM(aId);
  const mb = getM(bId);

  const activePreset = PRIORITY_PRESETS.find((p) => p.id === priorityId) ?? PRIORITY_PRESETS[0];
  const matrix = useMemo(
    () => buildComparisonMatrix(fa, fb, ma, mb, activePreset.weights),
    [fa, fb, ma, mb, activePreset.weights]
  );

  const Pair = ({
    title,
    winner,
    render,
  }: {
    title?: string;
    winner?: "a" | "b" | "tie";
    render: (f: Faculty, m?: FacultyMatch, side?: "a" | "b") => React.ReactNode;
  }) => (
    <div className={title ? "mt-5" : ""}>
      {title && <h3 className="text-center font-head font-extrabold text-sm mb-2">{tr(title)}</h3>}
      <div className="grid grid-cols-2 gap-3 items-start">
        <div
          className={`min-w-0 rounded-2xl p-2.5 transition-colors ${
            winner === "a"
              ? darkMode
                ? "bg-emerald-500/12 border border-emerald-400/35"
                : "bg-emerald-50 border border-emerald-300"
              : ""
          }`}
        >
          {render(fa, ma, "a")}
        </div>
        <div
          className={`min-w-0 rounded-2xl p-2.5 transition-colors ${
            winner === "b"
              ? darkMode
                ? "bg-emerald-500/12 border border-emerald-400/35"
                : "bg-emerald-50 border border-emerald-300"
              : ""
          }`}
        >
          {render(fb, mb, "b")}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label={tr("Dib u noqo")}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="font-head font-bold text-[19px]">{tr("Isbarbardhig")}</h1>
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

      <main className="max-w-4xl w-full mx-auto px-4 pt-5 pb-10 flex-1 space-y-5">
        {/* Interactive Priority Weight Selector (Unlock+ only, balanced default when free) */}
        {proActive && (
          <section
            className={`rounded-2xl p-4 border space-y-3 ${
              darkMode ? "bg-[#121A30] border-white/12" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#5D7BFF]" />
                <span className="font-head font-extrabold text-sm">
                  Miisaanka Go'aankaaga (Maxaa kuu muhiimsan?)
                </span>
              </div>
              <span className="text-xs opacity-65">Dhibcuhu si toos ah ayay isu beddelaan</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITY_PRESETS.map((preset) => {
                const active = preset.id === priorityId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPriorityId(preset.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      active
                        ? "bg-[#3B5BDB] text-white border-[#3B5BDB]"
                        : darkMode
                        ? "bg-white/[0.04] border-white/15 text-white/85 hover:bg-white/[0.1]"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Free Side-by-Side Faculty Comparison */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: aId, set: setAId, label: "Kulliyadda A" },
              { val: bId, set: setBId, label: "Kulliyadda B" },
            ].map((sel, i) => (
              <select
                key={i}
                aria-label={sel.label}
                value={sel.val}
                onChange={(e) => sel.set(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold border outline-none ${
                  darkMode
                    ? "bg-[#151D33] border-white/15 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.short}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="mt-3.5">
            <Pair
              render={(f) => (
                <div className="rounded-[16px] overflow-hidden">
                  <FacultyBanner faculty={f} height={100} label />
                </div>
              )}
            />
            <Pair
              title="Ku habboonaanta"
              winner={matrix.recommended}
              render={(f, m, side) => {
                const score = side === "a" ? matrix.scoreA : matrix.scoreB;
                const isWin = matrix.recommended === side;
                return (
                  <div className="flex items-center gap-2">
                    <p
                      className="font-head font-extrabold text-[24px] tabular-nums"
                      style={{ color: argbToHex(f.color) }}
                    >
                      {m?.inPool ? `${score}%` : "-"}
                    </p>
                    {isWin && m?.inPool && (
                      <Crown className="w-4 h-4 text-[#FFC93C] shrink-0" />
                    )}
                  </div>
                );
              }}
            />
            <Pair
              title="Xiisaha · Kartida · Qiimaha"
              winner={matrix.interestWinner}
              render={(_, m) => (
                <p className="text-xs opacity-80 tabular-nums font-semibold">
                  {m?.inPool ? `${m.interest}% · ${m.aptitude}% · ${m.conditions}%` : "-"}
                </p>
              )}
            />
            <Pair
              title="Magaca"
              render={(f) => <p className="text-sm font-semibold leading-snug">{tx(f.name)}</p>}
            />
            <Pair
              title="Sharaxaad"
              render={(f) => <p className="text-xs leading-relaxed opacity-85">{tx(f.desc)}</p>}
            />
            <Pair
              title="Waaxaha"
              render={(f) => (
                <p className="text-xs leading-relaxed opacity-85">
                  {trf("{n} waax: {list}", { n: f.depts.length, list: f.depts.join(", ") })}
                </p>
              )}
            />
            <Pair
              title="Shaqooyinka"
              render={(f) => (
                <p className="text-xs leading-relaxed opacity-85">{txl(f.jobs).join(" · ")}</p>
              )}
            />
            <Pair
              title="Talooyinka"
              render={(f) => (
                <ul className="space-y-1 text-xs leading-relaxed opacity-85">
                  {txl(f.tips).slice(0, 2).map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              )}
            />
          </div>
        </div>

        {/* Unlock+ Decision Verdict & Hybrid Combo Matrix */}
        {!proActive ? (
          <section
            className="rounded-3xl p-5 sm:p-6 border border-[#FFC93C]/40 shadow-lg space-y-4 text-white"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,201,60,0.12) 0%, rgba(15,27,76,0.92) 48%, rgba(22,19,68,0.95) 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#FFC93C]/18 border border-[#FFC93C]/45 text-[#FFD86B] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#FFD86B]">
                    Xukunka Go'aanka &amp; Miisaanka (Unlock+)
                  </div>
                  <div className="text-xs text-white/75">
                    Miisaanka Xiisaha vs Kartida vs Suuqa &amp; Isku-darka Xirfadaha
                  </div>
                </div>
              </div>
              <ProBadge small />
            </div>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Marka aad furto Unlock+ ($0.50 qeyb ama $1.20 Total · 20% Off), waxaad dooran kartaa miisaanka mudnaantaada, arki kartaa sida labadan kulliyadood isugu xirmaan, iyo 3 su'aalood oo go'aan-qaadasho ah.
            </p>

            <button
              type="button"
              onClick={onOpenPaywall}
              className="w-full sm:w-auto px-5 h-11 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LockOpen className="w-4 h-4" />
              <span>Fur Unlock+ ($0.50 | Total $1.20)</span>
            </button>
          </section>
        ) : (
          <ProContentShield
            active={proActive}
            sectionLabel="Qeybta 3aad · Isbarbardhigga Pro Matrix"
          >
            <section
              className={`rounded-3xl p-5 border space-y-4 ${
                darkMode
                  ? "bg-[#121A30] border-[#FFC93C]/35 text-white"
                  : "bg-indigo-50/75 border-indigo-200 text-slate-900"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFC93C]">
                  <Sparkles className="w-4 h-4" />
                  <span>Xukunka Go'aanka HIRAAL</span>
                </div>
                <h3 className="font-head font-extrabold text-lg leading-snug">
                  {matrix.verdictTitle}
                </h3>
                <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                  {matrix.verdictBody}
                </p>
              </div>

              <div
                className={`rounded-2xl p-4 border space-y-1.5 ${
                  darkMode ? "bg-white/[0.04] border-white/12" : "bg-white border-slate-200"
                }`}
              >
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#5D7BFF]">
                  Isku-darka Labada Kulliyadood (Skill Synergy)
                </div>
                <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                  {matrix.hybridComboNote}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider opacity-75">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>3 Su'aalood oo Go'aan-qaadasho ah</span>
                </div>
                <ol className="space-y-1.5">
                  {matrix.decisionQuestions.map((q, idx) => (
                    <li key={idx} className="text-xs sm:text-[13px] opacity-90 flex items-start gap-2 leading-relaxed">
                      <span className="font-head font-extrabold text-[#5D7BFF] shrink-0">
                        {idx + 1}.
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </ProContentShield>
        )}

        <Footer />
      </main>
    </div>
  );
}
