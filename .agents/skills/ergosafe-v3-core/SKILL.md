---
name: ergosafe-v3-core
description: Comprehensive architecture SOPs, state contracts, and implementation standards for ErgoSafe Reborn V3.
---

# ErgoSafe Reborn V3 - Core Architecture SOPs & Reusable Patterns

This skill serves as the authoritative architectural blueprint for **ErgoSafe Reborn V3**, documenting system components, state contracts, API specifications, and operational SOPs.

---

## 1. Core Navigation Standard (6 Primary Modules)

The application enforces a 6-item primary sidebar navigation structure defined in `src/components/layout/Sidebar.tsx` and routed via `src/App.tsx`:

1. **HR & Compliance Dashboard** (`/hr`) -> `HRDashboard.tsx`
   - Employee risk tracking, active compliance breach cases, and manager escalation workflows under Section 37 of the South African OHS Act 85 of 1993.
2. **Ergonomics Training & Certification** (`/training`) -> `TrainingPage.tsx`
   - Workstation posture modules, self-evaluations, and OHS certification progress.
3. **Daily Self-Risk Assessment** (`/assessment`) -> `SelfAssessmentPage.tsx`
   - WFH / desk ergonomics checklist and MediaPipe 3D posture telemetry input.
4. **Nelly Posture & Hazard Monitoring Engine** (`/nelly`) -> `RiskyBehaviorsPage.tsx`
   - Biomechanical posture hazard monitoring, tech-neck detection, and real-time hazard log event dispatch.
5. **Shandray's Prizm Driver & Shift Fatigue Telemetry** (`/fatigue`) -> `GEARDashboardPage.tsx`
   - Continuous driving-hour tracking, reaction drop scoring, and real-time Prizm alert triggers.
6. **Analytics & Regulatory Audit Logs** (`/reports`) -> `ReportsPage.tsx`
   - Administrative zero-knowledge compliance dossiers, G.E.A.R. metric analytics, and ISO 45001/45003 audit logs.

---

## 2. 3D Spinal Alignment & Unsafe Behavior Detection

- **Component**: `src/components/agent/SpineViewer.tsx`
- **Scenarios**:
  - `Neutral Ergonomic Desk` (`good`): S-curve spinal alignment.
  - `Working from Bed` (`critical`): Pelvic-to-spine angle >= 120°, cervical tilt >= 30°.
  - `Couch Slouching` (`warning`): Lumbar spine unsupported, thoracic kyphosis.
  - `Tech-Neck Flexion` (`critical`): Cervical load jumps from 12 lbs to 60 lbs.
  - `Monitor Height Mismatch` (`warning`): Continuous cervical extension strain.
- **Hazard Log Integration**:
  - Calling `useComplianceStore.getState().logHazardEvent('posture', description, 'BREACH')` directly appends incident records to the compliance ledger.

---

## 3. Nelly Multilingual Conversational Bot & Speech Engine

- **Voice Engine**: `src/utils/speech.ts`
- **Supported Languages & Accent Routing**:
  - `en-ZA` (South African English)
  - `zu-ZA` (isiZulu)
  - `xh-ZA` (isiXhosa)
  - `st-ZA` (Sesotho)
  - `sw-KE` (KiSwahili)
  - `zh-CN` (Mandarin)
  - `de-DE` (German)
- **Triage & NLP Logic**:
  - `NellyAvatar.tsx` handles real-time conversational triage for lower back pain (L1-L5), neck strain, wrist/carpal compression, eye strain (20-20-20 rule), and OHS compliance queries.
  - Responses are spoken aloud via `speak(text, lang)` with human pitch/rate modulation and logged into `complianceStore`.

---

## 4. Shandray's Prizm Driver Fatigue Handshake API

- **Endpoint**: `/api/v1/fatigue-score` (`api/v1/fatigue-score.js`)
- **Method**: `POST`
- **Payload Contract**:
  ```json
  {
    "driverId": "DRV-9042",
    "drivingHours": 6.5,
    "reactionTimes": [420, 480, 590, 680],
    "reactionDropPct": 32.5,
    "shiftType": "long-distance-driver"
  }
  ```
- **Response Contract**:
  ```json
  {
    "success": true,
    "driverId": "DRV-9042",
    "fatigueScore": 78,
    "riskLevel": "CRITICAL_BREACH",
    "drivingHours": 6.5,
    "reactionDropPct": 32.5,
    "prizmAlertTriggered": true,
    "recommendedAction": "PRIZM CRITICAL ALERT: Pull over immediately for 30-min power rest.",
    "ohsComplianceAdvisory": "Section 37 OHS Act Breach: Continuous driving hours exceed safe limits.",
    "handshakeStatus": "SHANDRAY_PRIZM_ACKNOWLEDGED",
    "timestamp": "2026-08-01T00:45:00.000Z"
  }
  ```

---

## 5. Interactive Demo Video <-> Executive Briefing Sync

- **Component**: `src/features/dashboard/ExecutiveBriefing.tsx`
- **Video Timestamps**:
  - `00:15`: Executive OHS & POPI Compliance Handshake
  - `01:15`: Nelly Ergonomic Engine & Biomechanical Posture Alert
  - `02:40`: Shandray's Prizm Driver & Shift Fatigue Handshake
  - `04:10`: Section 37 / OHS Legal Risk Mitigation & ROI Audit
- **Interactive Player**: Integrated Video Player Modal with simulated playback timeline.
- **Audio Narration**: "Narrate Briefing" button invoking `speak()` for executive audio summaries.

---

## 6. Behavior-Based Safety (BBS) Corrective Action Engine

- **Component**: `src/components/agent/BBSCorrectiveActionOverlay.tsx`
- **Hazard-to-Training Matrix**:
  1. **3D Posture Hazards (Bed/Couch/Tech-Neck)** -> 15-second interactive postural reset stretch overlay.
  2. **Shandray Driver Fatigue Alerts (>4h / Score >=40)** -> 60-second power-breathing and hydration/break compliance advisory.
  3. **Digital Eye Strain / Long Shifts** -> 20-second ocular 20-20-20 & cervical glide exercises.
- **Audit Logging Contract**:
  - Calling `useComplianceStore.getState().logVerifiedBBSIntervention(type, hazardResolved, durationSeconds)` appends `"Verified BBS Micro-Intervention"` records with user ID, timestamp, and hazard resolved to the compliance ledger.
- **Nelly Audio Guidance**:
  - Nelly automatically speaks the corrective action instructions in the active regional voice accent.
