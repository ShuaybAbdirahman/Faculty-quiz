import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Compass,
  ExternalLink,
  Lightbulb,
  Lock,
  Map,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  comingSoonRoadmaps,
  facultyRoadmaps,
  readinessChecklist,
  somaliaChallenges,
  type FacultyRoadmap,
} from "../data/proHubData";
import { useApp } from "../context/AppContext";
import { ProBadge, ProgressRing } from "./ModernUI";

const STORAGE_ROADMAP_PROGRESS = "hk_pro_roadmap_done_v1";
const STORAGE_READINESS_PROGRESS = "hk_pro_readiness_done_v1";

function loadIdSet(key: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function ProRoadmapsExplorer({
  locked = false,
  initialFacultyId,
  onUnlockClick,
}: {
  locked?: boolean;
  initialFacultyId?: string;
  onUnlockClick?: () => void;
}) {
  const { tr } = useApp();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialFacultyId) {
      const match = facultyRoadmaps.find((r) => r.facultyId === initialFacultyId);
      if (match) return match.id;
    }
    return facultyRoadmaps[0].id;
  });
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>(() =>
    loadIdSet(STORAGE_ROADMAP_PROGRESS)
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return facultyRoadmaps;
    return facultyRoadmaps.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.stages.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
            s.tools.some((tl) => tl.toLowerCase().includes(q))
        )
    );
  }, [query]);

  const activeRoadmap: FacultyRoadmap =
    filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? facultyRoadmaps[0];

  const toggleMilestone = (key: string) => {
    if (locked) {
      onUnlockClick?.();
      return;
    }
    setDoneMap((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_ROADMAP_PROGRESS, JSON.stringify(next));
      return next;
    });
  };

  const totalItems = activeRoadmap.stages.reduce((acc, s) => acc + s.skills.length, 0);
  const completedItems = activeRoadmap.stages.reduce(
    (acc, s) =>
      acc + s.skills.filter((_, idx) => Boolean(doneMap[`${activeRoadmap.id}:${s.id}:${idx}`])).length,
    0
  );
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Search & Selector Header */}
      <div className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-[#FFD86B]" />
              <h2 className="font-head font-extrabold text-[20px] text-white">
                {tr("Khariidadaha Kulliyadaha (La Hubiyay)")}
              </h2>
            </div>
            <p className="mt-1 text-xs text-white/75 leading-relaxed">
              {tr(
                "Khariidado tallaabo-tallaabo ah oo ku salaysan halbeegyada caalamiga ah (roadmap.sh, IEEE, ABET, WHO). Calaamadee xirfadaha aad barato."
              )}
            </p>
          </div>
          {!locked && (
            <div className="flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-2xl px-3.5 py-2">
              <span className="text-xs text-white/70">{tr("Horumarkaaga:")}</span>
              <span className="font-head font-extrabold text-sm text-[#FFD86B] tabular-nums">
                {pct}% ({completedItems}/{totalItems})
              </span>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/45 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr("Raadi khariidad: AI, Koronto, Caafimaad, Python, Dhisme...")}
            className="w-full rounded-xl ps-10 pe-4 py-3 text-sm bg-[#091233]/90 border border-white/18 text-white placeholder:text-white/40 outline-none focus:border-[#FFC93C]"
          />
        </div>

        {/* Roadmap Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {filtered.map((r) => {
            const active = r.id === activeRoadmap.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  active
                    ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C] shadow-sm"
                    : "bg-white/6 text-white/85 border-white/15 hover:bg-white/12"
                }`}
              >
                {r.title.replace(" Roadmap", "")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Roadmap Detail */}
      <div className="rounded-3xl p-5 sm:p-6 border border-[#FFC93C]/35 bg-white/[0.04] space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                {activeRoadmap.sourceBadge} · {activeRoadmap.duration}
              </span>
            </div>
            <h3 className="font-head font-extrabold text-[22px] text-white leading-tight">
              {activeRoadmap.title}
            </h3>
            <p className="text-sm text-white/75 leading-relaxed max-w-2xl">
              {activeRoadmap.subtitle}
            </p>
          </div>
          {!locked && (
            <div className="w-full sm:w-44">
              <div className="flex justify-between text-xs font-bold text-[#FFD86B] mb-1 tabular-nums">
                <span>Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/12 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFE28F] to-[#FFC93C] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stages Timeline */}
        <div className="space-y-4">
          {activeRoadmap.stages.map((stage, stageIdx) => {
            const isStageLocked = locked && stageIdx > 0;
            return (
              <div
                key={stage.id}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all ${
                  isStageLocked
                    ? "border-white/10 bg-white/[0.02] opacity-75"
                    : "border-white/15 bg-[#091233]/75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#FFD86B]">
                      {stage.phase}
                    </div>
                    <h4 className="mt-0.5 font-head font-extrabold text-[17px] text-white">
                      {stage.title}
                    </h4>
                  </div>
                  {isStageLocked && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FFD86B]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>PRO</span>
                    </span>
                  )}
                </div>

                {isStageLocked ? (
                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-white/65">
                      {tr(
                        "Fur Pro ($0.10 · Abid) si aad u aragto xirfadaha, qalabka, iyo mashruuca marxaladdan."
                      )}
                    </p>
                    {onUnlockClick && (
                      <button
                        type="button"
                        onClick={onUnlockClick}
                        className="px-4 py-2 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs cursor-pointer"
                      >
                        {tr("Fur Pro ($0.10)")}
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="mt-1.5 text-xs sm:text-sm text-white/75 leading-relaxed">
                      {stage.summary}
                    </p>

                    {/* Checkable Skills */}
                    <div className="mt-3.5 space-y-2">
                      {stage.skills.map((skill, idx) => {
                        const key = `${activeRoadmap.id}:${stage.id}:${idx}`;
                        const checked = Boolean(doneMap[key]);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => toggleMilestone(key)}
                            className={`w-full text-start p-2.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-[13.5px] transition-colors cursor-pointer ${
                              checked
                                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-100"
                                : "bg-white/[0.04] border-white/10 hover:border-white/25 text-white/90"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                                checked
                                  ? "bg-emerald-400 border-emerald-400 text-[#050A1C]"
                                  : "border-white/30"
                              }`}
                            >
                              {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </span>
                            <span className={checked ? "line-through opacity-80" : ""}>{skill}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Tools & Project Milestone */}
                    <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center gap-2 flex-wrap text-white/80">
                        <Wrench className="w-3.5 h-3.5 text-[#FFD86B] shrink-0" />
                        <span className="font-semibold text-white/60">Tools:</span>
                        <span>{stage.tools.join(" · ")}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 rounded-xl px-3.5 py-2.5 bg-[#FFC93C]/10 border border-[#FFC93C]/25 text-xs text-[#FFE8A3] flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#FFC93C] shrink-0 mt-0.5" />
                      <span>
                        <strong>{tr("Mashruuca Marxaladda:")}</strong> {stage.milestone}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Free Verified Resources */}
        {!locked && activeRoadmap.freeResources.length > 0 && (
          <div className="rounded-2xl p-4 bg-white/[0.04] border border-white/12">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD86B] mb-2.5">
              <BookOpen className="w-4 h-4" />
              <span>{tr("Ilaha Waxbarasho ee Bilaashka ah (La Hubiyay)")}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {activeRoadmap.freeResources.map((res) => (
                <div
                  key={res.name}
                  className="rounded-xl p-3 bg-[#091233]/75 border border-white/10 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{res.name}</div>
                    <div className="text-[11.5px] text-white/65 mt-0.5">{res.note}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFD86B] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coming Soon Roadmaps */}
      <div className="rounded-3xl p-5 border border-white/12 bg-white/[0.03]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#FFD86B]" />
            <h4 className="font-head font-bold text-sm text-white">
              {tr("Khariidado Cusub oo Soo Socda (Bilaash u ah Pro)")}
            </h4>
          </div>
          <span className="text-[11px] font-bold text-[#FFD86B]">{tr("Dhawaan")}</span>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {comingSoonRoadmaps.map((c) => (
            <div
              key={c.title}
              className="rounded-xl p-3 bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{c.title}</div>
                <div className="text-[11px] text-white/60">{c.faculty}</div>
              </div>
              <span className="text-[10.5px] font-bold text-[#FFD86B] shrink-0">{c.eta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SomaliaChallengesHub({
  locked = false,
  onUnlockClick,
}: {
  locked?: boolean;
  onUnlockClick?: () => void;
}) {
  const { tr } = useApp();
  const [openId, setOpenId] = useState<string>(somaliaChallenges[0].id);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5 border border-white/15 bg-white/[0.05]">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#FFD86B]" />
          <h2 className="font-head font-extrabold text-[20px] text-white">
            {tr("Caqabadaha Ardayga Soomaaliya iyo Xalkooda")}
          </h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
          {tr(
            "Hage dhab ah oo loogu talagalay ardayga ka baxaya dugsiga sare una gudbaya jaamacadaha Soomaaliya (luqadda, khidmadda, xirfadda shaqada, qoyska, iyo darajada)."
          )}
        </p>
      </div>

      <div className="space-y-3">
        {somaliaChallenges.map((item, idx) => {
          const isOpen = openId === item.id;
          const isLocked = locked && idx > 0;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/15 bg-[#091233]/80 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  if (isLocked) {
                    onUnlockClick?.();
                  } else {
                    setOpenId(isOpen ? "" : item.id);
                  }
                }}
                className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                    {item.category}
                  </div>
                  <h3 className="font-head font-bold text-[15.5px] sm:text-[16.5px] text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
                {isLocked ? (
                  <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
                ) : isOpen ? (
                  <ChevronUp className="w-5 h-5 text-white/70 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/70 shrink-0" />
                )}
              </button>

              {isOpen && !isLocked && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/10 space-y-3.5">
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    <strong className="text-rose-300">{tr("Caqabadda:")}</strong> {item.problem}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {tr("Xalka Tallaabo-Tallaabo:")}
                    </div>
                    <ol className="space-y-2">
                      {item.solutionSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-xl px-3.5 py-2.5 bg-[#FFC93C]/12 border border-[#FFC93C]/30 text-xs text-[#FFE599]">
                    <strong>{tr("Talo Muhiim ah:")}</strong> {item.quickTip}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReadinessTracker({
  locked = false,
  onUnlockClick,
}: {
  locked?: boolean;
  onUnlockClick?: () => void;
}) {
  const { tr } = useApp();
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() =>
    loadIdSet(STORAGE_READINESS_PROGRESS)
  );

  const doneCount = readinessChecklist.filter((it) => Boolean(checkedMap[it.id])).length;
  const pct = Math.round((doneCount / readinessChecklist.length) * 100);

  const toggle = (id: string) => {
    if (locked) {
      onUnlockClick?.();
      return;
    }
    setCheckedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_READINESS_PROGRESS, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] flex items-center justify-between gap-4 flex-wrap">
        <div className="max-w-lg">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#FFD86B]" />
            <h2 className="font-head font-extrabold text-[20px] text-white">
              {tr("Diyaargarowga Jaamacadda (90 Maalmood)")}
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
            {tr(
              "Calaamadee tallaabo kasta oo aad dhammayso ka hor inta uusan sannadka koowaad bilaaban si aad jaamacadda ugu gasho kalsooni buuxda."
            )}
          </p>
        </div>

        <ProgressRing
          percent={pct}
          color="#FFC93C"
          size={78}
          stroke={7}
          track="rgba(255,255,255,0.16)"
        >
          <span className="font-head font-extrabold text-base text-[#FFD86B] tabular-nums">
            {pct}%
          </span>
        </ProgressRing>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {readinessChecklist.map((item) => {
          const checked = Boolean(checkedMap[item.id]);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`text-start rounded-2xl p-4 border transition-all cursor-pointer flex items-start gap-3 ${
                checked
                  ? "bg-emerald-500/15 border-emerald-400/40"
                  : "bg-[#091233]/80 border-white/15 hover:border-white/30"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  checked
                    ? "bg-emerald-400 border-emerald-400 text-[#050A1C]"
                    : "border-white/30 text-transparent"
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#FFD86B]">
                  {item.category}
                </div>
                <div
                  className={`font-head font-bold text-sm mt-0.5 ${
                    checked ? "text-emerald-100 line-through opacity-80" : "text-white"
                  }`}
                >
                  {item.title}
                </div>
                <p className="text-xs text-white/65 mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProUnlockPromoBanner({ onUnlock }: { onUnlock: () => void }) {
  const { tr } = useApp();
  return (
    <div
      className="rounded-3xl p-5 border border-[#FFC93C]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,201,60,0.16) 0%, rgba(99,102,241,0.18) 100%)",
      }}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ProBadge small />
          <span className="text-xs font-extrabold text-[#FFD86B]">
            {tr("$0.10 Keliya · Hal mar (Abid)")}
          </span>
        </div>
        <h3 className="font-head font-extrabold text-lg text-white">
          {tr("Fur dhammaan Khariidadaha Waxbarashada, Xalka Caqabadaha iyo Hagaha Waaxda")}
        </h3>
        <p className="text-xs text-white/80">
          {tr(
            "Hal mar bixi $0.10 (EVC Plus: 610999089 · Shuceyb Abdirahman), waligaa Pro ayaad ahaanaysaa iyadoo adeegyo cusub ay bilaash kuugu soo kordhayaan."
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="shrink-0 px-5 py-3 rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{tr("Fur Pro ($0.10)")}</span>
      </button>
    </div>
  );
}
