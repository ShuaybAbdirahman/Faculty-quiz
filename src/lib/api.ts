import { backendEnabled, supaHeaders, supabaseUrl } from "./config";
import type { ProDeptData } from "./scoring";
import {
  isValidDeviceId,
  isValidProItemKey,
  normalizeProInfo,
  type ProScope,
  type ServerEntitlementPayload,
} from "./proSecurity";

// ---- Results API ----
export async function submitResult(params: {
  lang: string;
  ids: string[];
  pcts: number[];
}): Promise<boolean> {
  if (!backendEnabled || params.ids.length === 0 || params.ids.length !== params.pcts.length) {
    return false;
  }
  try {
    const top = params.ids.slice(0, 3).map((id, i) => ({
      id,
      pct: Math.min(100, Math.max(0, params.pcts[i])),
    }));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_result`, {
      method: "POST",
      headers: supaHeaders(),
      body: JSON.stringify({ p_lang: params.lang, p_top: top, p_consent: true }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

// ---- Reviews API ----
export interface ReviewItem {
  name?: string | null;
  comment: string;
  rating: number;
  faculty?: string | null;
}

export interface ReviewsData {
  count: number;
  avg: number;
  items: ReviewItem[];
}

export async function fetchReviews(limit = 20): Promise<ReviewsData | null> {
  if (!backendEnabled) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/public_reviews`, {
      method: "POST",
      headers: supaHeaders(),
      body: JSON.stringify({ p_limit: limit }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const m = await res.json();
    const raw = Array.isArray(m?.items) ? m.items : [];
    return {
      count: Number(m?.count ?? 0),
      avg: Number(m?.avg ?? 0),
      items: raw.map((e: Record<string, unknown>) => ({
        name: (e.name as string | null) ?? null,
        comment: String(e.comment ?? ""),
        rating: Number(e.rating ?? 5),
        faculty: (e.faculty as string | null) ?? null,
      })),
    };
  } catch {
    return null;
  }
}

export async function submitReview(params: {
  lang: string;
  rating: number;
  comment: string;
  name?: string;
  faculty?: string;
}): Promise<boolean> {
  if (!backendEnabled || params.rating < 1 || params.rating > 5) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_review`, {
      method: "POST",
      headers: supaHeaders(),
      body: JSON.stringify({
        p_lang: params.lang,
        p_rating: params.rating,
        p_comment: params.comment,
        p_name: params.name && params.name.length > 0 ? params.name : null,
        p_faculty: params.faculty ?? null,
        p_consent: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

// ---- Pro API ----
export class ProApiError extends Error {
  code: string;
  constructor(code: string) {
    super(`ProApiError(${code})`);
    this.code = code;
  }
  get locked(): boolean {
    return this.code === "locked";
  }
}

export interface ProMethod {
  name: string;
  number: string;
  holder: string;
}

export interface ProInfo {
  priceText: string;
  days: number;
  whatsapp: string;
  note: string;
  methods: ProMethod[];
}

async function rpc(fn: string, body: Record<string, unknown>, seconds = 15): Promise<unknown> {
  if (!backendEnabled) throw new ProApiError("offline");
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), seconds * 1000);
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: supaHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const text = await res.text();
    if (res.ok) return text ? JSON.parse(text) : null;
    let code = "error";
    try {
      const m = JSON.parse(text);
      if (m && typeof m === "object" && "message" in m && m.message) {
        code = String(m.message);
      }
    } catch {
      // ignore
    }
    throw new ProApiError(code);
  } catch (e) {
    if (e instanceof ProApiError) throw e;
    throw new ProApiError("offline");
  }
}

export async function fetchProInfo(): Promise<ProInfo> {
  const j = (await rpc("pro_info", {})) as Record<string, unknown>;
  const raw = Array.isArray(j?.methods) ? (j.methods as Record<string, unknown>[]) : [];
  const methods: ProMethod[] = raw
    .map((e) => ({
      name: String(e.name ?? ""),
      number: String(e.number ?? ""),
      holder: String(e.holder ?? ""),
    }))
    .filter((m) => m.name.length > 0 && m.number.length > 0);
  return normalizeProInfo({
    priceText: String(j?.price_text ?? ""),
    days: Number(j?.days ?? 180),
    whatsapp: String(j?.whatsapp ?? "").replace(/[^0-9]/g, ""),
    note: String(j?.note ?? ""),
    methods,
  });
}

function parseServerScope(raw: unknown): ProScope | undefined {
  return raw === "full" || raw === "departments" || raw === "languages" || raw === "none"
    ? raw
    : undefined;
}

function parseServerItems(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw.filter((item): item is string => typeof item === "string" && isValidProItemKey(item));
}

export async function fetchProStatus(deviceId: string): Promise<ServerEntitlementPayload> {
  if (!isValidDeviceId(deviceId)) return { active: false, expiresAt: 0 };
  const j = (await rpc("pro_status", { p_device: deviceId })) as Record<string, unknown>;
  if (j?.active === true && typeof j.expires_at === "string") {
    const expiresAt = Date.parse(j.expires_at) || 0;
    const scope = parseServerScope(j.scope);
    const unlockedItems = parseServerItems(j.unlocked_items);
    const hasServerScopeMetadata = scope !== undefined || unlockedItems !== undefined;
    return {
      active: expiresAt > Date.now(),
      expiresAt,
      scope,
      unlockedItems,
      hasServerScopeMetadata,
    };
  }
  return { active: false, expiresAt: 0 };
}

export async function submitProRequest(params: {
  deviceId: string;
  phone: string;
  method: string;
  txn: string;
  amount?: string;
  name?: string;
}): Promise<void> {
  if (!isValidDeviceId(params.deviceId)) throw new ProApiError("bad_device");
  await rpc("pro_submit_request", {
    p_device: params.deviceId,
    p_phone: params.phone,
    p_method: params.method,
    p_txn: params.txn,
    p_amount: params.amount ?? null,
    p_name: params.name ?? null,
  });
}

export async function redeemProCode(
  deviceId: string,
  code: string
): Promise<{
  ok: boolean;
  expiresMs?: number;
  scope?: ProScope;
  unlockedItems?: string[];
  error?: string;
}> {
  if (!isValidDeviceId(deviceId)) throw new ProApiError("bad_device");
  const j = (await rpc("pro_redeem", { p_device: deviceId, p_code: code })) as Record<
    string,
    unknown
  >;
  if (j?.ok === true) {
    const exp = typeof j.expires_at === "string" ? Date.parse(j.expires_at) || 0 : 0;
    return {
      ok: true,
      expiresMs: exp,
      scope: parseServerScope(j.scope),
      unlockedItems: parseServerItems(j.unlocked_items),
    };
  }
  return { ok: false, error: String(j?.error ?? "invalid_code") };
}

export async function fetchProContent(deviceId: string, facultyId: string): Promise<ProDeptData[]> {
  if (!isValidDeviceId(deviceId)) throw new ProApiError("locked");
  const j = await rpc("pro_content", { p_device: deviceId, p_faculty: facultyId });
  if (!Array.isArray(j)) return [];
  return j as ProDeptData[];
}

export interface RemotePredictRankingRow {
  id: string;
  device_id_short: string;
  scope: "school" | "jus";
  subject_id: string;
  subject_name: string;
  student_name: string;
  score_pct: number;
  correct_count: number;
  total_questions: number;
  elapsed_sec: number;
  submitted_at: number;
}

export async function fetchPredictRankings(
  scope: "school" | "jus",
  subjectId = "all",
  limit = 50
): Promise<RemotePredictRankingRow[]> {
  if (!backendEnabled) return [];
  try {
    const j = await rpc("public_predict_rankings", {
      p_scope: scope,
      p_subject_id: subjectId,
      p_limit: limit,
    });
    if (!Array.isArray(j)) return [];
    return j as RemotePredictRankingRow[];
  } catch {
    return [];
  }
}

export async function submitPredictRanking(params: {
  deviceId: string;
  scope: "school" | "jus";
  subjectId: string;
  subjectName: string;
  studentName: string;
  scorePct: number;
  correctCount: number;
  totalQuestions: number;
  elapsedSec: number;
}): Promise<boolean> {
  if (!backendEnabled || !isValidDeviceId(params.deviceId)) return false;
  try {
    await rpc("submit_predict_ranking", {
      p_device: params.deviceId,
      p_scope: params.scope,
      p_subject_id: params.subjectId,
      p_subject_name: params.subjectName,
      p_student_name: params.studentName,
      p_score_pct: params.scorePct,
      p_correct_count: params.correctCount,
      p_total_questions: params.totalQuestions,
      p_elapsed_sec: params.elapsedSec,
    });
    return true;
  } catch {
    return false;
  }
}

