import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  Check,
  CloudOff,
  Info,
  Loader2,
  Lock,
  LockOpen,
  SlidersHorizontal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { items, sections, type Faculty } from "../data/quizData";
import { proTraitLabels } from "../data/proData";
import { getProQuestionsForFaculty } from "../data/proQuestions";
import { useApp } from "../context/AppContext";
import { fetchProContent, ProApiError } from "../lib/api";
import { backendEnabled } from "../lib/config";
import { argbToHex, hexToRgba, plainFacultyName } from "../lib/i18n";
import { rankDepts, refineItems, traitsFrom, type ProDeepAnswer, type ProDeptData } from "../lib/scoring";
import {
  AccentTitleLight,
  FacultyIcon,
  ProBadge,
  ProgressRing,
  ShinyButton,
} from "../components/ModernUI";
import {
  ProRoadmapsExplorer,
  ReadinessTracker,
  SomaliaChallengesHub,
} from "../components/ProHubContent";

export interface ProFacultyRef {
  f: Faculty;
  percent: number;
}

export function ProEntryCard({
  entries,
  onOpenPro,
}: {
  entries: ProFacultyRef[];
  onOpenPro: (faculty: Faculty) => void;
}) {
  const { tr, tx, proActive, refreshPro } = useApp();
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (backendEnabled) {
      refreshPro().catch(() => {});
    }
  }, [refreshPro]);

  return (
    <div
      className="relative rounded-[24px] p-[18px] text-white border border-[#FFC93C]/55"
      style={{
        background: "linear-gradient(135deg, #050A1E 0%, #16276F 100%)",
        boxShadow: "0 12px 30px rgba(255,201,60,0.16)",
      }}
    >
      <div className="flex items-center justify-between">
        <ProBadge />
        {proActive ? (
          <BadgeCheck className="w-6 h-6 text-[#FFD86B]" />
        ) : (
          <Lock className="w-5 h-5 text-[#FFD86B]" />
        )}
      </div>

      <h3 className="mt-3 font-head font-extrabold text-[24px] leading-tight">
        {tr("Hagaha Waaxda")}
      </h3>
      <p className="mt-1 text-[13.5px] text-white/80">
        {tr("Dooro waaxda saxda ah ee kulliyaddaada")}
      </p>

      <p className="mt-3.5 text-[11.5px] font-bold tracking-wider uppercase text-[#FFD86B]">
        {tr("Ka dooro kulliyadda")}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {entries.map((entry, i) => {
          const isSel = i === sel;
          const hex = argbToHex(entry.f.color);
          return (
            <button
              key={entry.f.id}
              type="button"
              onClick={() => setSel(i)}
              className={`max-w-[260px] px-3 py-2 rounded-full flex items-center gap-1.5 text-[12.5px] border cursor-pointer transition-all ${
                isSel ? "font-bold border-[#FFC93C]" : "font-medium border-white/25"
              }`}
              style={{
                background: isSel
                  ? `linear-gradient(90deg, ${hexToRgba(hex, 0.95)}, ${hexToRgba(hex, 0.6)})`
                  : "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
              }}
            >
              <FacultyIcon faculty={entry.f} size={18} />
              <span className="truncate">{plainFacultyName(tx(entry.f.name))}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-2">
        {[
          { icon: <BarChart3 className="w-4 h-4 text-[#FFD86B]" />, k: "Kala saar waaxaha ku habboon" },
          { icon: <Briefcase className="w-4 h-4 text-[#FFD86B]" />, k: "Shaqooyinka waaxda kasta" },
          { icon: <SlidersHorizontal className="w-4 h-4 text-[#FFD86B]" />, k: "Xoojiso natiijada su’aalo yar" },
        ].map((f) => (
          <div key={f.k} className="flex items-center gap-2.5 text-[13.5px] text-white/90">
            <span className="w-7 h-7 rounded-[9px] bg-[#FFC93C]/16 flex items-center justify-center shrink-0">
              {f.icon}
            </span>
            <span>{tr(f.k)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <ShinyButton
          label={proActive ? "Fur Hagaha Pro" : "Fur Pro"}
          icon={
            proActive ? (
              <Sparkles className="w-5 h-5 text-[#050A1E]" />
            ) : (
              <LockOpen className="w-5 h-5 text-[#050A1E]" />
            )
          }
          onClick={() => onOpenPro(entries[sel].f)}
        />
      </div>
    </div>
  );
}

export function ProGuideScreen({
  faculty,
  ratings,
  onBack,
  onLocked,
}: {
  faculty: Faculty;
  ratings: number[];
  onBack: () => void;
  onLocked: () => void;
}) {
  const { lang, tr, trf, tx, txl, rtl, deviceId, setProUntil } = useApp();
  const [depts, setDepts] = useState<ProDeptData[] | null>(null);
  const [ask, setAsk] = useState<number[]>([]);
  const [extra, setExtra] = useState<Record<number, number>>({});
  const [proAns, setProAns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"depts" | "roadmaps" | "challenges" | "readiness">("depts");

  const facultyProQuestions = useMemo(() => getProQuestionsForFaculty(faculty.id), [faculty.id]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const d = await fetchProContent(deviceId, faculty.id);
      if (d.length === 0) {
        setErr("empty");
        setLoading(false);
        return;
      }
      setDepts(d);
      setAsk(refineItems(d, ratings));
      setLoading(false);
    } catch (e) {
      if (e instanceof ProApiError && e.locked) {
        setProUntil(0);
        onLocked();
        return;
      }
      setErr(e instanceof ProApiError ? e.code : "offline");
      setLoading(false);
    }
  }, [deviceId, faculty.id, ratings, setProUntil, onLocked]);

  useEffect(() => {
    load();
  }, [load]);

  const ranked = useMemo(() => {
    if (!depts) return [];
    const deepList: ProDeepAnswer[] = facultyProQuestions
      .filter((q) => proAns[q.id] !== undefined)
      .map((q) => ({ k: q.k, k2: q.k2, v: proAns[q.id] }));
    const raw = traitsFrom(ratings, extra, deepList);
    return rankDepts(depts, raw);
  }, [depts, ratings, extra, facultyProQuestions, proAns]);

  const traitLabel = (k: string) => {
    const entry = proTraitLabels[k];
    if (!entry) return k;
    return entry[lang === "so" ? 0 : lang === "en" ? 1 : 2];
  };

  const hex = argbToHex(faculty.color);

  return (
    <div
      className="min-h-screen flex flex-col text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050A1E 0%, #0B1647 50%, #1A1450 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-28 -right-24 w-[320px] h-[320px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,201,60,0.16), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-28 w-[360px] h-[360px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(106,71,224,0.35), transparent 70%)" }}
      />

      <header className="relative z-10 border-b border-white/10 bg-[#050A1E]/85 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer transition-colors"
          >
            {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-head font-extrabold text-[18px]">{tr("Hagaha Waaxda")}</h1>
            <ProBadge small />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {[
            { id: "depts", label: tr("Waaxaha") },
            { id: "roadmaps", label: tr("Khariidadaha") },
            { id: "challenges", label: tr("Caqabadaha Soomaaliya") },
            { id: "readiness", label: tr("Diyaargarowga") },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border shrink-0 cursor-pointer transition-colors ${
                activeTab === t.id
                  ? "bg-[#FFC93C] text-[#050A1E] border-[#FFC93C]"
                  : "bg-white/6 text-white/80 border-white/15 hover:bg-white/12"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5 pb-12">
        {activeTab === "roadmaps" ? (
          <ProRoadmapsExplorer initialFacultyId={faculty.id} />
        ) : activeTab === "challenges" ? (
          <SomaliaChallengesHub />
        ) : activeTab === "readiness" ? (
          <ReadinessTracker />
        ) : loading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFC93C]" />
          </div>
        ) : err || !depts || ranked.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <CloudOff className="w-10 h-10 text-[#FFD86B]" />
            <p className="text-sm text-white/85 max-w-xs leading-relaxed">
              {tr("Lama soo qaadi karin. Hubi internetka oo mar kale isku day.")}
            </p>
            <button
              type="button"
              onClick={load}
              className="px-5 py-2.5 rounded-full bg-[#FFC93C] text-[#050A1E] font-extrabold text-sm cursor-pointer"
            >
              {tr("Isku day mar kale")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Faculty Header */}
            <div className="flex items-center gap-3">
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center border border-white/50 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${hex}, ${hexToRgba(hex, 0.6)})`,
                }}
              >
                <FacultyIcon faculty={faculty} size={28} />
              </div>
              <div>
                <h2 className="font-head font-extrabold text-[18px] leading-tight">
                  {plainFacultyName(tx(faculty.name))}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {trf("{n} waaxood oo la barbar dhigay", { n: ranked.length })}
                </p>
              </div>
            </div>

            {faculty.id === "med" && (
              <div className="rounded-[16px] p-3 border border-white/20 bg-white/8 flex items-start gap-2 text-xs text-white/85 leading-relaxed">
                <Info className="w-4 h-4 text-[#FFD86B] shrink-0 mt-0.5" />
                <span>
                  {tr(
                    "Dhakhtarnimada waa waax keliya; kuwan waa waddooyinka takhasuska ee aad dooran karto kadib."
                  )}
                </span>
              </div>
            )}

            {/* Hero #1 Department */}
            {(() => {
              const top = ranked[0];
              const jobs = txl(top.d.jobs);
              return (
                <div
                  className="rounded-[26px] p-[18px] border border-[#FFC93C]/60"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
                    boxShadow: "0 12px 28px rgba(255,201,60,0.18)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider uppercase text-[#FFD86B]">
                      {tr("Waaxda ugu habboon")}
                    </span>
                    <Trophy className="w-5 h-5 text-[#FFC93C]" />
                  </div>

                  <div className="mt-3 flex items-start gap-3.5">
                    <ProgressRing
                      percent={top.pct}
                      color="#FFC93C"
                      size={92}
                      stroke={8}
                      track="rgba(255,255,255,0.18)"
                      gradientId="proHeroRing"
                    >
                      <span className="font-head font-extrabold text-[22px] text-[#FFD86B]">
                        {top.pct}%
                      </span>
                    </ProgressRing>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-head font-extrabold text-[20px] leading-tight">
                        {top.d.name}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-white/85 leading-relaxed">
                        {tx(top.d.d)}
                      </p>
                    </div>
                  </div>

                  {top.why.length > 0 && (
                    <div className="mt-3.5">
                      <p className="text-[11.5px] font-bold tracking-wider uppercase text-[#FFD86B] mb-2">
                        {tr("Waxa ay kuugu habboon tahay")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {top.why.map((k) => (
                          <span
                            key={k}
                            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFC93C]/16 border border-[#FFC93C]/50 text-[#FFD86B]"
                          >
                            {traitLabel(k)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3.5">
                    <p className="text-[11.5px] font-bold tracking-wider uppercase text-[#FFD86B] mb-2">
                      {tr("Shaqooyin suurtagal ah")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {jobs.map((j) => (
                        <span
                          key={j}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/22 text-white"
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Other Ranked Departments */}
            {ranked.length > 1 && (
              <div className="pt-2 space-y-3">
                <AccentTitleLight label="Waaxaha loo kala saaray ku habboonaantaada" />
                {ranked.slice(1).map((s, idx) => {
                  const jobs = txl(s.d.jobs);
                  return (
                    <div
                      key={s.d.name}
                      className="rounded-[20px] p-3.5 border border-white/20"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-[26px] h-[26px] rounded-full bg-white/15 flex items-center justify-center text-xs font-extrabold shrink-0">
                          {idx + 2}
                        </span>
                        <span className="flex-1 font-head font-bold text-[15px] leading-snug">
                          {s.d.name}
                        </span>
                        <span className="font-head font-extrabold text-[15px] text-[#FFD86B]">
                          {s.pct}%
                        </span>
                      </div>
                      <div className="mt-2.5 h-[7px] rounded-full bg-white/12 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${s.pct}%`,
                            background: "linear-gradient(90deg, #FFE28F, #FFC93C, #FF9F5B)",
                          }}
                        />
                      </div>
                      <p className="mt-2.5 text-[12.5px] text-white/80 leading-relaxed">
                        {tx(s.d.d)}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {jobs.slice(0, 3).map((j) => (
                          <span
                            key={j}
                            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/22"
                          >
                            {j}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dedicated Faculty-Tailored Pro Precision Questions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AccentTitleLight label="Su'aalaha Gaarka ah ee Waaxda (Pro)" />
                </div>
                <span className="text-xs font-bold text-[#FFD86B] tabular-nums">
                  {Object.keys(proAns).length}/{facultyProQuestions.length}
                </span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                {tr(
                  "Ka jawaab 5-tan su'aalood ee gaarka u ah kulliyaddaada si natiijada waaxdaada u noqoto mid aad u saxsan."
                )}
              </p>

              {facultyProQuestions.map((pq, n) => {
                const opts = txl(sections[1].sc);
                const selected = proAns[pq.id];
                return (
                  <div
                    key={pq.id}
                    className={`rounded-[20px] p-4 border transition-colors ${
                      selected !== undefined ? "border-[#FFC93C]/60" : "border-white/20"
                    }`}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          selected !== undefined
                            ? "bg-[#FFC93C] text-[#050A1E]"
                            : "bg-white/16 text-white"
                        }`}
                      >
                        {selected !== undefined ? <Check className="w-3.5 h-3.5" /> : n + 1}
                      </span>
                      <p className="text-sm font-semibold leading-snug">{tx(pq.t)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {opts.map((opt, oi) => {
                        const isSel = selected === oi + 1;
                        return (
                          <button
                            key={oi}
                            type="button"
                            onClick={() => setProAns((prev) => ({ ...prev, [pq.id]: oi + 1 }))}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                              isSel
                                ? "bg-[#FFC93C] text-[#050A1E] border-[#FFC93C]"
                                : "bg-white/8 text-white border-white/25 hover:bg-white/15"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Optional extra unanswered free-quiz refinement items if any */}
              {ask.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <AccentTitleLight label="Xoojiso natiijada" />
                    <span className="text-xs font-bold text-[#FFD86B] tabular-nums">
                      {Object.keys(extra).length}/{ask.length}
                    </span>
                  </div>
                  {ask.slice(0, 3).map((qIdx, n) => {
                    const it = items[qIdx];
                    const opts = txl(sections[it.s].sc);
                    const selected = extra[qIdx];
                    return (
                      <div
                        key={qIdx}
                        className={`rounded-[20px] p-3.5 border ${
                          selected !== undefined ? "border-[#FFC93C]/55" : "border-white/20"
                        }`}
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                              selected !== undefined
                                ? "bg-[#FFC93C] text-[#050A1E]"
                                : "bg-white/16 text-white"
                            }`}
                          >
                            {selected !== undefined ? <Check className="w-3.5 h-3.5" /> : n + 1}
                          </span>
                          <p className="text-sm font-semibold leading-snug">{tx(it.t)}</p>
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {opts.map((opt, oi) => {
                            const isSel = selected === oi + 1;
                            return (
                              <button
                                key={oi}
                                type="button"
                                onClick={() => setExtra((prev) => ({ ...prev, [qIdx]: oi + 1 }))}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                                  isSel
                                    ? "bg-[#FFC93C] text-[#050A1E] border-[#FFC93C]"
                                    : "bg-white/8 text-white border-white/25 hover:bg-white/15"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="pt-2 text-center text-xs text-white/60 leading-relaxed">
              {tr("Waa hage, ma aha go’aan kama dambays ah. La tasho macallimiin ama arday jaamacad.")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
