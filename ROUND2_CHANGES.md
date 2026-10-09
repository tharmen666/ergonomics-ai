# ErgoSafe Reborn V3 - Round 2 changes (verified)

Done by Claude on 9 Oct 2026, working on `Desktop\ErgoSafe_Reborn_V3`.
Every item below was built and tested; the output at the bottom is copied from the real run, unedited.

## Proof the new tests are real
The new tests were also run against the **original** code (before these fixes):

- `e2e/round2-store.spec.ts`: **9 of 15 failed** on the original store (duplicate logs, false BREACHes, keyword breach,
  weight parsing, 45-min/back-belt text). The 6 that passed cover behaviour that was already correct and must stay correct.
- `e2e/api.spec.ts`: **8 of 11 failed** on the original API files (default token, no 401/500, `"abc"` hours accepted,
  `Infinity` accepted, no range/length limits). The 3 that passed were already fixed in round 1.
- Route test: with one menu label temporarily renamed, it **failed** at that route (the old version silently skipped it).

## What changed

| # | Problem | Fix | Test |
|---|---|---|---|
| A1 | Every hazard was logged twice (store listened to its own event) | Removed the self-listener; `processTelemetry` now writes its own log | `round2-store` A1 x3 |
| A2 | `fireEvent` / `recordUsage` ran inside `set()` updaters | All side effects now run after `set()` | covered by A1/A3 tests |
| A3 | Manual self-assessment (score >= 15) set global **BREACH** | `RiskPage` logs a RISK_ALERT; `triggerBreach` removed | `round2-store` A3, `round2-ui` A3 |
| A3 | Resolving a case could flip global status to BREACH | One shared status summary: BREACH only for open statutory breaches | `round2-store` A3 |
| A3 | Overdue risks stayed `RISK_ALERT`; tick and manual escalation disagreed | Overdue risk -> `OVERDUE_HIGH_RISK`; genuine breach -> `BREACH`; real-time clock unless demoMode | `round2-store` A3 x3 |
| A4 | Free text like "no SHE rep on night shift" created a statutory BREACH | Free text only sets `suggestedStatutoryReview`; breaches only via `logStatutoryLegalBreach` | `round2-store` A4 |
| A5 | Weight parser: "25,5 kg" read as 5 kg; only first weight checked | Parses all weights (SA comma decimals, "1 000 kg"), uses the largest; "2 x 15 kg" stays 15 | `round2-store` A5 |
| A5 | Non-high-risk findings were classified HIGH_RISK + medical-surveillance record | Classification/retention category now follow the actual result | `round2-store` A5 |
| A6 | 3D spine froze mid-transition (`frameloop="demand"`, no `invalidate`) - bad posture could still look green | Renders while on screen & tab visible, pauses otherwise; clamped interpolation. Same fix for the training robot | `round2-ui` A6 + visual check |
| B1 | "Max 45 min cold exposure under Reg 9" - not in GN 5952 | Removed; field renamed `coldExposureWorkWarmingMinutes` (site-configured, default null) | `complianceStore` 7, `round2-store` B2 |
| B2 | Lumbar support belts as a control; "7 days" label vs 72h SLA | Removed belts; label generated from `HIGH_RISK_SLA_HOURS` (72) | `round2-store` B2 |
| B2 | Translations: "100% compliance", "Right to Disconnect protected / CCMA precedent", Kenyan "OSHA 2007", "ISO 45001" penalty claim | Removed in all 8 languages (zu/xh/st/sw edited only by deletion - see native review note) | - |
| B2 | HR/Reports: "CEO Escalated" shown for BREACH status; "SLA: 72h Remaining" always; "Critical Breach Active" for any escalation | `utils/caseLabels.ts`: real status, escalation and remaining/overdue time | `round2-store` labels |
| B2 | "POPIA-Aligned Confidential Storage (Access Controlled)" | Replaced with the truth: browser-only, not encrypted, no access control | `round2-ui` B2 |
| B2 | Front page: "MongoDB compliance ledger via Google Cloud Agent Builder", "P0 AUDIT PASSED", hardcoded "NO PENDING OFFENCES", "Section 37 lockout rules" | Removed; offences badge now counts real open statutory breaches | route test (page heading) |
| C1 | API fell back to public token `ergosafe-dev-token`; client token baked in | `api/_lib/security.js`: fails closed (500) without `ERGOSAFE_API_TOKEN`; client sends no token in production unless configured; rate limit 10/10 min on `/api/compliance` | `api` C1 x4 |
| C2 | Fatigue API: no auth, `"abc"` -> 0, `Infinity` accepted, no ranges/limits; "CRITICAL_BREACH" | Token + rate limit; 0-24 h, 0-100 %, <= 100 finite positive samples; `CRITICAL` | `api` C2 x6 |
| D1 | Route test skipped missing routes; Stewardship check matched the sidebar text | No skip; checks the page's own heading; proven to fail on a missing route | `e2e-all-routes` |
| D2-D4 | Consent / emergency / handshake UI tests could pass without testing | Consent modal must appear; emergency panel actually opened; slow run must show FAILED | `phase0-ui` x3 |
| D6 | Store tests shared state | Full reset with `initialComplianceState` | all store specs |
| E1 | Pinch-zoom blocked | Removed `maximum-scale=1, user-scalable=no` | `round2-ui` E1 |
| E2 | Hardcoded "Build: a9407fe" / "Live Production" | Real commit injected at build (`__APP_BUILD__`); badge removed | `round2-ui` E2 |
| E3 | `@ts-nocheck` in TrainingModule & ErgoBotCanvas; stray `NellyAvatar` in Layout | Removed; type errors fixed | `tsc` |
| Perf | 958 kB three.js bundle preloaded on first visit (manualChunks pulled React `scheduler` into it) | Function-form manualChunks; first-visit JS **1,269 kB -> 469 kB** | `round2-ui` Perf |
| a11y | Nelly avatar was a clickable `div` | `role="button"`, keyboard support | `phase0-ui` 0.1 |
| Tests | Invoice test only passed on en-ZA number formatting | Accepts `25 000` and `25,000` | `app` 3 |

