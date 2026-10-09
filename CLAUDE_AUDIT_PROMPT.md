# ErgoSafe Reborn V3 - Master Claude Audit & Optimization Directive

> **Instructions for Claude**: You are acting as a Principal Software Architect, Senior React/TypeScript Performance Specialist, and Certified South African Occupational Health and Safety (OHS / Ergonomics) Regulatory Auditor.
> Analyze the provided codebase and architecture specifications for **ErgoSafe Reborn V3** and execute a thorough audit and optimization plan according to the directives below.

---

## 1. Architectural & State Machine Audit
1. **Zustand State Stores**:
   - Inspect [`complianceStore.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/store/complianceStore.ts), [`nellyStore.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/store/nellyStore.ts), [`tenantStore.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/store/tenantStore.ts), and [`agentLogStore.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/store/agentLogStore.ts).
   - Check for state mutations, memory leaks in append-only ledgers (`hazardLogs`, `auditTrail`), atomic state updates, and selector memoization to prevent unnecessary React re-renders.
2. **React 18 Component Lifecycles & Navigation**:
   - Audit [`App.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/App.tsx) routing logic and sidebar tab transitions.
   - Check feature mount points: [`HRDashboard.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/features/hr/HRDashboard.tsx), [`TrainingPage.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/features/training/TrainingPage.tsx), [`SelfAssessmentPage.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/features/assessment/SelfAssessmentPage.tsx), [`RiskyBehaviorsPage.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/features/risks/RiskyBehaviorsPage.tsx), [`GEARDashboardPage.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/features/dashboard/GEARDashboardPage.tsx), and [`ReportsPage.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/features/reports/ReportsPage.tsx).

---

## 2. 3D Biomechanics & WebGL Performance Optimization
1. **Three.js & Canvas Lifecycle**:
   - Inspect [`SpineViewer.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/components/agent/SpineViewer.tsx) and `@react-three/fiber` / `@react-three/drei` usage.
   - Validate that WebGL contexts, geometries, materials, and textures are explicitly disposed of on component unmount to prevent GPU memory leaks.
   - Ensure the rendering loop throttles when the user is idle or tab is hidden (`useFrame` throttling / frameloop `demand`).

---

## 3. Statutory South African OHS & Legal Grounding Audit
1. **Mandatory Statutory Frameworks**:
   - South African Occupational Health and Safety (OHS) Act 85 of 1993 (Sections 8, 16.2, 37, 38).
   - Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019). Must strictly cite GN R1589 (not draft GNR 1009).
   - Physical Agents Regulations, 2024 (GN 5952, GG 52226) for thermal stress (cold/heat) and illumination, replacing repealed Environmental Regulations 1987.
   - General Safety Regulations (GSR): GSR 13H (Housekeeping) and GSR 13J (Emergency Exits/Egress with outward-opening doors).
   - Compensation for Occupational Injuries and Diseases Act (COIDA) 130 of 1993 (Schedule 3).
2. **Statutory Retention & Deterministic Guardrails**:
   - 40 YEARS for Regulation 6 Ergonomic Risk Assessments and Regulation 8 Medical Surveillance records (Ergonomics Regs 2019 Regulation 10(1)).
   - 3 YEARS for equipment inspection logs and control measure maintenance (Regulations 7 & 9).
   - Deterministic HIGH risk triggers: manual handling > 25 kg, carcass handling, knife deboning force, and cold room stress, recommending Regulation 8(1) OMP referral where indicated by the Regulation 6 assessment.
3. **Strict Taxonomy Separation**:
   - Ensure voluntary management frameworks (ISO 45001:2018, ISO 45003) are strictly separated from statutory South African law and never falsely labeled as legal requirements.
4. **Statutory Generator Verification**:
   - Audit [`src/api/compliance.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/api/compliance.ts) to verify the prompt engineering, fallback mechanisms, and Hierarchy of Controls sequence (Elimination -> Substitution -> Engineering -> Administrative -> PPE).

---

## 4. Nelly Multilingual Conversational AI & Speech Engine
1. **Browser Speech Synthesis**:
   - Audit [`speech.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/utils/speech.ts) and [`NellyAvatar.tsx`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/src/components/nelly/NellyAvatar.tsx).
   - Review South African regional voice fallback mappings (`en-ZA`, `zu-ZA`, `xh-ZA`, `st-ZA`, `sw-KE`, `zh-CN`, `de-DE`).
   - Guard against synthesis queue deadlocks, audio overlap, and unhandled browser voice synthesis cancellations.

---

## 5. Shandray's Prizm Driver Fatigue Telemetry & API Contracts
1. **Fatigue Handshake API**:
   - Audit [`api/v1/fatigue-score.js`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/api/v1/fatigue-score.js).
   - Validate payload bounds checking, driving hours risk thresholds, reaction drop calculations, and error-handling resilience.

---

## 6. Security, Zero-Knowledge Privacy & POPIA Compliance
1. **Data Privacy**:
   - Verify compliance with the Protection of Personal Information Act (POPIA).
   - Ensure posture telemetry and employee health indicators are kept strictly client-side or anonymized before storage.
   - Verify zero leakage of secret keys or sensitive tokens into client-side bundles.

---

## 7. Bundle Size, Code Splitting & Production Readiness
1. **Vite & Chunk Optimization**:
   - Audit [`vite.config.ts`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/vite.config.ts) and [`package.json`](file:///c:/Users/Desigan%20Tharmen/Desktop/ErgoSafe_Reborn_V3/package.json).
   - Implement dynamic code splitting (`React.lazy()`) for heavy modules (Three.js canvas, chart engines, PDF generators) to bring the initial bundle down to optimal fast-load benchmarks.

---

## Deliverables Required From Claude:
1. **Executive Audit Scorecard**: 1-10 rating across Architecture, Performance, OHS Legal Rigor, POPIA Privacy, and Code Hygiene.
2. **Prioritized Vulnerabilities & Inefficiencies Table**: Ranked by Severity (Critical, Warning, Optimization).
3. **Drop-in Optimized Code Patches**: Fully written replacement code blocks for critical files.
4. **Actionable Implementation Roadmap**: Quick wins vs strategic architectural refactors.
