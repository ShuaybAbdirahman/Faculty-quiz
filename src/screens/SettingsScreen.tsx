import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Copy,
  Globe,
  Info,
  Lock,
  LogOut,
  MessageSquareText,
  Moon,
  Palette,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sun,
  User,
  UserCheck,
} from "lucide-react";
import type { Lang } from "../data/quizData";
import { cleanName, isValidName, useApp } from "../context/AppContext";
import { langNames } from "../lib/i18n";
import { formatShortDeviceId } from "../lib/proSecurity";

const APP_VERSION = "2.0.0";

export function SettingsScreen({
  onBack,
  onOpenFounderIntro,
  onOpenReviews,
  onLangChanged,
  onOpenPaywall,
}: {
  onBack: () => void;
  onOpenFounderIntro: () => void;
  onOpenReviews: () => void;
  onLangChanged: () => void;
  onOpenPaywall: () => void;
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
    proAnyActive,
    proSchoolActive,
    proJusActive,
    proUniversityActive,
    proLanguagesActive,
    proExpiresAt,
    deviceId,
    refreshPro,
    resetDeviceSession,
    resetAllPrefs,
    tr,
    showToast,
  } = useApp();

  const unlockedStageLabels = [
    proSchoolActive ? "School" : null,
    proJusActive ? "Diyaarinta JUS" : null,
    proUniversityActive ? "University" : null,
    proLanguagesActive ? "Luqadaha" : null,
  ].filter(Boolean) as string[];

  const [nameInput, setNameInput] = useState(userName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [checkingPro, setCheckingPro] = useState(false);

  const shortDev = formatShortDeviceId(deviceId);

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

  const handleVerifyPro = async () => {
    setCheckingPro(true);
    try {
      const ok = await refreshPro();
      showToast(ok ? tr("Unlock+ waa la furay!") : tr("Weli lama xaqiijin. Fadlan sug ama la xiriir maamulaha."));
    } finally {
      setCheckingPro(false);
    }
  };

  const handleSwitchStudent = () => {
    resetDeviceSession();
    setNameInput("");
    setNameError(null);
    showToast(tr("Qalabka waa la nadiifiyay, arday cusub ayaa hadda isticmaali kara."));
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
      className={`mt-4 rounded-2xl p-5 border ${
        darkMode
          ? "bg-[#121A30] border-white/10"
          : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-3.5">
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
      <header
        className={`border-b ${
          darkMode ? "border-white/10 bg-[#0B1226]/90" : "border-slate-200 bg-white/90"
        } backdrop-blur-md sticky top-0 z-20`}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="font-head font-bold text-[19px]">{tr("Dejinta")}</h1>
        </div>
      </header>

      <main className="max-w-2xl w-full mx-auto px-4 pb-12">
        {/* Pro & Device Security Card */}
        <Section icon={<ShieldCheck className="w-5 h-5" />} title="Unlock+ iyo Amniga Qalabka">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>{tr("Xaaladda Unlock+:")}</span>
                <span className={proAnyActive ? "text-emerald-400" : "opacity-75"}>
                  {tr(proAnyActive ? "Waa furan yahay" : "Waa xiran yahay")}
                </span>
              </div>
              {unlockedStageLabels.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {unlockedStageLabels.map((lbl) => (
                    <span
                      key={lbl}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/35 text-[11px] font-bold text-emerald-400"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-1 text-xs font-mono opacity-70">Device ID: {shortDev}</div>
              {proExpiresAt > Date.now() && (
                <div className="mt-1 text-xs text-emerald-400 font-semibold tabular-nums">
                  {tr("Dhammaadka:")}{" "}
                  {new Date(proExpiresAt).toLocaleDateString()} (
                  {Math.max(1, Math.ceil((proExpiresAt - Date.now()) / (86400 * 1000)))}{" "}
                  {tr("maalmood")})
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shortDev);
                    showToast(tr("Waa la koobiyeeyay"));
                  } catch {
                    // ignore
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-current/15 hover:bg-current/5 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{tr("Koobi Aqoonsiga")}</span>
              </button>
              <button
                type="button"
                disabled={checkingPro}
                onClick={handleVerifyPro}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#3B5BDB] text-white hover:bg-[#324EC2] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingPro ? "animate-spin" : ""}`} />
                <span>{tr("Hubi")}</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-current/10 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs opacity-70 max-w-sm leading-relaxed">
              {tr(
                "Haddii arday kale uu qalabkan isticmaalayo, riix badhanka si Unlock+ loo xiro oo aqoonsi cusub loo sameeyo."
              )}
            </p>
            <button
              type="button"
              onClick={handleSwitchStudent}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-400/40 text-rose-400 hover:bg-rose-500/10 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{tr("Beddel ardayga")}</span>
            </button>
          </div>
        </Section>
        {/* Language */}
        <Section icon={<Globe className="w-5 h-5" />} title="Luqadda">
          <div className="grid grid-cols-3 rounded-full p-1 border border-current/15 overflow-hidden gap-1">
            {(Object.keys(langNames) as Lang[]).map((code) => {
              const active = code === lang;
              const locked = code !== "so" && !proLanguagesActive;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    const ok = setLang(code);
                    if (ok) onLangChanged();
                    else onOpenPaywall();
                  }}
                  className={`py-2 px-2 rounded-full text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                    active
                      ? "bg-[#3B5BDB] text-white"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <span>{langNames[code]}</span>
                  {locked && <Lock className="w-3 h-3 text-[#FFC93C]" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs opacity-70">
            {tr("Af-Soomaaligu waa bilaash. Ingiriisiga iyo Carabiga waa Unlock+ (Rukun).")}
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
