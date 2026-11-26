import type { ProInfo } from "./api";

export type ProBillingCycle = "weekly" | "monthly" | "yearly";

export interface ProBillingPlan {
  id: ProBillingCycle;
  title: string;
  subtitle: string;
  amount: number;
  priceText: string;
  ussdAmount: string;
  days: number;
  durationLabel: string;
  badge?: string;
  savingsLabel?: string;
}

export const PRO_BILLING_PLANS: Record<ProBillingCycle, ProBillingPlan> = {
  weekly: {
    id: "weekly",
    title: "Todobaadle (Weekly)",
    subtitle: "Ku tijaabi dhammaan qeybaha Pro muddo 7 maalmood ah",
    amount: 0.5,
    priceText: "$0.50",
    ussdAmount: "0.5",
    days: 7,
    durationLabel: "7 Maalmood",
  },
  monthly: {
    id: "monthly",
    title: "Bille (Monthly)",
    subtitle: "Doorashada ugu caansan ardayda · Xirfad, Imtixaan & Jaamacad",
    amount: 1.2,
    priceText: "$1.20",
    ussdAmount: "1.2",
    days: 30,
    durationLabel: "30 Maalmood",
    badge: "Ugu Caansan",
    savingsLabel: "Kaydi 40%",
  },
  yearly: {
    id: "yearly",
    title: "Sanadle (Yearly)",
    subtitle: "Helitaan buuxa sanadka oo dhan (Form 4, JUS & Jaamacad)",
    amount: 5.0,
    priceText: "$5.00",
    ussdAmount: "5",
    days: 365,
    durationLabel: "365 Maalmood",
    badge: "Qiimo Dhimis Weyn",
    savingsLabel: "Kaydi 65%",
  },
};

export function getProBillingPlan(cycle: ProBillingCycle = "monthly"): ProBillingPlan {
  return PRO_BILLING_PLANS[cycle] ?? PRO_BILLING_PLANS.monthly;
}

export function maskPaymentNumber(number: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  const tail = digits.slice(-2) || "••";
  return `••• ••• •${tail}`;
}

export function canRevealPaymentDetails(params: {
  step: number;
  phone: string;
  name: string;
  committed: boolean;
}): boolean {
  if (params.step < 3) return false;
  if (!params.committed) return false;
  if (!validateEvcPhone(params.phone).ok) return false;
  const clean = sanitizeCheckoutName(params.name);
  const letters = clean.match(/\p{L}/gu);
  return Boolean(letters && letters.length >= 2);
}

export const EVC_PAYMENT_CONFIG = {
  methodName: "EVC Plus",
  number: "610999089",
  holder: "Shuceyb Abdirahman",
  whatsapp: "252610999089",
  defaultPrice: "$1.20 · 30 Maalmood",
  ussdAmount: "1.2",
  defaultDays: 30,
} as const;

export const TOTAL_BUNDLE_CONFIG = {
  originalAmount: 1.5,
  discountPct: 20,
  finalAmount: 1.2,
  savedAmount: 0.3,
  originalPrice: "$1.50",
  finalPrice: "$1.20",
  priceText: "$1.20 · 30 Maalmood",
  ussdAmount: "1.2",
  days: 30,
} as const;

export function calculateTotalBundlePricing(
  originalAmount: number = TOTAL_BUNDLE_CONFIG.originalAmount,
  discountPct: number = TOTAL_BUNDLE_CONFIG.discountPct
) {
  const safeOriginal = Math.max(0.5, Number.isFinite(originalAmount) ? originalAmount : 1.5);
  const safePct = Math.min(50, Math.max(0, Number.isFinite(discountPct) ? discountPct : 20));
  const saved = Number(((safeOriginal * safePct) / 100).toFixed(2));
  const final = Number((safeOriginal - saved).toFixed(2));
  const ussdAmount = final % 1 === 0 ? final.toFixed(0) : final.toFixed(1).replace(/\.0$/, "");
  return {
    originalAmount: safeOriginal,
    discountPct: safePct,
    savedAmount: saved,
    finalAmount: final,
    formattedOriginal: `$${safeOriginal.toFixed(2)}`,
    formattedSaved: `$${saved.toFixed(2)}`,
    formattedFinal: `$${final.toFixed(2)}`,
    ussdAmount,
  };
}

