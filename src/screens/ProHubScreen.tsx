import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Lock,
  LockOpen,
  Map,
  Menu,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProBadge } from "../components/ModernUI";
import { ProContentShield } from "../components/ProContentShield";
import { ProRoadmapsExplorer } from "../components/ProHubContent";
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
  | "somalia_growth";

interface TabMeta {
  id: HubTab;
  label: string;
  icon: React.ReactNode;
  gateHeadline: string;
  gateSummary: string;
  highlights: string[];
}

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

  const tabs: TabMeta[] = [
    {
      id: "roadmaps",
      label: tr("Khariidadaha"),
      icon: <Map className="w-4 h-4" />,
      gateHeadline: tr("Khariidadaha Waxbarashada (Unlock+ Keliya)"),
      gateSummary: tr(
        "Hel khariidado tallaabo-tallaabo ah oo la hubiyay (AI, Koronto, Caafimaad, Dhisme, Maaliyad iyo kuwo kale) marka aad furto Unlock+."
      ),
      highlights: [
        tr("Marxaladaha waxbarashada iyo xirfadaha loo baahan yahay"),
        tr("Qalabka casriga ah iyo mashaariicda ardayga"),
        tr("Ilaha waxbarasho ee bilaashka ah ee la hubiyay"),
      ],
    },
    {
      id: "universities",
      label: tr("Jaamacadaha"),
      icon: <Building2 className="w-4 h-4" />,
      gateHeadline: tr("Hagaha Jaamacadaha Soomaaliya (Unlock+ Keliya)"),
      gateSummary: tr(
        "Ogow jaamacadaha bixiya kulliyaddaada, ku kala shaandhee magaalada iyo kulliyadda, kana hel website-yada rasmiga ah."
      ),
      highlights: [
        tr("Liiska jaamacadaha dowliga ah iyo kuwa gaarka loo leeyahay"),
        tr("Kala shaandhaynta magaalada iyo 14-ka kulliyadood"),
        tr("Faahfaahinta iyo xiriirrada rasmiga ah ee jaamacad kasta"),
      ],
    },
    {
      id: "pioneers",
      label: tr("Dadka Caanka ah"),
      icon: <Award className="w-4 h-4" />,
      gateHeadline: tr("Dadka Caanka ah ee Adduunka (Unlock+ Keliya)"),
      gateSummary: tr(
        "Baro shakhsiyaadka heerka sare ka gaaray kulliyad kasta, shahaadadii ay qaateen, iyo casharka ardayga."
      ),
      highlights: [
        tr("Shakhsiyaad caalami ah iyo kuwo Soomaali ah oo la hubiyay"),
        tr("Shahaadooyinka iyo guulaha ay gaareen"),
        tr("Ilaha rasmiga ah iyo casharro dhiirrigelin ah"),
      ],
    },
    {
      id: "future_jobs",
      label: tr("Shaqooyinka Cusub"),
      icon: <TrendingUp className="w-4 h-4" />,
      gateHeadline: tr("Wararka Shaqooyinka Cusub & AI (Unlock+ Keliya)"),
      gateSummary: tr(
        "Xog rasmi ah oo ku saabsan shaqooyinka ugu kororka badan iyo fursadaha gudaha Soomaaliya."
      ),
      highlights: [
        tr("Falanqaynta shaqooyinka ugu kororka badan adduunka"),
        tr("Fursadaha suuqa shaqada ee gudaha Soomaaliya"),
        tr("Xirfadaha AI iyo xogta ee shirkaduhu raadinayaan"),
      ],
    },
    {
      id: "skills",
      label: tr("Xirfadaha Dakhliga"),
      icon: <Wrench className="w-4 h-4" />,
      gateHeadline: tr("Xirfadaha Dakhliga Sare (Unlock+ Keliya)"),
      gateSummary: tr(
        "Baro xirfado dhab ah oo aad ku shaqaysan karto adigoo arday ah (Video Editing, Design, Web & AI)."
      ),
      highlights: [
        tr("Qorshaha 30-ka maalmood ee bilowga xirfad kasta"),
        tr("Sida ardaygu dakhli uga sameeyo gudaha iyo dibadda"),
        tr("Koorsooyin bilaash ah oo rasmi ah"),
      ],
    },
    {
      id: "somalia_growth",
      label: tr("Horumarinta Ardayga"),
      icon: <Rocket className="w-4 h-4" />,
      gateHeadline: tr("Horumarinta Ardayga Soomaaliya (Unlock+ Keliya)"),
      gateSummary: tr(
        "Istiraatiijiyad la hubiyay iyo deeqaha waxbarasho ee caalamiga ah ee u furan ardayda Soomaaliya."
      ),
      highlights: [
        tr("Xog ku salaysan warbixinnada Bangiga Adduunka"),
        tr("Tallaabooyinka heer caalami lagu gaaro"),
        tr("Xiriirrada rasmiga ah ee deeqaha waxbarasho"),
      ],
    },
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
        background: "linear-gradient(180deg, #061D42 0%, #0C326C 52%, #1553A6 100%)",
      }}
    >
      {/* Compact Single-Row Header with 3-Line Menu Trigger */}
      <header className="border-b border-white/15 relative z-30 bg-[#061D42]/95 backdrop-blur-xl">
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
              aria-label={tr("Qaybaha Unlock+")}
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
                <LockOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{tr("Fur Unlock+ ($0.50 | $1.20 Total)")}</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-[11px] sm:text-xs font-bold text-emerald-300 whitespace-nowrap shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{tr("Unlock+ Furan")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Slide-Down 3-Line Menu Drawer showing all 8 Pro Sections with Pro Lock Badge */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              aria-label="Unlock+ Sections Menu"
              className="relative z-30 border-t border-white/15 bg-[#07214C]/98 shadow-2xl animate-pro-enter"
            >
              <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-3.5 space-y-2">
                <div className="flex items-center justify-between px-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                      {tr("Xarunta Ardayga Unlock+")}
                    </span>
                    <ProBadge small />
                  </div>
                  <span className="text-[11px] font-semibold text-[#FFD86B]">6 {tr("Qaybood")}</span>
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
                            <span>UNLOCK+</span>
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
                    <LockOpen className="w-4 h-4" />
                    <span>{tr("Fur Unlock+ ($0.50 · Total $1.20)")}</span>
                  </button>
                )}
              </div>
            </nav>
          </>
        )}
      </header>

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-8 pb-28 space-y-5 min-w-0 overflow-x-clip">
        {!proActive ? (
          /* STRICT PRO LOCK GATE: Zero Pro data, zero filters, zero university/pioneer names mounted until Pro is unlocked */
          <section
            key={tab}
            className="animate-pro-enter max-w-2xl mx-auto rounded-3xl p-5 sm:p-8 border border-[#FFC93C]/45 shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-5"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,201,60,0.12) 0%, rgba(15,27,76,0.88) 45%, rgba(22,19,68,0.92) 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2">
                <span className="w-10 h-10 rounded-2xl bg-[#FFC93C]/18 border border-[#FFC93C]/40 text-[#FFD86B] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#FFD86B]">
                    {tr("Qaybtan waa xiran tahay")}
                  </div>
                  <div className="text-xs text-white/65">{activeTabObj.label}</div>
                </div>
              </div>
              <ProBadge />
            </div>

            <div className="space-y-2">
              <h2 className="font-head font-extrabold text-xl sm:text-2xl text-white leading-snug">
                {activeTabObj.gateHeadline}
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                {activeTabObj.gateSummary}
              </p>
            </div>

            <div className="rounded-2xl p-4 bg-[#070E29]/80 border border-white/10 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                {tr("Waxa aad heli doonto marka aad furto:")}
              </div>
              {activeTabObj.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85">
                  <Lock className="w-3.5 h-3.5 text-[#FFD86B] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-1 space-y-3">
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full h-[52px] rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <LockOpen className="w-4 h-4" />
                <span>{tr("Fur Unlock+ ($0.50 · Total $1.20)")}</span>
              </button>

              <p className="text-[11.5px] text-center text-white/60 leading-relaxed">
                {tr(
                  "Bixi $0.50 hal qeyb ama $1.20 HIRAAL Total (20% Qiimo Dhimis) EVC Plus: 610999089 · Shuceyb Abdirahman muddo 6 bilood ah."
                )}
              </p>
            </div>
          </section>
        ) : (
          /* PRO ACTIVE: Full unlocked access to all 6 University & Career Unlock+ Hub sections under ProContentShield */
          <ProContentShield
            active={proActive}
            sectionLabel={`Qeybta 3aad · University (${activeTabObj.label})`}
          >
            <div key={tab} className="animate-pro-enter min-w-0">
              {tab === "roadmaps" && (
                <ProRoadmapsExplorer
                  locked={false}
                  initialFacultyId={initialFacultyId}
                  onUnlockClick={onOpenPaywall}
                />
              )}
              {tab === "universities" && (
                <SomaliaUniversitiesSection
                  isPro={true}
                  onUnlock={onOpenPaywall}
                  initialFacultyId={initialFacultyId}
                />
              )}
              {tab === "pioneers" && (
                <WorldPioneersSection isPro={true} onUnlock={onOpenPaywall} />
              )}
              {tab === "future_jobs" && (
                <FutureJobsNewsSection isPro={true} onUnlock={onOpenPaywall} />
              )}
              {tab === "skills" && (
                <HighIncomeSkillsSection isPro={true} onUnlock={onOpenPaywall} />
              )}
              {tab === "somalia_growth" && (
                <SomaliaGrowthSection isPro={true} onUnlock={onOpenPaywall} />
              )}
            </div>
          </ProContentShield>
        )}
      </main>
    </div>
  );
}
