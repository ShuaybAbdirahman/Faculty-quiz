import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, LocalizedList, LocalizedString } from "../data/quizData";
import { detectInitialLang, tr as trFn, trf as trfFn, tx as txFn, txl as txlFn } from "../lib/i18n";
import { fetchProStatus } from "../lib/api";
import { backendEnabled } from "../lib/config";

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

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem("device_id");
  if (!id || id.length < 16) {
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    id = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem("device_id", id);
  }
  return id;
}

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
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
  setProUntil: (ms: number) => void;
  refreshPro: () => Promise<boolean>;
  deviceId: string;
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
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());
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
  const [proUntilMs, setProUntilMs] = useState<number>(() => {
    return Number(localStorage.getItem("pro_until") || "0") || 0;
  });
  const [pendingAt, setPendingAtState] = useState<number>(() => {
    return Number(localStorage.getItem("pro_pending") || "0") || 0;
  });
  const [founderIntroSeen, setFounderIntroSeen] = useState<boolean>(false);
  const [deviceId] = useState<string>(() => getOrCreateDeviceId());
  const [toast, setToast] = useState<string | null>(null);

  const rtl = lang === "ar";
  const proActive = proUntilMs > Date.now();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.title = trFn(lang, "Hagaha Kulliyadda");
  }, [lang, rtl]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(16 * textScale)}px`;
  }, [textScale]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

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

  const setProUntil = useCallback((ms: number) => {
    setProUntilMs(ms);
    localStorage.setItem("pro_until", String(ms));
  }, []);

  const setPendingAt = useCallback((ms: number) => {
    setPendingAtState(ms);
    localStorage.setItem("pro_pending", String(ms));
  }, []);

  const refreshPro = useCallback(async () => {
    if (!backendEnabled) return proUntilMs > Date.now();
    const exp = await fetchProStatus(deviceId);
    setProUntil(exp);
    return exp > Date.now();
  }, [deviceId, proUntilMs, setProUntil]);

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
    const t = setTimeout(() => setToast(null), 2600);
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
      setProUntil,
      refreshPro,
      deviceId,
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
      setProUntil,
      refreshPro,
      deviceId,
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
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4 max-w-[90vw]">
          <div className="rounded-xl bg-[#1E2538] text-white text-sm font-medium px-4 py-3 shadow-2xl border border-white/15 animate-rise">
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
