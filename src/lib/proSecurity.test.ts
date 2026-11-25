import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateTotalBundlePricing,
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
  syncServerEntitlement,
  TOTAL_BUNDLE_CONFIG,
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

test("normalizeProInfo enforces EVC Plus 610999089, Shuceyb Abdirahman, and 180-day seasonal pricing", () => {
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
  assert.equal(info.priceText, "$0.50 · 6 Bilood");
  assert.equal(info.days, 180);

  const ninetyDay = normalizeProInfo({ priceText: "$0.50 · 3 Bilood", days: 90 });
  assert.equal(ninetyDay.priceText, "$0.50 · 3 Bilood");
  assert.equal(ninetyDay.days, 90);

  // Legacy $0.10/3650/Abid values fall back to balanced $0.50 · 6 Bilood (180-day) limit
  const legacyTiny = normalizeProInfo({ priceText: "$0.10 · 6 Bilood", days: 180 });
  assert.equal(legacyTiny.priceText, "$0.50 · 6 Bilood");
  const legacyLifetime = normalizeProInfo({ priceText: "$0.10 · Abid (Hal mar)", days: 3650 });
  assert.equal(legacyLifetime.priceText, "$0.50 · 6 Bilood");
  assert.equal(legacyLifetime.days, 180);

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

test("HIRAAL Total bundle applies 20% discount ($1.50 -> $1.20) and scope full unlocks all stages + languages", async () => {
  const {
    hasBridgeExamAccess,
    hasDepartmentsAccess,
    hasLanguagesAccess,
    hasSchoolSubjectAccess,
    saveRequestedProScope,
  } = await import("./proSecurity");

  const pricing = calculateTotalBundlePricing();
  assert.equal(TOTAL_BUNDLE_CONFIG.originalAmount, 1.5);
  assert.equal(TOTAL_BUNDLE_CONFIG.discountPct, 20);
  assert.equal(pricing.finalAmount, 1.2);
  assert.equal(pricing.savedAmount, 0.3);
  assert.equal(pricing.formattedFinal, "$1.20");
  assert.equal(pricing.formattedOriginal, "$1.50");
  assert.equal(pricing.ussdAmount, "1.2");

  const storage = createMemoryStorage();
  const deviceId = getOrCreateSecureDeviceId(storage);
  const now = 1_700_000_000_000;
  const future = now + 180 * 24 * 3600 * 1000;

  saveRequestedProScope(storage, deviceId, "full");
  const totalEnt = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasLanguagesAccess(totalEnt, deviceId, now), true);
  assert.equal(hasDepartmentsAccess(totalEnt, deviceId, now), true);
  assert.equal(hasSchoolSubjectAccess(totalEnt, deviceId, "bio", now), true);
  assert.equal(hasSchoolSubjectAccess(totalEnt, deviceId, "math", now), true);
  assert.equal(hasBridgeExamAccess(totalEnt, deviceId, "snu_tartanka", now), true);
});

test("School Form 4 ($0.50) and Bridging Exam ($0.50) item unlocks stay isolated until stage/full unlock", async () => {
  const {
    hasBridgeExamAccess,
    hasDepartmentsAccess,
    hasLanguagesAccess,
    hasSchoolSubjectAccess,
    saveRequestedProItem,
    saveRequestedProScope,
  } = await import("./proSecurity");

  const storage = createMemoryStorage();
  const deviceId = getOrCreateSecureDeviceId(storage);
  const now = 1_700_000_000_000;
  const future = now + 365 * 24 * 3600 * 1000;

  // Unlock Biology Predict Exam item only
  saveRequestedProItem(storage, deviceId, "school:bio");
  const bioOnly = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasSchoolSubjectAccess(bioOnly, deviceId, "bio", now), true);
  assert.equal(hasSchoolSubjectAccess(bioOnly, deviceId, "chem", now), false);
  assert.equal(hasBridgeExamAccess(bioOnly, deviceId, "snu_tartanka", now), false);
  assert.equal(hasDepartmentsAccess(bioOnly, deviceId, now), false);
  assert.equal(hasLanguagesAccess(bioOnly, deviceId, now), false);

  // Unlock SNU Entrance Predict Exam ($0.50) -> preserves school:bio without unlocking other school subjects
  saveRequestedProItem(storage, deviceId, "bridge:snu_tartanka");
  const merged = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasSchoolSubjectAccess(merged, deviceId, "bio", now), true);
  assert.equal(hasSchoolSubjectAccess(merged, deviceId, "phys", now), false);
  assert.equal(hasBridgeExamAccess(merged, deviceId, "snu_tartanka", now), true);
  assert.equal(hasBridgeExamAccess(merged, deviceId, "uni_placement", now), false);

  // Unlock+ (departments or full scope) automatically unlocks EVERY Form 4 & Bridge JUS Predict Exam
  saveRequestedProScope(storage, deviceId, "departments");
  const unlockPlusEnt = writeStoredEntitlement(storage, deviceId, future, now);
  assert.equal(hasDepartmentsAccess(unlockPlusEnt, deviceId, now), true);
  assert.equal(hasSchoolSubjectAccess(unlockPlusEnt, deviceId, "phys", now), true);
  assert.equal(hasSchoolSubjectAccess(unlockPlusEnt, deviceId, "math", now), true);
  assert.equal(hasBridgeExamAccess(unlockPlusEnt, deviceId, "snu_tartanka", now), true);
  assert.equal(hasBridgeExamAccess(unlockPlusEnt, deviceId, "jus_bio", now), true);
  assert.equal(hasBridgeExamAccess(unlockPlusEnt, deviceId, "jus_eng", now), true);
});

