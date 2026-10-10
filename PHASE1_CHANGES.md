# ErgoSafe Reborn V3 — Phase 1 remediation (11 Oct 2026)

Built on the locked round-2 commit `5d49c9a`. Verified by Claude before delivery:
`tsc --noEmit` clean, `npm run build` OK, Playwright **71/71 passing** (the original 51 plus 20 new tests in
`e2e/phase1-remediation.spec.ts`). The lock-down script reruns build and tests on the laptop before committing.

The ComplianceGuard merge (Next.js code, Section 17 / GSR 3 engine, Phase 1 vitest file) is parked on the
`haven-merge` branch and is **not** part of this build.

## Hazard engine (`src/store/complianceStore.ts`)
| Fix | Before | After |
|---|---|---|
| Over-escalation | Every `evaluateStatutoryPhysicalHazard` call was tagged HIGH RISK, scored 30, referred to an OMP, filed as a 40-yr medical surveillance record and escalated | All of these derive from the evaluation. Low-risk findings are logged for review (score 68, state `triggered`, REG 6 record, no OMP referral, no escalation) |
| Negation | "Freezer cleaned, no issues", "no carcass handling" triggered HIGH RISK | Negated mentions ignored; cold-room words only count with an exposure cue (work, inside, hours, -18 °C ...) |
| Machine handling | "Forklift moves a 1 000 kg pallet" = manual handling | Weights moved by forklift / pallet jack / hoist / conveyor excluded unless a manual verb is also present |
| 25 kg | Presented as a statutory limit | Company **guidance** threshold, configurable per tenant (`manualHandlingGuidanceKg`, default 25). Label says "company guidance threshold - ergonomic risk assessment required" |
| Confirmed categories | Free text only | Explicit hazard types (`carcass_handling`, `knife_boning`, `cold_room_stress`) always count |

## Tenant safety, demo data, IDs
- `|| 'COMP-001'` fallback removed. Records created without a session are stamped `NO_TENANT_SESSION`, so they can never merge into a real tenant (the demo seed cases for COMP-001 remain, as demo data).
- `getCurrentTenant()` returns nothing when no one is signed in (it used to return the first company — Oredax, a real client).
- Hard-coded `Harvey Specter (OHS Sec 16.2 Appointee)` replaced by the tenant's configured `ohsAppointee`; if unset the record says **"s16(2) appointee not assigned"**. Oredax is deliberately left unassigned until the client confirms a name.
- All TV-character demo names (Suits cast) replaced with invented names.
- IDs now `crypto.randomUUID()` (with a secure fallback) instead of `Date.now()` + random 0-999.

## API (`api/_lib/security.js`, `api/compliance.js`)
- Rate limiter no longer trusts the client-supplied first `x-forwarded-for` entry; uses `x-vercel-forwarded-for` / `x-real-ip` / last hop. Old buckets are evicted.
- Token compared with `crypto.timingSafeEqual`.
- `Access-Control-Allow-Credentials` removed (bearer tokens, not cookies).
- Malformed JSON → 400. Non-string `siteContext` / `hazards` → 400. Only validated fields reach the generator.
- Error responses no longer return `err.message` / upstream details; the server logs them with a `requestId` that the client receives.

## Emergency panel (`NellyEmergencyUI.tsx`, Nelly chat)
- Opens only for an actual emergency report; "no injury today", "accident report form" no longer trigger it.
- "DISPATCH STATUTORY EMS" → **Call Emergency Services**. Numbers shown in large text (tel: links do nothing on desktops); tenant numbers first, then 10177 / 10111 / 112 always present, with a note that 112 is for cellphones.
- `role="alertdialog"`, focus moves into the panel, 14 px+ text, stronger contrast, animations respect reduced-motion.
- De-escalate needs a confirmation and is logged with the user and time.
- Unique React keys; phone numbers validated before use in tel: links.

## Still open (not in this lock)
- Per-user authentication, server-side storage and the 40-year retention vault (records still live in the browser).
- Legal registry with verification dates; Section 17 / GSR 3 engine lives on `haven-merge`.
  Note for that work: GSR 3 first aiders are required above **10** employees (1 per 100 in shops/offices, 1 per 50 elsewhere); the **first-aid box** applies above **5**. Do not change the first-aider threshold to 5.
- Wellbeing module (Phase 7) and copy clean-up (Phase 8).
