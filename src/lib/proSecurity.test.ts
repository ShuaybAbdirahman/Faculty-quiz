import test from "node:test";
import assert from "node:assert/strict";
import {
  clearStoredEntitlement,
  EVC_PAYMENT_CONFIG,
  formatShortDeviceId,
  generateSecureDeviceId,
  getOrCreateSecureDeviceId,
  isEntitlementValidForDevice,
  isValidDeviceId,
  LEGACY_PRO_UNTIL_KEY,
  normalizeProInfo,
  readStoredEntitlement,
  rotateDeviceId,
  writeStoredEntitlement,
  type StorageLike,
} from "./proSecurity";

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

test("generateSecureDeviceId creates unique valid IDs and rejects weak IDs", () => {
  const id1 = generateSecureDeviceId();
  const id2 = generateSecureDeviceId();
  assert.notEqual(id1, id2);
  assert.equal(isValidDeviceId(id1), true);
  assert.equal(isValidDeviceId(id2), true);

  for (const bad of ["", "null", "undefined", "default", "web", "short", "bad space id 123456"]) {
    assert.equal(isValidDeviceId(bad), false, `Expected "${bad}" to be invalid`);
  }
});

test("entitlement is strictly bound to one deviceId and never unlocks another device", () => {
  const storage = createMemoryStorage();
  const now = 1_700_000_000_000;
  const future = now + 86400 * 1000 * 180;
  const deviceA = generateSecureDeviceId();
  const deviceB = generateSecureDeviceId();

  const saved = writeStoredEntitlement(storage, deviceA, future, now);
  assert.ok(saved);
  assert.equal(isEntitlementValidForDevice(saved, deviceA, now + 1000), true);
  assert.equal(isEntitlementValidForDevice(saved, deviceB, now + 1000), false);

  // Reading with deviceB must return null and purge mismatched entry
  assert.equal(readStoredEntitlement(storage, deviceB, now + 1000), null);
});

test("legacy unbound pro_until is ignored and purged", () => {
  const storage = createMemoryStorage();
  const now = 1_700_000_000_000;
  const deviceA = getOrCreateSecureDeviceId(storage);
  storage.setItem(LEGACY_PRO_UNTIL_KEY, String(now + 999999999));

  const ent = readStoredEntitlement(storage, deviceA, now);
  assert.equal(ent, null);
  assert.equal(storage.getItem(LEGACY_PRO_UNTIL_KEY), null);
});

test("expired or stale entitlements are rejected until re-verified", () => {
  const now = 1_700_000_000_000;
  const deviceA = generateSecureDeviceId();

  assert.equal(
    isEntitlementValidForDevice({ deviceId: deviceA, expiresAt: now - 1, verifiedAt: now - 1000 }, deviceA, now),
    false
  );
  assert.equal(
    isEntitlementValidForDevice(
      { deviceId: deviceA, expiresAt: now + 100000, verifiedAt: now - 20 * 60 * 1000 },
      deviceA,
      now
    ),
    false
  );
});

test("rotateDeviceId issues new device ID and revokes previous Pro entitlement", () => {
  const storage = createMemoryStorage();
  const now = 1_700_000_000_000;
  const dev1 = getOrCreateSecureDeviceId(storage);
  writeStoredEntitlement(storage, dev1, now + 86400 * 1000, now);
  assert.ok(readStoredEntitlement(storage, dev1, now + 100));

  const dev2 = rotateDeviceId(storage);
  assert.notEqual(dev1, dev2);
  assert.equal(readStoredEntitlement(storage, dev2, now + 100), null);
  clearStoredEntitlement(storage);
});