export type RukunCycle = "weekly" | "monthly" | "yearly";

export interface RukunPlanMeta {
  id: RukunCycle;
  label: string;
  periodText: string;
  days: number;
  singleAmount: number;
  singleFormatted: string;
  singleUssd: string;
  totalOriginal: string;
  totalAmount: number;
  totalFormatted: string;
  totalSaved: string;
  totalUssd: string;
}

export const RUKUN_PLANS: Record<RukunCycle, RukunPlanMeta> = {
  weekly: {
    id: "weekly",
    label: "Asbuucle",
    periodText: "7 Maalmood",
    days: 7,
    singleAmount: 0.25,
    singleFormatted: "$0.25",
    singleUssd: "0.25",
    totalOriginal: "$0.75",
    totalAmount: 0.6,
    totalFormatted: "$0.60",
    totalSaved: "$0.15",
    totalUssd: "0.6",
  },
  monthly: {
    id: "monthly",
    label: "Bille",
    periodText: "30 Maalmood",
    days: 30,
    singleAmount: 0.5,
    singleFormatted: "$0.50",
    singleUssd: "0.5",
    totalOriginal: "$1.50",
    totalAmount: 1.2,
    totalFormatted: "$1.20",
    totalSaved: "$0.30",
    totalUssd: "1.2",
  },
  yearly: {
    id: "yearly",
    label: "Sanadle",
    periodText: "365 Maalmood",
    days: 365,
    singleAmount: 1.5,
    singleFormatted: "$1.50",
    singleUssd: "1.5",
    totalOriginal: "$4.50",
    totalAmount: 3.6,
    totalFormatted: "$3.60",
    totalSaved: "$0.90",
    totalUssd: "3.6",
  },
};

export function getRukunPricing(cycle: RukunCycle, isTotal: boolean) {
  const meta = RUKUN_PLANS[cycle] ?? RUKUN_PLANS.monthly;
  if (isTotal) {
    return {
      ...meta,
      priceFormatted: meta.totalFormatted,
      originalFormatted: meta.totalOriginal,
      savedFormatted: meta.totalSaved,
      ussdAmount: meta.totalUssd,
      discountPct: 20,
    };
  }
  return {
    ...meta,
    priceFormatted: meta.singleFormatted,
    originalFormatted: meta.singleFormatted,
    savedFormatted: "$0.00",
    ussdAmount: meta.singleUssd,
    discountPct: 0,
  };
}

export const DEVICE_ID_STORAGE_KEY = "hk_device_id_v2";
export const LEGACY_DEVICE_ID_KEY = "device_id";
export const ENTITLEMENT_STORAGE_KEY = "hk_pro_entitlement_v2";
export const LEGACY_PRO_UNTIL_KEY = "pro_until";

export const REQUESTED_SCOPE_STORAGE_KEY = "hk_pro_requested_scope_v2";
export const REQUESTED_ITEM_STORAGE_KEY = "hk_pro_requested_item_v1";

/** Re-verify with Supabase if local cache is older than 5 minutes. */
export const MAX_ENTITLEMENT_STALE_MS = 5 * 60 * 1000;

export type ProScope = "full" | "school" | "jus" | "university" | "departments" | "languages" | "none";
export type ProStageId = "school" | "jus" | "university" | "languages";
export type ProItemKey = `school:${string}` | `bridge:${string}` | `stage:${ProStageId}`;

