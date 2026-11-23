import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Compass,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Moon,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { AuroraBackground, Footer, SomaliStarIcon } from "../components/ModernUI";
import { HeroSpotlightTicker } from "../components/HeroSpotlightTicker";
import { PromoPosterModal } from "../components/PromoPosterModal";
import { ReviewsSection } from "../components/ReviewsComponents";
import promoPosterThumb from "../assets/images/hagaha_kulliyadda_promo_1795079553879.jpg";

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
  onOpenSettings,
  onOpenReviews,
}: {
  onEnterSchool: (subjectId?: string) => void;
  onEnterBridging: (section?: "exams" | "readiness" | "challenges") => void;
  onEnterFacultyGuide: () => void;
  onOpenSettings: () => void;
  onOpenReviews: () => void;
}) {
  const { darkMode, setDarkMode, tr, proActive } = useApp();
  const [promoOpen, setPromoOpen] = useState(false);

  const juneDays = useMemo(() => daysUntil(2027, 5, 1), []);
  const octDays = useMemo(() => daysUntil(2027, 9, 1), []);

  return (
    <div dir="ltr" className="min-h-screen flex flex-col">
      {/* Compact Somalia Flag Blue Top Shell (Shows Ticker + Leads Directly to the 3 Main Sections) */}
      <section
        className="relative overflow-hidden text-white border-b border-white/15"
        style={{
          background: "linear-gradient(135deg, #0D3C7A 0%, #1C66C2 48%, #4189DD 100%)",
        }}
      >
        <AuroraBackground />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-3.5 sm:pt-4 pb-6 sm:pb-7">
          {/* Clean Top Bar (Brand + Actions) */}
          <header className="flex items-center justify-between gap-4 pb-3.5 border-b border-white/15">
            <div className="flex items-center gap-2.5 min-w-0 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/18 border border-white/35 flex items-center justify-center shadow-sm shrink-0">
                <SomaliStarIcon className="w-5 h-5 text-white animate-star-float" />
              </div>
              <span className="font-head font-extrabold text-[18px] sm:text-[20px] tracking-tight text-white whitespace-nowrap shrink-0">
                CAAWIYE
              </span>
            </div>

            <nav className="flex items-center gap-1.5 shrink-0" aria-label="Main Controls">
              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                title={tr("Sawirka Xayeysiinta")}
                aria-label={tr("Sawirka Xayeysiinta")}
              >
                <ImageIcon className="w-4 h-4 text-white" />
                <span className="hidden md:inline">{tr("Sawirka Xayeysiinta")}</span>
              </button>

              {proActive && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-500/25 border border-emerald-300/45 text-[11px] font-bold text-white whitespace-nowrap shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pro</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={tr(darkMode ? "Iftiin" : "Mugdi")}
                className="p-2 sm:p-2.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white cursor-pointer transition-colors shrink-0"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={tr("Dejinta")}
                className="p-2 sm:p-2.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white cursor-pointer transition-colors shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </nav>
          </header>

          {/* Compact Animated Spotlight Ticker */}
          <div className="-mt-1">
            <HeroSpotlightTicker />
          </div>

          {/* Crisp Compact Editorial Banner + 2027 Exam Countdown Strip */}
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-rise">
            <div className="space-y-1.5 max-w-2xl">
              <h1
                className="font-head font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.12] tracking-tight text-white"
                style={{ textWrap: "balance" }}
              >
                CAAWIYE: <span className="text-[#FFE484]">School, Gap &amp; University</span>
              </h1>
              <p className="text-[13.5px] sm:text-[15px] text-white/90 leading-relaxed">
                Hal madal oo ka kooban saddex qeybood oo mid walba midab iyo hage u gaar ah leedahay.
              </p>
            </div>

            {/* Live Exam Countdown Strip */}
            <div className="grid grid-cols-2 gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onEnterSchool()}
                className="text-start rounded-2xl px-3.5 py-2.5 bg-white/14 hover:bg-white/22 border border-white/25 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#DBEAFE]">
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
                className="text-start rounded-2xl px-3.5 py-2.5 bg-white/14 hover:bg-white/22 border border-white/25 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A7F3D0]">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Gap · Oct 2027</span>
                </div>
                <div className="font-head font-extrabold text-sm sm:text-base text-white tabular-nums mt-0.5">
                  {octDays} Maalmood
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: The 3 Distinct Colored Sections Immediately Visible Above the Fold */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
        <section id="qeybaha-waaweyn" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5">
            <div>
              <h2 className="font-head font-extrabold text-xl sm:text-2xl tracking-tight">
                Dooro Qeybtaada Hadda
              </h2>
            </div>
            <p className="text-xs sm:text-sm opacity-75">
              School &amp; Gap: Af-Soomaali Keliya · University: SO / EN / AR
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 1. SCHOOL - Somalia Flag Sky Blue Theme */}
            <article
              className="animate-card-delay-1 relative overflow-hidden rounded-3xl p-6 text-white flex flex-col justify-between gap-5 transition-transform duration-200 hover:-translate-y-1 shadow-xl border border-[#7CB7FF]/45"
              style={{
                background: "linear-gradient(155deg, #1E73D8 0%, #4189DD 55%, #124E9B 100%)",
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-11 h-11 rounded-2xl bg-white/18 border border-white/35 text-white flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white/95">
                      01 · School
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#DBEAFE] tabular-nums">
                    June 2027
                  </span>
                </div>

                <div>
                  <h3 className="font-head font-extrabold text-2xl leading-snug text-white">
                    School (Form 4)
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                    Imtixaanka Qaranka ee Form 4 (12 maado): Saynis, Luqadaha, Bulsho, Ganacsi, Tech &amp; Tarbiyo. Diyaar u ah PDFs &amp; Predict Exam.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/22 space-y-1.5 text-xs text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF-yada (12 Maado):</span>
                    </span>
                    <span className="font-bold text-[#DBEAFE]">Free (Dhowaan)</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFE484]" />
                      <span>Predict Exam:</span>
                    </span>
                    <span className="font-extrabold text-[#FFE484] tabular-nums">$0.10 / Maado</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnterSchool()}
                className="w-full h-12 rounded-2xl bg-white hover:bg-[#F0F7FF] text-[#0D3C7A] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md whitespace-nowrap"
              >
                <span>Gal School</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* 2. GAP - Emerald Teal Theme */}
            <article
              className="animate-card-delay-2 relative overflow-hidden rounded-3xl p-6 text-white flex flex-col justify-between gap-5 transition-transform duration-200 hover:-translate-y-1 shadow-xl border border-emerald-300/45"
              style={{
                background: "linear-gradient(155deg, #047857 0%, #059669 55%, #065F46 100%)",
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-11 h-11 rounded-2xl bg-white/18 border border-white/35 text-white flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white/95">
                      02 · Gap
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-100 tabular-nums">
                    Oct 2027
                  </span>
                </div>

                <div>
                  <h3 className="font-head font-extrabold text-2xl leading-snug text-white">
                    Gap (Diyaargarow)
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                    Inta u dhaxaysa School &amp; University: tartanka Jaamacadda Ummadda (JUS), PDFs, Predict Exam, 90 Maalmood &amp; Xalka Caqabadaha.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/22 space-y-1.5 text-xs text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDFs &amp; 90 Maalmood:</span>
                    </span>
                    <span className="font-bold text-emerald-100">Free (Dhowaan)</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFE484]" />
                      <span>Predict Exam Tartanka:</span>
                    </span>
                    <span className="font-extrabold text-[#FFE484] tabular-nums">$0.10</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnterBridging("exams")}
                className="w-full h-12 rounded-2xl bg-white hover:bg-emerald-50 text-[#064E3B] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md whitespace-nowrap"
              >
                <span>Gal Gap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* 3. UNIVERSITY - Royal Indigo / Amber Theme */}
            <article
              className="animate-card-delay-3 relative overflow-hidden rounded-3xl p-6 text-white flex flex-col justify-between gap-5 transition-transform duration-200 hover:-translate-y-1 shadow-xl border border-indigo-300/45"
              style={{
                background: "linear-gradient(155deg, #312E81 0%, #4338CA 55%, #1E1B4B 100%)",
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-11 h-11 rounded-2xl bg-[#FFC93C]/22 border border-[#FFC93C]/50 text-[#FFE484] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-100">
                      03 · University
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#FFE484]">
                    14 Kulliyadood
                  </span>
                </div>

                <div>
                  <h3 className="font-head font-extrabold text-2xl leading-snug text-white">
                    University (Kulliyadda)
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                    Imtixaanka RIASEC ee kuu soo saaraya kulliyadda kuugu habboon, Hagaha Waaxda, Khariidadaha, Jaamacadaha Soomaaliya &amp; Dadka Caanka ah.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/22 space-y-1.5 text-xs text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <Compass className="w-3.5 h-3.5 text-[#FFE484]" />
                      <span>RIASEC &amp; 14 Kulliyad:</span>
                    </span>
                    <span className="font-bold text-emerald-200">Free</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-white/90">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFE484]" />
                      <span>Waaxaha + Xarunta Pro:</span>
                    </span>
                    <span className="font-extrabold text-[#FFE484] tabular-nums">$0.10 · Abid</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onEnterFacultyGuide}
                className="w-full h-12 rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#0A1936] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md whitespace-nowrap"
              >
                <span>Gal University</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          </div>
        </section>

        {/* Somali Language Pride Quote (Somalia Flag Blue Framed) */}
        <section
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border ${
            darkMode
              ? "bg-gradient-to-br from-[#08224B] via-[#0E3675] to-[#071B3E] border-[#4189DD]/40"
              : "bg-gradient-to-br from-[#EFF6FF] via-[#FFFFFF] to-[#E6F1FD] border-[#4189DD]/30 shadow-xs"
          }`}
        >
          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#165FB8] dark:text-[#7CB7FF]">
              <SomaliStarIcon className="w-4 h-4 shrink-0" />
              <span>{tr("Sharafka iyo Haybadda Afkeenna Hooyo")}</span>
            </div>

            <blockquote className="font-quote font-bold text-[22px] sm:text-[28px] leading-[1.4] tracking-normal">
              “{tr("Afkaaga hooyo waa sharaftaada iyo aqoontaada. Ummad walba afkeeda ayay ku horumartaa.")}”
            </blockquote>

            <div className="text-sm font-bold text-[#165FB8] dark:text-[#93C5FD]">
              {tr("Murti Soomaaliyeed")}
            </div>

            <p className="text-xs sm:text-[13.5px] opacity-80 leading-relaxed pt-2.5 border-t border-current/10">
              School (Form 4) iyo Gap waxay si buuxda ugu shaqeeyaan Af-Soomaali keliya; University-na qaybta Af-Soomaaligu waa bilaash 100%.
            </p>
          </div>
        </section>

        {/* Promo Poster Showcase Card */}
        <section
          className={`rounded-3xl p-5 sm:p-6 border flex flex-col sm:flex-row items-center gap-6 ${
            darkMode ? "bg-[#081F44] border-[#4189DD]/25" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <button
            type="button"
            onClick={() => setPromoOpen(true)}
            className="w-40 sm:w-44 shrink-0 rounded-2xl overflow-hidden border border-white/15 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <img
              src={promoPosterThumb}
              alt="CAAWIYE Promo Poster"
              referrerPolicy="no-referrer"
              className="w-full h-auto block"
            />
          </button>
          <div className="flex-1 text-center sm:text-start space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#165FB8] dark:text-[#7CB7FF]">
              <ImageIcon className="w-4 h-4" />
              <span>{tr("Sawirka Xayeysiinta")}</span>
            </div>
            <h3 className="font-head font-extrabold text-xl sm:text-2xl leading-tight">
              {tr("La wadaag asxaabtaada iyo ardayda dugsiga sare")}
            </h3>
            <p className="text-xs sm:text-sm opacity-75 leading-relaxed max-w-xl">
              {tr(
                "Sawir xayeysiin ah oo diyaarsan oo leh QR code dhab ah iyo link-ga rasmiga ah, hal mar riix si aad u soo degsato."
              )}
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#4189DD] hover:bg-[#2F75CC] text-white font-head font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{tr("Eeg & Soo Degso")}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Public Student Reviews */}
        <div className="-mx-4 sm:-mx-6">
          <ReviewsSection onViewAll={onOpenReviews} />
        </div>
      </main>

      {promoOpen && <PromoPosterModal onClose={() => setPromoOpen(false)} />}

      <Footer />
    </div>
  );
}
