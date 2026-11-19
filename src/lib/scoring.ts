import {
  clusterFaculties,
  clusterOrder,
  faculties,
  items,
  type Faculty,
  type Lang,
  type QuizItem,
} from "../data/quizData";
import { tr, tx } from "./i18n";

export const interestKeys = ["R", "I", "A", "S", "E", "C"] as const;
export const deepKeys = [
  "surg",
  "lab",
  "care",
  "comm",
  "anim",
  "code",
  "build",
  "elec",
  "fly",
  "just",
  "gov",
  "teach",
  "media",
  "acct",
  "mkt",
  "ops",
  "proj",
  "crop",
  "env",
  "teeth",
  "diag",
] as const;
export const aptitudeKeys = ["math", "bio", "lang", "ict", "soc"] as const;
export const conditionKeys = ["blood", "long", "help", "money", "stable", "field"] as const;

export const interestNames: Record<string, string> = {
  R: "Farsamo iyo gacmeed",
  I: "Baadhis iyo sayniska",
  A: "Hal-abuur iyo naqshad",
  S: "Daryeel iyo barasho",
  E: "Hoggaamin iyo ganacsi",
  C: "Nidaam iyo xisaab",
};

export interface FacultyMatch {
  f: Faculty;
  percent: number;
  interest: number;
  aptitude: number;
  conditions: number;
  reasons: string[];
  inPool: boolean;
}

export function minNeeded(planLen: number): number {
  return Math.round(planLen * 0.6);
}

export function ratingFor(it: QuizItem, choice: number): number {
  if (choice < 0) return -1;
  if (it.type === "l" || it.type === "sc") return choice + 1;
  return choice === it.a ? 2 + (it.d ?? 1) : 1;
}

export function screeningIdx(): number[] {
  const out: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === "sc") out.push(i);
  }
  return out;
}

export function clusterScores(r: number[], idx: number[]): Record<string, number> {
  const sc: Record<string, number> = {};
  for (const c of clusterOrder) sc[c] = 0;
  for (const i of idx) {
    const v = r[i];
    if (v > 0 && items[i].ow) {
      const weights = items[i].ow![v - 1];
      if (weights) {
        for (const [c, x] of Object.entries(weights)) {
          sc[c] = (sc[c] ?? 0) + x;
        }
      }
    }
  }
  return sc;
}

function corder(sc: Record<string, number>): string[] {
  return [...clusterOrder].sort((a, b) => {
    const d = (sc[b] ?? 0) - (sc[a] ?? 0);
    return d !== 0 ? d : clusterOrder.indexOf(a) - clusterOrder.indexOf(b);
  });
}

export function focusClusters(r: number[], idx: number[]): string[] {
  const sc = clusterScores(r, idx);
  const o = corder(sc);
  if ((sc[o[0]] ?? 0) <= 0) return [];
  const R = [o[0]];
  if (
    clusterFaculties[o[0]].length < 3 ||
    ((sc[o[1]] ?? 0) > 0 && (sc[o[0]] ?? 0) - (sc[o[1]] ?? 0) <= 1)
  ) {
    R.push(o[1]);
  }
  return R;
}

export function buildPlan(r: number[]): number[] {
  const sc = screeningIdx();
  const f3 = sc.slice(0, 3);
  const s3 = clusterScores(r, f3);
  const o = corder(s3);
  const amb = (s3[o[0]] ?? 0) <= 0 || (s3[o[0]] ?? 0) - (s3[o[1]] ?? 0) <= 1;
  const idx = amb && sc.length > 3 ? [...f3, sc[3]] : f3;
  const R = focusClusters(r, idx);
  const plan = [...idx];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.type === "sc") continue;
    const c = it.c;
    if (R.length === 0) {
      if (it.deep !== true) plan.push(i);
    } else if (it.deep === true) {
      if (c && c.some((x) => R.includes(x))) plan.push(i);
    } else if (!c || (R.length > 1 ? R.every((x) => c.includes(x)) : c.includes(R[0]))) {
      plan.push(i);
    }
  }
  return plan;
}

export function poolIds(r: number[]): string[] {
  const R = focusClusters(r, screeningIdx());
  if (R.length === 0) return faculties.map((f) => f.id);
  const set: string[] = [];
  for (const c of R) {
    for (const id of clusterFaculties[c]) {
      if (!set.includes(id)) set.push(id);
    }
  }
  return set;
}

