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
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProBadge } from "../components/ModernUI";
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

  const tabs: { id: HubTab; label: string; icon: React.ReactNode }[] = [
    { id: "roadmaps", label: tr("Khariidadaha"), icon: <Map className="w-4 h-4" /> },
    { id: "universities", label: tr("Jaamacadaha"), icon: <Building2 className="w-4 h-4" /> },
    { id: "pioneers", label: tr("Dadka Caanka ah"), icon: <Award className="w-4 h-4" /> },
    { id: "future_jobs", label: tr("Shaqooyinka Cusub"), icon: <TrendingUp className="w-4 h-4" /> },
    { id: "skills", label: tr("Xirfadaha Dakhliga"), icon: <Wrench className="w-4 h-4" /> },
    { id: "somalia_growth", label: tr("Horumarinta Ardayga"), icon: <Rocket className="w-4 h-4" /> },
    { id: "challenges", label: tr("Caqabadaha Soomaaliya"), icon: <Lightbulb className="w-4 h-4" /> },
    { id: "readiness", label: tr("Diyaargarowga"), icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background: "linear-gradient(180deg, #050A1C 0%, #0A153E 52%, #131342 100%)",
      }}
    >
      <header className="border-b border-white/10 sticky top-0 z-20 bg-[#050A1C]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer transition-colors"
            >
              {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-head font-extrabold text-[18px]">{tr("Xarunta Ardayga Pro")}</h1>
              <ProBadge small />
            </div>
          </div>

          {!proActive ? (
            <button
              type="button"
              onClick={onOpenPaywall}
              className="px-3.5 py-2 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tr("Fur Pro ($0.10 · Abid)")}</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-300">{tr("Pro waa furan yahay (Abid)")}</span>
          )}
        </div>

        {/* Sub-navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 border shrink-0 cursor-pointer transition-colors ${
                  active
                    ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C]"
                    : "bg-white/6 text-white/80 border-white/15 hover:bg-white/12"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-14 space-y-5">
        {!proActive && <ProUnlockPromoBanner onUnlock={onOpenPaywall} />}

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
      </main>
    </div>
  );
}
