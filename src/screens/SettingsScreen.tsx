import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Globe,
  Info,
  Lock,
  MessageSquareText,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  User,
  UserCheck,
} from "lucide-react";
import type { Lang } from "../data/quizData";
import { cleanName, isValidName, useApp } from "../context/AppContext";
import { langNames } from "../lib/i18n";

const APP_VERSION = "1.0.0";

export function SettingsScreen({
  onBack,
  onOpenFounderIntro,
  onOpenReviews,
  onLangChanged,
}: {
  onBack: () => void;
  onOpenFounderIntro: () => void;
  onOpenReviews: () => void;
  onLangChanged: () => void;
}) {
  const {
    lang,
    setLang,
    rtl,
    darkMode,
    setDarkMode,
    animationsOn,
    setAnimationsOn,
    textScale,
    setTextScale,
    userName,
    setUserName,
    resetAllPrefs,
    tr,
    showToast,
  } = useApp();

  const [nameInput, setNameInput] = useState(userName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleSaveName = () => {
    const cleaned = cleanName(nameInput);
    if (!cleaned) {
      setUserName("");
      setNameError(null);
      return;
    }
    if (!isValidName(cleaned)) {
      setNameError(
        tr("Magaca waa inuu ahaadaa ugu yaraan 2 xaraf, xarfo kaliya (tiro iyo calaamado lama oggola).")
      );
      return;
    }
    setUserName(cleaned);
    setNameError(null);
    showToast(tr("Magaca waa la keydiyay."));
  };

  const handleClearName = () => {
    setNameInput("");
    setUserName("");
    setNameError(null);
  };

  const Section = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <section
      className={`mt-3 rounded-[20px] p-4 border ${
        darkMode
          ? "bg-[#151D33]/90 border-white/10"
          : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[#5D7BFF]">{icon}</span>
        <h2 className="font-head font-bold text-[16px]">{tr(title)}</h2>
      </div>
      {children}
    </section>
  );

  const Tile = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2.5 flex items-center justify-between gap-3 text-start hover:opacity-80 cursor-pointer"
    >
      <span className="flex items-center gap-3 text-[15px]">
        <span className="opacity-75">{icon}</span>
        <span>{tr(label)}</span>
      </span>
      <ChevronRight className={`w-5 h-5 opacity-55 ${rtl ? "rotate-180" : ""}`} />
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
        <h1 className="font-head font-bold text-[19px]">{tr("Dejinta")}</h1>
      </header>

      <main className="px-4 pb-10">
        {/* Language */}
        <Section icon={<Globe className="w-5 h-5" />} title="Luqadda">
          <div className="grid grid-cols-3 rounded-full p-1 border border-current/15 overflow-hidden">
            {(Object.keys(langNames) as Lang[]).map((code) => {
              const active = code === lang;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLang(code);
                    onLangChanged();
                  }}
                  className={`py-2 px-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                    active
                      ? "bg-[#3B5BDB] text-white"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {langNames[code]}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs opacity-65">
            {tr("Beddelka luqadda wuxuu ku celinayaa bogga hore.")}
          </p>
        </Section>

        {/* Appearance */}
        <Section icon={<Palette className="w-5 h-5" />} title="Muuqaalka">
          <div className="grid grid-cols-2 rounded-full p-1 border border-current/15 overflow-hidden">
            <button
              type="button"
              onClick={() => setDarkMode(false)}
              className={`py-2 px-3 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                !darkMode ? "bg-[#3B5BDB] text-white" : "opacity-80"
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{tr("Iftiin")}</span>
            </button>
            <button
              type="button"
              onClick={() => setDarkMode(true)}
              className={`py-2 px-3 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                darkMode ? "bg-[#3B5BDB] text-white" : "opacity-80"
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{tr("Mugdi")}</span>
            </button>
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-[15px]">{tr("Dhaqdhaqaaqyada (animation)")}</span>
            <input
              type="checkbox"
              checked={animationsOn}
              onChange={(e) => setAnimationsOn(e.target.checked)}
              className="w-5 h-5 accent-[#3B5BDB] cursor-pointer"
            />
          </label>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[15px]">
              <span>{tr("Cabbirka qoraalka")}</span>
              <span className="text-xs opacity-70">{Math.round(textScale * 100)}%</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm font-semibold">A</span>
              <input
                type="range"
                min={0.9}
                max={1.3}
                step={0.1}
                value={textScale}
                onChange={(e) => setTextScale(Number(e.target.value))}
                className="flex-1 accent-[#3B5BDB] cursor-pointer"
              />
              <span className="text-2xl font-semibold">A</span>
            </div>
          </div>
        </Section>

        {/* Name */}
        <Section icon={<User className="w-5 h-5" />} title="Magacaaga">
          <input
            type="text"
            value={nameInput}
            maxLength={20}
            onChange={(e) => {
              const filtered = e.target.value.replace(/[^\p{L}\p{M}\s'’-]/gu, "").slice(0, 20);
              setNameInput(filtered);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
            }}
            placeholder={tr("Magacaaga (ikhtiyaari)")}
            className={`w-full rounded-[14px] px-3.5 py-3 text-sm border outline-none focus:border-[#5D7BFF] ${
              darkMode
                ? "bg-[#0E1424] border-white/15 text-white placeholder:text-white/40"
                : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
            }`}
          />
          {nameError && <p className="mt-1.5 text-xs text-red-400">{nameError}</p>}
          <div className="mt-2.5 flex gap-2.5">
            <button
              type="button"
              onClick={handleSaveName}
              className="flex-1 py-2.5 rounded-full bg-[#3B5BDB] hover:bg-[#324EC2] text-white font-semibold text-sm cursor-pointer"
            >
              {tr("Keydi")}
            </button>
            <button
              type="button"
              onClick={handleClearName}
              className={`px-4 py-2.5 rounded-full border font-semibold text-sm cursor-pointer ${
                darkMode
                  ? "border-white/20 text-white/90 hover:bg-white/10"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tr("Tirtir magacayga")}
            </button>
          </div>
        </Section>

        {/* About */}
        <Section icon={<Info className="w-5 h-5" />} title="Ku saabsan">
          <div className="divide-y divide-current/10">
            <Tile
              icon={<UserCheck className="w-5 h-5" />}
              label="Fariinta aasaasaha"
              onClick={onOpenFounderIntro}
            />
            <Tile
              icon={<MessageSquareText className="w-5 h-5" />}
              label="Fikirrada ardayda"
              onClick={onOpenReviews}
            />
            <Tile
              icon={<Lock className="w-5 h-5" />}
              label="Xog-ilaalinta"
              onClick={() => setPrivacyOpen(true)}
            />
            <Tile
              icon={<RotateCcw className="w-5 h-5" />}
              label="Dib u deji dejinta"
              onClick={() => {
                resetAllPrefs();
                setNameInput("");
                setNameError(null);
                showToast(tr("Dejinta waa la dib u dejiyay."));
              }}
            />
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs opacity-65">
            <span>{tr("Nooca app-ka")}</span>
            <span>{APP_VERSION}</span>
          </div>
        </Section>
      </main>

      {/* Privacy Dialog */}
      {privacyOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5"
          onClick={() => setPrivacyOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-md w-full rounded-[24px] p-6 shadow-2xl border ${
              darkMode
                ? "bg-[#151D33] border-white/15 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h3 className="font-head font-bold text-xl">{tr("Xog-ilaalinta")}</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-85">
              {tr(
                "Magacaaga (ikhtiyaari) wuxuu ku hadhaa qalabkaaga oo kaliya, lamana diro waligeed. Natiijadaada waxaa la diiwaangelin karaa magac la’aan, kaliya haddii aad oggolaato. Fikirkaaga waxaa la muujin karaa kaliya marka aad oggolaato oo la ansixiyo (magaca koowaad ee ikhtiyaariga ah kaliya). Dejinta (luqadda, mugdiga, cabbirka qoraalka) waxay ku xusuusan tahay qalabkaaga."
              )}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="px-4 py-2 rounded-xl font-bold text-sm text-[#5D7BFF] hover:bg-[#5D7BFF]/10 cursor-pointer"
              >
                {tr("Xidh")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
