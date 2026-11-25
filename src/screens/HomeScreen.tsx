import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  LockOpen,
  MessageSquareText,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Footer, HiraalBrandIcon, SomaliStarIcon } from "../components/ModernUI";
import { HeroSpotlightTicker } from "../components/HeroSpotlightTicker";
import { PromoPosterModal } from "../components/PromoPosterModal";
import type { HubTab } from "./ProHubScreen";
import type { BridgingSectionTab } from "./BridgingPrepScreen";

function daysUntil(year: number, monthIndex: number, day: number): number {
  const now = new Date();
  const target = new Date(year, monthIndex, day);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function HomeScreen({
  onEnterSchool,
  onEnterBridging,
  onEnterFacultyGuide,
  onOpenProHub,
  onOpenSettings,
  onOpenReviews,
}: {
  onEnterSchool: (subjectId?: string) => void;
  onEnterBridging: (section?: BridgingSectionTab) => void;
  onEnterFacultyGuide: () => void;
  onOpenProHub: (tab?: HubTab, facultyId?: string) => void;
  onOpenSettings: () => void;
  onOpenReviews: () => void;
}) {
  const { darkMode, setDarkMode, tr, proActive } = useApp();
  const [promoOpen, setPromoOpen] = useState(false);

  const juneDays = useMemo(() => daysUntil(2027, 5, 1), []);
  const octDays = useMemo(() => daysUntil(2027, 9, 1), []);

  return (
    <div dir="ltr" className="min-h-screen flex flex-col pb-24 sm:pb-28">
      {/* Compact Somalia Flag Blue Top Hero */}
      <section
        className="relative overflow-hidden text-white border-b border-white/15"
        style={{
          background: "linear-gradient(135deg, #0A2E66 0%, #175BB8 52%, #2B7AE4 100%)",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-3.5 sm:pt-4 pb-6 sm:pb-7">
          {/* Clean Single-Row Header */}
          <header className="flex items-center justify-between gap-4 pb-3 border-b border-white/15">
            <div className="flex items-center gap-2.5 shrink-0">
              <HiraalBrandIcon size={38} />
              <span className="font-head font-extrabold text-[19px] sm:text-[21px] tracking-tight text-white whitespace-nowrap shrink-0">
                HIRAAL
              </span>
            </div>

            <nav className="flex items-center gap-1.5 shrink-0" aria-label="Main Controls">
              {proActive && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-500/25 border border-emerald-300/45 text-[11px] font-bold text-white whitespace-nowrap shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Unlock+</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-white/14 hover:bg-white/24 border border-white/25 text-white text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                title={tr("Sawirka Xayeysiinta")}
                aria-label={tr("Sawirka Xayeysiinta")}
              >
                <ImageIcon className="w-4 h-4 text-[#FFE484]" />
                <span className="hidden sm:inline">{tr("Sawirka QR")}</span>
              </button>

              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={tr(darkMode ? "Iftiin" : "Mugdi")}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white cursor-pointer transition-colors shrink-0"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={tr("Dejinta")}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white cursor-pointer transition-colors shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </nav>
          </header>

          {/* Compact Spotlight Strip */}
          <div className="-mt-1">
            <HeroSpotlightTicker />
          </div>

          {/* Focused Hero + Prominent Logo + Live Countdowns */}
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-rise">
            <div className="flex items-center gap-4 max-w-2xl">
              <HiraalBrandIcon size={68} className="hidden sm:flex rounded-2xl shadow-xl" />
              <div className="space-y-1">
                <h1
                  className="font-head font-extrabold text-[26px] sm:text-[34px] leading-[1.12] tracking-tight text-white"
                  style={{ textWrap: "balance" }}
                >
                  HIRAAL: <span className="text-[#FFE484]">School, Diyaarinta JUS &amp; University</span>
                </h1>
                <p className="text-[13.5px] sm:text-[15px] text-white/88 leading-relaxed">
                  {tr("Ogow kulliyadda kugu habboon, imtixaannada 2027, iyo xirfadaha mustaqbalka.")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onEnterSchool()}
                className="text-start rounded-2xl px-3.5 py-2.5 bg-cyan-500/22 hover:bg-cyan-500/32 border border-cyan-300/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#BAE6FD]">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>School · June 2027</span>
                </div>
                <div className="font-head font-extrabold text-sm sm:text-base text-white tabular-nums mt-0.5">
                  {juneDays} Maalmood
                </div>
              </button>

              <button
                type="button"
                onClick={() => onEnterBridging("exams")}
                className="text-start rounded-2xl px-3.5 py-2.5 bg-emerald-500/22 hover:bg-emerald-500/32 border border-emerald-300/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A7F3D0]">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>JUS · Oct 2027</span>
                </div>
                <div className="font-head font-extrabold text-sm sm:text-base text-white tabular-nums mt-0.5">
                  {octDays} Maalmood
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Clean Section Cards + Quick Action Strip */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        <section id="qeybaha-waaweyn" className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-head font-extrabold text-lg sm:text-xl tracking-tight">
              Qeybaha Waaweyn
            </h2>
            <span className="text-xs font-medium opacity-70">
              3 Qeybood
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* 1. SCHOOL: Vibrant Ocean Cyan-Blue */}
            <article
              className="animate-card-delay-1 relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-1 shadow-lg border border-cyan-300/35"
              style={{
                background: "linear-gradient(150deg, #0284C7 0%, #0EA5E9 48%, #1D4ED8 100%)",
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-white/20 border border-white/35 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white/95">
                      School
                    </span>
                  </div>
                  <span className="text-xs font-bold text-cyan-100 tabular-nums">June 2027</span>
                </div>

                <div>
                  <h3 className="font-head font-extrabold text-xl sm:text-2xl leading-snug text-white">
                    Form 4 (12 Maado)
                  </h3>
                  <p className="mt-1 text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                    12 maado (PDFs &amp; Predict), Sirta Top-10 &amp; Maaddooyinka, iyo Ranking.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-white/90">
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDFs Free</span>
                  </span>
                  <span className="font-extrabold text-[#FFE484] tabular-nums">Qeyb $0.50 · Total $1.20</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnterSchool()}
                className="w-full min-h-[46px] rounded-2xl bg-white hover:bg-cyan-50 text-[#073B6F] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm whitespace-nowrap"
              >
                <span>Gal School</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* 2. DIYAARINTA JAAMACADDA: Vibrant Emerald-Teal */}
            <article
              className="animate-card-delay-2 relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-1 shadow-lg border border-emerald-300/35"
              style={{
                background: "linear-gradient(150deg, #059669 0%, #10B981 48%, #0F766E 100%)",
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-white/20 border border-white/35 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white/95">
                      Heerka JUS &amp; Gelitaanka
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-100 tabular-nums">Oct 2027</span>
                </div>

                <div>
                  <h3 className="font-head font-extrabold text-xl sm:text-2xl leading-snug text-white">
                    Diyaarinta JUS (Keliya)
                  </h3>
                  <p className="mt-1 text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                    Jaamacadda Ummadda (5 maado: 4 Saynis + English), 90 maalmood &amp; Ranking JUS.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/20 flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-white/90">
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDFs Free</span>
                  </span>
                  <span className="font-extrabold text-[#FFE484] tabular-nums">Qeyb $0.50 · Total $1.20</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnterBridging("exams")}
                className="w-full min-h-[46px] rounded-2xl bg-white hover:bg-emerald-50 text-[#064E3B] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm whitespace-nowrap"
              >
                <span>Gal Diyaarinta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* 3. UNIVERSITY: Royal Indigo-Violet */}
            <article
              className="animate-card-delay-3 relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-1 shadow-lg border border-violet-300/35"
              style={{
                background: "linear-gradient(150deg, #4F46E5 0%, #7C3AED 55%, #312E81 100%)",
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-[#FFC93C]/22 border border-[#FFC93C]/50 text-[#FFE484] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-100">
                      Jaamacad
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#FFE484] tabular-nums">14 Kulliyad</span>
                </div>

                <div>
                  <h3 className="font-head font-extrabold text-xl sm:text-2xl leading-snug text-white">
                    Hagaha Kulliyadda
                  </h3>
                  <p className="mt-1 text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                    Imtixaanka RIASEC ee kuu soo saaraya kulliyadda kuugu habboon (SO/EN/AR).
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-200 font-bold">RIASEC Free</span>
                  <span className="font-extrabold text-[#FFE484] tabular-nums">Qeyb $0.50 · Total $1.20 (-20%)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onEnterFacultyGuide}
                className="w-full min-h-[46px] rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#0A1936] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm whitespace-nowrap"
              >
                <span>Gal Jaamacad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          </div>
        </section>

        {/* Clean 2-Column Utility Row */}
        <section className="grid md:grid-cols-2 gap-4">
          {/* Unlock+ Hub Highlight Card: Warm Amber-Orange */}
          <div
            className="rounded-3xl p-5 sm:p-6 text-white flex flex-col justify-between gap-4 border border-amber-300/35 shadow-md"
            style={{
              background: "linear-gradient(140deg, #B45309 0%, #D97706 52%, #EA580C 100%)",
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-100">
                  <LockOpen className="w-4 h-4 text-[#FFE484]" />
                  <span>Unlock+ Hub</span>
                </span>
                <span className="text-xs font-extrabold text-[#FFE484] tabular-nums">$0.50 | $1.20 Total (-20%)</span>
              </div>
              <h3 className="font-head font-extrabold text-lg sm:text-xl leading-snug">
                Khariidadaha, Jaamacadaha &amp; Xirfadaha
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                6-da qaybood ee University Hub: Khariidadaha, Jaamacadaha Soomaaliya, Dadka Caanka ah, Shaqooyinka Casriga ah &amp; Xirfadaha Dakhliga.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenProHub("roadmaps")}
              className="w-full sm:w-auto self-start min-h-[44px] px-5 rounded-xl bg-white hover:bg-amber-50 text-[#7C2D12] font-head font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <span>Fur Unlock+ Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Murti, Promo QR & Reviews Compact Card */}
          <div
            className={`rounded-3xl p-5 sm:p-6 border flex flex-col justify-between gap-4 ${
              darkMode
                ? "bg-[#091E3E] border-[#4189DD]/30 text-white"
                : "bg-white border-slate-200 text-slate-900 shadow-xs"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#165FB8] dark:text-[#7CB7FF]">
                <SomaliStarIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{tr("Murti Soomaaliyeed")}</span>
              </div>
              <blockquote className="font-quote font-bold text-lg sm:text-xl leading-snug">
                “{tr("Afkaaga hooyo waa sharaftaada iyo aqoontaada. Ummad walba afkeeda ayay ku horumartaa.")}”
              </blockquote>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="min-h-[44px] px-4 rounded-xl bg-[#4189DD] hover:bg-[#2F75CC] text-white font-head font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{tr("Sawirka QR")}</span>
              </button>
              <button
                type="button"
                onClick={onOpenReviews}
                className={`min-h-[44px] px-4 rounded-xl border font-head font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  darkMode
                    ? "bg-white/8 hover:bg-white/15 border-white/15 text-white"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900"
                }`}
              >
                <MessageSquareText className="w-4 h-4 text-[#4189DD]" />
                <span>{tr("Fikirrada Ardayda")}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {promoOpen && <PromoPosterModal onClose={() => setPromoOpen(false)} />}

      <Footer />
    </div>
  );
}
