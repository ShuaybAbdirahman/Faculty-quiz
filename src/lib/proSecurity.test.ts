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

test("normalizeProInfo enforces EVC Plus 610999089, Shuceyb Abdirahman, and updated Monthly default", () => {
  const info = normalizeProInfo({
    priceText: "0.1",
    days: 30,
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
  assert.equal(info.priceText, "$1.20 · 30 Maalmood");
  assert.equal(info.days, 30);

  const yearly = normalizeProInfo({ priceText: "$5.00 · 365 Maalmood", days: 365 });
  assert.equal(yearly.priceText, "$5.00 · 365 Maalmood");
  assert.equal(yearly.days, 365);

  const legacyTiny = normalizeProInfo({ priceText: "$0.10 · 6 Bilood", days: 180 });
  assert.equal(legacyTiny.priceText, "$1.20 · 30 Maalmood");
  const legacyLifetime = normalizeProInfo({ priceText: "$0.10 · Abid (Hal mar)", days: 3650 });
  assert.equal(legacyLifetime.priceText, "$1.20 · 30 Maalmood");
  assert.equal(legacyLifetime.days, 30);

  assert.equal(formatShortDeviceId("hkd_abcdef1234567890"), "ABCDE-7890");
});

test("Weekly, Monthly, and Yearly plans and last-step payment reveal gate behave securely", async () => {
  const { PRO_BILLING_PLANS, canRevealPaymentDetails, maskPaymentNumber, getProBillingPlan } =
    await import("./proSecurity");

  assert.equal(PRO_BILLING_PLANS.weekly.amount, 0.5);
  assert.equal(PRO_BILLING_PLANS.weekly.days, 7);
  assert.equal(PRO_BILLING_PLANS.monthly.amount, 1.2);
  assert.equal(PRO_BILLING_PLANS.monthly.days, 30);
  assert.equal(PRO_BILLING_PLANS.yearly.amount, 5.0);
  assert.equal(PRO_BILLING_PLANS.yearly.days, 365);
  assert.equal(getProBillingPlan("yearly").ussdAmount, "5");

  // Payment number must be masked before final step
  assert.equal(maskPaymentNumber("610999089"), "••• ••• •89");

  // Step 1 and Step 2 must NEVER reveal full payment number
  assert.equal(
    canRevealPaymentDetails({ step: 1, phone: "0615123456", name: "Axmed Cali", committed: true }),
    false
  );
  assert.equal(
    canRevealPaymentDetails({ step: 2, phone: "0615123456", name: "Axmed Cali", committed: true }),
    false
  );

  // Step 3 without valid phone, valid name, or commitment must still refuse reveal
  assert.equal(
    canRevealPaymentDetails({ step: 3, phone: "123", name: "Axmed Cali", committed: true }),
    false
  );
  assert.equal(
    canRevealPaymentDetails({ step: 3, phone: "0615123456", name: "A", committed: true }),
    false
  );
  assert.equal(
    canRevealPaymentDetails({ step: 3, phone: "0615123456", name: "Axmed Cali", committed: false }),
    false
  );

  // Valid Step 3 with serious committed student reveals payment details
  assert.equal(
    canRevealPaymentDetails({ step: 3, phone: "0615123456", name: "Axmed Cali", committed: true }),
    true
  );
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

test("Rukun plans (Asbuucle, Bille, Sanadle) enforce exact prices and 20% Total discount", async () => {
  const { getRukunPricing } = await import("./proSecurity");

  const wSingle = getRukunPricing("weekly", false);
  const wTotal = getRukunPricing("weekly", true);
  assert.equal(wSingle.days, 7);
  assert.equal(wSingle.priceFormatted, "$0.25");
  assert.equal(wTotal.originalFormatted, "$0.75");
  assert.equal(wTotal.priceFormatted, "$0.60");
  assert.equal(wTotal.savedFormatted, "$0.15");
  assert.equal(wTotal.ussdAmount, "0.6");

  const mSingle = getRukunPricing("monthly", false);
  const mTotal = getRukunPricing("monthly", true);
  assert.equal(mSingle.days, 30);
  assert.equal(mSingle.priceFormatted, "$0.50");
  assert.equal(mTotal.originalFormatted, "$1.50");
  assert.equal(mTotal.priceFormatted, "$1.20");
  assert.equal(mTotal.savedFormatted, "$0.30");

  const ySingle = getRukunPricing("yearly", false);
  const yTotal = getRukunPricing("yearly", true);
  assert.equal(ySingle.days, 365);
  assert.equal(ySingle.priceFormatted, "$1.50");
  assert.equal(yTotal.originalFormatted, "$4.50");
  assert.equal(yTotal.priceFormatted, "$3.60");
  assert.equal(yTotal.savedFormatted, "$0.90");
});

test("Strict Stage Isolation: unlocking one stage never unlocks other stages; Total unlocks all", async () => {
  const {
    hasBridgeExamAccess,
    hasDepartmentsAccess,
    hasJusStageAccess,
    hasLanguagesAccess,
    hasSchoolStageAccess,
    hasSchoolSubjectAccess,
    hasUniversityStageAccess,
    saveRequestedProItem,
    saveRequestedProScope,
  } = await import("./proSecurity");

  const now = 1_700_000_000_000;
  const future = now + 30 * 24 * 3600 * 1000;

  // 1. School ONLY
  const s1 = createMemoryStorage();
  const d1 = getOrCreateSecureDeviceId(s1);
  saveRequestedProItem(s1, d1, "stage:school");
  const schoolOnly = writeStoredEntitlement(s1, d1, future, now);
  assert.equal(hasSchoolStageAccess(schoolOnly, d1, now), true);
  assert.equal(hasSchoolSubjectAccess(schoolOnly, d1, "bio", now), true);
  assert.equal(hasJusStageAccess(schoolOnly, d1, now), false);
  assert.equal(hasBridgeExamAccess(schoolOnly, d1, "snu_tartanka", now), false);
  assert.equal(hasUniversityStageAccess(schoolOnly, d1, now), false);
  assert.equal(hasDepartmentsAccess(schoolOnly, d1, now), false);
  assert.equal(hasLanguagesAccess(schoolOnly, d1, now), false);

  // 2. Adding JUS unlocks School + JUS, keeping University & Languages locked
  saveRequestedProItem(s1, d1, "stage:jus");
  const schoolAndJus = writeStoredEntitlement(s1, d1, future, now);
  assert.equal(hasSchoolStageAccess(schoolAndJus, d1, now), true);
  assert.equal(hasJusStageAccess(schoolAndJus, d1, now), true);
  assert.equal(hasBridgeExamAccess(schoolAndJus, d1, "snu_tartanka", now), true);
  assert.equal(hasUniversityStageAccess(schoolAndJus, d1, now), false);
  assert.equal(hasLanguagesAccess(schoolAndJus, d1, now), false);

  // 3. University ONLY never unlocks School, JUS, or Languages
  const s2 = createMemoryStorage();
  const d2 = getOrCreateSecureDeviceId(s2);
  saveRequestedProItem(s2, d2, "stage:university");
  const uniOnly = writeStoredEntitlement(s2, d2, future, now);
  assert.equal(hasUniversityStageAccess(uniOnly, d2, now), true);
  assert.equal(hasDepartmentsAccess(uniOnly, d2, now), true);
  assert.equal(hasSchoolStageAccess(uniOnly, d2, now), false);
  assert.equal(hasJusStageAccess(uniOnly, d2, now), false);
  assert.equal(hasLanguagesAccess(uniOnly, d2, now), false);

  // 4. Languages ONLY never unlocks School, JUS, or University
  const s3 = createMemoryStorage();
  const d3 = getOrCreateSecureDeviceId(s3);
  saveRequestedProItem(s3, d3, "stage:languages");
  const langOnly = writeStoredEntitlement(s3, d3, future, now);
  assert.equal(hasLanguagesAccess(langOnly, d3, now), true);
  assert.equal(hasSchoolStageAccess(langOnly, d3, now), false);
  assert.equal(hasJusStageAccess(langOnly, d3, now), false);
  assert.equal(hasUniversityStageAccess(langOnly, d3, now), false);

  // 5. HIRAAL Total (full) unlocks ALL stages + Languages
  const s4 = createMemoryStorage();
  const d4 = getOrCreateSecureDeviceId(s4);
  saveRequestedProScope(s4, d4, "full");
  const totalEnt = writeStoredEntitlement(s4, d4, future, now);
  assert.equal(hasSchoolStageAccess(totalEnt, d4, now), true);
  assert.equal(hasSchoolSubjectAccess(totalEnt, d4, "math", now), true);
  assert.equal(hasJusStageAccess(totalEnt, d4, now), true);
  assert.equal(hasBridgeExamAccess(totalEnt, d4, "snu_tartanka", now), true);
  assert.equal(hasUniversityStageAccess(totalEnt, d4, now), true);
  assert.equal(hasLanguagesAccess(totalEnt, d4, now), true);
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

test("ProLevel progression binds weekly->1, monthly->2, yearly->3 and rejects tampered level", async () => {
  const {
    ENTITLEMENT_STORAGE_KEY,
    getActiveProLevel,
    getProLevelForCycle,
    hasProLevelAccess,
  } = await import("./proSecurity");
  assert.equal(getProLevelForCycle("weekly"), 1);
  assert.equal(getProLevelForCycle("monthly"), 2);
  assert.equal(getProLevelForCycle("yearly"), 3);

  const storage = createMemoryStorage();
  const now = 1_700_000_000_000;
  const deviceId = generateSecureDeviceId();

  const lvl1 = writeStoredEntitlement(
    storage,
    deviceId,
    now + 7 * 86400 * 1000,
    now,
    "none",
    ["stage:school"],
    1
  );
  assert.ok(lvl1);
  assert.equal(getActiveProLevel(lvl1, deviceId, now + 1000), 1);
  assert.equal(hasProLevelAccess(lvl1, deviceId, 1, now + 1000), true);
  assert.equal(hasProLevelAccess(lvl1, deviceId, 2, now + 1000), false);
  assert.equal(hasProLevelAccess(lvl1, deviceId, 3, now + 1000), false);

  // Tampering level 1 -> 3 directly in storage must fail HMAC verification
  const raw = JSON.parse(storage.getItem(ENTITLEMENT_STORAGE_KEY)!);
  raw.level = 3;
  storage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(raw));
  assert.equal(readStoredEntitlement(storage, deviceId, now + 1000), null);

  const lvl3 = writeStoredEntitlement(
    storage,
    deviceId,
    now + 365 * 86400 * 1000,
    now,
    "full",
    undefined,
    3
  );
  assert.ok(lvl3);
  assert.equal(getActiveProLevel(lvl3, deviceId, now + 1000), 3);
  assert.equal(hasProLevelAccess(lvl3, deviceId, 2, now + 1000), true);
  assert.equal(hasProLevelAccess(lvl3, deviceId, 3, now + 1000), true);
});

test("detectInitialLang always defaults to Somali unless en or ar was explicitly saved", async () => {
  const { detectInitialLang } = await import("./i18n");
  const prevStorage = (globalThis as { localStorage?: unknown }).localStorage;
  const store = new Map<string, string>();
  (globalThis as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
    removeItem: (k: string) => store.delete(k),
  };
  try {
    assert.equal(detectInitialLang(), "so");
    store.set("lang", "en");
    assert.equal(detectInitialLang(), "en");
    store.set("lang", "ar");
    assert.equal(detectInitialLang(), "ar");
  } finally {
    if (prevStorage === undefined) {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    } else {
      (globalThis as { localStorage?: unknown }).localStorage = prevStorage;
    }
  }
});