export interface ProEntitlement {
  deviceId: string;
  expiresAt: number;
  verifiedAt: number;
  scope?: ProScope;
  unlockedItems?: string[];
  sig?: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const WEAK_IDS = new Set(["", "null", "undefined", "default", "web", "guest", "anonymous"]);
const VALID_DEVICE_RE = /^[a-zA-Z0-9_-]{16,64}$/;
const VALID_ITEM_RE = /^(school|bridge|stage):[a-z0-9_]{2,32}$/;

export function isValidProScope(raw: unknown): raw is ProScope {
  return (
    raw === "full" ||
    raw === "school" ||
    raw === "jus" ||
    raw === "university" ||
    raw === "departments" ||
    raw === "languages" ||
    raw === "none"
  );
}

export function isValidProItemKey(key: string | null | undefined): key is ProItemKey {
  return Boolean(key && typeof key === "string" && VALID_ITEM_RE.test(key));
}

export function isValidDeviceId(id: string | null | undefined): id is string {
  if (!id || typeof id !== "string") return false;
  const trimmed = id.trim();
  if (WEAK_IDS.has(trimmed.toLowerCase())) return false;
  return VALID_DEVICE_RE.test(trimmed);
}

export function generateSecureDeviceId(): string {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `hkd_${hex}`;
}

export function getOrCreateSecureDeviceId(storage: StorageLike): string {
  const v2 = storage.getItem(DEVICE_ID_STORAGE_KEY);
  if (isValidDeviceId(v2)) return v2;

  // Migrate valid legacy device_id so existing paying students keep their exact device binding
  const legacy = storage.getItem(LEGACY_DEVICE_ID_KEY);
  if (isValidDeviceId(legacy)) {
    storage.setItem(DEVICE_ID_STORAGE_KEY, legacy);
    return legacy;
  }

  const fresh = generateSecureDeviceId();
  storage.setItem(DEVICE_ID_STORAGE_KEY, fresh);
  storage.setItem(LEGACY_DEVICE_ID_KEY, fresh);
  return fresh;
}

export function rotateDeviceId(storage: StorageLike): string {
  const fresh = generateSecureDeviceId();
  storage.setItem(DEVICE_ID_STORAGE_KEY, fresh);
  storage.setItem(LEGACY_DEVICE_ID_KEY, fresh);
  clearStoredEntitlement(storage);
  return fresh;
}

const MAX_FUTURE_EXPIRY_MS = 735 * 86400 * 1000;
const MAX_CLOCK_SKEW_MS = 60_000;

export function computeEntitlementSignature(ent: Omit<ProEntitlement, "sig">): string {
  const items = [...(ent.unlockedItems ?? [])].sort().join(",");
  const payload = `hiraal_v2|${ent.deviceId}|${ent.expiresAt}|${ent.verifiedAt}|${ent.scope ?? "full"}|${items}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= (ch + i * 31) & 0xff;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, "0")}${h2.toString(16).padStart(8, "0")}`;
}

export function isEntitlementValidForDevice(
  ent: ProEntitlement | null,
  deviceId: string,
  now: number = Date.now(),
  maxStaleMs: number = MAX_ENTITLEMENT_STALE_MS
): boolean {
  if (!ent) return false;
  if (!isValidDeviceId(deviceId)) return false;
  if (ent.deviceId !== deviceId) return false;
  if (!Number.isFinite(ent.expiresAt) || ent.expiresAt <= now) return false;
  if (ent.expiresAt > now + MAX_FUTURE_EXPIRY_MS) return false;
  if (!Number.isFinite(ent.verifiedAt) || ent.verifiedAt <= 0) return false;
  if (ent.verifiedAt > now + MAX_CLOCK_SKEW_MS) return false;
  if (now - ent.verifiedAt > maxStaleMs) return false;
  return true;
}

export function readStoredEntitlement(
  storage: StorageLike,
  deviceId: string,
  now: number = Date.now(),
  maxStaleMs: number = MAX_ENTITLEMENT_STALE_MS
): ProEntitlement | null {
  // Always purge legacy unbound pro_until so stale/shared unlocks can never bypass device binding
  storage.removeItem(LEGACY_PRO_UNTIL_KEY);

  const raw = storage.getItem(ENTITLEMENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ProEntitlement>;
    const rawScope = parsed.scope;
    const scope: ProScope = isValidProScope(rawScope) ? rawScope : "full";
    const unlockedItems = Array.isArray(parsed.unlockedItems)
      ? parsed.unlockedItems.filter((item): item is string => isValidProItemKey(item))
      : [];
    const ent: ProEntitlement = {
      deviceId: String(parsed.deviceId ?? ""),
      expiresAt: Number(parsed.expiresAt ?? 0),
      verifiedAt: Number(parsed.verifiedAt ?? 0),
      scope,
      unlockedItems,
      sig: typeof parsed.sig === "string" ? parsed.sig : undefined,
    };
    const expectedSig = computeEntitlementSignature(ent);
    if (!ent.sig || ent.sig !== expectedSig) {
      storage.removeItem(ENTITLEMENT_STORAGE_KEY);
      return null;
    }
    if (!isEntitlementValidForDevice(ent, deviceId, now, maxStaleMs)) {
      // Do not trust mismatched or expired entitlements
      if (ent.deviceId !== deviceId || ent.expiresAt <= now) {
        storage.removeItem(ENTITLEMENT_STORAGE_KEY);
      }
      return null;
    }
    return ent;
  } catch {
    storage.removeItem(ENTITLEMENT_STORAGE_KEY);
    return null;
  }
}

export function saveRequestedProScope(storage: StorageLike, deviceId: string, scope: ProScope): void {
  if (!isValidDeviceId(deviceId)) return;
  storage.setItem(REQUESTED_SCOPE_STORAGE_KEY, JSON.stringify({ deviceId, scope }));
  storage.removeItem(REQUESTED_ITEM_STORAGE_KEY);
}

export function readRequestedProScope(storage: StorageLike, deviceId: string): ProScope | null {
  const raw = storage.getItem(REQUESTED_SCOPE_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { deviceId?: string; scope?: string };
    if (parsed.deviceId !== deviceId) return null;
    if (isValidProScope(parsed.scope) && parsed.scope !== "none") {
      return parsed.scope;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveRequestedProItem(storage: StorageLike, deviceId: string, itemKey: ProItemKey): void {
  if (!isValidDeviceId(deviceId) || !isValidProItemKey(itemKey)) return;
  storage.setItem(REQUESTED_ITEM_STORAGE_KEY, JSON.stringify({ deviceId, itemKey }));
  storage.removeItem(REQUESTED_SCOPE_STORAGE_KEY);
}

export function readRequestedProItem(storage: StorageLike, deviceId: string): ProItemKey | null {
  const raw = storage.getItem(REQUESTED_ITEM_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { deviceId?: string; itemKey?: string };
    if (parsed.deviceId !== deviceId) return null;
    if (isValidProItemKey(parsed.itemKey)) {
      return parsed.itemKey;
    }
    return null;
  } catch {
    return null;
  }
}

export function mergeProScope(existing: ProScope | null, next: ProScope): ProScope {
  if (!existing || existing === "none") return next;
  if (next === "none") return existing;
  if (existing === "full" || next === "full") return "full";
  if ((existing === "languages" && next === "departments") || (existing === "departments" && next === "languages")) {
    return "full";
  }
  return existing === next ? existing : next;
}

export function hasLanguagesAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  const sc = ent?.scope ?? "full";
  if (sc === "languages" || sc === "full") return true;
  return Boolean(ent?.unlockedItems?.includes("stage:languages"));
}

export function hasSchoolStageAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  const sc = ent?.scope ?? "full";
  if (sc === "school" || sc === "full") return true;
  return Boolean(ent?.unlockedItems?.includes("stage:school"));
}

export function hasJusStageAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  const sc = ent?.scope ?? "full";
  if (sc === "jus" || sc === "full") return true;
  return Boolean(ent?.unlockedItems?.includes("stage:jus"));
}

export function hasUniversityStageAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  const sc = ent?.scope ?? "full";
  if (sc === "university" || sc === "departments" || sc === "full") return true;
  return Boolean(ent?.unlockedItems?.includes("stage:university"));
}

