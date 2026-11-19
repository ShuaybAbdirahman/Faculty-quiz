import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, LocalizedList, LocalizedString } from "../data/quizData";
import { detectInitialLang, tr as trFn, trf as trfFn, tx as txFn, txl as txlFn } from "../lib/i18n";
import { fetchProStatus } from "../lib/api";
import { backendEnabled } from "../lib/config";
import {
  canUseLanguage,
  clearStoredEntitlement,
  getOrCreateSecureDeviceId,
  isEntitlementValidForDevice,
  readStoredEntitlement,
  resolveAllowedLang,
  rotateDeviceId,
  writeStoredEntitlement,
  type ProEntitlement,
} from "../lib/proSecurity";

const NAME_RE = /^[\p{L}][\p{L}\p{M}\s'’-]{1,19}$/u;
const LETTER_RE = /\p{L}/gu;

export function cleanName(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function isValidName(s: string): boolean {
  if (!NAME_RE.test(s)) return false;
  const matches = s.match(LETTER_RE);
  return Boolean(matches && matches.length >= 2);
}

export function firstName(s: string): string {
  const parts = s.trim().split(/\s+/).filter(Boolean);
  return parts[0] ?? "";
}

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => boolean;
  rtl: boolean;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  animationsOn: boolean;
  setAnimationsOn: (v: boolean) => void;
  textScale: number;
  setTextScale: (v: number) => void;
  userName: string;
  setUserName: (v: string) => void;
  proActive: boolean;
  proExpiresAt: number;
  setProUntil: (ms: number) => void;
  refreshPro: () => Promise<boolean>;
  deviceId: string;
  resetDeviceSession: () => void;
  pendingAt: number;
  setPendingAt: (ms: number) => void;
  founderIntroSeen: boolean;
  markFounderIntroSeen: () => void;
  resetAllPrefs: () => void;
  tr: (key: string) => string;
  trf: (key: string, params: Record<string, string | number>) => string;
  tx: (v: LocalizedString | Record<string, string> | undefined) => string;
  txl: (v: LocalizedList | Record<string, string[]> | undefined) => string[];
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState<string>(() => getOrCreateSecureDeviceId(localStorage));
  const [entitlement, setEntitlement] = useState<ProEntitlement | null>(() =>
    readStoredEntitlement(localStorage, getOrCreateSecureDeviceId(localStorage))
  );
  const proActive = isEntitlementValidForDevice(entitlement, deviceId);
  const proExpiresAt = proActive && entitlement ? entitlement.expiresAt : 0;

  const [langState, setLangState] = useState<Lang>(() =>
    resolveAllowedLang(detectInitialLang(), proActive)
  );
  const lang: Lang = resolveAllowedLang(langState, proActive);

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem("dark");
    return saved === null ? true : saved === "true";
  });
  const [animationsOn, setAnimationsOnState] = useState<boolean>(() => {
    const saved = localStorage.getItem("anim");
    return saved === null ? true : saved === "true";
  });
  const [textScale, setTextScaleState] = useState<number>(() => {
    const saved = Number(localStorage.getItem("textScale"));
    return !Number.isNaN(saved) && saved >= 0.85 && saved <= 1.35 ? saved : 1.0;
  });
  const [userName, setUserNameState] = useState<string>(() => {
    const saved = localStorage.getItem("name") || "";
    return isValidName(saved) ? saved : "";
  });
  const [pendingAt, setPendingAtState] = useState<number>(() => {
    return Number(localStorage.getItem("pro_pending") || "0") || 0;
  });
  const [founderIntroSeen, setFounderIntroSeen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const rtl = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.title = trFn(lang, "Hagaha Kulliyadda");
  }, [lang, rtl]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(16 * textScale)}px`;
  }, [textScale]);

  const setLang = useCallback(
    (l: Lang): boolean => {
      if (!canUseLanguage(l, proActive)) {
        setToast(trFn(lang, "Af-Soomaaligu waa bilaash. Fur Pro ($0.10, hal mar) si aad u hesho Ingiriisi iyo Carabi."));
        return false;
      }
      setLangState(l);
      localStorage.setItem("lang", l);
      return true;
    },
    [proActive, lang]
  );

  const setDarkMode = useCallback((v: boolean) => {
    setDarkModeState(v);
    localStorage.setItem("dark", String(v));
  }, []);

  const setAnimationsOn = useCallback((v: boolean) => {
    setAnimationsOnState(v);
    localStorage.setItem("anim", String(v));
  }, []);

  const setTextScale = useCallback((v: number) => {
    const clamped = Math.round(v * 100) / 100;
    setTextScaleState(clamped);
    localStorage.setItem("textScale", String(clamped));
  }, []);

  const setUserName = useCallback((v: string) => {
    setUserNameState(v);
    localStorage.setItem("name", v);
  }, []);

  const setProUntil = useCallback(
    (ms: number) => {
      const saved = writeStoredEntitlement(localStorage, deviceId, ms);
      setEntitlement(saved);
    },
    [deviceId]
  );

  const setPendingAt = useCallback((ms: number) => {
    setPendingAtState(ms);
    if (ms > 0) localStorage.setItem("pro_pending", String(ms));
    else localStorage.removeItem("pro_pending");
  }, []);

  const refreshPro = useCallback(async () => {
    if (!backendEnabled) return false;
    try {
      const exp = await fetchProStatus(deviceId);
      const saved = writeStoredEntitlement(localStorage, deviceId, exp);
      setEntitlement(saved);
      if (saved) setPendingAt(0);
      return saved !== null;
    } catch {
      // On network failure, only keep an already device-bound non-expired entitlement
      const cached = readStoredEntitlement(localStorage, deviceId);
      setEntitlement(cached);
      return cached !== null;
    }
  }, [deviceId, setPendingAt]);

  // Always verify Pro entitlement with Supabase on startup so revoked/other-device unlocks never leak
  useEffect(() => {
    if (!backendEnabled) return;
    refreshPro().catch(() => {});
  }, [refreshPro]);

  // Re-verify when tab regains focus so server revocations take effect promptly
  useEffect(() => {
    if (!backendEnabled) return;
    const onFocus = () => {
      refreshPro().catch(() => {});
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshPro]);

  const resetDeviceSession = useCallback(() => {
    const nextId = rotateDeviceId(localStorage);
    clearStoredEntitlement(localStorage);
    setDeviceId(nextId);
    setEntitlement(null);
    setPendingAt(0);
    setUserName("");
  }, [setPendingAt, setUserName]);

  const markFounderIntroSeen = useCallback(() => {
    setFounderIntroSeen(true);
  }, []);

  const resetAllPrefs = useCallback(() => {
    setDarkMode(true);
    setAnimationsOn(true);
    setTextScale(1.0);
    setUserName("");
  }, [setDarkMode, setAnimationsOn, setTextScale, setUserName]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const tr = useCallback((k: string) => trFn(lang, k), [lang]);
  const trf = useCallback(
    (k: string, params: Record<string, string | number>) => trfFn(lang, k, params),
    [lang]
  );
  const tx = useCallback(
    (v: LocalizedString | Record<string, string> | undefined) => txFn(lang, v),
    [lang]
  );
  const txl = useCallback(
    (v: LocalizedList | Record<string, string[]> | undefined) => txlFn(lang, v),
    [lang]
  );

  const value = useMemo<AppContextValue>(
    () => ({
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
      proActive,
      proExpiresAt,
      setProUntil,
      refreshPro,
      deviceId,
      resetDeviceSession,
      pendingAt,
      setPendingAt,
      founderIntroSeen,
      markFounderIntroSeen,
      resetAllPrefs,
      tr,
      trf,
      tx,
      txl,
      showToast,
    }),
    [
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
      proActive,
      proExpiresAt,
      setProUntil,
      refreshPro,
      deviceId,
      resetDeviceSession,
      pendingAt,
      setPendingAt,
      founderIntroSeen,
      markFounderIntroSeen,
      resetAllPrefs,
      tr,
      trf,
      tx,
      txl,
      showToast,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 max-w-[92vw]"
        >
          <div className="rounded-xl bg-[#10182E]/95 backdrop-blur-md text-white text-sm font-semibold px-4 py-3 shadow-2xl border border-white/15 animate-rise">
            {toast}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
