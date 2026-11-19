import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap,
  HelpCircle,
  Lock,
  Moon,
  Settings,
  Sun,
  Trophy,
  User,
} from "lucide-react";
import { faculties, type Lang } from "../data/quizData";
import { cleanName, isValidName, useApp } from "../context/AppContext";
import { argbToHex, hexToRgba, langNames } from "../lib/i18n";
import {
  AccentTitle,
  AuroraBackground,
  FacultyBanner,
  FacultyIcon,
  Footer,
  ShinyButton,
} from "../components/ModernUI";
import { ReviewsSection } from "../components/ReviewsComponents";

function canSplit(s: string): boolean {
  for (const ch of s) {
    if ((ch.codePointAt(0) ?? 0) >= 0x0590) return false;
  }
  return true;
}

function PopText({ text }: { text: string }) {
  const { animationsOn } = useApp();
  if (!animationsOn || !canSplit(text)) {
    return <span className="text-[#FFD86B] text-[20px] font-extrabold">{text}</span>;
  }
  return (
    <span dir="ltr" className="inline-flex text-[#FFD86B] text-[20px] font-extrabold">
      {Array.from(text).map((ch, i) => (
        <span key={`${i}-${ch}`} className="animate-pop-letter whitespace-pre">
          {ch}
        </span>
      ))}
    </span>
  );
}

