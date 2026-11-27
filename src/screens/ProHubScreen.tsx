import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Crown,
  GraduationCap,
  Layers,
  Lock,
  LockOpen,
  Map as MapIcon,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { faculties } from "../data/quizData";
import { form4Subjects } from "../data/schoolForm4Data";
import { bridgeSubjects } from "../data/bridgingPrepData";
import {
  getProLevelForCycle,
  getRukunPricing,
  PRO_LEVEL_PLANS,
  type ProBillingCycle,
  type ProLevel,
} from "../lib/proSecurity";
import { ProContentShield } from "../components/ProContentShield";
import {
  ProRoadmapsExplorer,
  ReadinessTracker,
  SomaliaChallengesHub,
} from "../components/ProHubContent";
import {
  FutureJobsNewsSection,
  HighIncomeSkillsSection,
  SomaliaGrowthSection,
  SomaliaUniversitiesSection,
  WorldPioneersSection,
} from "../components/ProWorldHubSections";
import {
  ExamHallRulesSection,
  LegalSubjectSecretsSection,
  Top10TricksSection,
} from "../components/TopStudentHubSection";
import { PredictRankingBoard } from "../components/PredictRankingBoard";
import { ProStudentTools } from "../components/ProStudentTools";
import { FacultyIcon } from "../components/ModernUI";
import type { ProPlanType } from "./ProPaywallScreen";

export type HubTab =
  | "tools"
  | "roadmaps"
  | "departments"
  | "secrets"
  | "readiness"
  | "universities"
  | "skills"
  | "pioneers"
  | "rankings"
  | "future_jobs"
  | "somalia_growth";

type UnifiedTab =
  | "tools"
  | "roadmaps"
  | "departments"
  | "secrets"
  | "readiness"
  | "universities"
  | "skills"
  | "pioneers"
  | "rankings";

type StageId = "school" | "jus" | "university";

function normalizeTab(tab?: HubTab): UnifiedTab {
  if (tab === "future_jobs") return "skills";
  if (tab === "somalia_growth") return "universities";
  if (
    tab === "tools" ||
    tab === "roadmaps" ||
    tab === "departments" ||
    tab === "secrets" ||
    tab === "readiness" ||
    tab === "universities" ||
    tab === "skills" ||
    tab === "pioneers" ||
    tab === "rankings"
  ) {
    return tab;
  }
  return "tools";
}

interface UnifiedSectionMeta {
  id: UnifiedTab;
  label: string;
  stage: StageId;
  stageLabel: string;
  requiredLevel: ProLevel;
  icon: React.ComponentType<{ className?: string }>;
}

const UNIFIED_SECTIONS: UnifiedSectionMeta[] = [
  {
    id: "tools",
    label: "Qalabka Ardayga",
    stage: "university",
    stageLabel: "University",
    requiredLevel: 1,
    icon: Calculator,
  },
  {
    id: "departments",
    label: "Hagaha Waaxda",
    stage: "university",
    stageLabel: "University",
    requiredLevel: 1,
    icon: Compass,
  },
  {
    id: "universities",
    label: "Jaamacadaha",
    stage: "university",
    stageLabel: "University",
    requiredLevel: 2,
    icon: Building2,
  },
  {
    id: "skills",
    label: "Suuqa Shaqada",
    stage: "university",
    stageLabel: "University",
    requiredLevel: 2,
    icon: Wrench,
  },
  {
    id: "roadmaps",
    label: "Khariidadaha",
    stage: "university",
    stageLabel: "University",
    requiredLevel: 3,
    icon: MapIcon,
  },
  {
    id: "pioneers",
    label: "Dadka Caanka ah",
    stage: "university",
    stageLabel: "University",
    requiredLevel: 3,
    icon: Award,
  },
  {
    id: "secrets",
    label: "Sirta Top-10",
    stage: "school",
    stageLabel: "School",
    requiredLevel: 1,
    icon: Sparkles,
  },
  {
    id: "readiness",
    label: "90-Maalmood",
    stage: "jus",
    stageLabel: "Diyaarinta",
    requiredLevel: 1,
    icon: ClipboardCheck,
  },
  {
    id: "rankings",
    label: "Kaalmaha Sare",
    stage: "school",
    stageLabel: "School / Diyaarinta",
    requiredLevel: 1,
    icon: Trophy,
  },
];