export function hasDepartmentsAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  return hasUniversityStageAccess(ent, deviceId, now);
}

export function hasUnlockedItem(
  ent: ProEntitlement | null,
  deviceId: string,
  itemKey: ProItemKey,
  now: number = Date.now()
): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  if (!isValidProItemKey(itemKey)) return false;
  return Boolean(ent?.unlockedItems?.includes(itemKey));
}

export function hasSchoolSubjectAccess(
  ent: ProEntitlement | null,
  deviceId: string,
  subjectId: string,
  now: number = Date.now()
): boolean {
  if (hasSchoolStageAccess(ent, deviceId, now)) return true;
  return hasUnlockedItem(ent, deviceId, `school:${subjectId}`, now);
}

export function hasBridgeExamAccess(
  ent: ProEntitlement | null,
  deviceId: string,
  examId: string,
  now: number = Date.now()
): boolean {
  if (hasJusStageAccess(ent, deviceId, now)) return true;
  return hasUnlockedItem(ent, deviceId, `bridge:${examId}`, now);
}

export interface ServerEntitlementPayload {
  active: boolean;
  expiresAt: number;
  scope?: ProScope;
  unlockedItems?: string[];
  hasServerScopeMetadata?: boolean;
}

export function writeStoredEntitlement(
  storage: StorageLike,
  deviceId: string,
  expiresAt: number,
  now: number = Date.now(),
  explicitScope?: ProScope,
  explicitItem?: ProItemKey
): ProEntitlement | null {
  storage.removeItem(LEGACY_PRO_UNTIL_KEY);
  if (!isValidDeviceId(deviceId) || !Number.isFinite(expiresAt) || expiresAt <= now) {
    storage.removeItem(ENTITLEMENT_STORAGE_KEY);
    return null;
  }
  const existing = readStoredEntitlement(storage, deviceId, now, Number.MAX_SAFE_INTEGER);
  const requestedScope = readRequestedProScope(storage, deviceId);
  const requestedItem = readRequestedProItem(storage, deviceId);

  const itemToAdd = explicitItem ?? requestedItem;
  const mergedItems = Array.from(
    new Set([...(existing?.unlockedItems ?? []), ...(itemToAdd && isValidProItemKey(itemToAdd) ? [itemToAdd] : [])])
  );

  const resolvedScope: ProScope = explicitScope
    ? mergeProScope(existing?.scope ?? null, explicitScope)
    : requestedScope
    ? mergeProScope(existing?.scope ?? null, requestedScope)
    : itemToAdd
    ? existing?.scope ?? "none"
    : existing?.scope ?? "full";

  const unsignedEnt: Omit<ProEntitlement, "sig"> = {
    deviceId,
    expiresAt: Math.min(expiresAt, now + MAX_FUTURE_EXPIRY_MS),
    verifiedAt: now,
    scope: resolvedScope,
    unlockedItems: mergedItems,
  };
  const ent: ProEntitlement = {
    ...unsignedEnt,
    sig: computeEntitlementSignature(unsignedEnt),
  };
  storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(ent));
  // Consume pending request markers so they cannot be replayed across status refreshes
  storage.removeItem(REQUESTED_SCOPE_STORAGE_KEY);
  storage.removeItem(REQUESTED_ITEM_STORAGE_KEY);
  return ent;
}