## Files you can delete (not imported anywhere; they never reach the app)
- `src/assets/Legal-Guardrails/PrivacyHandshake.tsx` (duplicate - the app uses `Privacy-Shield`)
- `src/features/risks/RiskyBehaviorsPage.tsx` (duplicate - the app uses `features/risk/`)
- `src/logic/security/irisCore.json` (duplicate - the app uses `src/data/irisCore.json`)
- `src/features/shop/ShopPage.tsx`, `src/features/dashboard/NellyCoachPage.tsx`,
  `src/features/dashboard/PostureTelemetry.tsx`, `src/components/HackathonDemo.tsx`

The build and all tests were run **without** these files.

## Before you deploy (Vercel environment variables)
Set `ERGOSAFE_API_TOKEN`, `VITE_ERGOSAFE_API_TOKEN` (same value), `ALLOWED_ORIGINS` and `ANTHROPIC_API_KEY`.
Without `ERGOSAFE_API_TOKEN` the API now refuses every request on purpose. See README "Server configuration".

## Still open (not fixed here - needs a decision or a specialist)
- **Real authentication** (TODO(auth)): the demo login and the shared API token are not user authentication.
- **Encryption / POPIA s26** handling of health data (TODO(privacy)).
- **Native-speaker review** of isiZulu, isiXhosa, Sesotho and Kiswahili strings (TODO(native-review)); the
  zu/xh/st "right to disconnect" sentence still says the right is "protected".
- **COIDA Schedule 3** item for knife deboning - removed until verified (TODO(legal-verify)).
- Marketing copy in `financePitches.ts` / `notebookLM_content.ts` still leans on "Section 37/38" framing - accurate
  but salesy; worth a legal read before sending to banks.
- `/api/compliance.js` imports `../src/api/compliance.js` while the source is `.ts` - confirm this resolves on your
  Vercel build (it works in the test runner).

