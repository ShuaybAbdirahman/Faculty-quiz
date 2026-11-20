import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  ClipboardCheck,
  Lightbulb,
  Map,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { AuroraBackground, ProBadge } from "../components/ModernUI";
import {
  ProRoadmapsExplorer,
  ProUnlockPromoBanner,
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

export type HubTab =
  | "roadmaps"
  | "universities"
  | "pioneers"
  | "future_jobs"
  | "skills"
  | "somalia_growth"
  | "challenges"
  | "readiness";

export function ProHubScreen({
  initialTab = "roadmaps",
  initialFacultyId,
  onBack,
  onOpenPaywall,
}: {
  initialTab?: HubTab;
  initialFacultyId?: string;
  onBack: () => void;
  onOpenPaywall: () => void;
}) {
  const { tr, rtl, proActive } = useApp();
  const [tab, setTab] = useState<HubTab>(initialTab);

  const tabs: { id: HubTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    {
      id: "roadmaps",
      label: tr("Khariidadaha"),
      shortLabel: tr("Khariidad"),
      icon: <Map className="w-4 h-4" />,
    },
    {
      id: "universities",
      label: tr("Jaamacadaha"),
      shortLabel: tr("Jaamacad"),
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "pioneers",
      label: tr("Dadka Caanka ah"),
      shortLabel: tr("Caanka"),
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: "future_jobs",
      label: tr("Shaqooyinka Cusub"),
      shortLabel: tr("AI & 2030"),
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "skills",
      label: tr("Xirfadaha Dakhliga"),
      shortLabel: tr("Xirfado"),
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "somalia_growth",
      label: tr("Horumarinta Ardayga"),
      shortLabel: tr("Horumar"),
      icon: <Rocket className="w-4 h-4" />,
    },
    {
      id: "challenges",
      label: tr("Caqabadaha Soomaaliya"),
      shortLabel: tr("Caqabad"),
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: "readiness",
      label: tr("Diyaargarowga"),
      shortLabel: tr("90 Maalin"),
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col text-white relative"
      style={{
        background: "linear-gradient(180deg, #050A1C 0%, #0A153E 52%, #131342 100%)",
      }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <AuroraBackground />
      </div>

      <header className="border-b border-white/10 sticky top-0 z-30 bg-[#050A1C]/92 backdrop-blur-xl">
        {/* Clean Single-Row Top Bar */}
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="p-2 rounded-xl bg-white/6 hover:bg-white/14 border border-white/10 text-white cursor-pointer transition-colors shrink-0"
            >
              {rtl ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="font-head font-extrabold text-[15px] sm:text-[18px] leading-none truncate">
                <span className="sm:hidden">{tr("Xarunta Pro")}</span>
                <span className="hidden sm:inline">{tr("Xarunta Ardayga Pro")}</span>
              </h1>
              <ProBadge small />
            </div>
          </div>

          {!proActive ? (
            <button
              type="button"
              onClick={onOpenPaywall}
              className="relative overflow-hidden px-3 sm:px-4 py-2 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-[11.5px] sm:text-xs inline-flex items-center gap-1.5 cursor-pointer transition-transform active:scale-[0.97] whitespace-nowrap shrink-0 shadow-[0_6px_18px_rgba(255,201,60,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{tr("Fur Pro ($0.10)")}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-[11px] sm:text-xs font-bold text-emerald-300 whitespace-nowrap shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{tr("Pro Furan")}</span>
            </span>
          )}
        </div>

        {/* All 8 Pro Sections Grid: 4x2 on mobile (zero clipping), 8-across on desktop */}
        <nav
          aria-label="Pro Sections"
          className="max-w-5xl mx-auto px-3.5 sm:px-6 pb-3"
        >
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`group flex flex-col items-center justify-center gap-1 px-1.5 py-2 rounded-xl text-[10.5px] sm:text-[11.5px] font-bold border cursor-pointer transition-all duration-200 min-w-0 ${
                    active
                      ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C] shadow-[0_6px_18px_rgba(255,201,60,0.3)] scale-[1.02]"
                      : "bg-white/[0.05] text-white/80 border-white/12 hover:bg-white/[0.11] hover:border-white/25"
                  }`}
                >
                  <span className={`transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105 text-[#FFD86B]"}`}>
                    {t.icon}
                  </span>
                  <span className="truncate w-full text-center leading-tight">
                    <span className="lg:hidden">{t.shortLabel}</span>
                    <span className="hidden lg:inline">{t.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 pb-14 space-y-5 min-w-0">
        {!proActive && <ProUnlockPromoBanner onUnlock={onOpenPaywall} />}

        <div key={tab} className="animate-pro-enter min-w-0">
          {tab === "roadmaps" && (
            <ProRoadmapsExplorer
              locked={!proActive}
              initialFacultyId={initialFacultyId}
              onUnlockClick={onOpenPaywall}
            />
          )}
          {tab === "universities" && (
            <SomaliaUniversitiesSection
              isPro={proActive}
              onUnlock={onOpenPaywall}
              initialFacultyId={initialFacultyId}
            />
          )}
          {tab === "pioneers" && (
            <WorldPioneersSection isPro={proActive} onUnlock={onOpenPaywall} />
          )}
          {tab === "future_jobs" && (
            <FutureJobsNewsSection isPro={proActive} onUnlock={onOpenPaywall} />
          )}
          {tab === "skills" && (
            <HighIncomeSkillsSection isPro={proActive} onUnlock={onOpenPaywall} />
          )}
          {tab === "somalia_growth" && (
            <SomaliaGrowthSection isPro={proActive} onUnlock={onOpenPaywall} />
          )}
          {tab === "challenges" && (
            <SomaliaChallengesHub locked={!proActive} onUnlockClick={onOpenPaywall} />
          )}
          {tab === "readiness" && (
            <ReadinessTracker locked={!proActive} onUnlockClick={onOpenPaywall} />
          )}
        </div>
      </main>
    </div>
  );
}