export function syncServerEntitlement(
  storage: StorageLike,
  deviceId: string,
  server: ServerEntitlementPayload,
  now: number = Date.now()
): ProEntitlement | null {
  storage.removeItem(LEGACY_PRO_UNTIL_KEY);
  if (!isValidDeviceId(deviceId) || !server.active || !Number.isFinite(server.expiresAt) || server.expiresAt <= now) {
    clearStoredEntitlement(storage);
    return null;
  }

  // Authoritative path: server explicitly returned scope and/or unlockedItems
  if (server.hasServerScopeMetadata) {
    const validItems = Array.from(
      new Set((server.unlockedItems ?? []).filter((item): item is string => isValidProItemKey(item)))
    );
    const resolvedScope: ProScope = isValidProScope(server.scope)
      ? server.scope
      : validItems.length > 0
      ? "none"
      : "departments";

    const unsignedEnt: Omit<ProEntitlement, "sig"> = {
      deviceId,
      expiresAt: Math.min(server.expiresAt, now + MAX_FUTURE_EXPIRY_MS),
      verifiedAt: now,
      scope: resolvedScope,
      unlockedItems: validItems,
    };
    const ent: ProEntitlement = {
      ...unsignedEnt,
      sig: computeEntitlementSignature(unsignedEnt),
    };
    storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(ent));
    storage.removeItem(REQUESTED_SCOPE_STORAGE_KEY);
    storage.removeItem(REQUESTED_ITEM_STORAGE_KEY);
    return ent;
  }

  // Legacy backend fallback (server returned only { active: true, expires_at }):
  // If this device already has a signed entitlement, NEVER let pending local selections escalate it.
  const existing = readStoredEntitlement(storage, deviceId, now, Number.MAX_SAFE_INTEGER);
  if (existing) {
    const unsignedEnt: Omit<ProEntitlement, "sig"> = {
      deviceId,
      expiresAt: Math.min(server.expiresAt, now + MAX_FUTURE_EXPIRY_MS),
      verifiedAt: now,
      scope: existing.scope ?? "departments",
      unlockedItems: existing.unlockedItems ?? [],
    };
    const ent: ProEntitlement = {
      ...unsignedEnt,
      sig: computeEntitlementSignature(unsignedEnt),
    };
    storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(ent));
    storage.removeItem(REQUESTED_SCOPE_STORAGE_KEY);
    storage.removeItem(REQUESTED_ITEM_STORAGE_KEY);
    return ent;
  }

  // First activation on legacy backend: bind strictly to the single submitted request (and consume it)
  return writeStoredEntitlement(storage, deviceId, server.expiresAt, now);
}

