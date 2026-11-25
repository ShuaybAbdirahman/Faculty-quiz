import { formatShortDeviceId, type StorageLike } from "./proSecurity";

export type PredictRankingScope = "school" | "jus";

export interface PredictRankingEntry {
  id: string;
  scope: PredictRankingScope;
  subjectId: string;
  subjectName: string;
  studentName: string;
  deviceIdShort: string;
  scorePct: number;
  correctCount: number;
  totalQuestions: number;
  elapsedSec: number;
  submittedAt: number;
  isSelf?: boolean;
}

export interface RankedPredictEntry extends PredictRankingEntry {
  rank: number;
}

export const PREDICT_RANKING_STORAGE_KEY = "hiraal_predict_rankings_v1";

export function sanitizeStudentDisplayName(raw: string): string {
  const cleaned = String(raw ?? "")
    .replace(/[<>`"'\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 36);
  return cleaned || "Arday";
}

export function formatDurationClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

export function sortPredictRankingEntries(
  entries: PredictRankingEntry[]
): RankedPredictEntry[] {
  const sorted = [...entries].sort((a, b) => {
    if (b.scorePct !== a.scorePct) return b.scorePct - a.scorePct;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    if (a.elapsedSec !== b.elapsedSec) return a.elapsedSec - b.elapsedSec;
    return a.submittedAt - b.submittedAt;
  });

  return sorted.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

export function filterRankingBySubject(
  entries: PredictRankingEntry[],
  subjectId: string
): RankedPredictEntry[] {
  const filtered =
    subjectId === "all" ? entries : entries.filter((item) => item.subjectId === subjectId);
  return sortPredictRankingEntries(filtered);
}

export function readLocalPredictRankings(
  storage: StorageLike,
  scope: PredictRankingScope,
  selfDeviceId?: string
): PredictRankingEntry[] {
  const raw = storage.getItem(PREDICT_RANKING_STORAGE_KEY);
  if (!raw) return [];
  const selfShort = selfDeviceId ? formatShortDeviceId(selfDeviceId) : "";
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is PredictRankingEntry => {
        if (!item || typeof item !== "object") return false;
        const r = item as Record<string, unknown>;
        return (
          r.scope === scope &&
          typeof r.subjectId === "string" &&
          typeof r.studentName === "string" &&
          typeof r.scorePct === "number" &&
          Number.isFinite(r.scorePct)
        );
      })
      .map((item) => ({
        ...item,
        studentName: sanitizeStudentDisplayName(item.studentName),
        scorePct: Math.min(100, Math.max(0, Math.round(item.scorePct))),
        correctCount: Math.max(0, Math.round(item.correctCount ?? 0)),
        totalQuestions: Math.max(1, Math.round(item.totalQuestions ?? 1)),
        elapsedSec: Math.max(0, Math.round(item.elapsedSec ?? 0)),
        isSelf: Boolean(selfShort && item.deviceIdShort === selfShort),
      }));
  } catch {
    return [];
  }
}

export function saveLocalPredictScore(
  storage: StorageLike,
  input: {
    scope: PredictRankingScope;
    subjectId: string;
    subjectName: string;
    studentName: string;
    deviceId: string;
    scorePct: number;
    correctCount: number;
    totalQuestions: number;
    elapsedSec: number;
    submittedAt?: number;
  }
): PredictRankingEntry {
  const now = input.submittedAt ?? Date.now();
  const deviceIdShort = formatShortDeviceId(input.deviceId);
  const entry: PredictRankingEntry = {
    id: `pr_${input.scope}_${input.subjectId}_${now}_${Math.random().toString(36).slice(2, 6)}`,
    scope: input.scope,
    subjectId: input.subjectId,
    subjectName: input.subjectName.trim(),
    studentName: sanitizeStudentDisplayName(input.studentName),
    deviceIdShort,
    scorePct: Math.min(100, Math.max(0, Math.round(input.scorePct))),
    correctCount: Math.max(0, Math.round(input.correctCount)),
    totalQuestions: Math.max(1, Math.round(input.totalQuestions)),
    elapsedSec: Math.max(0, Math.round(input.elapsedSec)),
    submittedAt: now,
    isSelf: true,
  };

  let all: PredictRankingEntry[] = [];
  try {
    const raw = storage.getItem(PREDICT_RANKING_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) all = parsed;
  } catch {
    all = [];
  }

  const next = [entry, ...all].slice(0, 200);
  storage.setItem(PREDICT_RANKING_STORAGE_KEY, JSON.stringify(next));
  return entry;
}

export function mergePredictRankings(
  remote: PredictRankingEntry[],
  local: PredictRankingEntry[],
  selfDeviceId?: string
): PredictRankingEntry[] {
  const selfShort = selfDeviceId ? formatShortDeviceId(selfDeviceId) : "";
  const seen = new Set<string>();
  const merged: PredictRankingEntry[] = [];

  for (const item of [...remote, ...local]) {
    const key = `${item.scope}|${item.subjectId}|${item.deviceIdShort}|${item.scorePct}|${item.correctCount}|${item.elapsedSec}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({
      ...item,
      studentName: sanitizeStudentDisplayName(item.studentName),
      isSelf: Boolean(selfShort && item.deviceIdShort === selfShort),
    });
  }

  return merged;
}