function rawTraits(r: number[]): Record<string, number> {
  const sum: Record<string, number> = {};
  const cnt: Record<string, number> = {};
  for (let i = 0; i < items.length; i++) {
    if (r[i] <= 0 || items[i].type === "sc") continue;
    const k = items[i].k;
    if (!k) continue;
    sum[k] = (sum[k] ?? 0) + r[i];
    cnt[k] = (cnt[k] ?? 0) + 1;
  }
  const out: Record<string, number> = {};
  for (const k of Object.keys(sum)) {
    out[k] = sum[k] / cnt[k];
  }
  return out;
}

export function interestProfile(r: number[], lang: Lang): string[] {
  const raw = rawTraits(r);
  const ks = [...interestKeys]
    .filter((k) => k in raw)
    .sort((a, b) => raw[b] - raw[a]);
  return ks.slice(0, 3).map((k) => `${tr(lang, interestNames[k])} (${k})`);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function computeMatches(r: number[], lang: Lang): FacultyMatch[] {
  const raw = rawTraits(r);
  const pool = poolIds(r);

  const meanOf = (ks: readonly string[], d: number): number => {
    const vals = ks.filter((k) => k in raw).map((k) => raw[k]);
    return vals.length === 0 ? d : vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const mean = meanOf(interestKeys, 3.0);
  const meanD = meanOf(deepKeys, 3.0);
  const interestSet = new Set<string>(interestKeys);
  const deepSet = new Set<string>(deepKeys);

  const u = (k: string): number => {
    const v = raw[k];
    const abs = (v - 1) / 4;
    if (interestSet.has(k)) return 0.5 * abs + 0.5 * clamp(0.5 + (v - mean) / 4, 0, 1);
    if (deepSet.has(k)) return 0.5 * abs + 0.5 * clamp(0.5 + (v - meanD) / 4, 0, 1);
    return abs;
  };

  const keys = Object.keys(raw);
  const xs = keys.map((k) => u(k));
  const mx = xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
  const allInterest: string[] = [...interestKeys, ...deepKeys];

  const out: FacultyMatch[] = [];
  for (const f of faculties) {
    if (!pool.includes(f.id)) {
      out.push({ f, percent: 0, interest: 0, aptitude: 0, conditions: 0, reasons: [], inPool: false });
      continue;
    }
    const p = f.p;
    const w = (k: string): number => p[k] ?? 0;

    const fit = (ks: readonly string[]): number | null => {
      let a = 0;
      let b = 0;
      for (const k of ks) {
        if (w(k) <= 0 || !(k in raw)) continue;
        a += w(k) * u(k);
        b += w(k);
      }
      return b === 0 ? null : a / b;
    };

    const gi = fit(allInterest);
    const ga = fit(aptitudeKeys);
    const gc = fit(conditionKeys);

    const parts: [number, number][] = [];
    if (gi !== null) parts.push([gi, 0.45]);
    if (ga !== null) parts.push([ga, 0.35]);
    if (gc !== null) parts.push([gc, 0.2]);

    const ws = parts.reduce((s, x) => s + x[1], 0);
    let t = parts.length === 0 ? 0 : parts.reduce((s, x) => s + x[0] * x[1], 0) / ws;

    const ys = keys.map((k) => w(k) / 3);
    const my = ys.length === 0 ? 0 : ys.reduce((a, b) => a + b, 0) / ys.length;
    let dot = 0;
    let nu = 0;
    let np = 0;
    for (let i = 0; i < xs.length; i++) {
      const a = xs[i] - mx;
      const b = ys[i] - my;
      dot += a * b;
      nu += a * a;
      np += b * b;
    }
    const corr = nu > 1e-9 && np > 1e-9 ? (dot / Math.sqrt(nu * np) + 1) / 2 : 0.5;
    t = 0.75 * t + 0.25 * corr;

    if (ga !== null) {
      const dem = Math.max(0, ...aptitudeKeys.map(w)) / 3;
      t *= 1 - dem * Math.max(0, 0.6 - ga) * 0.8;
    }
    if (w("blood") >= 2 && (raw["blood"] ?? 5) <= 2) t *= 0.7;
    if (w("long") >= 3 && (raw["long"] ?? 5) <= 2) t *= 0.85;

    const why: { score: number; text: string }[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type !== "l" || r[i] < 4) continue;
      const k = items[i].k;
      if (!k) continue;
      const wt = w(k);
      if (wt < 2) continue;
      why.push({ score: wt * r[i], text: `${tx(lang, items[i].t)}: ${r[i]}/5` });
    }
    why.sort((x, y) => y.score - x.score);

    out.push({
      f,
      percent: Math.round(t * 100),
      interest: Math.round((gi ?? 0) * 100),
      aptitude: Math.round((ga ?? 0) * 100),
      conditions: Math.round((gc ?? 0) * 100),
      reasons: why.slice(0, 3).map((e) => e.text),
      inPool: true,
    });
  }

  out.sort((x, y) => {
    if (x.inPool !== y.inPool) return x.inPool ? -1 : 1;
    return y.percent - x.percent;
  });
  return out;
}

// ---- Pro Department Scoring (from lib/pro_guide.dart) ----
export interface ProDeptData {
  name: string;
  d: Record<string, string>;
  jobs: Record<string, string[]>;
  p: Record<string, number>;
}

export interface DeptScore {
  d: ProDeptData;
  pct: number;
  why: string[];
}

export function traitsFrom(ratings: number[], extra: Record<number, number>): Record<string, number> {
  const sum: Record<string, number> = {};
  const cnt: Record<string, number> = {};
  const add = (i: number, v: number) => {
    if (v <= 0 || !items[i] || items[i].type === "sc") return;
    const k = items[i].k;
    if (!k) return;
    sum[k] = (sum[k] ?? 0) + v;
    cnt[k] = (cnt[k] ?? 0) + 1;
  };
  for (let i = 0; i < items.length && i < ratings.length; i++) {
    add(i, ratings[i]);
  }
  for (const [idxStr, val] of Object.entries(extra)) {
    add(Number(idxStr), val);
  }
  const out: Record<string, number> = {};
  for (const k of Object.keys(sum)) {
    out[k] = sum[k] / cnt[k];
  }
  return out;
}

export function rankDepts(depts: ProDeptData[], raw: Record<string, number>): DeptScore[] {
  const out: DeptScore[] = [];
  for (const d of depts) {
    const p = d.p || {};
    let acc = 0;
    let ws = 0;
    let tot = 0;
    let pen = 0;
    const contrib: { score: number; k: string }[] = [];
    for (const [k, wv] of Object.entries(p)) {
      const w = Number(wv);
      tot += w;
      const v = raw[k];
      if (v === undefined) continue;
      const u = (v - 1) / 4;
      acc += w * u;
      ws += w;
      if (w >= 3 && v <= 2) pen++;
      if (u >= 0.6) contrib.push({ score: w * u, k });
    }
    let fit = ws === 0 ? 0.5 : acc / ws;
    fit *= Math.max(0.7, 1 - 0.06 * pen);
    const cov = tot === 0 ? 0 : ws / tot;
    fit = 0.5 + (fit - 0.5) * (0.4 + 0.6 * Math.min(1, cov / 0.7));
    contrib.sort((a, b) => b.score - a.score);
    const pct = Math.min(98, Math.max(20, Math.round(fit * 100)));
    out.push({ d, pct, why: contrib.slice(0, 3).map((e) => e.k) });
  }
  out.sort((a, b) => b.pct - a.pct);
  return out;
}

export function refineItems(depts: ProDeptData[], ratings: number[]): number[] {
  const ds = depts.map((d) => d.p || {});
  const keys = new Set<string>();
  for (const p of ds) {
    for (const k of Object.keys(p)) keys.add(k);
  }
  const spread: Record<string, number> = {};
  for (const k of keys) {
    const ws = ds.map((p) => Number(p[k] ?? 0));
    spread[k] = Math.max(...ws) - Math.min(...ws);
  }
  const cand: { sp: number; idx: number }[] = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.type !== "l" || !it.k) continue;
    if (i < ratings.length && ratings[i] > 0) continue;
    const sp = spread[it.k] ?? 0;
    if (sp < 2) continue;
    cand.push({ sp, idx: i });
  }
  cand.sort((a, b) => b.sp - a.sp);
  const seen = new Set<string>();
  const out: number[] = [];
  for (const e of cand) {
    const k = items[e.idx].k!;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(e.idx);
    }
    if (out.length === 6) break;
  }
  return out;
}