export function clearStoredEntitlement(storage: StorageLike): void {
  storage.removeItem(ENTITLEMENT_STORAGE_KEY);
  storage.removeItem(LEGACY_PRO_UNTIL_KEY);
  storage.removeItem(REQUESTED_SCOPE_STORAGE_KEY);
  storage.removeItem(REQUESTED_ITEM_STORAGE_KEY);
}

export function formatShortDeviceId(deviceId: string): string {
  if (!deviceId) return "-";
  const clean = deviceId.replace(/^hkd_/, "");
  if (clean.length <= 10) return clean.toUpperCase();
  return `${clean.slice(0, 5).toUpperCase()}-${clean.slice(-4).toUpperCase()}`;
}

export function normalizeProInfo(raw?: Partial<ProInfo> | null): ProInfo {
  const rawPrice = String(raw?.priceText ?? "").trim();
  const isDefaultTiny =
    rawPrice === "" ||
    rawPrice === "0" ||
    rawPrice === "0.1" ||
    rawPrice === "0.10" ||
    rawPrice === "$0.1" ||
    rawPrice === "$0.10" ||
    rawPrice === "$0.10 · 6 Bilood" ||
    rawPrice === "$0.10 · Abid (Hal mar)" ||
    rawPrice === "0.5" ||
    rawPrice === "0.50" ||
    rawPrice === "$0.5" ||
    rawPrice === "$0.50" ||
    rawPrice.includes("$3");

  const priceText = isDefaultTiny ? EVC_PAYMENT_CONFIG.defaultPrice : rawPrice;
  const days =
    typeof raw?.days === "number" && Number.isFinite(raw.days) && raw.days >= 1 && raw.days <= 730
      ? raw.days
      : EVC_PAYMENT_CONFIG.defaultDays;

  return {
    priceText,
    days,
    whatsapp: EVC_PAYMENT_CONFIG.whatsapp,
    note: String(raw?.note ?? "").trim(),
    methods: [
      {
        name: EVC_PAYMENT_CONFIG.methodName,
        number: EVC_PAYMENT_CONFIG.number,
        holder: EVC_PAYMENT_CONFIG.holder,
      },
    ],
  };
}

/** Somali ("so") is always 100% free; English ("en") and Arabic ("ar") require Pro. */
export function canUseLanguage(lang: "so" | "en" | "ar", proActive: boolean): boolean {
  return lang === "so" || proActive;
}

export function resolveAllowedLang(
  requested: "so" | "en" | "ar",
  proActive: boolean
): "so" | "en" | "ar" {
  return canUseLanguage(requested, proActive) ? requested : "so";
}

