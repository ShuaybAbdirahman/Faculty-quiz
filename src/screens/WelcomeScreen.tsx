import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  GitBranch,
  Globe,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Lock,
  Map,
  Moon,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react";
import { faculties, type Faculty, type Lang } from "../data/quizData";
import { cleanName, isValidName, useApp } from "../context/AppContext";
import { argbToHex, darkenHex, hexToRgba, langNames, plainFacultyName } from "../lib/i18n";
import {
  AccentTitle,
  AuroraBackground,
  FacultyIcon,
  Footer,
  ProBadge,
  ShinyButton,
  SomaliStarIcon,
} from "../components/ModernUI";
import { ReviewsSection } from "../components/ReviewsComponents";
import { PromoPosterModal, PromoPosterThumb } from "../components/PromoPosterModal";
import { HeroSpotlightTicker } from "../components/HeroSpotlightTicker";
import type { HubTab } from "./ProHubScreen";

function NameField() {
  const { tr, userName, setUserName } = useApp();
  const [raw, setRaw] = useState(userName);
  const [focused, setFocused] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const handleChange = (val: string) => {
    const filtered = val.replace(/[^\p{L}\p{M}\s'’-]/gu, "").slice(0, 20);
    setRaw(filtered);
    const cleaned = cleanName(filtered);
    const isBad = cleaned.length > 0 && !isValidName(cleaned);
    setInvalid(isBad);
    setUserName(cleaned.length === 0 || isBad ? "" : cleaned);
  };

  return (
    <div>
      <label htmlFor="student-name-input" className="sr-only">
        {tr("Magacaaga (ikhtiyaari)")}
      </label>
      <div
        className={`relative rounded-2xl p-[1.5px] transition-all duration-200 ${
          focused
            ? "bg-gradient-to-r from-[#FFD86B] via-[#60A5FA] to-[#A78BFA] shadow-[0_0_24px_rgba(255,216,107,0.25)]"
            : "bg-white/22"
        }`}
      >
        <div className="rounded-[14.5px] bg-[#0B1433]/95 flex items-center px-4">
          <User className="w-5 h-5 text-white/60 shrink-0" />
          <input
            id="student-name-input"
            type="text"
            value={raw}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={tr("Magacaaga (ikhtiyaari)")}
            maxLength={20}
            className="w-full bg-transparent text-white text-[16px] font-semibold py-4 px-3 outline-none placeholder:text-white/45 placeholder:font-normal caret-[#FFD86B]"
          />
          {userName && <CheckCircle2 className="w-5 h-5 text-[#FFD86B] shrink-0" />}
        </div>
      </div>

      <div className="mt-2 min-h-[22px]">
        {userName ? (
          <p className="text-sm text-white/90 flex items-center gap-1.5">
            <span>{tr("Soo dhawoow,")}</span>
            <span className="font-head font-extrabold text-[#FFD86B]">{userName}</span>
          </p>
        ) : invalid ? (
          <p className="text-xs text-[#FFB4AB]">
            {tr("Magaca waa inuu ahaadaa ugu yaraan 2 xaraf, xarfo kaliya (tiro iyo calaamado lama oggola).")}
          </p>
        ) : (
          <p className="text-xs text-white/60">
            {tr("Ku qor magacaaga si hambalyadaada ugu soo baxdo.")}
          </p>
        )}
      </div>
    </div>
  );
}

export function WelcomeScreen({
  onBackHome,
  onStart,
  onOpenSettings,
  onOpenReviews,
  onOpenProHub,
  onOpenPaywall,
}: {
  onBackHome: () => void;
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenReviews: () => void;
  onOpenProHub: (tab?: HubTab, facultyId?: string) => void;
  onOpenPaywall: () => void;
}) {
  const { lang, setLang, darkMode, setDarkMode, tr, trf, tx, txl, rtl, proActive } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [peekFaculty, setPeekFaculty] = useState<Faculty | null>(null);
  const [promoOpen, setPromoOpen] = useState(false);

  const featuredFaculties = useMemo(() => faculties.slice(0, 6), []);

  const handleSelectLang = (code: Lang) => {
    setLangMenuOpen(false);
    const ok = setLang(code);
    if (!ok) {
      onOpenPaywall();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Full-Bleed Academic Hero */}
      <section
        className="relative overflow-hidden text-white border-b border-white/15"
        style={{
          background: "linear-gradient(135deg, #07224C 0%, #165FB8 52%, #312E81 100%)",
        }}
      >
        <AuroraBackground />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-5 pb-12 lg:pb-16">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between gap-2 pb-5 sm:pb-6 border-b border-white/15">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <button
                type="button"
                onClick={onBackHome}
                aria-label="Ku noqo CAAWIYE"
                className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-xs font-bold text-white cursor-pointer transition-colors shrink-0"
              >
                {rtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span className="hidden sm:inline">CAAWIYE</span>
              </button>
              <div className="w-9 h-9 rounded-xl bg-[#4189DD] border border-white/30 flex items-center justify-center shrink-0">
                <SomaliStarIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-head font-extrabold text-[15px] sm:text-[17px] leading-tight tracking-tight truncate">
                  University · {tr("Hagaha Kulliyadda")}
                </div>
                <div className="text-[10.5px] sm:text-[11px] text-white/70 font-medium truncate">
                  Qeybta 3aad · RIASEC · 14 {tr("Kulliyadaha")}
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-1.5 shrink-0" aria-label="App Controls">
              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/18 border border-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
                title={tr("Sawirka Xayeysiinta")}
                aria-label={tr("Sawirka Xayeysiinta")}
              >
                <ImageIcon className="w-4 h-4 text-[#FFD86B]" />
                <span className="hidden md:inline">{tr("Sawirka Xayeysiinta")}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenProHub("roadmaps")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFC93C]/15 hover:bg-[#FFC93C]/25 border border-[#FFC93C]/45 text-[#FFD86B] text-xs font-extrabold cursor-pointer transition-colors"
              >
                {proActive ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{tr("Xarunta Pro · Khariidadaha")}</span>
              </button>

              {/* Language Picker (Somali Free, English & Arabic Pro) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((v) => !v)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                  aria-label={tr("Luqadda")}
                  aria-expanded={langMenuOpen}
                >
                  <Globe className="w-4 h-4 text-[#FFD86B] shrink-0" />
                  <span className="sm:hidden uppercase font-bold">{lang}</span>
                  <span className="hidden sm:inline">{langNames[lang]}</span>
                </button>
                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setLangMenuOpen(false)} />
                    <div
                      className={`absolute end-0 mt-1.5 z-30 w-48 rounded-2xl py-1.5 shadow-2xl border ${
                        darkMode
                          ? "bg-[#111933] border-white/15 text-white"
                          : "bg-white border-slate-200 text-slate-900"
                      }`}
                    >
                      {(Object.keys(langNames) as Lang[]).map((code) => {
                        const locked = code !== "so" && !proActive;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleSelectLang(code)}
                            className={`w-full text-start px-3.5 py-2.5 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                              code === lang
                                ? "bg-[#3B5BDB]/20 text-[#6E8BFF]"
                                : darkMode
                                  ? "hover:bg-white/10"
                                  : "hover:bg-slate-100"
                            }`}
                          >
                            <span>{langNames[code]}</span>
                            {locked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#FFC93C]/20 text-[#FFD86B]">
                                <Lock className="w-2.5 h-2.5" />
                                PRO
                              </span>
                            ) : code === "so" ? (
                              <span className="text-[10px] font-bold text-emerald-400">FREE</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={tr(darkMode ? "Iftiin" : "Mugdi")}
                className="p-2 sm:p-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white cursor-pointer transition-colors shrink-0"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={tr("Dejinta")}
                className="p-2 sm:p-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white cursor-pointer transition-colors shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </nav>
          </header>

          {/* Animated Hero Spotlight Ticker (10 App Highlights + Automatic Friday Salawat) */}
          <HeroSpotlightTicker />

          {/* Hero Two-Column Stage */}
          <div className="mt-6 lg:mt-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Editorial Copy + Name Input + Primary CTA */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h1 className="font-head font-extrabold text-[40px] sm:text-[50px] lg:text-[54px] leading-[1.08] tracking-tight text-white">
                  {tr("Hagaha Kulliyadda")}
                </h1>
                <div className="mt-3 w-16 h-1 rounded-full bg-[#FFD86B]" />
              </div>

              <p className="text-[16px] sm:text-[17px] leading-relaxed text-white/80 max-w-2xl">
                {tr(
                  "Su’aalo gaagaaban ayaa kaa caawinaya inaad garatid kulliyadda kugu habboon, adigoo ku saleynaya waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah."
                )}
              </p>

              {/* Unboxed Metadata Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] font-semibold text-white/85 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#FFD86B]" />
                  <span className="tabular-nums">{trf("{n} su’aalood", { n: "25-30" })}</span>
                </span>
                <span className="text-white/25" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FFD86B]" />
                  <span>{tr("Ku dhawaad 8 daqiiqo")}</span>
                </span>
                <span className="text-white/25" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#FFD86B]" />
                  <span>{tr("Saddex kulliyadood")}</span>
                </span>
              </div>

              {/* Action Panel */}
              <div className="pt-2 max-w-xl space-y-3.5">
                <NameField />
                <ShinyButton label="Bilow" onClick={onStart} />
                <div className="flex items-start gap-2 text-xs text-white/60 pt-0.5">
                  <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#FFD86B]/80" />
                  <p className="leading-relaxed">
                    {tr(
                      "Magacaaga (ikhtiyaari) waxaa loo isticmaalaa hambalyada oo kaliya. Waxay ku hadhaysaa qalabkaaga, lamana diro waligeed."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Faculty Preview Deck */}
            <div className="lg:col-span-5 hidden sm:block">
              <div className="rounded-3xl p-5 bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-head font-bold text-sm text-white/90">
                    {tr("Taabo kulliyad si aad u eegto")}
                  </span>
                  <span className="text-xs font-semibold text-[#FFD86B] tabular-nums">
                    14 {tr("Kulliyadaha")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {featuredFaculties.map((f) => {
                    const hex = argbToHex(f.color);
                    const dark = darkenHex(hex, 0.45);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPeekFaculty(f)}
                        className="text-start rounded-2xl p-3.5 border border-white/12 hover:border-[#FFD86B]/60 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${hexToRgba(hex, 0.28)} 0%, ${hexToRgba(dark, 0.35)} 100%)`,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/25"
                          style={{ background: hexToRgba(hex, 0.55) }}
                        >
                          <FacultyIcon faculty={f} size={22} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-head font-bold text-[13.5px] text-white truncate">
                            {plainFacultyName(tx(f.name))}
                          </div>
                          <div className="text-[11px] text-white/65 truncate">
                            {f.depts.length} {tr("waaxood")}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-10 space-y-10">
        {/* Clear Somali Language Pride Editorial Quote */}
        <section
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border ${
            darkMode
              ? "bg-gradient-to-br from-[#0D1736] via-[#131F48] to-[#0A1128] border-[#FFD86B]/30"
              : "bg-gradient-to-br from-[#FFFDF7] via-[#F5F8FF] to-[#EEF2FF] border-[#3B5BDB]/20 shadow-sm"
          }`}
        >
          <div className="relative z-10 max-w-4xl space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#D97706] dark:text-[#FFD86B]">
              <span className="w-6 h-[2px] bg-[#D97706] dark:bg-[#FFD86B] inline-block" />
              <span>{tr("Sharafka iyo Haybadda Afkeenna Hooyo")}</span>
            </div>

            <blockquote className="font-quote font-bold text-[22px] sm:text-[28px] leading-[1.42] tracking-normal">
              “{tr("Afkaaga hooyo waa sharaftaada iyo aqoontaada. Ummad walba afkeeda ayay ku horumartaa.")}”
            </blockquote>

            <div className="text-sm font-bold text-[#D97706] dark:text-[#FFD86B]">
              {tr("Murti Soomaaliyeed")}
            </div>

            <p className="text-xs sm:text-[13.5px] opacity-80 leading-relaxed pt-2.5 border-t border-current/10">
              {tr(
                "Af-Soomaaligu waa luqad cilmi iyo horumar ah, sidaas darteed barnaamijkan Af-Soomaali waa bilaash boqolkiiba boqol. Luqadaha Ingiriisiga iyo Carabiga waxaa lagu furtaa qaybta Pro ($0.10, hal mar oo keliya)."
              )}
            </p>
          </div>
        </section>

        {/* Pro Student Hub Spotlight Banner ($0.10 Lifetime) */}
        <section
          className="rounded-3xl p-6 sm:p-7 text-white border border-[#7CB7FF]/40 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #07224C 0%, #1553A6 58%, #312E81 100%)",
            boxShadow: "0 18px 40px rgba(7,34,76,0.25)",
          }}
        >
          <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <ProBadge />
                <span className="text-xs font-extrabold text-[#FFD86B]">
                  {tr("$0.10 Keliya · Hal mar (Abid)")}
                </span>
              </div>
              <h2 className="font-head font-extrabold text-[24px] sm:text-[28px] leading-tight">
                {tr("Xarunta Ardayga Pro: Khariidadaha, Jaamacadaha & Xirfadaha")}
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                {tr(
                  "Ka hel khariidado waxbarasho oo la hubiyay (AI, Injineernimada Korontada, Caafimaadka, Dhismaha, Maaliyadda), hagaha jaamacadaha Soomaaliya, dadka caanka ah ee qarnigan, iyo xirfadaha dakhliga sare."
                )}
              </p>
              <div className="pt-1 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenProHub("roadmaps")}
                  className="px-5 py-3 rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Map className="w-4 h-4" />
                  <span>{tr("Eeg Khariidadaha")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenProHub("universities")}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/16 border border-white/20 text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#FFD86B]" />
                  <span>{tr("Jaamacadaha")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenProHub("pioneers")}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/16 border border-white/20 text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Award className="w-4 h-4 text-[#FFD86B]" />
                  <span>{tr("Dadka Caanka ah")}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { title: "AI & Data Science", tag: "roadmap.sh", color: "#6366F1", tab: "roadmaps" as const, fid: "cs" },
                { title: "Electrical Eng.", tag: "IEEE & ABET", color: "#F59E0B", tab: "roadmaps" as const, fid: "eng" },
                { title: "Medicine (MBBS)", tag: "WHO Track", color: "#EF4444", tab: "roadmaps" as const, fid: "med" },
                { title: tr("Jaamacadaha Soomaaliya"), tag: "Directory", color: "#10B981", tab: "universities" as const, fid: undefined },
              ].map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => onOpenProHub(card.tab, card.fid)}
                  className="text-start rounded-2xl p-3.5 bg-white/[0.08] hover:bg-white/[0.15] border border-white/18 transition-all cursor-pointer"
                >
                  <div className="font-head font-bold text-sm text-white leading-snug">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-[#FFD86B] font-semibold mt-1">{card.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* All 14 Faculties Interactive Explorer Grid */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <AccentTitle label="Kulliyadaha" />
            <span className="text-xs font-semibold opacity-60">{tr("Taabo mid kasta si aad u eegto")}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {faculties.map((f) => {
              const hex = argbToHex(f.color);
              const dark = darkenHex(hex, 0.5);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPeekFaculty(f)}
                  className={`group text-start rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                    darkMode
                      ? "bg-[#121A30] border-white/10 hover:border-[#FFD86B]/50"
                      : "bg-white border-slate-200/90 hover:border-[#3B5BDB]/50 shadow-xs hover:shadow-md"
                  }`}
                >
                  <div
                    className="h-20 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${hex} 0%, ${dark} 100%)` }}
                  >
                    <div className="w-11 h-11 rounded-full bg-white/15 border border-white/35 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <FacultyIcon faculty={f} size={24} />
                    </div>
                  </div>
                  <div className="p-2.5 text-center">
                    <div className="font-head font-bold text-[12.5px] leading-snug line-clamp-2">
                      {plainFacultyName(tx(f.name))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Promo Poster Showcase Card (View & Download with Real QR) */}
        <section
          className={`rounded-3xl p-5 sm:p-6 border flex flex-col sm:flex-row items-center gap-6 ${
            darkMode
              ? "bg-[#101831] border-white/12"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <button
            type="button"
            onClick={() => setPromoOpen(true)}
            aria-label="CAAWIYE Promo Poster"
            className="w-40 sm:w-44 shrink-0 rounded-2xl overflow-hidden border border-[#4189DD]/35 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <PromoPosterThumb />
          </button>
          <div className="flex-1 text-center sm:text-start space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#D97706] dark:text-[#FFD86B]">
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
                className="px-5 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{tr("Eeg & Soo Degso")}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Public Student Reviews */}
        <div className="-mx-6">
          <ReviewsSection onViewAll={onOpenReviews} />
        </div>
      </main>

      {promoOpen && <PromoPosterModal onClose={() => setPromoOpen(false)} />}

      {/* Interactive Faculty Quick-Peek Modal */}
      {peekFaculty && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPeekFaculty(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border animate-rise ${
              darkMode
                ? "bg-[#111930] border-white/15 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div
              className="p-5 text-white flex items-center justify-between gap-3"
              style={{
                background: `linear-gradient(135deg, ${argbToHex(peekFaculty.color)} 0%, ${darkenHex(argbToHex(peekFaculty.color), 0.5)} 100%)`,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                  <FacultyIcon faculty={peekFaculty} size={26} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-head font-extrabold text-lg leading-tight truncate">
                    {plainFacultyName(tx(peekFaculty.name))}
                  </h3>
                  <p className="text-xs text-white/80 truncate">{peekFaculty.en}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPeekFaculty(null)}
                aria-label="Close"
                className="p-2 rounded-xl bg-black/20 hover:bg-black/35 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed opacity-85">{tx(peekFaculty.desc)}</p>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5D7BFF] mb-2">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{tr("Waaxaha")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {peekFaculty.depts.map((d) => (
                    <span
                      key={d}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        darkMode ? "bg-white/10 text-white/90" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5D7BFF] mb-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{tr("Shaqooyinka laga helo")}</span>
                </div>
                <p className="text-xs sm:text-sm opacity-85">{txl(peekFaculty.jobs).join(" · ")}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPeekFaculty(null);
                    onStart();
                  }}
                  className="flex-1 h-11 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm cursor-pointer transition-colors"
                >
                  {tr("Bilow (Ogow % ku habboonaanta)")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fid = peekFaculty.id;
                    setPeekFaculty(null);
                    onOpenProHub("roadmaps", fid);
                  }}
                  className="h-11 px-4 rounded-xl bg-[#3B5BDB] hover:bg-[#324EC2] text-white font-bold text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Map className="w-4 h-4" />
                  <span>{tr("Khariidadaha")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
