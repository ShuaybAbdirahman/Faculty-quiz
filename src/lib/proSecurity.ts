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

/** Re-verify with Supabase if local cache is older than 15 minutes. */
export const MAX_ENTITLEMENT_STALE_MS = 15 * 60 * 1000;

export interface ProEntitlement {
  deviceId: string;
  expiresAt: number;
  verifiedAt: number;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const WEAK_IDS = new Set(["", "null", "undefined", "default", "web", "guest", "anonymous"]);
const VALID_DEVICE_RE = /^[a-zA-Z0-9_-]{16,64}$/;

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
    const ent: ProEntitlement = {
      deviceId: String(parsed.deviceId ?? ""),
      expiresAt: Number(parsed.expiresAt ?? 0),
      verifiedAt: Number(parsed.verifiedAt ?? 0),
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

export function writeStoredEntitlement(
  storage: StorageLike,
  deviceId: string,
  expiresAt: number,
  now: number = Date.now()
): ProEntitlement | null {
  storage.removeItem(LEGACY_PRO_UNTIL_KEY);
  if (!isValidDeviceId(deviceId) || !Number.isFinite(expiresAt) || expiresAt <= now) {
    storage.removeItem(ENTITLEMENT_STORAGE_KEY);
    return null;
  }
  const ent: ProEntitlement = {
    deviceId,
    expiresAt,
    verifiedAt: now,
  };
  storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(ent));
  return ent;
}

export function clearStoredEntitlement(storage: StorageLike): void {
  storage.removeItem(ENTITLEMENT_STORAGE_KEY);
  storage.removeItem(LEGACY_PRO_UNTIL_KEY);
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