export type BlockedProAction = "screenshot" | "print" | "save" | "copy" | "devtools";

export function isBlockedProShortcut(
  e: {
    key?: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  },
  isEditableTarget = false
): BlockedProAction | null {
  const key = (e.key ?? "").toLowerCase();
  const hasMod = Boolean(e.ctrlKey || e.metaKey);

  if (key === "printscreen") return "screenshot";
  if (hasMod && e.shiftKey && (key === "3" || key === "4" || key === "5" || key === "s")) {
    return "screenshot";
  }
  if (hasMod && key === "p") return "print";
  if (hasMod && key === "s") return "save";
  if (key === "f12") return "devtools";
  if (hasMod && e.shiftKey && (key === "i" || key === "j" || key === "c")) return "devtools";
  if (hasMod && key === "u") return "devtools";
  if (!isEditableTarget && hasMod && (key === "c" || key === "x" || key === "a")) {
    return "copy";
  }
  return null;
}

export const PRO_IDLE_LOCK_MS = 120_000;

export function formatWatermarkTimeTag(date: Date = new Date()): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  return `${hh}:${mm} ${dd}/${mo}`;
}

export function buildProWatermarkStamp(deviceId: string, userName?: string, timeTag?: string): string {
  const short = formatShortDeviceId(deviceId);
  const cleanName = (userName ?? "").replace(/\s+/g, " ").trim().slice(0, 22);
  const cleanTime = (timeTag ?? "").replace(/\s+/g, " ").trim().slice(0, 16);
  const parts = ["HIRAAL UNLOCK+"];
  if (cleanName) parts.push(cleanName);
  parts.push(`ID:${short}`);
  if (cleanTime) parts.push(cleanTime);
  return parts.join(" · ");
}

export function isTamperedOverlayStyle(style: {
  display?: string;
  visibility?: string;
  opacity?: string | number;
}): boolean {
  const disp = String(style.display ?? "block").toLowerCase().trim();
  const vis = String(style.visibility ?? "visible").toLowerCase().trim();
  const op = Number(style.opacity ?? 1);
  if (disp === "none" || vis === "hidden" || vis === "collapse") return true;
  if (!Number.isFinite(op) || op < 0.7) return true;
  return false;
}

function escapeSvgText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildProWatermarkTileDataUri(stamp: string): string {
  const safeStamp = escapeSvgText(stamp || "HIRAAL PRO");
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">',
    '<g transform="rotate(-20 260 130)">',
    '<text x="260" y="135" text-anchor="middle" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.4" fill="rgba(100,116,139,0.06)">',
    safeStamp,
    "</text>",
    "</g>",
    "</svg>",
  ].join("");
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRO_PERSONAL_REMINDER = {
  title: "Xasuusin · 1 Qalab = 1 Arday",
  body: "Qeybtan HIRAAL Pro adiga keligaa ayay kuu furan tahay. Ha qaadin screenshot hana la wadaagin dad kale; arday kasta naftiisa ayuu ku furan karaa (Todobaadle $0.50, Bille $1.20 ama Sanadle $5.00).",
} as const;

export const PAYMENT_COOLDOWN_MS = 30_000;
export const REDEEM_LOCKOUT_MS = 15_000;
const PAYMENT_COOLDOWN_KEY = "hk_pay_cooldown_v1";
const REDEEM_FAIL_KEY = "hk_redeem_fail_v1";

export function validateEvcPhone(raw: string): { ok: boolean; normalized: string } {
  const cleaned = raw.replace(/[\s()-]/g, "").replace(/[^0-9+]/g, "");
  const digits = cleaned.replace(/^\+/, "");
  if (!/^[0-9]{7,15}$/.test(digits)) {
    return { ok: false, normalized: cleaned };
  }
  // Reject repeated dummy digits like 0000000 or 1111111
  if (/^(\d)\1{6,}$/.test(digits)) {
    return { ok: false, normalized: cleaned };
  }
  return { ok: true, normalized: cleaned };
}

export function validatePayTimeHHMM(raw: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(raw.trim());
}

