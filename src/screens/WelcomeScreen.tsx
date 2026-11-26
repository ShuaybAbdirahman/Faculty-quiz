import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  GitBranch,
  Globe,
  HelpCircle,
  Lock,
  LockOpen,
  Map,
  MessageSquareText,
  Moon,
  Settings,
  ShieldCheck,
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
  FacultyIcon,
  Footer,
  HiraalLogoMark,
  ShinyButton,
} from "../components/ModernUI";
import { ReviewsSection } from "../components/ReviewsComponents";
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
            ? "bg-gradient-to-r from-[#FFD86B] via-[#818CF8] to-[#A78BFA] shadow-[0_0_24px_rgba(255,216,107,0.25)]"
            : "bg-white/22"
        }`}
      >
        <div className="rounded-[14.5px] bg-[#13123A]/95 flex items-center px-4">
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

      <div className="mt-2 min-h-[20px]">
        {userName ? (
          <p className="text-sm text-white/90 flex items-center gap-1.5">
            <span>{tr("Soo dhawoow,")}</span>
            <span className="font-head font-extrabold text-[#FFD86B]">{userName}</span>
          </p>
        ) : invalid ? (
          <p className="text-xs text-[#FFB4AB]">
            {tr("Magaca waa inuu ahaadaa ugu yaraan 2 xaraf, xarfo kaliya (tiro iyo calaamado lama oggola).")}
          </p>
        ) : null}
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
  const { lang, setLang, darkMode, setDarkMode, tr, trf, tx, txl, rtl, proActive, proLanguagesActive } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [peekFaculty, setPeekFaculty] = useState<Faculty | null>(null);
  const [sectionTab, setSectionTab] = useState<"faculties" | "reviews">("faculties");

  const featuredFaculties = useMemo(() => faculties.slice(0, 6), []);

  const handleSelectLang = (code: Lang) => {
    setLangMenuOpen(false);
    const ok = setLang(code);
    if (!ok) {
      onOpenPaywall();
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 sm:pb-28">
      {/* Royal Indigo-Violet University Hero */}
      <section
        className="relative overflow-hidden text-white border-b border-white/15"
        style={{
          background: "linear-gradient(135deg, #241F6B 0%, #4338CA 52%, #6D28D9 100%)",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-4 pb-8 lg:pb-12">
          {/* Clean Top Navigation Bar */}
          <header className="flex items-center justify-between gap-2 pb-4 border-b border-white/15">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <button
                type="button"
                onClick={onBackHome}
                aria-label="Ku noqo HIRAAL"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-2.5 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-xs font-bold text-white cursor-pointer transition-colors shrink-0"
              >
                {rtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span className="hidden sm:inline">HIRAAL</span>
              </button>
              <div className="w-9 h-9 rounded-xl bg-white/18 border border-white/30 flex items-center justify-center shrink-0">
                <HiraalLogoMark size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-head font-extrabold text-[15px] sm:text-[17px] leading-tight tracking-tight truncate">
                  {tr("Hagaha Kulliyadda")}
                </div>
                <div className="text-[11px] text-white/75 font-medium truncate">
                  RIASEC · 14 {tr("Kulliyadaha")}
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-1.5 shrink-0" aria-label="App Controls">
              <button
                type="button"
                onClick={() => onOpenProHub("roadmaps")}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-xl bg-[#FFC93C]/18 hover:bg-[#FFC93C]/28 border border-[#FFC93C]/45 text-[#FFD86B] text-xs font-extrabold cursor-pointer transition-colors whitespace-nowrap"
              >
                {proActive ? <ShieldCheck className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
                <span>Unlock+ Hub</span>
              </button>

              {/* Language Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/18 border border-white/18 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
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
                        const locked = code !== "so" && !proLanguagesActive;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleSelectLang(code)}
                            className={`w-full text-start px-3.5 py-2.5 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                              code === lang
                                ? "bg-indigo-500/20 text-indigo-400"
                                : darkMode
                                  ? "hover:bg-white/10"
                                  : "hover:bg-slate-100"
                            }`}
                          >
                            <span>{langNames[code]}</span>
                            {locked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-[#FFD86B]">
                                <Lock className="w-2.5 h-2.5" />
                                UNLOCK+
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
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/18 border border-white/18 text-white cursor-pointer transition-colors shrink-0"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={tr("Dejinta")}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/18 border border-white/18 text-white cursor-pointer transition-colors shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </nav>
          </header>

          {/* Hero Two-Column Stage */}
          <div className="mt-6 lg:mt-8 grid lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h1
                  className="font-head font-extrabold text-[34px] sm:text-[46px] lg:text-[50px] leading-[1.08] tracking-tight text-white"
                  style={{ textWrap: "balance" }}
                >
                  {tr("Hagaha Kulliyadda")}
                </h1>
                <div className="mt-2.5 w-16 h-1 rounded-full bg-[#FFD86B]" />
              </div>

              <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-white/85 max-w-xl">
                {tr(
                  "Su’aalo gaagaaban ayaa kaa caawinaya inaad garatid kulliyadda kugu habboon, adigoo ku saleynaya waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah."
                )}
              </p>

              {/* Clean Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#FFD86B]" />
                  <span className="tabular-nums">{trf("{n} su’aalood", { n: "25-30" })}</span>
                </span>
                <span className="text-white/25" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FFD86B]" />
                  <span>{tr("Ku dhawaad 8 daqiiqo")}</span>
                </span>
                <span className="text-white/25" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#FFD86B]" />
                  <span>{tr("Saddex kulliyadood")}</span>
                </span>
              </div>

              {/* Action Panel */}
              <div className="pt-1 max-w-xl space-y-3">
                <NameField />
                <ShinyButton label="Bilow" onClick={onStart} />
              </div>
            </div>

            {/* Right: Interactive 6-Faculty Preview Deck */}
            <div className="lg:col-span-5 hidden sm:block">
              <div className="rounded-3xl p-5 bg-white/[0.08] border border-white/18 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-head font-bold text-sm text-white/95">
                    {tr("Taabo kulliyad si aad u eegto")}
                  </span>
                  <span className="text-xs font-semibold text-[#FFD86B] tabular-nums">
                    14 {tr("Kulliyadaha")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {featuredFaculties.map((f) => {
                    const hex = argbToHex(f.color);
                    const dark = darkenHex(hex, 0.45);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPeekFaculty(f)}
                        className="text-start rounded-2xl p-3 border border-white/15 hover:border-[#FFD86B]/65 flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${hexToRgba(hex, 0.34)} 0%, ${hexToRgba(dark, 0.42)} 100%)`,
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/25"
                          style={{ background: hexToRgba(hex, 0.55) }}
                        >
                          <FacultyIcon faculty={f} size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-head font-bold text-[13px] text-white truncate">
                            {plainFacultyName(tx(f.name))}
                          </div>
                          <div className="text-[11px] text-white/70 truncate">
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

      {/* Segmented Section Tabs (No Stacked Wall of Duplicated Blocks) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            className={`inline-flex p-1 rounded-2xl border self-start ${
              darkMode ? "bg-[#0B1B3B] border-white/12" : "bg-slate-200/70 border-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setSectionTab("faculties")}
              className={`min-h-[40px] px-4 rounded-xl text-xs sm:text-sm font-head font-bold cursor-pointer transition-all whitespace-nowrap ${
                sectionTab === "faculties"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : darkMode
                    ? "text-white/75 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
              }`}
            >
              14 {tr("Kulliyadaha")}
            </button>
            <button
              type="button"
              onClick={() => setSectionTab("reviews")}
              className={`min-h-[40px] px-4 rounded-xl text-xs sm:text-sm font-head font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                sectionTab === "reviews"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : darkMode
                    ? "text-white/75 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>{tr("Waxa ay yiraahdaan ardayda")}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenProHub("roadmaps")}
            className="min-h-[40px] px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-600 dark:text-[#FFD86B] font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto whitespace-nowrap"
          >
            <LockOpen className="w-3.5 h-3.5" />
            <span>{tr("Unlock+ Hub · Khariidadaha")}</span>
          </button>
        </div>

        {sectionTab === "faculties" ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <AccentTitle label="Kulliyadaha" />
              <span className="text-xs font-semibold opacity-65">
                {tr("Taabo mid kasta si aad u eegto")}
              </span>
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
                        : "bg-white border-slate-200/90 hover:border-indigo-400 shadow-xs hover:shadow-md"
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
        ) : (
          <div className="-mx-4 sm:-mx-6">
            <ReviewsSection onViewAll={onOpenReviews} />
          </div>
        )}
      </main>

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

              {txl(peekFaculty.tips).length > 0 && (
                <div
                  className={`rounded-2xl p-3.5 border text-xs leading-relaxed ${
                    darkMode
                      ? "bg-[#FFC93C]/10 border-[#FFC93C]/30 text-[#FFE599]"
                      : "bg-amber-50 border-amber-200 text-amber-950"
                  }`}
                >
                  <strong className="block mb-1">{tr("Talooyin")}:</strong>
                  <span>{txl(peekFaculty.tips)[0]}</span>
                </div>
              )}

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
                  className="h-11 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
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