function FacultyMarquee() {
  const { animationsOn } = useApp();
  const sizes = [52, 46, 56, 48, 54, 44];
  const order = useMemo(() => {
    const arr = faculties.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const renderItem = (idx: number, pos: number) => {
    const f = faculties[idx];
    const size = sizes[pos % sizes.length];
    const hex = argbToHex(f.color);
    return (
      <div key={`${idx}-${pos}`} className="w-[56px] h-[76px] flex items-center justify-center shrink-0">
        <div
          className="rounded-full flex items-center justify-center border border-white/35"
          style={{
            width: size,
            height: size,
            background: `linear-gradient(135deg, ${hexToRgba(hex, 0.6)} 0%, ${hexToRgba(hex, 0.22)} 100%)`,
            boxShadow: `0 0 14px ${hexToRgba(hex, 0.35)}`,
          }}
        >
          <FacultyIcon faculty={f} size={Math.round(size * 0.5)} />
        </div>
      </div>
    );
  };

  if (!animationsOn) {
    return (
      <div className="h-[76px] flex items-center justify-between">
        {order.slice(0, 5).map((idx, pos) => renderItem(idx, pos))}
      </div>
    );
  }

  return (
    <div
      className="h-[76px] overflow-hidden relative"
      style={{
        maskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div className="flex gap-3.5 w-max animate-marquee">
        {order.map((idx, pos) => renderItem(idx, pos))}
        {order.map((idx, pos) => renderItem(idx, pos + order.length))}
      </div>
    </div>
  );
}

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
      <div
        className={`relative rounded-[22px] p-[1.8px] transition-shadow ${
          focused ? "shadow-[0_0_26px_rgba(255,216,107,0.30)]" : ""
        }`}
        style={{
          background: focused
            ? "conic-gradient(from 0deg, #FFD86B, #FF7EB6, #7AE7FF, #FFD86B)"
            : "rgba(255,255,255,0.30)",
        }}
      >
        <div className="rounded-[20.2px] bg-[#111B45] flex items-center px-4">
          <User className="w-[22px] h-[22px] text-white/70 shrink-0" />
          <input
            type="text"
            value={raw}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={tr("Magacaaga (ikhtiyaari)")}
            maxLength={20}
            className="w-full bg-transparent text-white text-[18px] font-semibold py-[17px] px-2.5 outline-none placeholder:text-white/55 placeholder:font-medium caret-[#FFD86B]"
          />
          {userName ? (
            <CheckCircle2 className="w-6 h-6 text-[#FFD86B] shrink-0" />
          ) : (
            <span className="w-4 shrink-0" />
          )}
        </div>
      </div>

      <div className="mt-2.5 min-h-[26px]">
        {userName ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block text-[20px] animate-wave-hand" role="img" aria-label="wave">
              👋
            </span>
            <span className="text-white text-[16px]">{tr("Soo dhawoow,")}</span>
            <PopText text={userName} />
          </div>
        ) : invalid ? (
          <p className="text-[13px] text-[#FFB4AB]">
            {tr("Magaca waa inuu ahaadaa ugu yaraan 2 xaraf, xarfo kaliya (tiro iyo calaamado lama oggola).")}
          </p>
        ) : (
          <p className="text-[13px] text-white/70">
            {tr("Ku qor magacaaga si hambalyadaada ugu soo baxdo.")}
          </p>
        )}
      </div>
    </div>
  );
}

export function WelcomeScreen({
  onStart,
  onOpenSettings,
  onOpenReviews,
}: {
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenReviews: () => void;
}) {
  const { lang, setLang, darkMode, setDarkMode, tr, trf } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const heroWords = tr("Hagaha Kulliyadda").split(" ");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Aurora Hero Header */}
      <div
        className="relative overflow-hidden rounded-b-[34px] text-white"
        style={{
          background: "linear-gradient(135deg, #070D26 0%, #1B3A9E 52%, #6A47E0 100%)",
        }}
      >
        <AuroraBackground />

        <div className="relative z-10 px-6 pt-7 pb-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2">
            <GraduationCap className="w-11 h-11 text-white" />
            <div className="flex items-center gap-1">
              {/* Language Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-white text-sm font-semibold cursor-pointer"
                  title={tr("Luqadda")}
                >
                  <Globe className="w-5 h-5" />
                  <span>{langNames[lang]}</span>
                </button>
                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setLangMenuOpen(false)} />
                    <div
                      className={`absolute end-0 mt-1 z-30 w-36 rounded-2xl py-1.5 shadow-xl border ${
                        darkMode
                          ? "bg-[#151D33] border-white/15 text-white"
                          : "bg-white border-slate-200 text-slate-900"
                      }`}
                    >
                      {(Object.keys(langNames) as Lang[]).map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setLang(code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full text-start px-3.5 py-2 text-sm font-semibold cursor-pointer transition-colors ${
                            code === lang
                              ? "bg-[#3B5BDB]/20 text-[#6E8BFF]"
                              : darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-slate-100"
                          }`}
                        >
                          {langNames[code]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                title={tr(darkMode ? "Iftiin" : "Mugdi")}
                className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                title={tr("Dejinta")}
                className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Title */}
          <div className="mt-4">
            <h1 className="font-head font-extrabold text-[38px] sm:text-[42px] leading-[1.12] tracking-tight flex flex-wrap gap-x-2.5">
              {heroWords.map((w, i) => (
                <span
                  key={i}
                  className="hero-shine-text animate-rise inline-block"
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  {w}
                </span>
              ))}
            </h1>
            <div className="mt-2 w-16 h-1 rounded-full bg-[#FFD86B]" />
          </div>

          <p className="mt-3 text-[15.5px] leading-relaxed text-white/75 animate-rise" style={{ animationDelay: "120ms" }}>
            {tr(
              "Su’aalo gaagaaban ayaa kaa caawinaya inaad garatid kulliyadda kugu habboon, adigoo ku saleynaya waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah."
            )}
          </p>

          {/* Info Pills */}
          <div className="mt-5 flex flex-wrap gap-2 animate-rise" style={{ animationDelay: "220ms" }}>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-[13px] font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.08) 100%)",
              }}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{trf("{n} su’aalood", { n: "25-30" })}</span>
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-[13px] font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.08) 100%)",
              }}
            >
              <Clock className="w-4 h-4" />
              <span>{tr("Ku dhawaad 8 daqiiqo")}</span>
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-[13px] font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.08) 100%)",
              }}
            >
              <Trophy className="w-4 h-4" />
              <span>{tr("Saddex kulliyadood")}</span>
            </div>
          </div>

          {/* Faculty Marquee */}
          <div className="mt-4 animate-rise" style={{ animationDelay: "280ms" }}>
            <FacultyMarquee />
          </div>

          {/* Name Field */}
          <div className="mt-3.5 animate-rise" style={{ animationDelay: "340ms" }}>
            <NameField />
          </div>
        </div>
      </div>

      {/* Faculties Horizontal Carousel */}
      <section className="mt-6">
        <div className="px-6 mb-3">
          <AccentTitle label="Kulliyadaha" />
        </div>
        <div className="flex gap-3 overflow-x-auto px-6 pb-1 hide-scrollbar">
          {faculties.map((f, i) => (
            <div
              key={f.id}
              className="w-[156px] shrink-0 rounded-[18px] overflow-hidden shadow-md animate-rise"
              style={{ animationDelay: `${150 + i * 50}ms` }}
            >
              <FacultyBanner faculty={f} height={118} label float floatDelay={i * 220} />
            </div>
          ))}
        </div>
      </section>

      {/* Public Student Reviews */}
      <ReviewsSection onViewAll={onOpenReviews} />

      {/* Privacy Notice */}
      <div className="px-6 mt-5 flex items-start gap-2 text-xs opacity-70">
        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {tr(
            "Magacaaga (ikhtiyaari) waxaa loo isticmaalaa hambalyada oo kaliya. Waxay ku hadhaysaa qalabkaaga, lamana diro waligeed."
          )}
        </p>
      </div>

      {/* Primary CTA */}
      <div className="p-6">
        <ShinyButton label="Bilow" onClick={onStart} />
      </div>

      <Footer />
    </div>
  );
}
