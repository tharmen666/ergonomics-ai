/**
 * ErgoSafe Reborn V3 - Statutory OHS Compliance API Engine
 * Server-side handler for generating statutory OHS documents grounded in South African legislation.
 */

declare const process: { env: Record<string, string | undefined> };

export interface ComplianceRequestPayload {
  taskType: string; // e.g., "HIRA", "SWP", "Incident Root Cause", "Toolbox Talk"
  siteContext: string; // e.g., "Logistics Warehouse - Durban Port"
  hazards: string; // e.g., "Repetitive lumbar strain from lifting 25kg boxes, monitor height mismatch"
}

export interface ComplianceResponseData {
  success: boolean;
  document: string;
  fallback?: boolean;
  metadata: {
    taskType: string;
    siteContext: string;
    hazards: string;
    timestamp: string;
    grounding: string;
    model: string;
  };
  error?: string;
}

export const OHS_SYSTEM_PROMPT = `You are the embedded statutory engine for ErgoSafe, acting as an expert South African Occupational Health and Safety (OHS) Compliance & Risk Management Specialist.

Core Directives:
1. Standards Taxonomy Separation:
   - Mandatory South African Statutory Frameworks:
     * Occupational Health and Safety Act 85 of 1993 (Sections 8, 14, 16, 17, 24, 37, 38).
     * Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019). Do NOT cite draft GNR 1009.
     * Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) for thermal stress (cold/heat) and illumination (replacing repealed Environmental Regulations 1987).
     * General Safety Regulations (GSR): GSR 13H (Housekeeping & Floor Maintenance) and GSR 13J (Fire precaution & means of egress with outward-opening doors).
     * COIDA Act 130 of 1993.
   - Voluntary Best-Practice Frameworks: ISO 45001:2018 (Occupational Health & Safety Management Systems) and ISO 45003:2021 (Psychosocial Risk). Always label ISO standards as voluntary, never statutory in South Africa.
2. Statutory Record Retention:
   - 40 YEARS for Regulation 6 Ergonomic Risk Assessments and Regulation 8 Medical Surveillance records (Ergonomics Regulations, 2019 Regulation 10(1)).
   - 3 YEARS for equipment inspection logs, lifting tackle, and control measure maintenance (Regulations 7 & 9).
3. Medical Surveillance (Regulation 8(1)):
   - Physical hazards trigger an OMP referral recommendation under Regulation 8(1) where the Regulation 6 risk assessment indicates the need or an occupational health practitioner recommends it. Do NOT state that medical surveillance is legally mandatory.
4. Hierarchy of Controls: Strictly sequence controls: Elimination -> Substitution -> Engineering -> Administrative -> PPE.
5. Citations: Cite specific statutory sections and regulations correctly.
6. Format & Disclaimers: Deliver clean, structured Markdown ready for on-screen review and PDF compilation. Always include the Statutory Compliance Notice disclaimer banner and Competent Person verification sign-off section.`;

/**
 * Executes statutory compliance generation via Anthropic API (or structured statutory fallback).
 */
export async function generateStatutoryDocument(
  payload: ComplianceRequestPayload
): Promise<ComplianceResponseData> {
  const { taskType = 'HIRA', siteContext = 'General Facility', hazards = 'Unspecified postural & physical hazards' } = payload;
  const timestamp = new Date().toISOString();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const modelName = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';

  const userPrompt = `Generate a statutory OHS compliance document for South African workplace safety:
Document Type: ${taskType}
Site / Workplace Context: ${siteContext}
Identified Hazards & Risk Factors: ${hazards}

Provide a comprehensive, professional ${taskType} document strictly grounded in South African OHS legislation.
Ensure clear headers, statutory reference citations, an initial risk rating section to be completed by the assessor, a strict Hierarchy of Controls matrix, and formal approval fields for the designated statutory Competent Person (Appointed Sec 16.2 / Risk Assessor).`;

  if (apiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelName,
          max_tokens: 3000,
          temperature: 0.0,
          system: OHS_SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const contentBlock = data.content?.[0];
        if (contentBlock && contentBlock.type === 'text' && contentBlock.text) {
          return {
            success: true,
            document: contentBlock.text,
            metadata: {
              taskType,
              siteContext,
              hazards,
              timestamp,
              grounding: 'OHS Act 85 of 1993, Ergonomics Regs 2019 (Mandatory Statutory) & ISO 45001:2018 (Voluntary Framework)',
              model: `${modelName} (Deterministic Temp 0.0 with Human Sign-Off Gate)`
            }
          };
        }
      } else {
        console.warn('[ErgoSafe Compliance API] Anthropic API returned HTTP error:', response.status);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('[ErgoSafe Compliance API] Failed to invoke Anthropic API:', err);
    }
  }

  // If upstream model fails or API key is unconfigured, return clean 503 Service Unavailable
  return {
    success: false,
    fallback: false,
    document: '',
    error: 'Service Unavailable: Upstream AI compliance model is unavailable. Please verify API key configuration.',
    metadata: {
      taskType,
      siteContext,
      hazards,
      timestamp,
      grounding: 'South African OHS Act 85 of 1993 & Ergonomics Regulations, 2019',
      model: 'None (Upstream 503)'
    }
  };
}