## Build output (`npm run build`)
```
> ergo-safe-reborn@0.0.0 build
> tsc && vite build
vite v5.4.21 building for production...
transforming...
✓ 2485 modules transformed.
rendering chunks...
dist/index.html                                       1.61 kB
dist/assets/index-CX32lHkP.css                       91.48 kB
dist/assets/apiToken-D7c7AkKg.js                      0.03 kB
dist/assets/lpsStore-BzD6LYKl.js                      0.67 kB
dist/assets/GlowButton-uKFQo9OF.js                    1.24 kB
dist/assets/TeamPage-H1l7DBpk.js                      1.80 kB
dist/assets/ErgoBotCanvas-D_MRkP5I.js                 2.68 kB
dist/assets/ChecklistPage-D1C-_yQ-.js                 3.51 kB
dist/assets/SettingsPage-BdvOuR8-.js                  5.14 kB
dist/assets/RiskyBehaviorsPage-Cxw9-mhV.js            5.63 kB
dist/assets/MasterAdminPortal-BexYCIjC.js             6.28 kB
dist/assets/ReportsPage-D2d5hfD3.js                   7.19 kB
dist/assets/financePitches-CN40UUYW.js               10.01 kB
dist/assets/RiskPage-4wuxUGNa.js                     11.37 kB
dist/assets/HQTechnicalDemo-DfGUjlgL.js              13.31 kB
dist/assets/SmartBreakTimer-CBLmEaWG.js              13.51 kB
dist/assets/CompanionHub-BE_ENAgP.js                 14.53 kB
dist/assets/AdminPortal-B3xrZ3r8.js                  15.04 kB
dist/assets/HRDashboard-Dzd6aODw.js                  15.23 kB
dist/assets/StatutoryDocGeneratorModal-ZKRsxRSa.js   18.87 kB
dist/assets/SOPGenerator-B4bqYQXI.js                 20.39 kB
dist/assets/GEARDashboardPage-HJh-cZre.js            21.55 kB
dist/assets/InvoicePage-BJXZbrqk.js                  22.62 kB
dist/assets/SelfAssessmentPage-CopqXK4r.js           26.26 kB
dist/assets/SpineViewer-C6v72Q2G.js                  27.06 kB
dist/assets/TrainingPage-7pNCrd7U.js                 29.12 kB
dist/assets/DashboardPage-bW98QPPg.js                31.61 kB
dist/assets/ExecutiveBriefing-PBn6KnJe.js            34.50 kB
dist/assets/vendor-ui-DeeB8SnH.js                   149.72 kB
dist/assets/vendor-core-oj7QnT2W.js                 154.93 kB
dist/assets/index-41BuBic8.js                       173.21 kB
dist/assets/react-three-fiber.esm-C76BUSm8.js       800.25 kB
✓ built in 8.69s
```

