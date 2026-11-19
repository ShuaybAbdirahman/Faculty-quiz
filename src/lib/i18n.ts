import { uiTranslations } from "../data/translations";
import type { Lang, LocalizedList, LocalizedString } from "../data/quizData";

export const langNames: Record<Lang, string> = {
  so: "Soomaali",
  en: "English",
  ar: "العربية",
};

export function detectInitialLang(): Lang {
  const saved = localStorage.getItem("lang") as Lang | null;
  if (saved && saved in langNames) return saved;
  const nav = (navigator.language || "so").toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("en")) return "en";
  return "so";
}

export function tr(lang: Lang, key: string): string {
  if (lang === "so") return key;
  const entry = uiTranslations[key];
  if (!entry) return key;
  return entry[lang === "en" ? 0 : 1];
}

export function trf(lang: Lang, key: string, params: Record<string, string | number>): string {
  return tr(lang, key).replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
}

export function tx(lang: Lang, v: LocalizedString | Record<string, string> | undefined): string {
  if (!v) return "";
  return v[lang] ?? v.en ?? v.so ?? "";
}

export function txl(lang: Lang, v: LocalizedList | Record<string, string[]> | undefined): string[] {
  if (!v) return [];
  return v[lang] ?? v.en ?? v.so ?? [];
}

export function plainFacultyName(full: string): string {
  return full.replace(/^(Kulliyadda|Faculty of|كلية)\s+/, "");
}

export function argbToHex(color: number): string {
  return "#" + (color & 0xffffff).toString(16).padStart(6, "0");
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function darkenHex(hex: string, factor = 0.5): string {
  const clean = hex.replace("#", "");
  const r = Math.round(parseInt(clean.slice(0, 2), 16) * (1 - factor));
  const g = Math.round(parseInt(clean.slice(2, 4), 16) * (1 - factor));
  const b = Math.round(parseInt(clean.slice(4, 6), 16) * (1 - factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