const STAGE_CARDS: Array<{
  id: StageId;
  title: string;
  tag: string;
  accentCard: string;
  accentBadge: string;
  items: string[];
}> = [
  {
    id: "school",
    title: "School",
    tag: "Form 4",
    accentCard: "border-sky-500/40 bg-sky-500/[0.06]",
    accentBadge: "bg-sky-600 text-white",
    items: ["Predict Exams (12 Maado)", "Sirta Top-10 & 12 Maado", "Ranking Form 4"],
  },
  {
    id: "jus",
    title: "Diyaarinta",
    tag: "Gelitaanka",
    accentCard: "border-emerald-500/40 bg-emerald-500/[0.06]",
    accentBadge: "bg-emerald-600 text-white",
    items: ["5-ta Maado ee Gelitaanka", "90 Maalmood & Caqabadaha", "Ranking Gelitaanka"],
  },
  {
    id: "university",
    title: "University",
    tag: "Kulliyadaha",
    accentCard: "border-amber-400/45 bg-amber-500/[0.07]",
    accentBadge: "bg-amber-400 text-[#050A1C]",
    items: ["GPA, Jadwal & Wareysi", "Hagaha Waaxda & Jaamacadaha", "Suuqa Shaqada & Khariidado"],
  },
];

const LEVEL_TIERS: Array<{
  level: ProLevel;
  cycle: ProBillingCycle;
  colorDot: string;
  pillCls: string;
  cardBorder: string;
  unlocks: string[];
}> = [
  {
    level: 1,
    cycle: "weekly",
    colorDot: "bg-sky-500",
    pillCls: "bg-sky-500/18 text-sky-300 border-sky-400/40",
    cardBorder: "border-sky-500/45",
    unlocks: [
      "Qalabka GPA & Saacadda Focus",
      "Sirta Top-10 & Xeerarka Hoolka",
      "90-Maalmood (1-30) & Ranking",
    ],
  },
  {
    level: 2,
    cycle: "monthly",
    colorDot: "bg-emerald-500",
    pillCls: "bg-emerald-500/18 text-emerald-300 border-emerald-400/40",
    cardBorder: "border-emerald-500/45",
    unlocks: [
      "Wax kasta oo Heerka 1aad ku jira",
      "Jaamacadaha Soomaaliya & Suuqa Shaqada",
      "Sirta 12-ka Maado, Jadwalka & Caqabadaha",
    ],
  },
  {
    level: 3,
    cycle: "yearly",
    colorDot: "bg-amber-400",
    pillCls: "bg-amber-400/20 text-amber-300 border-amber-400/50",
    cardBorder: "border-amber-400/60",
    unlocks: [
      "Wax kasta oo Heerka 1 & 2 ku jira",
      "Khariidadaha Kulliyadaha Master & Dadka Caanka ah",
      "Wareysiga Deeqaha, Bangiga Adduunka & 1-90 Maalmood",
    ],
  },
];

const FREE_VS_PRO_ROWS = [
  {
    feature: "Imtixaanka RIASEC (#1-#3) & PDFs Aasaasiga ah",
    free: true,
  },
  {
    feature: "Predict Exams & Ranking (School ama Diyaarinta)",
    free: false,
  },
  {
    feature: "Sirta Top-10, 12-ka Maado & Xeerarka Hoolka",
    free: false,
  },
  {
    feature: "Qorshaha 90-Maalmood & Xalka Caqabadaha",
    free: false,
  },
  {
    feature: "Xisaabiyaha GPA, Jadwalka & Wareysiga Deeqaha",
    free: false,
  },
  {
    feature: "Jaamacadaha Soomaaliya, Suuqa Shaqada & Khariidado",
    free: false,
  },
];

