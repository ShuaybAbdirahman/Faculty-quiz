import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  Lock,
  Map,
  Menu,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  X,
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const activeTabObj = tabs.find((t) => t.id === tab) ?? tabs[0];

  const handleSelectTab = (id: HubTab) => {
    setTab(id);
    setMenuOpen(false);
  };

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

      {/* Compact Single-Row Sticky Header with 3-Line Menu Trigger */}
      <header className="border-b border-white/10 sticky top-0 z-30 bg-[#050A1C]/95 backdrop-blur-xl">
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

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={tr("Qaybaha Pro")}
              aria-expanded={menuOpen}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all min-w-0 ${
                menuOpen
                  ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C] shadow-[0_6px_18px_rgba(255,201,60,0.3)]"
                  : "bg-white/[0.07] hover:bg-white/[0.13] text-white border-white/15"
              }`}
            >
              {menuOpen ? (
                <X className="w-4 h-4 shrink-0" />
              ) : (
                <Menu className="w-4 h-4 text-[#FFD86B] shrink-0" />
              )}
              <span className="truncate">{activeTabObj.label}</span>
              {!proActive && !menuOpen && (
                <Lock className="w-3 h-3 text-[#FFD86B] shrink-0" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
        </div>

        {/* Slide-Down 3-Line Menu Drawer showing all 8 Pro Sections with Pro Lock Badge */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 top-[61px] bg-black/60 backdrop-blur-xs z-20"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              aria-label="Pro Sections Menu"
              className="relative z-30 border-t border-white/10 bg-[#08102B]/98 shadow-2xl animate-pro-enter"
            >
              <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-3.5 space-y-2">
                <div className="flex items-center justify-between px-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                      {tr("Xarunta Ardayga Pro")}
                    </span>
                    <ProBadge small />
                  </div>
                  <span className="text-[11px] font-semibold text-[#FFD86B]">8 {tr("Qaybood")}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-1.5">
                  {tabs.map((t) => {
                    const active = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTab(t.id)}
                        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border cursor-pointer transition-all min-w-0 ${
                          active
                            ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C] shadow-md"
                            : "bg-white/[0.05] text-white/90 border-white/10 hover:bg-white/[0.11] hover:border-white/25"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className={active ? "text-[#050A1C] shrink-0" : "text-[#FFD86B] shrink-0"}>
                            {t.icon}
                          </span>
                          <span className="truncate">{t.label}</span>
                        </span>

                        {!proActive ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide shrink-0 ${
                              active
                                ? "bg-[#050A1C]/15 text-[#050A1C]"
                                : "bg-[#FFC93C]/15 text-[#FFD86B] border border-[#FFC93C]/30"
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                            <span>PRO</span>
                          </span>
                        ) : (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-[#050A1C]" : "text-emerald-400"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!proActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPaywall();
                    }}
                    className="mt-2 w-full py-2.5 px-4 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{tr("Fur Pro ($0.10 · Abid)")}</span>
                  </button>
                )}
              </div>
            </nav>
          </>
        )}
      </header>

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 pb-14 space-y-5 min-w-0 overflow-x-clip">
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