## Test output (`npx playwright test`, 51 tests)
```
✓   1 [chromium] › e2e/api.spec.ts:32:5 › API guards & validation › C1: fails closed (500) when ERGOSAFE_API_TOKEN is not configured - no default token (16ms)
✓   2 [chromium] › e2e/api.spec.ts:41:5 › API guards & validation › C1: wrong or missing token -> 401 (5ms)
✓   3 [chromium] › e2e/api.spec.ts:50:5 › API guards & validation › C1: CORS never sends a wildcard origin with credentials (4ms)
✓   4 [chromium] › e2e/api.spec.ts:60:5 › API guards & validation › C1: rate limit returns 429 after the limit (9ms)
✓   5 [chromium] › e2e/api.spec.ts:70:5 › API guards & validation › 2.3: sync returns 501 (not a fake success) (1ms)
✓   6 [chromium] › e2e/api.spec.ts:83:5 › API guards & validation › C2: non-numeric hours -> 400 (not silently 0) (1ms)
✓   7 [chromium] › e2e/api.spec.ts:86:5 › API guards & validation › C2: hours out of range -> 400 (2ms)
✓   8 [chromium] › e2e/api.spec.ts:90:5 › API guards & validation › C2: reactionDropPct out of range -> 400 (1ms)
✓   9 [chromium] › e2e/api.spec.ts:93:5 › API guards & validation › C2: Infinity / negative / non-numeric reaction times -> 400 (3ms)
✓  10 [chromium] › e2e/api.spec.ts:98:5 › API guards & validation › C2: more than 100 reaction samples -> 400 (1ms)
✓  11 [chromium] › e2e/api.spec.ts:101:5 › API guards & validation › C2: odd-length reaction times use real slice lengths ([100,200,300] -> +150%) (4ms)
✓  12 [chromium] › e2e/app.spec.ts:35:3 › ErgoSafe Reborn V3 End-to-End Suite › 1. Viewport Responsiveness - Mobile (375x667) and Desktop (1280x800) (604ms)
✓  13 [chromium] › e2e/app.spec.ts:59:3 › ErgoSafe Reborn V3 End-to-End Suite › 2. Sidebar Navigation - All Feature Tabs Mount Valid React Components (5.7s)
✓  14 [chromium] › e2e/app.spec.ts:87:3 › ErgoSafe Reborn V3 End-to-End Suite › 3. Invoicing Engine - Create Assessment Invoice and Verify 15% SA VAT & PDF Modal (2.0s)
✓  15 [chromium] › e2e/app.spec.ts:124:3 › ErgoSafe Reborn V3 End-to-End Suite › 4. Nelly AI Accent & 7-Language Selector (en, zu, xh, sw, zh, de, st) (2.2s)
✓  16 [chromium] › e2e/complianceStore.spec.ts:26:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 1. Legal Citations & Repeal of ERW 1987 (6ms)
✓  17 [chromium] › e2e/complianceStore.spec.ts:36:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 2. 26 kg lift triggers HIGH RISK, NOT BREACH (9ms)
✓  18 [chromium] › e2e/complianceStore.spec.ts:65:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 3. Training records default to employee tenure retention (Regulation 10(1)) (2ms)
✓  19 [chromium] › e2e/complianceStore.spec.ts:82:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 4. Assessment and surveillance records enforce 40-year statutory retention (4ms)
✓  20 [chromium] › e2e/complianceStore.spec.ts:104:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 5. Genuine statutory non-compliance strictly triggers BREACH (2ms)
✓  21 [chromium] › e2e/complianceStore.spec.ts:120:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 6. Cold room stress maps to Regulation 9 of Physical Agents Regulations, 2024 (2ms)
✓  22 [chromium] › e2e/complianceStore.spec.ts:129:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 7. Industry Presets: Wholesale Cash & Carry and Retail Butchery validation (4ms)
✓  23 [chromium] › e2e/complianceStore.spec.ts:148:5 › Compliance Store & Statutory Scoring Engine Unit Tests › 8. Full 3-Tier Retention Schedule Verification (2ms)
✓  24 [chromium] › e2e/e2e-all-routes.spec.ts:23:5 › ErgoSafe Reborn V3 14-Route Core Verification Pass › All 14 core navigation routes exist, render, and log 0 console errors (17.4s)
✓  25 [chromium] › e2e/phase0-ui.spec.ts:6:5 › PHASE 0 UI: Consent & Emergency UI Verification › 0.3 Consent key is absent until the accept button is clicked (3.1s)
✓  26 [chromium] › e2e/phase0-ui.spec.ts:23:5 › PHASE 0 UI: Consent & Emergency UI Verification › 0.1 Emergency panel dials public emergency numbers, never the personal cellphone (1.1s)
✓  27 [chromium] › e2e/phase0-ui.spec.ts:48:5 › PHASE 0 UI: Consent & Emergency UI Verification › 0.2 A slow (fatigued) handshake run shows FAILED, not PASSED (8.1s)
✓  28 [chromium] › e2e/phase0.spec.ts:14:5 › PHASE 0: Life-Safety & Correctness Verification Suite › 0.1 Emergency UI never renders personal cellphone and defaults to SA emergency numbers (5ms)
✓  29 [chromium] › e2e/phase0.spec.ts:32:5 › PHASE 0: Life-Safety & Correctness Verification Suite › 0.2 Fatigue Store: failCognitiveHandshake leaves cognitiveHandshakePassed === false (4ms)
✓  30 [chromium] › e2e/phase0.spec.ts:50:5 › PHASE 0: Life-Safety & Correctness Verification Suite › 0.4 Simulated clock does not touch real records with demoMode: false, and past SLA keeps RISK_ALERT (4ms)
✓  31 [chromium] › e2e/phase0.spec.ts:80:5 › PHASE 0: Life-Safety & Correctness Verification Suite › 0.5 Hazard detection false positives (strict >25kg numeric and no free-text legal breaches) (7ms)
✓  32 [chromium] › e2e/round2-store.spec.ts:47:5 › Round 2 - store correctness › A1: one logHazardEvent call writes exactly one log entry (2ms)
✓  33 [chromium] › e2e/round2-store.spec.ts:53:5 › Round 2 - store correctness › A1: one logStatutoryLegalBreach call writes exactly one log entry (2ms)
✓  34 [chromium] › e2e/round2-store.spec.ts:59:5 › Round 2 - store correctness › A1: processTelemetry still logs (exactly once) after removing the self-listener (3ms)
✓  35 [chromium] › e2e/round2-store.spec.ts:68:5 › Round 2 - store correctness › A3: a manual unsafe-setup risk never sets global status to BREACH (2ms)
✓  36 [chromium] › e2e/round2-store.spec.ts:75:5 › Round 2 - store correctness › A3: resolving one case while another is escalated (non-statutory) does not create a BREACH (3ms)
✓  37 [chromium] › e2e/round2-store.spec.ts:84:5 › Round 2 - store correctness › A3: overdue RISK_ALERT (73h old) escalates to OVERDUE_HIGH_RISK on real time, not BREACH (3ms)
✓  38 [chromium] › e2e/round2-store.spec.ts:94:5 › Round 2 - store correctness › A3: with demoMode off, a 72h case created 10 real seconds ago does not escalate (2ms)
✓  39 [chromium] › e2e/round2-store.spec.ts:101:5 › Round 2 - store correctness › A3: an overdue genuine statutory breach does escalate as BREACH (2ms)
✓  40 [chromium] › e2e/round2-store.spec.ts:115:5 › Round 2 - hazard text detection › A4: free text never creates a statutory breach, only a suggested review (4ms)
✓  41 [chromium] › e2e/round2-store.spec.ts:126:5 › Round 2 - hazard text detection › A5: weight parsing handles SA decimals, multiple weights and "2 x 15 kg" (6ms)
✓  42 [chromium] › e2e/round2-store.spec.ts:139:5 › Round 2 - hazard text detection › A5: a non-high-risk finding is not classified as HIGH_RISK or as a medical surveillance record (2ms)
✓  43 [chromium] › e2e/round2-store.spec.ts:146:5 › Round 2 - hazard text detection › B2: no unverified 45-minute Reg 9 limit or back-support belts in control text (2ms)
✓  44 [chromium] › e2e/round2-store.spec.ts:156:5 › Round 2 - labels › SLA label shows real remaining/overdue time (3ms)
✓  45 [chromium] › e2e/round2-store.spec.ts:169:5 › Round 2 - fatigue › 3.2: moving the slider 4.5 -> 5.0 -> 5.5 h creates at most one new case (2ms)
✓  46 [chromium] › e2e/round2-store.spec.ts:180:5 › Round 2 - fatigue › 0.2: a failed handshake is never recorded as passed (1ms)
✓  47 [chromium] › e2e/round2-ui.spec.ts:5:5 › Round 2 UI › A3: an unsafe manual risk assessment logs a risk alert, not a legal breach (5.1s)
✓  48 [chromium] › e2e/round2-ui.spec.ts:22:5 › Round 2 UI › A6: 3D spine render loop runs while visible (no frozen "demand" loop) (2.1s)
✓  49 [chromium] › e2e/round2-ui.spec.ts:31:5 › Round 2 UI › E1/E2: pinch-zoom allowed; no hardcoded build or "Live Production" badge (274ms)
✓  50 [chromium] › e2e/round2-ui.spec.ts:40:5 › Round 2 UI › B2/1.1: Reports page states storage honestly (no "Access Controlled" claim) (2.1s)
✓  51 [chromium] › e2e/round2-ui.spec.ts:48:5 › Round 2 UI › Perf: first page load does not download three.js (730ms)
51 passed (53.4s)
```
