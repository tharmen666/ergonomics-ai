# ErgoSafe Reborn | Autonomous Multi-Agent Industrial Safety Sentinel

> **Google Cloud & NVIDIA AI Hackathon Submission**  
> An agentic proof-of-concept demonstrating real-time ergonomics analysis, high-frequency environmental telemetry, and supervisory audit workflows powered by Google Cloud Agent Builder, Gemini, and NVIDIA-accelerated data processing.

---

## 🎯 The Vision & Problem Space
Industrial workplace compliance (anchored by frameworks like the South African OHS Act 85 of 1993, NIHL Regulations, and Ergonomics Regulations 2019) often suffers from manual data silos, delayed incident escalation, and static paper registers. 

**ErgoSafe** demonstrates how autonomous agentic workflows can transform static compliance checklists into proactive, real-time safety interventions.

---

## ⚙️ Architectural Core & Stack

* **AI document drafting:** `/api/compliance` calls the Anthropic Messages API (model from `ANTHROPIC_MODEL`) to draft HIRA/SWP/toolbox documents that a competent person must review and sign off. "Nelly" voice coaching uses rule-based responses and the browser's speech synthesis.
* **Telemetry & State Machines:** Deterministic rules for manual handling (>25 kg), carcass handling, knife deboning, cold-room exposure, posture angles and driver fatigue. These are risk triggers, not statutory limits.
* **Integrity & Auditability:** Client-side event logging and local browser storage for prototype demonstration.
  <!-- // TODO(privacy): implement encryption + POPIA s26 special-information handling before production -->
* **Human-in-the-Loop (HITL) Governance:** Pre-shift assessments highlight fatigue and strain risk indicators, routing alerts to shift supervisors rather than imposing unverified black-box decisions.
* **Storage:** Prototype only - all compliance records live in the browser (Zustand + localStorage). There is no server database yet, no encryption and no access control.
* **Frontend & Edge Delivery:** High-performance React 18, Vite, and Tailwind CSS deployed on global edge infrastructure with sub-second responsive interaction.

---

## ⚖️ Statutory Framework: OHS Act 85 of 1993

Designed with the **Occupational Health and Safety Act 85 of 1993** at its core, ErgoSafe Reborn assists employers with statutory compliance:

- **Section 8 (General Duties of Employers):** Assists employers in providing and maintaining a working environment that is safe and without risk to health.
- **Section 37 (Acts or Omissions of Employees and Mandataries):** Addresses employer and mandatary responsibilities, facilitating compliance documentation and Section 37(2) written arrangements.
  <!-- // TODO(legal-verify): removed claim that Section 37 provides automatic legal defense against negligence -->
- **Section 38 (Offences and Penalties):** Supports organizational visibility into compliance gaps to proactively address workplace health and safety.

---

## 🧠 Key Features & Workflows

1. **Pre-Shift Cognitive Handshake:** An interactive baseline test to identify acute cognitive fatigue. Reaction drops trigger fatigue mitigation protocols.
2. **Nelly Multilingual Voice Coach:** Conversational triage and audio coaching across regional languages.
3. **3D Biomechanical Spine Viewer:** Posture hazard visualizer (Tech-neck, Working from bed, Couch slouching) with ergonomic alerts.
4. **Prizm Driver Fatigue Telemetry:** Driving-hour tracking and reaction drop scoring with structured rest advisories.
5. **Audit Documentation:** In-browser compliance records aligned with OHS regulations and voluntary ISO 45001/45003 guidance.

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

## 🔐 Server configuration (Vercel environment variables)

| Variable | Required | Purpose |
|---|---|---|
| `ERGOSAFE_API_TOKEN` | **Yes** | Shared bearer token for `/api/*`. If unset, the API refuses every request (fails closed). |
| `VITE_ERGOSAFE_API_TOKEN` | Yes (same value) | Sent by the browser. **Visible in the public JS bundle** - this is a bot/cost guard, not user authentication. Replace with per-user sessions before production. |
| `ALLOWED_ORIGINS` | Yes in production | Comma-separated list of allowed origins for CORS (e.g. `https://ergosafe.example`). |
| `ANTHROPIC_API_KEY` | For AI drafting | Key for `/api/compliance`. Without it the endpoint returns 503. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5-5`. |

`/api/compliance` is rate-limited to 10 requests per 10 minutes per IP (per serverless instance).

---

## 🔒 Scope & Compliance Disclaimer
*ErgoSafe is an architectural prototype developed for hackathon demonstration and exploratory purposes. Audit logging and supervisory sign-off workflows demonstrate technical integrity and UI/UX patterns for statutory record-keeping, and do not constitute formal legal counsel or statutory certification under Section 16/37 of the South African OHS Act.*

---

*ErgoSafe Reborn: Autonomous Multi-Agent Industrial Safety Sentinel.*

