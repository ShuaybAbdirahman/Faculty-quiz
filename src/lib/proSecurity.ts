import type { ProInfo } from "./api";

export const EVC_PAYMENT_CONFIG = {
  methodName: "EVC Plus",
  number: "610999089",
  holder: "Shuceyb Abdirahman",
  whatsapp: "252610999089",
  defaultPrice: "$0.10 · Abid (Hal mar)",
  ussdAmount: "0.1",
  defaultDays: 3650,
} as const;

export const DEVICE_ID_STORAGE_KEY = "hk_device_id_v2";
export const LEGACY_DEVICE_ID_KEY = "device_id";
export const ENTITLEMENT_STORAGE_KEY = "hk_pro_entitlement_v2";
export const LEGACY_PRO_UNTIL_KEY = "pro_until";

export const REQUESTED_SCOPE_STORAGE_KEY = "hk_pro_requested_scope_v2";
export const REQUESTED_ITEM_STORAGE_KEY = "hk_pro_requested_item_v1";

/** Re-verify with Supabase if local cache is older than 15 minutes. */
export const MAX_ENTITLEMENT_STALE_MS = 15 * 60 * 1000;

export type ProScope = "full" | "departments" | "languages" | "none";
export type ProItemKey = `school:${string}` | `bridge:${string}`;

export interface ProEntitlement {
  deviceId: string;
  expiresAt: number;
  verifiedAt: number;
  scope?: ProScope;
  unlockedItems?: string[];
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const WEAK_IDS = new Set(["", "null", "undefined", "default", "web", "guest", "anonymous"]);
const VALID_DEVICE_RE = /^[a-zA-Z0-9_-]{16,64}$/;
const VALID_ITEM_RE = /^(school|bridge):[a-z0-9_]{2,32}$/;

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
  if (!Number.isFinite(ent.verifiedAt) || ent.verifiedAt <= 0) return false;
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
    const scope: ProScope =
      rawScope === "languages" || rawScope === "departments" || rawScope === "full" || rawScope === "none"
        ? rawScope
        : "full";
    const unlockedItems = Array.isArray(parsed.unlockedItems)
      ? parsed.unlockedItems.filter((item): item is string => isValidProItemKey(item))
      : [];
    const ent: ProEntitlement = {
      deviceId: String(parsed.deviceId ?? ""),
      expiresAt: Number(parsed.expiresAt ?? 0),
      verifiedAt: Number(parsed.verifiedAt ?? 0),
      scope,
      unlockedItems,
    };
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
    if (parsed.scope === "languages" || parsed.scope === "departments" || parsed.scope === "full") {
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
  if (existing !== next) return "full";
  return existing;
}

export function hasLanguagesAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  const sc = ent?.scope ?? "full";
  return sc === "languages" || sc === "full";
}

export function hasDepartmentsAccess(ent: ProEntitlement | null, deviceId: string, now: number = Date.now()): boolean {
  if (!isEntitlementValidForDevice(ent, deviceId, now)) return false;
  const sc = ent?.scope ?? "full";
  return sc === "departments" || sc === "full";
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
  return hasUnlockedItem(ent, deviceId, `school:${subjectId}`, now);
}

export function hasBridgeExamAccess(
  ent: ProEntitlement | null,
  deviceId: string,
  examId: string,
  now: number = Date.now()
): boolean {
  return hasUnlockedItem(ent, deviceId, `bridge:${examId}`, now);
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

  const ent: ProEntitlement = {
    deviceId,
    expiresAt,
    verifiedAt: now,
    scope: resolvedScope,
    unlockedItems: mergedItems,
  };
  storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(ent));
  return ent;
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
    rawPrice.includes("$3");

  const priceText = isDefaultTiny ? EVC_PAYMENT_CONFIG.defaultPrice : rawPrice;
  const days =
    typeof raw?.days === "number" && Number.isFinite(raw.days) && raw.days >= 365
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