function levelStyle(level: ProLevel | 0) {
  if (level === 3) {
    return {
      badge: "bg-amber-400 text-[#050A1C]",
      softBadge: "bg-amber-400/18 text-amber-300 border-amber-400/45",
      label: "Heerka 3+ · Sanadle",
      short: "Heerka 3+",
    };
  }
  if (level === 2) {
    return {
      badge: "bg-emerald-500 text-white",
      softBadge: "bg-emerald-500/18 text-emerald-300 border-emerald-400/45",
      label: "Heerka 2 · Bille",
      short: "Heerka 2",
    };
  }
  return {
    badge: "bg-sky-600 text-white",
    softBadge: "bg-sky-500/18 text-sky-300 border-sky-400/45",
    label: "Heerka 1 · Asbuucle",
    short: "Heerka 1",
  };
}

export function ProHubScreen({
  initialTab,
  initialFacultyId,
  onBack,
  onOpenPaywall,
  onOpenDepartmentGuide,
}: {
  initialTab?: HubTab;
  initialFacultyId?: string;
  onBack: () => void;
  onOpenPaywall: (cycle?: ProBillingCycle, stagePlan?: ProPlanType) => void;
  onOpenDepartmentGuide?: (facultyId: string) => void;
}) {
  const {
    darkMode,
    rtl,
    proAnyActive,
    proSchoolActive,
    proJusActive,
    proUniversityActive,
    proLevel,
    hasProLevel,
    tx,
  } = useApp();

  const defaultTab = useMemo<UnifiedTab>(() => {
    if (initialTab) return normalizeTab(initialTab);
    if (proUniversityActive) return "tools";
    if (proSchoolActive) return "secrets";
    if (proJusActive) return "readiness";
    return "tools";
  }, [initialTab, proUniversityActive, proSchoolActive, proJusActive]);

  const [tab, setTab] = useState<UnifiedTab>(defaultTab);
  const [selectedStage, setSelectedStage] = useState<ProPlanType>("school");
  const [selectedCycle, setSelectedCycle] = useState<ProBillingCycle>("monthly");
  const [rankingScope, setRankingScope] = useState<"school" | "jus">(() =>
    proJusActive && !proSchoolActive ? "jus" : "school"
  );
  const [secretsTab, setSecretsTab] = useState<"tricks" | "subjects" | "rules">("tricks");
  const [jusSubTab, setJusSubTab] = useState<"readiness" | "challenges">("readiness");
  const [selectedFacId, setSelectedFacId] = useState<string>(
    initialFacultyId || faculties[0].id
  );

  const activeFac = faculties.find((f) => f.id === selectedFacId) ?? faculties[0];
  const isTotalStage = selectedStage === "total";
  const rukunPreview = getRukunPricing(selectedCycle, isTotalStage);

  const stageOpenMap: Record<StageId, boolean> = {
    school: proSchoolActive,
    jus: proJusActive,
    university: proUniversityActive,
  };

  const activeSectionMeta = UNIFIED_SECTIONS.find((s) => s.id === tab) ?? UNIFIED_SECTIONS[0];
  const currentTabStage: StageId =
    tab === "rankings" ? rankingScope : activeSectionMeta.stage;
  const currentTabStageOpen = stageOpenMap[currentTabStage];
  const currentTabLevelOpen = hasProLevel(activeSectionMeta.requiredLevel);
  const currentLevelMeta = levelStyle(proLevel);

  const pageBg = darkMode ? "bg-[#0B1324] text-slate-100" : "bg-slate-50 text-slate-900";
  const cardCls = darkMode
    ? "bg-[#111C33] border-white/10 text-slate-100"
    : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const mutedCls = darkMode ? "text-slate-300" : "text-slate-600";

  const effectiveLevel: ProLevel = (proLevel === 0 ? 1 : proLevel) as ProLevel;

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-clip flex flex-col pb-24 sm:pb-28 ${pageBg}`}>
      {/* Clean Single-Row Top Bar */}
      <header
        className={`border-b sticky top-0 z-30 backdrop-blur-xl ${
          darkMode ? "bg-[#0B1324]/92 border-white/10" : "bg-white/92 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border cursor-pointer transition-colors shrink-0 ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900"
              }`}
            >
              {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <span className="font-head font-extrabold text-lg sm:text-xl tracking-tight whitespace-nowrap shrink-0">
              HIRAAL Pro
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {proAnyActive ? (
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap ${currentLevelMeta.badge}`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{currentLevelMeta.short}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onOpenPaywall(selectedCycle, selectedStage)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <LockOpen className="w-4 h-4" />
                <span>Fur ({rukunPreview.priceFormatted})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 min-w-0">
        {!proAnyActive ? (
          /* LOCKED VIEW: Stage-Isolated Cards + Color-Coded Progressive Levels (Zero Clutter) */
          <div className="space-y-6">
            {/* Concise Honest Hero */}
            <section
              className={`rounded-3xl p-6 sm:p-8 border ${cardCls} flex flex-col lg:flex-row lg:items-center justify-between gap-6`}
            >
              <div className="space-y-4 max-w-2xl">
                <h1
                  className="font-head font-extrabold text-2xl sm:text-4xl leading-tight tracking-tight"
                  style={{ textWrap: "balance" }}
                >
                  Imtixaankaaga, Kulliyaddaada &amp; Mustaqbalkaaga
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenPaywall(selectedCycle, selectedStage)}
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LockOpen className="w-4 h-4" />
                    <span>Bilow Hadda · {rukunPreview.priceFormatted}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 shrink-0">
                {LEVEL_TIERS.map((lt) => (
                  <div
                    key={lt.level}
                    className={`rounded-2xl p-3 border text-center space-y-1 ${lt.cardBorder} ${
                      darkMode ? "bg-[#0B1324]" : "bg-slate-50"
                    }`}
                  >
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${lt.colorDot}`} />
                    <div className="font-head font-extrabold text-xs">
                      {PRO_LEVEL_PLANS[lt.level].badge}
                    </div>
                    <div className={`text-[11px] font-semibold ${mutedCls}`}>
                      {getRukunPricing(lt.cycle, isTotalStage).priceFormatted}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 1: 3 Independent Stage Buttons + Total (-20%) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-head font-bold text-lg sm:text-xl">
                  1. Dooro Qeybta Aad Rabto
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedStage("total")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isTotalStage
                      ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C]"
                      : darkMode
                        ? "bg-amber-400/12 text-amber-300 border-amber-400/40 hover:bg-amber-400/20"
                        : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Total · 3-da Qeyb (-20%)</span>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {STAGE_CARDS.map((st) => {
                  const isSel = selectedStage === st.id || isTotalStage;
                  return (
                    <article
                      key={st.id}
                      className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all ${
                        isSel
                          ? `${st.accentCard} ring-1 ring-current`
                          : cardCls
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-head font-extrabold text-lg">{st.title}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${st.accentBadge}`}>
                            {st.tag}
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs sm:text-[13px]">
                          {st.items.map((item) => (
                            <li key={item} className="flex items-center gap-2 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStage(st.id);
                          onOpenPaywall(selectedCycle, st.id);
                        }}
                        className="w-full min-h-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                      >
                        Fur {st.title} ({getRukunPricing(selectedCycle, false).priceFormatted})
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Color-Coded Progressive Levels (Weekly / Monthly / Yearly) */}
            <section id="qorshayaasha-pro" className="space-y-3">
              <h2 className="font-head font-bold text-lg sm:text-xl">
                2. Heerarka Rukun-ka (Heerka 1 · 2 · 3+)
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {LEVEL_TIERS.map((tier) => {
                  const meta = PRO_LEVEL_PLANS[tier.level];
                  const pricing = getRukunPricing(tier.cycle, isTotalStage);
                  const isSel = selectedCycle === tier.cycle;
                  return (
                    <div
                      key={tier.level}
                      className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all ${
                        isSel ? `${tier.cardBorder} ring-1 ring-current` : cardCls
                      } ${darkMode ? "bg-[#0F1B35]" : "bg-white"}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${tier.pillCls}`}>
                            {meta.badge}
                          </span>
                          <span className={`text-xs font-semibold ${mutedCls}`}>
                            {pricing.periodText}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="font-head font-extrabold text-3xl tabular-nums">
                            {pricing.priceFormatted}
                          </span>
                          <span className={`text-xs font-semibold ${mutedCls}`}>
                            / {pricing.label}
                          </span>
                        </div>

                        <ul className="space-y-1.5 text-xs sm:text-[13px]">
                          {tier.unlocks.map((u) => (
                            <li key={u} className="flex items-start gap-2 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{u}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCycle(tier.cycle);
                          onOpenPaywall(tier.cycle, selectedStage);
                        }}
                        className={`w-full min-h-[44px] rounded-xl font-head font-bold text-sm cursor-pointer transition-colors ${
                          isSel
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : darkMode
                              ? "bg-white/10 hover:bg-white/16 text-white"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        Dooro {meta.badge} ({pricing.priceFormatted})
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Compact Free vs Pro Comparison */}
            <section className={`rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-4`}>
              <h2 className="font-head font-bold text-lg sm:text-xl">
                Free &amp; Pro
              </h2>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                <div className="pb-2 grid grid-cols-12 text-xs font-bold">
                  <span className="col-span-8">Qeybta</span>
                  <span className={`col-span-2 text-center ${mutedCls}`}>Free</span>
                  <span className="col-span-2 text-center text-blue-600 dark:text-amber-400">Pro</span>
                </div>
                {FREE_VS_PRO_ROWS.map((row) => (
                  <div
                    key={row.feature}
                    className="py-2.5 grid grid-cols-12 items-center gap-2 text-xs sm:text-sm"
                  >
                    <span className="col-span-8 font-medium leading-snug">{row.feature}</span>
                    <span className="col-span-2 flex justify-center">
                      {row.free ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className={`w-3.5 h-3.5 ${mutedCls} opacity-50`} />
                      )}
                    </span>
                    <span className="col-span-2 flex justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* UNLOCKED WORKSPACE: Stage-Isolated & Level-Progressive */
          <div className="space-y-5">
            {/* Clean Workspace Header with Stage Status Pills + Level Upgrade Bar */}
            <section
              className="rounded-3xl p-5 sm:p-6 text-white border border-[#7CB7FF]/30 space-y-4 shadow-md"
              style={{
                background: "linear-gradient(135deg, #071F48 0%, #0F397E 58%, #165FB8 100%)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FFD86B]">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{currentLevelMeta.label}</span>
                  </div>
                  <h1 className="font-head font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                    {activeSectionMeta.label}
                  </h1>
                </div>

                {proLevel < 3 && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenPaywall(
                        proLevel === 1 ? "monthly" : "yearly",
                        currentTabStage
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>
                      {proLevel === 1 ? "U Gudub Heerka 2" : "U Gudub Heerka 3+"}
                    </span>
                  </button>
                )}
              </div>

              {/* 3 Independent Stage Status Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {STAGE_CARDS.map((st) => {
                  const open = stageOpenMap[st.id];
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        if (open) {
                          if (st.id === "school") setTab("secrets");
                          else if (st.id === "jus") setTab("readiness");
                          else setTab("tools");
                        } else {
                          onOpenPaywall(selectedCycle, st.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                        open
                          ? "bg-emerald-500/20 border-emerald-400/45 text-emerald-200"
                          : "bg-white/8 border-white/20 text-white/75 hover:bg-white/15"
                      }`}
                    >
                      {open ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#FFD86B]" />
                      )}
                      <span>{st.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Color-Coded Section Navigation */}
            <nav
              aria-label="Qaybaha HIRAAL Pro"
              className={`flex items-center gap-2 overflow-x-auto hide-scrollbar p-1.5 rounded-2xl border ${
                darkMode ? "bg-[#0F1B35] border-white/10" : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              {UNIFIED_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const active = tab === sec.id;
                const secStageOpen =
                  sec.id === "rankings"
                    ? proSchoolActive || proJusActive
                    : stageOpenMap[sec.stage];
                const secLevelOpen = hasProLevel(sec.requiredLevel);
                const unlocked = secStageOpen && secLevelOpen;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setTab(sec.id)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-head font-semibold inline-flex items-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0 ${
                      active
                        ? darkMode
                          ? "bg-[#FFC93C] text-[#050A1C] shadow-xs"
                          : "bg-[#165FB8] text-white shadow-xs"
                        : darkMode
                          ? "text-slate-300 hover:text-white hover:bg-white/8"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {unlocked ? (
                      <Icon className="w-4 h-4 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 shrink-0 text-[#FFD86B]" />
                    )}
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Gate Check 1: Stage Isolation Gate */}
            {!currentTabStageOpen ? (
              <section
                className="rounded-3xl p-6 sm:p-8 border border-[#FFC93C]/45 bg-[#0A1C3E] text-white space-y-5 shadow-lg max-w-2xl mx-auto text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFC93C]/18 border border-[#FFC93C]/40 text-[#FFD86B] flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#FFD86B]">
                    {activeSectionMeta.stageLabel} Keliya
                  </div>
                  <h2 className="font-head font-extrabold text-xl sm:text-2xl text-white">
                    {activeSectionMeta.label}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPaywall(selectedCycle, currentTabStage)}
                  className="px-6 py-3 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LockOpen className="w-4 h-4" />
                  <span>
                    Fur{" "}
                    {currentTabStage === "school"
                      ? "School"
                      : currentTabStage === "jus"
                        ? "Diyaarinta"
                        : "University"}
                  </span>
                </button>
              </section>
            ) : !currentTabLevelOpen ? (
              /* Gate Check 2: Progressive Level Upgrade Gate */
              <section className="rounded-3xl p-6 sm:p-8 border border-emerald-400/45 bg-[#0A1C3E] text-white space-y-5 shadow-lg max-w-2xl mx-auto text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/45 text-emerald-300 flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#FFD86B]">
                    {PRO_LEVEL_PLANS[activeSectionMeta.requiredLevel].title}
                  </div>
                  <h2 className="font-head font-extrabold text-xl sm:text-2xl text-white">
                    {activeSectionMeta.label}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenPaywall(
                      PRO_LEVEL_PLANS[activeSectionMeta.requiredLevel].cycle,
                      currentTabStage
                    )
                  }
                  className="px-6 py-3 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LockOpen className="w-4 h-4" />
                  <span>
                    U Gudub {PRO_LEVEL_PLANS[activeSectionMeta.requiredLevel].badge}
                  </span>
                </button>
              </section>
            ) : (
              <ProContentShield
                active={currentTabStageOpen && currentTabLevelOpen}
                sectionLabel={`HIRAAL Pro · ${activeSectionMeta.label}`}
              >
                <div key={tab} className="animate-pro-enter min-w-0">
                  {tab === "tools" && (
                    <ProStudentTools
                      proLevel={effectiveLevel}
                      onUpgrade={(cycle) => onOpenPaywall(cycle, "university")}
                    />
                  )}

                  {tab === "departments" && (
                    <section className="rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white space-y-6 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/12">
                        <div>
                          <p className="text-xs font-semibold text-[#FFD86B]">
                            Hagaha Waaxda &amp; Takhasuska
                          </p>
                          <h2 className="font-head font-bold text-xl sm:text-2xl mt-0.5 text-white">
                            Dooro Kulliyad
                          </h2>
                        </div>
                        {onOpenDepartmentGuide && (
                          <button
                            type="button"
                            onClick={() => onOpenDepartmentGuide(activeFac.id)}
                            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                          >
                            <GraduationCap className="w-4 h-4" />
                            <span>70-ka Su&apos;aalood ee {tx(activeFac.name).split("(")[0].trim()}</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {faculties.map((f) => {
                          const isSel = f.id === activeFac.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setSelectedFacId(f.id)}
                              className={`text-start rounded-xl p-3 border flex items-center gap-2.5 cursor-pointer transition-colors ${
                                isSel
                                  ? "border-[#FFC93C] bg-[#FFC93C]/16 text-white"
                                  : "border-white/12 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] hover:border-white/25"
                              }`}
                            >
                              <FacultyIcon faculty={f} size={20} />
                              <span className="text-xs font-semibold truncate">{tx(f.name)}</span>
                            </button>
                          );
                        })}
                      </div>

                      {hasProLevel(3) ? (
                        <div className="pt-2 border-t border-white/12">
                          <ProRoadmapsExplorer
                            locked={false}
                            initialFacultyId={activeFac.id}
                            onUnlockClick={() => onOpenPaywall("yearly", "university")}
                          />
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-white/12 flex items-center justify-between gap-3 flex-wrap">
                          <span className="text-xs font-bold text-[#FFD86B]">
                            Heerka 3+: Khariidadaha Kulliyadaha
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenPaywall("yearly", "university")}
                            className="px-4 py-2 rounded-xl bg-[#FFC93C] text-[#050A1C] font-head font-extrabold text-xs cursor-pointer"
                          >
                            U Gudub Heerka 3+
                          </button>
                        </div>
                      )}
                    </section>
                  )}

                  {tab === "roadmaps" && (
                    <div className="rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                      <ProRoadmapsExplorer
                        locked={false}
                        initialFacultyId={initialFacultyId}
                        onUnlockClick={() => onOpenPaywall("yearly", "university")}
                      />
                    </div>
                  )}

                  {tab === "secrets" && (
                    <div className="space-y-4">
                      <div
                        className={`inline-flex flex-wrap gap-1 p-1 rounded-xl border ${
                          darkMode ? "bg-[#0F1B35] border-white/10" : "bg-white border-slate-200 shadow-xs"
                        }`}
                      >
                        {[
                          { id: "tricks" as const, label: "Xeeladaha Top-10", icon: Sparkles, level: 1 as ProLevel },
                          { id: "subjects" as const, label: "Sirta 12-ka Maado", icon: BookOpen, level: 2 as ProLevel },
                          { id: "rules" as const, label: "Xeerarka Hoolka", icon: ShieldCheck, level: 1 as ProLevel },
                        ].map((st) => {
                          const Icon = st.icon;
                          const lockedSub = !hasProLevel(st.level);
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setSecretsTab(st.id)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                                secretsTab === st.id
                                  ? darkMode
                                    ? "bg-[#FFC93C] text-[#050A1C]"
                                    : "bg-[#165FB8] text-white"
                                  : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
                              }`}
                            >
                              {lockedSub ? <Lock className="w-3.5 h-3.5 text-[#FFD86B]" /> : <Icon className="w-3.5 h-3.5" />}
                              <span>{st.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                        {secretsTab === "tricks" && (
                          <Top10TricksSection isPro={true} onUnlock={() => onOpenPaywall("weekly", "school")} />
                        )}
                        {secretsTab === "subjects" &&
                          (hasProLevel(2) ? (
                            <LegalSubjectSecretsSection isPro={true} onUnlock={() => onOpenPaywall("monthly", "school")} />
                          ) : (
                            <div className="py-8 text-center space-y-4">
                              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                                Heerka 2aad · Bille
                              </div>
                              <h3 className="font-head font-extrabold text-xl text-white">
                                Sirta 12-ka Maado (Form 4)
                              </h3>
                              <button
                                type="button"
                                onClick={() => onOpenPaywall("monthly", "school")}
                                className="px-5 py-2.5 rounded-xl bg-[#FFC93C] text-[#050A1C] font-head font-extrabold text-xs cursor-pointer"
                              >
                                U Gudub Heerka 2
                              </button>
                            </div>
                          ))}
                        {secretsTab === "rules" && <ExamHallRulesSection />}
                      </div>
                    </div>
                  )}

                  {tab === "readiness" && (
                    <div className="space-y-4">
                      <div
                        className={`inline-flex flex-wrap gap-1 p-1 rounded-xl border ${
                          darkMode ? "bg-[#0F1B35] border-white/10" : "bg-white border-slate-200 shadow-xs"
                        }`}
                      >
                        {[
                          { id: "readiness" as const, label: "90 Maalmood", icon: Target, level: 1 as ProLevel },
                          { id: "challenges" as const, label: "Caqabadaha", icon: Sparkles, level: 2 as ProLevel },
                        ].map((jt) => {
                          const Icon = jt.icon;
                          const lockedSub = !hasProLevel(jt.level);
                          return (
                            <button
                              key={jt.id}
                              type="button"
                              onClick={() => setJusSubTab(jt.id)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                                jusSubTab === jt.id
                                  ? darkMode
                                    ? "bg-[#FFC93C] text-[#050A1C]"
                                    : "bg-[#165FB8] text-white"
                                  : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
                              }`}
                            >
                              {lockedSub ? <Lock className="w-3.5 h-3.5 text-[#FFD86B]" /> : <Icon className="w-3.5 h-3.5" />}
                              <span>{jt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                        {jusSubTab === "readiness" ? (
                          <ReadinessTracker
                            locked={false}
                            maxLevel={effectiveLevel}
                            onUnlockClick={() => onOpenPaywall(proLevel === 1 ? "monthly" : "yearly", "jus")}
                          />
                        ) : hasProLevel(2) ? (
                          <SomaliaChallengesHub
                            locked={false}
                            onUnlockClick={() => onOpenPaywall("monthly", "jus")}
                          />
                        ) : (
                          <div className="py-8 text-center space-y-4">
                            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                              Heerka 2aad · Bille
                            </div>
                            <h3 className="font-head font-extrabold text-xl text-white">
                              Caqabadaha Ardayga &amp; Xalkooda
                            </h3>
                            <button
                              type="button"
                              onClick={() => onOpenPaywall("monthly", "jus")}
                              className="px-5 py-2.5 rounded-xl bg-[#FFC93C] text-[#050A1C] font-head font-extrabold text-xs cursor-pointer"
                            >
                              U Gudub Heerka 2
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === "universities" && (
                    <div className="space-y-6 rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                      <SomaliaUniversitiesSection
                        isPro={true}
                        onUnlock={() => onOpenPaywall("monthly", "university")}
                        initialFacultyId={initialFacultyId}
                      />
                      <div className="pt-4 border-t border-white/12">
                        {hasProLevel(3) ? (
                          <SomaliaGrowthSection isPro={true} onUnlock={() => onOpenPaywall("yearly", "university")} />
                        ) : (
                          <div className="rounded-2xl p-5 border border-amber-400/40 bg-amber-400/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="text-xs font-extrabold text-[#FFD86B]">Heerka 3+ · Sanadle</div>
                              <div className="font-head font-bold text-base text-white">
                                Bangiga Adduunka &amp; Deeqaha Caalamiga ah
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onOpenPaywall("yearly", "university")}
                              className="px-4 py-2.5 rounded-xl bg-[#FFC93C] text-[#050A1C] font-head font-extrabold text-xs cursor-pointer shrink-0"
                            >
                              U Gudub Heerka 3+
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === "skills" && (
                    <div className="space-y-6 rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                      <HighIncomeSkillsSection isPro={true} onUnlock={() => onOpenPaywall("monthly", "university")} />
                      <div className="pt-4 border-t border-white/12">
                        <FutureJobsNewsSection isPro={true} onUnlock={() => onOpenPaywall("monthly", "university")} />
                      </div>
                    </div>
                  )}

                  {tab === "pioneers" && (
                    <div className="rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                      <WorldPioneersSection isPro={true} onUnlock={() => onOpenPaywall("yearly", "university")} />
                    </div>
                  )}

                  {tab === "rankings" && (
                    <div className="space-y-4">
                      <div
                        className={`inline-flex gap-1 p-1 rounded-xl border ${
                          darkMode ? "bg-[#0F1B35] border-white/10" : "bg-white border-slate-200 shadow-xs"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setRankingScope("school")}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                            rankingScope === "school"
                              ? darkMode
                                ? "bg-[#FFC93C] text-[#050A1C]"
                                : "bg-[#165FB8] text-white"
                              : mutedCls
                          }`}
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Ranking School (Form 4)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRankingScope("jus")}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                            rankingScope === "jus"
                              ? darkMode
                                ? "bg-[#FFC93C] text-[#050A1C]"
                                : "bg-[#165FB8] text-white"
                              : mutedCls
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Ranking Diyaarinta</span>
                        </button>
                      </div>

                      <div className="rounded-3xl p-5 sm:p-6 border border-[#2B4B8C]/50 bg-[#0A1C3E] text-white shadow-lg">
                        <PredictRankingBoard
                          scope={rankingScope}
                          title={
                            rankingScope === "school"
                              ? "Kaalmaha Sare ee School Form 4"
                              : "Kaalmaha Sare ee Diyaarinta Jaamacadda"
                          }
                          subjects={rankingScope === "school" ? form4Subjects : bridgeSubjects}
                          proActive={rankingScope === "school" ? proSchoolActive : proJusActive}
                          onUnlock={() => onOpenPaywall(selectedCycle, rankingScope)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </ProContentShield>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
