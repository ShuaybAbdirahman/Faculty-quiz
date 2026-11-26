import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  Compass,
  GraduationCap,
  Lock,
  LockOpen,
  Map as MapIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { faculties } from "../data/quizData";
import { form4Subjects } from "../data/schoolForm4Data";
import { bridgeSubjects } from "../data/bridgingPrepData";
import { PRO_BILLING_PLANS, type ProBillingCycle } from "../lib/proSecurity";
import { ProContentShield } from "../components/ProContentShield";
import { ProRoadmapsExplorer } from "../components/ProHubContent";
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

export type HubTab =
  | "tools"
  | "roadmaps"
  | "departments"
  | "secrets"
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
  | "universities"
  | "skills"
  | "pioneers"
  | "rankings";

function normalizeTab(tab?: HubTab): UnifiedTab {
  if (tab === "future_jobs") return "skills";
  if (tab === "somalia_growth") return "universities";
  if (
    tab === "tools" ||
    tab === "roadmaps" ||
    tab === "departments" ||
    tab === "secrets" ||
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
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const UNIFIED_SECTIONS: UnifiedSectionMeta[] = [
  {
    id: "tools",
    label: "Qalabka Ardayga",
    shortDesc: "Xisaabiyaha GPA, Jadwalka & Wareysiga",
    icon: Calculator,
  },
  {
    id: "roadmaps",
    label: "Khariidadaha",
    shortDesc: "Waddada Xirfadaha & Mashaariicda",
    icon: MapIcon,
  },
  {
    id: "departments",
    label: "Hagaha Waaxda",
    shortDesc: "14 Kulliyadood & Takhasusyada",
    icon: Compass,
  },
  {
    id: "secrets",
    label: "Sirta Top-10",
    shortDesc: "Xeeladaha Imtixaanka 12 Maado",
    icon: Sparkles,
  },
  {
    id: "universities",
    label: "Jaamacadaha",
    shortDesc: "Soomaaliya & Deeqaha Caalamiga ah",
    icon: Building2,
  },
  {
    id: "skills",
    label: "Shaqo & Xirfad",
    shortDesc: "Suuqa Cusub, AI & Dakhliga",
    icon: Wrench,
  },
  {
    id: "pioneers",
    label: "Dadka Caanka ah",
    shortDesc: "Hoggaamiyeyaasha Soomaaliya & Adduunka",
    icon: Award,
  },
  {
    id: "rankings",
    label: "Kaalmaha Sare",
    shortDesc: "Ranking-ka Form 4 & JUS",
    icon: Trophy,
  },
];

const FREE_VS_PRO_ROWS = [
  {
    feature: "Imtixaanka RIASEC (#1-#3) & PDFs Aasaasiga ah",
    free: true,
    pro: true,
  },
  {
    feature: "Xisaabiyaha Darajada, GPA & Kulliyadaha Kuu Furmaya",
    free: false,
    pro: true,
  },
  {
    feature: "Jadwalka Waxbarashada Toddobaadlaha & Saacadda Focus (25m)",
    free: false,
    pro: true,
  },
  {
    feature: "Predict Exams (12 Maado Form 4 + 5 Maado JUS) & Kaalmaha Sare",
    free: false,
    pro: true,
  },
  {
    feature: "Sirta Ardayda Top-10 & Xeeladaha Xalaasha ah ee 12-ka Maado",
    free: false,
    pro: true,
  },
  {
    feature: "Khariidadaha Xirfadaha, Jaamacadaha Soomaaliya & Deeqaha",
    free: false,
    pro: true,
  },
  {
    feature: "Diyaarinta Wareysiga Deeqaha & Luqadaha English / Carabi",
    free: false,
    pro: true,
  },
];

const PREVIEW_SAMPLES = [
  {
    id: "gpa",
    title: "Xisaabiyaha Fursadda & GPA",
    tag: "Kuma jiro Free-ga",
    body: "Geli dhibcahaaga 5-ta maado ee ugu muhiimsan si aad isla markiiba u aragto GPA-gaaga (4.0), darajadaada (A+ ilaa D), iyo kulliyadaha tartanka sare ee aad u qalanto.",
    bullets: [
      "Qiimeynta Sayniska, Tech & Suugaanta",
      "Tilmaanta diyaar-garowga deeqaha waxbarasho",
      "Saadaasha kulliyadaha Soomaaliya & JUS",
    ],
  },
  {
    id: "secrets",
    title: "Sirta Ardayda Top-10 (Form 4 & JUS)",
    tag: "12 Maado · 100% Xalaal",
    body: "Baro habka saxda ah ee saxayaasha imtixaanku u bixiyaan dhibcaha buuxa, khaladaadka keena in ardaygu lumiyo 15-20 dhibcood, iyo sida waqtiga loo maamulo hoolka.",
    bullets: [
      "Habka 3-Pass Strategy ee xallinta su'aalaha",
      "Qodobada High-Yield ee maado kasta",
      "Xeerarka amniga iyo kalsoonida hoolka",
    ],
  },
  {
    id: "roadmaps",
    title: "Khariidadaha, Shaqooyinka & Xirfadaha",
    tag: "Mustaqbalka & Dakhliga",
    body: "Tallaabo-tallaabo u baro xirfadaha dakhliga sare leh adigoo arday ah (AI, Web, Design, Video Editing) iyo jaamacadaha bixiya kulliyaddaada gudaha Soomaaliya.",
    bullets: [
      "Khariidado shaqo oo la hubiyay (IEEE, WHO)",
      "Qorshaha 30-ka maalmood ee xirfad kasta",
      "Liiska jaamacadaha Soomaaliya & website-yada",
    ],
  },
];

export function ProHubScreen({
  initialTab = "tools",
  initialFacultyId,
  onBack,
  onOpenPaywall,
  onOpenDepartmentGuide,
}: {
  initialTab?: HubTab;
  initialFacultyId?: string;
  onBack: () => void;
  onOpenPaywall: (cycle?: ProBillingCycle) => void;
  onOpenDepartmentGuide?: (facultyId: string) => void;
}) {
  const { darkMode, rtl, proActive, tx } = useApp();
  const [tab, setTab] = useState<UnifiedTab>(() => normalizeTab(initialTab));
  const [selectedCycle, setSelectedCycle] = useState<ProBillingCycle>("monthly");
  const [previewSample, setPreviewSample] = useState<string>("gpa");
  const [rankingScope, setRankingScope] = useState<"school" | "jus">("school");
  const [secretsTab, setSecretsTab] = useState<"tricks" | "subjects" | "rules">("tricks");
  const [selectedFacId, setSelectedFacId] = useState<string>(
    initialFacultyId || faculties[0].id
  );

  const activePlan = PRO_BILLING_PLANS[selectedCycle];
  const activeFac = faculties.find((f) => f.id === selectedFacId) ?? faculties[0];

  const pageBg = darkMode ? "bg-[#0B1324] text-slate-100" : "bg-slate-50 text-slate-900";
  const cardCls = darkMode
    ? "bg-[#111C33] border-white/10 text-slate-100"
    : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const mutedCls = darkMode ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-clip flex flex-col pb-24 sm:pb-28 ${pageBg}`}>
      {/* Clean Single-Row Top Bar (Brand + Back + Primary CTA, zero Device ID or Time clutter) */}
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

          <div className="flex items-center gap-3 shrink-0">
            {proActive ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
                <ShieldCheck className="w-4 h-4" />
                <span>Xubin Pro ah</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onOpenPaywall(selectedCycle)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <LockOpen className="w-4 h-4" />
                <span>Fur HIRAAL Pro ({activePlan.priceText})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 min-w-0">
        {!proActive ? (
          /* LOCKED VIEW: Student-Focused Persuasion, Live Feature Previews & Weekly/Monthly/Yearly Plans */
          <div className="space-y-8">
            {/* Editorial Hero Section */}
            <section
              className={`rounded-3xl p-6 sm:p-8 lg:p-10 border ${cardCls} grid lg:grid-cols-12 gap-8 items-center`}
            >
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                  Dhammaan Qeybaha Pro oo Hal Meel La Isugu Keenay · 100% Ammaan
                </p>
                <h1
                  className="font-head font-extrabold text-2xl sm:text-4xl leading-tight tracking-tight"
                  style={{ textWrap: "balance" }}
                >
                  Hagaaji Dhibcahaaga, Xaqiiji Kulliyaddaada, Barona Xirfad Mustaqbal leh
                </h1>
                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${mutedCls}`}>
                  HIRAAL Pro wuxuu ardayga Soomaaliyeed siiyaa 8 awoodood oo aysan lahayn qeybta bilaashka ah: Xisaabiyaha GPA-ga iyo fursadda jaamacadda, Jadwalka waxbarashada iyo saacadda diiradda, Sirta Top-10, Predict Exams, Khariidadaha shaqada, iyo Hagaha Waaxda.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenPaywall(selectedCycle)}
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LockOpen className="w-4 h-4" />
                    <span>Bilow HIRAAL Pro · {activePlan.priceText}</span>
                  </button>
                  <a
                    href="#qorshayaasha-pro"
                    className={`min-h-[48px] px-5 py-3 rounded-xl border font-head font-semibold text-sm inline-flex items-center gap-2 transition-colors ${
                      darkMode
                        ? "border-white/15 hover:bg-white/8 text-slate-200"
                        : "border-slate-300 hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    <span>Eeg Xirmooyinka Weekly / Monthly / Yearly</span>
                  </a>
                </div>
              </div>

              {/* Clean 8-Module Value Summary Card */}
              <div
                className={`lg:col-span-5 rounded-2xl p-5 border space-y-3 ${
                  darkMode ? "bg-[#0B1324] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="text-xs font-bold text-blue-600 dark:text-amber-400">
                  8 Qeybood oo Kuugu Jira Hal Furitaan
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {UNIFIED_SECTIONS.map((sec) => {
                    const Icon = sec.icon;
                    return (
                      <div key={sec.id} className="flex items-start gap-2.5 text-xs">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-head font-bold">{sec.label}</div>
                          <div className={mutedCls}>{sec.shortDesc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Weekly / Monthly / Yearly Selector */}
            <section id="qorshayaasha-pro" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="font-head font-bold text-xl sm:text-2xl">
                    Dooro Xirmada Kuugu Habboon (Weekly, Monthly, Yearly)
                  </h2>
                  <p className={`text-sm mt-0.5 ${mutedCls}`}>
                    Xirmo kasta waxay furaysaa dhammaan 8-da qeybood ee HIRAAL Pro. Qiimo jaban oo ardayga u qalma.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Lacag-bixin Ammaan ah oo Tallaabooyin Leh
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {(["weekly", "monthly", "yearly"] as ProBillingCycle[]).map((id) => {
                  const p = PRO_BILLING_PLANS[id];
                  const isSel = selectedCycle === id;
                  return (
                    <div
                      key={id}
                      className={`rounded-2xl p-6 border flex flex-col justify-between gap-5 transition-all ${
                        isSel
                          ? "border-blue-600 dark:border-amber-400 ring-1 ring-blue-600 dark:ring-amber-400 " +
                            (darkMode ? "bg-[#152340]" : "bg-blue-50/40")
                          : cardCls
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                          <span className="text-blue-600 dark:text-amber-400">
                            {p.badge ?? p.durationLabel}
                          </span>
                          {p.savingsLabel && (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              {p.savingsLabel}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-head font-bold text-lg">{p.title}</h3>
                          <p className={`text-xs mt-1 leading-relaxed ${mutedCls}`}>{p.subtitle}</p>
                        </div>

                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="font-head font-extrabold text-3xl tabular-nums">
                            {p.priceText}
                          </span>
                          <span className={`text-xs ${mutedCls}`}>/ {p.durationLabel}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCycle(id);
                            onOpenPaywall(id);
                          }}
                          className={`w-full min-h-[44px] rounded-xl font-head font-bold text-sm cursor-pointer transition-colors ${
                            isSel
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : darkMode
                                ? "bg-white/10 hover:bg-white/16 text-white"
                                : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          Dooro {p.title.split(" ")[0]} ({p.priceText})
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Interactive Preview + Free vs Pro Comparison */}
            <section className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Interactive Sample Preview */}
              <div className={`lg:col-span-6 rounded-2xl p-6 border ${cardCls} space-y-4`}>
                <div>
                  <h2 className="font-head font-bold text-lg sm:text-xl">
                    Tijaabi Waxa Ku Jira Gudaha Pro
                  </h2>
                  <p className={`text-xs mt-0.5 ${mutedCls}`}>
                    Riix mid ka mid ah qaybahan si aad u aragto farqiga tayada leh.
                  </p>
                </div>

                <div
                  className={`inline-flex flex-wrap gap-1 p-1 rounded-xl border ${
                    darkMode ? "bg-[#0B1324] border-white/10" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  {PREVIEW_SAMPLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPreviewSample(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                        previewSample === s.id
                          ? "bg-blue-600 text-white"
                          : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
                      }`}
                    >
                      {s.title.split(" ")[0]} {s.title.split(" ")[1]}
                    </button>
                  ))}
                </div>

                {(() => {
                  const activeSample =
                    PREVIEW_SAMPLES.find((s) => s.id === previewSample) ?? PREVIEW_SAMPLES[0];
                  return (
                    <div
                      className={`rounded-xl p-5 border space-y-3 ${
                        darkMode ? "bg-[#0B1324] border-white/10" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                        {activeSample.tag}
                      </div>
                      <h3 className="font-head font-bold text-base sm:text-lg">
                        {activeSample.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${mutedCls}`}>{activeSample.body}</p>
                      <ul className="space-y-1.5 pt-1">
                        {activeSample.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>

              {/* Clean Free vs Pro Comparison Table */}
              <div className={`lg:col-span-6 rounded-2xl p-6 border ${cardCls} space-y-4`}>
                <div>
                  <h2 className="font-head font-bold text-lg sm:text-xl">
                    Farqiga Qeybta Bilaashka ah &amp; HIRAAL Pro
                  </h2>
                  <p className={`text-xs mt-0.5 ${mutedCls}`}>
                    Wax badan oo aysan lahayn qeybta bilaashka ah ayaa kuu furmaya.
                  </p>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-white/10">
                  <div className="pb-2 grid grid-cols-12 text-xs font-bold">
                    <span className="col-span-8">Awoodda &amp; Xogta</span>
                    <span className={`col-span-2 text-center ${mutedCls}`}>Free</span>
                    <span className="col-span-2 text-center text-blue-600 dark:text-amber-400">Pro</span>
                  </div>
                  {FREE_VS_PRO_ROWS.map((row) => (
                    <div key={row.feature} className="py-3 grid grid-cols-12 items-center gap-2 text-xs sm:text-sm">
                      <span className="col-span-8 font-medium leading-snug">{row.feature}</span>
                      <span className="col-span-2 flex justify-center">
                        {row.free ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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

                <button
                  type="button"
                  onClick={() => onOpenPaywall(selectedCycle)}
                  className="w-full min-h-[46px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LockOpen className="w-4 h-4" />
                  <span>Fur Dhammaan Hadda ({activePlan.priceText})</span>
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* UNLOCKED UNIFIED HIRAAL PRO SUITE: ALL 8 Modules Unified Under Silent ProContentShield */
          <div className="space-y-6">
            {/* Clean Horizontal Section Navigation (Single-line controls, zero clutter) */}
            <nav
              aria-label="Qaybaha HIRAAL Pro"
              className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1"
            >
              {UNIFIED_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const active = tab === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setTab(sec.id)}
                    className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-head font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : darkMode
                          ? "bg-[#111C33] border-white/10 text-slate-300 hover:text-white hover:border-white/25"
                          : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>

            <ProContentShield
              active={proActive}
              sectionLabel={`HIRAAL Pro · ${UNIFIED_SECTIONS.find((s) => s.id === tab)?.label ?? "Pro"}`}
            >
              <div key={tab} className="animate-pro-enter min-w-0">
                {tab === "tools" && <ProStudentTools />}

                {tab === "departments" && (
                  <section className={`rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-5`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                          Hagaha Waaxda &amp; Takhasuska
                        </p>
                        <h2 className="font-head font-bold text-xl sm:text-2xl mt-0.5">
                          Dooro Kulliyad si aad u Barato Waaxahaaga
                        </h2>
                      </div>
                      {onOpenDepartmentGuide && (
                        <button
                          type="button"
                          onClick={() => onOpenDepartmentGuide(activeFac.id)}
                          className="min-h-[42px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Fur 70-ka Su&apos;aalood ee {tx(activeFac.name).split("(")[0].trim()}</span>
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
                                ? "border-blue-600 dark:border-amber-400 bg-blue-50 dark:bg-amber-400/12"
                                : darkMode
                                  ? "border-white/10 bg-[#0B1324] hover:border-white/25"
                                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <FacultyIcon faculty={f} size={20} />
                            <span className="text-xs font-semibold truncate">{tx(f.name)}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                      <ProRoadmapsExplorer
                        locked={false}
                        initialFacultyId={activeFac.id}
                        onUnlockClick={() => onOpenPaywall(selectedCycle)}
                      />
                    </div>
                  </section>
                )}

                {tab === "roadmaps" && (
                  <div className="rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                    <ProRoadmapsExplorer
                      locked={false}
                      initialFacultyId={initialFacultyId}
                      onUnlockClick={() => onOpenPaywall(selectedCycle)}
                    />
                  </div>
                )}

                {tab === "secrets" && (
                  <div className="space-y-4">
                    <div
                      className={`inline-flex flex-wrap gap-1 p-1 rounded-xl border ${
                        darkMode ? "bg-[#111C33] border-white/10" : "bg-white border-slate-200"
                      }`}
                    >
                      {[
                        { id: "tricks" as const, label: "Xeeladaha Top-10", icon: Sparkles },
                        { id: "subjects" as const, label: "Sirta 12-ka Maado", icon: BookOpen },
                        { id: "rules" as const, label: "Xeerarka Hoolka", icon: ShieldCheck },
                      ].map((st) => {
                        const Icon = st.icon;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSecretsTab(st.id)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                              secretsTab === st.id
                                ? "bg-blue-600 text-white"
                                : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{st.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                      {secretsTab === "tricks" && (
                        <Top10TricksSection isPro={true} onUnlock={() => onOpenPaywall(selectedCycle)} />
                      )}
                      {secretsTab === "subjects" && (
                        <LegalSubjectSecretsSection isPro={true} onUnlock={() => onOpenPaywall(selectedCycle)} />
                      )}
                      {secretsTab === "rules" && <ExamHallRulesSection />}
                    </div>
                  </div>
                )}

                {tab === "universities" && (
                  <div className="space-y-6 rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                    <SomaliaUniversitiesSection
                      isPro={true}
                      onUnlock={() => onOpenPaywall(selectedCycle)}
                      initialFacultyId={initialFacultyId}
                    />
                    <div className="pt-4 border-t border-white/10">
                      <SomaliaGrowthSection isPro={true} onUnlock={() => onOpenPaywall(selectedCycle)} />
                    </div>
                  </div>
                )}

                {tab === "skills" && (
                  <div className="space-y-6 rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                    <HighIncomeSkillsSection isPro={true} onUnlock={() => onOpenPaywall(selectedCycle)} />
                    <div className="pt-4 border-t border-white/10">
                      <FutureJobsNewsSection isPro={true} onUnlock={() => onOpenPaywall(selectedCycle)} />
                    </div>
                  </div>
                )}

                {tab === "pioneers" && (
                  <div className="rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                    <WorldPioneersSection isPro={true} onUnlock={() => onOpenPaywall(selectedCycle)} />
                  </div>
                )}

                {tab === "rankings" && (
                  <div className="space-y-4">
                    <div
                      className={`inline-flex gap-1 p-1 rounded-xl border ${
                        darkMode ? "bg-[#111C33] border-white/10" : "bg-white border-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setRankingScope("school")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                          rankingScope === "school" ? "bg-blue-600 text-white" : mutedCls
                        }`}
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Ranking School (Form 4)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRankingScope("jus")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                          rankingScope === "jus" ? "bg-blue-600 text-white" : mutedCls
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Ranking JUS</span>
                      </button>
                    </div>

                    <div className="rounded-3xl p-4 sm:p-6 bg-[#0F1B33] text-white">
                      <PredictRankingBoard
                        scope={rankingScope}
                        title={
                          rankingScope === "school"
                            ? "Kaalmaha Sare ee School Form 4"
                            : "Kaalmaha Sare ee Diyaarinta JUS"
                        }
                        subjects={rankingScope === "school" ? form4Subjects : bridgeSubjects}
                        proActive={proActive}
                        onUnlock={() => onOpenPaywall(selectedCycle)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ProContentShield>
          </div>
        )}
      </main>
    </div>
  );
}
