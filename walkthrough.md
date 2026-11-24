# Security Summary

## Reviewed Files

- `src/lib/proSecurity.ts`
- `src/lib/api.ts`
- `src/context/AppContext.tsx`
- `src/App.tsx`
- `src/screens/ProPaywallScreen.tsx`
- `src/screens/ProHubScreen.tsx`
- `src/screens/ProGuideScreen.tsx`
- `src/screens/SchoolForm4Screen.tsx`
- `src/screens/BridgingPrepScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/components/ProContentShield.tsx`
- `src/components/PredictExamRunner.tsx`
- `backend/supabase/fix_pro_security.sql`
- `admin/index.html`

## Issues Resolved

| Risk Area | File(s) | Fix Implemented |
| :--- | :--- | :--- |
| Scoped Unlock Privilege Escalation | `src/lib/proSecurity.ts`, `src/lib/api.ts`, `src/context/AppContext.tsx`, `src/screens/ProPaywallScreen.tsx`, `backend/supabase/fix_pro_security.sql` | Added `syncServerEntitlement` to enforce server-returned `scope` and `unlocked_items`, removed unverified local `saveRequestedProItem` mutation from `"Hubi xaaladda"` (`handleCheck`), consumed pending request markers after activation, and purged local entitlements immediately when the server returns `active: false`. |
| Stale Access & Admin Approval Sync Gap | `src/App.tsx`, `src/lib/proSecurity.ts` | Updated `handleOpenPro` to always re-verify with the server when `backendEnabled` is true (without falling back to stale React state), and tightened `MAX_ENTITLEMENT_STALE_MS` from 15 minutes to 5 minutes. |
| Lifetime / 3650-Day Lock-In Override | `src/lib/proSecurity.ts`, `backend/supabase/fix_pro_security.sql`, `admin/index.html`, `src/screens/ProPaywallScreen.tsx`, `src/screens/ProHubScreen.tsx` | Removed the `days >= 365` guard in `normalizeProInfo` that discarded 30/90/180-day server plans, bounded maximum validity to 730 days, and standardized the default Unlock+ duration to 180 days (6 months). |
| Paying for Un-Uploaded Predict Exams | `src/components/PredictExamRunner.tsx`, `src/screens/SchoolForm4Screen.tsx`, `src/screens/BridgingPrepScreen.tsx`, `src/screens/ProPaywallScreen.tsx` | Disabled paid checkout and EVC submission for School and Gap Predict Exams when `predictQuestions.length === 0`, preventing students from paying before questions are uploaded. |
| False Outbound-Link Screen Lock | `src/components/ProContentShield.tsx` | Exempted intentional `<a target="_blank">` outbound clicks (verified university and scholarship links) and editable controls from `window.blur` screen lockouts while preserving tab-switch, print, copy, and DevTools protections. |

## Safeguards Verified

- **Per-Device Isolation & Row Locking**: `backend/supabase/fix_pro_security.sql` enables Row Level Security on `pro_entitlements`, revokes direct table access from `anon` and `authenticated`, rejects weak/short device IDs, and uses `SELECT ... FOR UPDATE` in `pro_redeem` so single-use codes cannot be redeemed concurrently by multiple devices.
- **No Secret Leakage & Clean Dependencies**: All Supabase access uses the public anon key with `SECURITY DEFINER` RPC functions (`search_path = public`), admin operations require authenticated admin login in `admin/index.html` (`persistSession: false`, 5-minute idle timeout), and `bun audit` reported 0 vulnerabilities across 162 packages.
- **Safe Output Handling & Input Validation**: `proSecurity.ts` validates EVC phone numbers, `HH:MM` timestamps, and checkout names (`validateEvcPhone`, `validatePayTimeHHMM`, `sanitizeCheckoutName`), escapes SVG watermark text (`escapeSvgText`), sanitizes `wa.me` and `tel:` links, and enforces client payment/redeem cooldowns.
- **Zero Pre-Mounted Protected Hub Data**: `ProHubScreen.tsx` renders only a lock gate until `proActive` is verified, ensuring university, pioneer, roadmap, and career hub payloads are not mounted before entitlement verification.

---

## PoC Verification

### 1. Scoped Entitlement Escalation Blocked (`syncServerEntitlement` & `handleCheck`)

- **Pre-fix flaw**: A user who paid `$0.10` for `school:bio` could open `ProPaywallScreen`, pick `school:chem` (or `departments`), and tap `"Hubi xaaladda"` (`handleCheck`). `handleCheck` saved `school:chem` locally before calling `refreshPro()`, and `writeStoredEntitlement` merged the unverified local request onto the existing entitlement.
- **Verification**:
  1. `ProPaywallScreen.tsx` `handleCheck()` no longer calls `saveRequestedProItem`.
  2. `syncServerEntitlement` in `src/lib/proSecurity.ts` replaces `writeStoredEntitlement` inside `AppContext.refreshPro()`. When `hasServerScopeMetadata` is true, only server-returned `scope` and `unlockedItems` are stored. When checking a legacy backend response without scope metadata, an already-signed local entitlement preserves only its existing `scope` and `unlockedItems` and ignores any newly staged local request keys.
  3. Automated unit test `"syncServerEntitlement prevents scope escalation on refresh and purges revoked entitlements"` in `src/lib/proSecurity.test.ts` verified that staging `school:chem` or `full` before syncing fails to grant access to `chem` or `departments`, and `active: false` purges local storage immediately.

### 2. Server-Configured 30/90/180-Day Duration Honored (`normalizeProInfo`)

- **Pre-fix flaw**: `normalizeProInfo` checked `raw.days >= 365`, silently discarding admin-configured `30`, `90`, or `180` day durations and overwriting them with `3650` days (`$0.10 · Abid (Hal mar)`).
- **Verification**:
  1. `normalizeProInfo` now accepts any finite `days` between `1` and `730`, defaulting to `180` days (`$0.10 · 6 Bilood`).
  2. `MAX_FUTURE_EXPIRY_MS` is capped at `735` days (`~2 years`) instead of 10 years.
  3. Unit test `"normalizeProInfo enforces EVC Plus 610999089, Shuceyb Abdirahman, and 180-day seasonal pricing"` in `src/lib/proSecurity.test.ts` verified that `days: 90` and `days: 180` are preserved and legacy `3650 / Abid` values normalize safely to `180` days (`$0.10 · 6 Bilood`).

### 3. Empty Predict Exam Checkout Guard (`PredictExamRunner` & `ProPaywallScreen`)

- **Pre-fix flaw**: All 12 Form 4 subjects and 2 Gap entrance exam tracks currently have `predictQuestions: []` awaiting 2027 uploads, yet clicking `"Fur Predict ($0.10)"` navigated to payment and accepted EVC requests.
- **Verification**:
  1. `PredictExamGateCard`, `SchoolForm4Screen`, `BridgingPrepScreen`, and `ProPaywallScreen` now inspect `predictQuestions.length`.
  2. While `predictQuestions.length === 0`, the School/Gap unlock action is disabled with `"Diyaarinta Socota · Soo Gelinta 2027"`, and `ProPaywallScreen` blocks submission for empty exam slots while keeping `departments` and `languages` active.