export function sanitizeCheckoutName(raw: string): string {
  return raw
    .replace(/[<>`"'\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

export function generateSecureEvcRef(
  deviceId: string,
  hhmm: string,
  phDigits: string,
  tag: string
): string {
  const cleanTime = hhmm.replace(/[^0-9]/g, "").slice(0, 4) || "0000";
  const tail = phDigits.replace(/\D/g, "").slice(-4) || "0000";
  const devSuffix = formatShortDeviceId(deviceId).replace(/[^A-Z0-9]/g, "").slice(-4) || "0000";
  const randByte = new Uint8Array(2);
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(randByte);
  } else {
    randByte[0] = Math.floor(Math.random() * 256);
    randByte[1] = Math.floor(Math.random() * 256);
  }
  const nonce = Array.from(randByte, (b) => b.toString(36).toUpperCase().padStart(2, "0"))
    .join("")
    .slice(0, 3);
  const safeTag = tag.replace(/[^A-Z0-9_]/g, "").slice(0, 10) || "UNLOCK";
  return `EVC-${safeTag}-${cleanTime}-${tail}-${devSuffix}${nonce}`.slice(0, 40);
}

export function getPaymentCooldownRemainingMs(
  storage: StorageLike,
  deviceId: string,
  now: number = Date.now()
): number {
  const raw = storage.getItem(PAYMENT_COOLDOWN_KEY);
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw) as { deviceId?: string; until?: number };
    if (parsed.deviceId !== deviceId || !Number.isFinite(parsed.until)) return 0;
    return Math.max(0, (parsed.until ?? 0) - now);
  } catch {
    return 0;
  }
}

export function recordPaymentAttempt(
  storage: StorageLike,
  deviceId: string,
  now: number = Date.now()
): void {
  if (!isValidDeviceId(deviceId)) return;
  storage.setItem(
    PAYMENT_COOLDOWN_KEY,
    JSON.stringify({ deviceId, until: now + PAYMENT_COOLDOWN_MS })
  );
}

export function getRedeemCooldownRemainingMs(
  storage: StorageLike,
  deviceId: string,
  now: number = Date.now()
): number {
  const raw = storage.getItem(REDEEM_FAIL_KEY);
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw) as { deviceId?: string; count?: number; until?: number };
    if (parsed.deviceId !== deviceId || !Number.isFinite(parsed.until)) return 0;
    return Math.max(0, (parsed.until ?? 0) - now);
  } catch {
    return 0;
  }
}

export function recordRedeemFailure(
  storage: StorageLike,
  deviceId: string,
  now: number = Date.now()
): number {
  if (!isValidDeviceId(deviceId)) return 0;
  let count = 1;
  try {
    const parsed = JSON.parse(storage.getItem(REDEEM_FAIL_KEY) || "{}") as {
      deviceId?: string;
      count?: number;
    };
    if (parsed.deviceId === deviceId && typeof parsed.count === "number") {
      count = parsed.count + 1;
    }
  } catch {
    // ignore
  }
  const until = count >= 3 ? now + REDEEM_LOCKOUT_MS : 0;
  storage.setItem(REDEEM_FAIL_KEY, JSON.stringify({ deviceId, count, until }));
  return until > now ? REDEEM_LOCKOUT_MS : 0;
}

export function clearRedeemFailures(storage: StorageLike): void {
  storage.removeItem(REDEEM_FAIL_KEY);
}

export function buildSafeWhatsappUrl(phone: string, message: string): string {
  const safeDigits = phone.replace(/[^0-9]/g, "").slice(0, 18) || EVC_PAYMENT_CONFIG.whatsapp;
  return `https://wa.me/${safeDigits}?text=${encodeURIComponent(message)}`;
}

export function buildSafeTelUssdUrl(number: string, amount: string): string {
  const safeNum = number.replace(/[^0-9]/g, "").slice(0, 15) || EVC_PAYMENT_CONFIG.number;
  const safeAmt = amount.replace(/[^0-9.]/g, "").slice(0, 8) || EVC_PAYMENT_CONFIG.ussdAmount;
  return `tel:*712*${safeNum}*${safeAmt}%23`;
}