test("normalizeProInfo enforces EVC Plus 610999089 and Shuceyb Abdirahman", () => {
  const info = normalizeProInfo({
    priceText: "0.1",
    days: 180,
    whatsapp: "252614632360",
    note: "",
    methods: [
      { name: "EVC PLUS", number: "252614632360", holder: "OldName" },
      { name: "Zaad", number: "0631234567", holder: "Test" },
    ],
  });

  assert.equal(info.methods.length, 1);
  assert.equal(info.methods[0].name, EVC_PAYMENT_CONFIG.methodName);
  assert.equal(info.methods[0].number, "610999089");
  assert.equal(info.methods[0].holder, "Shuceyb Abdirahman");
  assert.equal(info.whatsapp, "252610999089");
  assert.equal(info.priceText, "$0.10 · Abid (Hal mar)");
  assert.equal(info.days, 3650);

  const customPrice = normalizeProInfo({ priceText: "$0.25 · Lifetime", days: 3650 });
  assert.equal(customPrice.priceText, "$0.25 · Lifetime");
  assert.equal(formatShortDeviceId("hkd_abcdef1234567890"), "ABCDE-7890");
});

test("Somali language is always free while English and Arabic require Pro", async () => {
  const { canUseLanguage, resolveAllowedLang } = await import("./proSecurity");
  assert.equal(canUseLanguage("so", false), true);
  assert.equal(canUseLanguage("en", false), false);
  assert.equal(canUseLanguage("ar", false), false);
  assert.equal(resolveAllowedLang("ar", false), "so");
  assert.equal(resolveAllowedLang("en", false), "so");

  assert.equal(canUseLanguage("so", true), true);
  assert.equal(canUseLanguage("en", true), true);
  assert.equal(canUseLanguage("ar", true), true);
  assert.equal(resolveAllowedLang("ar", true), "ar");
});

test("Pro Languages and Pro Departments packages stay cleanly separated and merge when both unlocked", async () => {
  const {
    hasLanguagesAccess,
    hasDepartmentsAccess,
    saveRequestedProScope,
  } = await import("./proSecurity");

  const storage = createMemoryStorage();
  const deviceId = getOrCreateSecureDeviceId(storage);
  const now = 1_700_000_000_000;
  const future = now + 365 * 24 * 3600 * 1000;

  // Unlock Languages pack only
  saveRequestedProScope(storage, deviceId, "languages");
  const langEnt = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasLanguagesAccess(langEnt, deviceId, now), true);
  assert.equal(hasDepartmentsAccess(langEnt, deviceId, now), false);

  // Also unlock Departments pack -> upgrades to full
  saveRequestedProScope(storage, deviceId, "departments");
  const fullEnt = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasLanguagesAccess(fullEnt, deviceId, now), true);
  assert.equal(hasDepartmentsAccess(fullEnt, deviceId, now), true);
});

test("School Form 4 ($0.10 per subject) and Bridging Exam unlocks stay isolated per item", async () => {
  const {
    hasBridgeExamAccess,
    hasDepartmentsAccess,
    hasLanguagesAccess,
    hasSchoolSubjectAccess,
    saveRequestedProItem,
  } = await import("./proSecurity");

  const storage = createMemoryStorage();
  const deviceId = getOrCreateSecureDeviceId(storage);
  const now = 1_700_000_000_000;
  const future = now + 365 * 24 * 3600 * 1000;

  // Unlock Biology Predict Exam ($0.10) only
  saveRequestedProItem(storage, deviceId, "school:bio");
  const bioOnly = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasSchoolSubjectAccess(bioOnly, deviceId, "bio", now), true);
  assert.equal(hasSchoolSubjectAccess(bioOnly, deviceId, "chem", now), false);
  assert.equal(hasBridgeExamAccess(bioOnly, deviceId, "snu_tartanka", now), false);
  assert.equal(hasDepartmentsAccess(bioOnly, deviceId, now), false);
  assert.equal(hasLanguagesAccess(bioOnly, deviceId, now), false);

  // Unlock SNU Entrance Predict Exam ($0.10) -> preserves school:bio without unlocking other school subjects
  saveRequestedProItem(storage, deviceId, "bridge:snu_tartanka");
  const merged = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasSchoolSubjectAccess(merged, deviceId, "bio", now), true);
  assert.equal(hasSchoolSubjectAccess(merged, deviceId, "phys", now), false);
  assert.equal(hasBridgeExamAccess(merged, deviceId, "snu_tartanka", now), true);
  assert.equal(hasBridgeExamAccess(merged, deviceId, "uni_placement", now), false);
});