test("Pro content shield blocks screenshot/print/save/copy shortcuts and stamps personal watermark", async () => {
  const {
    buildProWatermarkStamp,
    buildProWatermarkTileDataUri,
    formatWatermarkTimeTag,
    isBlockedProShortcut,
    isTamperedOverlayStyle,
    PRO_IDLE_LOCK_MS,
    PRO_PERSONAL_REMINDER,
  } = await import("./proSecurity");

  assert.equal(isBlockedProShortcut({ key: "PrintScreen" }), "screenshot");
  assert.equal(isBlockedProShortcut({ key: "4", metaKey: true, shiftKey: true }), "screenshot");
  assert.equal(isBlockedProShortcut({ key: "s", metaKey: true, shiftKey: true }), "screenshot");
  assert.equal(isBlockedProShortcut({ key: "p", ctrlKey: true }), "print");
  assert.equal(isBlockedProShortcut({ key: "s", ctrlKey: true }), "save");
  assert.equal(isBlockedProShortcut({ key: "c", ctrlKey: true }, false), "copy");
  assert.equal(isBlockedProShortcut({ key: "c", ctrlKey: true }, true), null);
  assert.equal(isBlockedProShortcut({ key: "F12" }), "devtools");

  const timeTag = formatWatermarkTimeTag(new Date(2026, 10, 23, 9, 5));
  assert.equal(timeTag, "09:05 23/11");

  const stamp = buildProWatermarkStamp("hkd_abcdef1234567890", "Axmed <Cali>", timeTag);
  assert.ok(stamp.includes("HIRAAL UNLOCK+"));
  assert.ok(stamp.includes("ABCDE-7890"));
  assert.ok(stamp.includes("Axmed <Cali>"));
  assert.ok(stamp.includes("09:05 23/11"));

  const uri = buildProWatermarkTileDataUri(stamp);
  assert.ok(uri.startsWith("data:image/svg+xml;utf8,"));
  const decoded = decodeURIComponent(uri.slice("data:image/svg+xml;utf8,".length));
  assert.ok(decoded.includes("Axmed &lt;Cali&gt;"));
  assert.ok(decoded.includes("ABCDE-7890"));
  assert.ok(decoded.includes("09:05 23/11"));
  assert.ok(!decoded.includes("<Cali>"));

  assert.equal(PRO_IDLE_LOCK_MS, 120_000);
  assert.equal(isTamperedOverlayStyle({ display: "none", visibility: "visible", opacity: "1" }), true);
  assert.equal(isTamperedOverlayStyle({ display: "block", visibility: "hidden", opacity: "1" }), true);
  assert.equal(isTamperedOverlayStyle({ display: "block", visibility: "visible", opacity: "0.2" }), true);
  assert.equal(isTamperedOverlayStyle({ display: "block", visibility: "visible", opacity: "1" }), false);

  assert.ok(PRO_PERSONAL_REMINDER.body.includes("screenshot"));
  assert.ok(PRO_PERSONAL_REMINDER.body.includes("naftiisa"));
});