/**
 * Fallback generator for South African statutory documentation
 */
function generateSouthAfricanStatutoryFallback(
  taskType: string,
  siteContext: string,
  hazards: string,
  timestamp: string
): string {
  const dateStr = new Date(timestamp).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `> **STATUTORY COMPLIANCE NOTICE**: *AI-assisted draft compiled for operational guidance. In terms of the Occupational Health and Safety Act (Act 85 of 1993), this document is not a certified legal record until reviewed, adjusted for site-specific conditions, and signed off by a designated Competent Person.*

# REPUBLIC OF SOUTH AFRICA - STATUTORY OHS COMPLIANCE DOSSIER
**Document Type:** ${taskType.toUpperCase()}
**Statutory Framework:** Occupational Health and Safety Act 85 of 1993 & Ergonomics Regulations, 2019
**Site / Workplace Context:** ${siteContext}
**Date of Assessment:** ${dateStr}
**Document Ref:** RSA-OHS-${Math.floor(100000 + Math.random() * 900000)}

---

## 1. STANDARDS TAXONOMY & MANDATE

### A. Mandatory South African Statutory Frameworks:
- **OHS Act 85 of 1993 Section 8(1) & 8(2)(b):** Legal duty to provide a safe workspace and eliminate or mitigate hazards.
- **Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019):** Regulation 6 Ergonomic Risk Assessment, Regulation 8(1) Medical Surveillance (surveillance is required where the Regulation 6 risk assessment indicates the need or an occupational health practitioner recommends it, with referral to an Occupational Medicine Practitioner), and Regulation 10 (40-year statutory record retention for assessments/surveillance; 3-year retention for equipment logs under Regs 7 & 9).
- **Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025):** Mandatory thermal stress management and illumination standards.
- **General Safety Regulations:** GSR 13H (Housekeeping & floor maintenance) and GSR 13J (Fire precaution and means of egress with unobstructed outward-opening doors).
- **Compensation for Occupational Injuries & Diseases Act (COIDA Act 130 of 1993):** Disease prevention and statutory injury reporting.

### B. Voluntary Best-Practice Frameworks:
- **ISO 45001:2018 Clause 6.1.2:** Voluntary international standard for Occupational Health & Safety Management Systems.

---

## 2. HAZARD IDENTIFICATION & EVALUATION
**Target Workplace Environment:** ${siteContext}  
**Identified Hazard Scope:** ${hazards}

### Risk Score Evaluation:
- **Risk Rating:** *Risk rating must be completed by the competent assessor based on site inspection and severity/likelihood evaluation.*
- **Assessment Scope:** Ergonomic and physical agents risk assessment under Regulation 6.

---

## 3. HIERARCHY OF CONTROLS (RSA OHS ACT SECTION 8)

| Priority Level | Hierarchy Tier | Statutory Mitigation Strategy | Framework Reference |
| :--- | :--- | :--- | :--- |
| **1. Primary** | **Elimination** | Redesign workflow to eliminate manual handling of loads >25kg and awkward static postures. | OHS Act Sec 8(2)(a) |
| **2. Secondary** | **Substitution** | Replace rigid equipment with height-adjustable and ergonomic mechanical aids. | Ergonomics Reg 6(3) |
| **3. Tertiary** | **Engineering Controls** | Install adjustable workstations, anti-fatigue flooring, and mechanical pallet lifters. | GSR 2 / Voluntary ISO 45001 |
| **4. Quaternary** | **Administrative Controls** | Implement scheduled rest breaks, task rotation, and ergonomic awareness training. | Ergonomics Reg 7 |
| **5. Quinary** | **Personal Protective Equipment (PPE)** | Issue slip-resistant safety footwear, anti-vibration gloves, and job-appropriate gear. | GSR 2(1) |

---

## 4. SAFE WORK PROCEDURE (SWP) & OPERATIONAL CONTROLS

1. **Pre-Shift Verification:** Supervisors must confirm all mechanical aids are inspected prior to shift commencement.
2. **Workplace Ergonomic Review:** Periodic task evaluation conducted to detect posture fatigue indicators.
3. **Escalation Protocol:** Posture strain or ergonomic risks identified must be documented and addressed under Section 8(1) general duties and routed to designated Section 16(2) assignees for remediation.

---

## 5. STATUTORY VERIFICATION & COMPETENT PERSON SIGN-OFF

- **Designated Competent Person:** \`______________________\`  **Date:** \`${dateStr}\`
- **Statutory Role / Designation:** \`______________________\`  **Appointee ID:** \`RSA-OHS-SEC162\`
- **ErgoSafe System Verification:** \`OFFLINE TEMPLATE - REQUIRES SITE VALIDATION\`
`;
}
