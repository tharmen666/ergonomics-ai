# ErgoSafe Reborn | Autonomous Multi-Agent Industrial Safety Sentinel

> **Google Cloud & NVIDIA AI Hackathon Submission**  
> An agentic proof-of-concept demonstrating real-time ergonomics analysis, high-frequency environmental telemetry, and supervisory audit workflows powered by Google Cloud Agent Builder, Gemini, and NVIDIA-accelerated data processing.

---

## 🎯 The Vision & Problem Space
Industrial workplace compliance (anchored by frameworks like the South African OHS Act 85 of 1993, NIHL Regulations, and Ergonomics Regulations 2019) often suffers from manual data silos, delayed incident escalation, and static paper registers. 

**ErgoSafe** demonstrates how autonomous agentic workflows can transform static compliance checklists into proactive, real-time safety interventions.

---

## ⚙️ Architectural Core & Stack

* **Agent Orchestration & Intelligence:** Orchestrated with Gemini models via Google Cloud Agent Builder, enabling natural language safety advisory and procedural multi-lingual voice coaching ("Nelly").
* **Telemetry & State Machines:** Deterministic calculation engines evaluating noise dosimeter thresholds (85 dBA 3dB exchange rate), WBGT thermal stress indicators, and ergonomic strain factors.
* **Integrity & Auditability:** Client-side tamper-evident event logging utilizing the **Web Crypto API (SHA-256)**, creating an immutable verification chain for inspection preparation.
* **Human-in-the-Loop (HITL) Governance:** Pre-shift assessments highlight fatigue and strain risk indicators, routing alerts to shift supervisors rather than imposing unverified black-box decisions.
* **Database & Partner Ledger:** MongoDB MCP Server integration for live safety telemetry, posture scans, and Section 37/38 legal compliance logs.
* **Frontend & Edge Delivery:** High-performance React 18, Vite, and Tailwind CSS deployed on global edge infrastructure with sub-second responsive interaction.

---

## ⚖️ Legal Guardrails: Sections 37 & 38

Designed with the **Occupational Health and Safety Act 85 of 1993** at its core, ErgoSafe Reborn explicitly addresses the strict liability factors that modern workplace leadership faces:

- **Section 37 (Acts or Omissions by Employees):** Tracks and mitigates ergonomic and environmental risks, logging a verifiable digital trail of safety interventions to protect corporate leadership from claims of negligence.
- **Section 38 (Offences):** Non-compliance with safety provisions can result in severe fines or penalties. ErgoSafe features a **DOA Lockout** mechanism that temporarily disables high-risk operational sign-offs for employees flagged with acute fatigue or strain.

---

## 🧠 Key Features & Workflows

1. **Pre-Shift & Pre-Login Cognitive Handshake:** A mandatory interaction test establishing a cognitive baseline. Reaction drops > 20% trigger specialized fatigue mitigation protocols.
2. **Nelly Multilingual Voice Coach:** Real-time conversational triage and audio coaching across 7 regional languages (en-ZA, zu-ZA, xh-ZA, st-ZA, sw-KE, zh-CN, de-DE).
3. **3D Biomechanical Spine Viewer:** Real-time posture hazard monitoring (Tech-neck, Working from bed, Couch slouching) dispatching automated compliance ledger events.
4. **Shandray's Prizm Driver Fatigue Telemetry:** Continuous driving-hour tracking and reaction drop scoring with automated rest advisories.
5. **Zero-Knowledge Audit Dossiers:** Client-side Web Crypto API (SHA-256) tamper-evident event logging producing ISO 45001/45003 compliance audit records.

---

## 🚀 Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Prepare for production 
npm run build
```

The master production branch automatically deploys to Vercel upon push: [https://ergo-safe-reborn.vercel.app](https://ergo-safe-reborn.vercel.app)

---

## 🧪 Reproducible Testing & Local Setup

Use the following steps to reproduce a local validation run from a clean checkout.

### 1. Clone the repository

```bash
git clone https://github.com/tharmen666/ergonomics-ai.git
cd ergonomics-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the local development server

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173` in a browser.

### 4. Test the live audio and HQ demo assets

With the development server running, verify that the HQ video and audio tracks load:

```text
http://127.0.0.1:5173/assets/ErgoSafe_Reborn_30s_1080p_Narrated_Demo.mp4
http://127.0.0.1:5173/assets/rachel_narrative.mp3
```

### 5. Run automated browser checks

```bash
npx playwright test
```

### 6. Run build verification

```bash
npm run build
```

---

## 🔒 Scope & Compliance Disclaimer
*ErgoSafe is an architectural prototype developed for hackathon demonstration and exploratory purposes. Audit logging and supervisory sign-off workflows demonstrate technical integrity and UI/UX patterns for statutory record-keeping, and do not constitute formal legal counsel or statutory certification under Section 16/37 of the South African OHS Act.*

---

*ErgoSafe Reborn: Autonomous Multi-Agent Industrial Safety Sentinel.*