test("syncServerEntitlement prevents scope escalation on refresh and purges revoked entitlements", async () => {
  const {
    hasDepartmentsAccess,
    hasLanguagesAccess,
    hasSchoolSubjectAccess,
    saveRequestedProItem,
    saveRequestedProScope,
  } = await import("./proSecurity");
  const storage = createMemoryStorage();
  const deviceId = getOrCreateSecureDeviceId(storage);
  const now = 1_700_000_000_000;
  const future = now + 180 * 86400 * 1000;

  // User paid only for school:bio
  const bioEnt = syncServerEntitlement(
    storage,
    deviceId,
    { active: true, expiresAt: future, scope: "none", unlockedItems: ["school:bio"], hasServerScopeMetadata: true },
    now
  );
  assert.ok(bioEnt);
  assert.equal(hasSchoolSubjectAccess(bioEnt, deviceId, "bio", now), true);
  assert.equal(hasSchoolSubjectAccess(bioEnt, deviceId, "chem", now), false);
  assert.equal(hasDepartmentsAccess(bioEnt, deviceId, now), false);
  assert.equal(hasLanguagesAccess(bioEnt, deviceId, now), false);

  // Even if client tries to stage another requested item/scope before calling refreshPro(), server sync refuses escalation
  saveRequestedProItem(storage, deviceId, "school:chem");
  const afterAttempt1 = syncServerEntitlement(
    storage,
    deviceId,
    { active: true, expiresAt: future, scope: "none", unlockedItems: ["school:bio"], hasServerScopeMetadata: true },
    now + 1000
  );
  assert.equal(hasSchoolSubjectAccess(afterAttempt1, deviceId, "chem", now + 1000), false);

  saveRequestedProScope(storage, deviceId, "full");
  const afterAttemptLegacy = syncServerEntitlement(
    storage,
    deviceId,
    { active: true, expiresAt: future, hasServerScopeMetadata: false },
    now + 2000
  );
  assert.equal(hasDepartmentsAccess(afterAttemptLegacy, deviceId, now + 2000), false);
  assert.equal(hasSchoolSubjectAccess(afterAttemptLegacy, deviceId, "bio", now + 2000), true);

  // Server revocation purges local entitlement immediately
  const revoked = syncServerEntitlement(storage, deviceId, { active: false, expiresAt: 0 }, now + 3000);
  assert.equal(revoked, null);
  assert.equal(readStoredEntitlement(storage, deviceId, now + 3000), null);
});

test("tampered localStorage entitlement is rejected and purged immediately", async () => {
  const { ENTITLEMENT_STORAGE_KEY, validateEvcPhone, validatePayTimeHHMM, sanitizeCheckoutName } =
    await import("./proSecurity");
  const storage = createMemoryStorage();
  const now = 1_700_000_000_000;
  const deviceA = generateSecureDeviceId();

  const saved = writeStoredEntitlement(storage, deviceA, now + 86400 * 1000, now, "languages");
  assert.ok(saved);

  // Tamper scope from languages -> full directly in storage
  const raw = JSON.parse(storage.getItem(ENTITLEMENT_STORAGE_KEY)!);
  raw.scope = "full";
  storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(raw));

  assert.equal(readStoredEntitlement(storage, deviceA, now + 100), null);
  assert.equal(storage.getItem(ENTITLEMENT_STORAGE_KEY), null);

  assert.equal(validateEvcPhone("061 234 5678").ok, true);
  assert.equal(validateEvcPhone("0000000").ok, false);
  assert.equal(validatePayTimeHHMM("14:35"), true);
  assert.equal(validatePayTimeHHMM("29:99"), false);
  assert.equal(sanitizeCheckoutName("  Axmed <script> "), "Axmed script");
});
