/**
 * ErgoSafe Reborn V3 — Forecourt Training & Statutory Compliance Engine
 * Provides multi-country statutory mapping (South Africa, Tanzania, Kenya,
 * Uganda, Ethiopia, and ISO standards), emergency & forecourt safety protocols
 * (9-step evacuation, 8-step spill response, P.A.S.S. firefighting, hydrocarbon
 * first aid, armed robbery security, and the 4+1 Spare Wheel Permeation check
 * grounded in Pascal's Law), plus mandatory corporate/personnel governance
 * normalization (Roof King -> BRILLIANT GROUP ONE, VEDAN -> VESHAN).
 */

import type { JurisdictionCode } from './wetstockEngine';

export interface StatutoryFrameworkMap {
  jurisdiction: JurisdictionCode;
  countryName: string;
  primaryOhsStatute: string;
  environmentalStatute: string;
  petroleumTechnicalStandards: string[];
  fiscalAndTelemetryMandate: string;
  regulatoryAuthorities: string[];
}

export interface EmergencyProtocolStep {
  stepNumber: number;
  actionTitle: string;
  instruction: string;
  criticalControl: string;
}

export interface PassFirefightingStage {
  letter: 'P' | 'A' | 'S_SQUEEZE' | 'S_SWEEP';
  word: 'PULL' | 'AIM' | 'SQUEEZE' | 'SWEEP';
  instruction: string;
  safetyDistanceMetres: string;
}

export interface HydrocarbonFirstAidRule {
  exposureRoute: 'INHALATION' | 'SKIN_CONTACT' | 'EYE_SPLASH' | 'INGESTION';
  immediateResponse: string;
  strictProhibition: string;
  medicalEscalationTrigger: string;
}

export interface SpareWheelPermeationResult {
  frontLeftPsi: number;
  frontRightPsi: number;
  rearLeftPsi: number;
  rearRightPsi: number;
  spareWheelPsi: number;
  targetRoadPsi: number;
  targetSparePsi: number;
  estimatedMonthlyPermeationLossPsi: number;
  pascalsLawForceNewtonPerSqM: number;
  roadTyresCompliant: boolean;
  spareWheelCompliant: boolean;
  overall4Plus1Compliant: boolean;
  remediationNote: string;
}

export interface TrainingRegisterEntry {
  recordId: string;
  companyName: string;
  traineeName: string;
  role: string;
  jurisdiction: JurisdictionCode;
  completedModules: string[];
  completedAtIso: string;
}

export const MULTI_COUNTRY_STATUTORY_MAP: Record<JurisdictionCode, StatutoryFrameworkMap> = {
  ZA: {
    jurisdiction: 'ZA',
    countryName: 'South Africa',
    primaryOhsStatute: 'Occupational Health and Safety Act 85 of 1993 (and Major Hazard Installation / Ergonomics Regulations)',
    environmentalStatute: 'National Environmental Management Act (NEMA) 107 of 1998 & National Water Act 36 of 1998',
    petroleumTechnicalStandards: [
      'SANS 10089-1: The Petroleum Industry — Storage and distribution of petroleum products in above-ground bulk installations',
      'SANS 10089-2: Electrical and other installations in the distribution and marketing sector',
      'SANS 10131: Above-ground storage tanks for petroleum products',
    ],
    fiscalAndTelemetryMandate: 'DMRE Retail Site Licensing & SARS Customs/Excise Fuel Levy Reconciliation',
    regulatoryAuthorities: ['Department of Employment and Labour (DEL)', 'DMRE', 'DFFE'],
  },
  TZ: {
    jurisdiction: 'TZ',
    countryName: 'Tanzania',
    primaryOhsStatute: 'Occupational Health and Safety Act, No. 5 of 2003 (OSHA Tanzania)',
    environmentalStatute: 'Environmental Management Act, Cap 191 (NEMC)',
    petroleumTechnicalStandards: [
      'EWURA Petroleum (Retail Operations) Rules',
      'EWURA Automatic Tank Gauging (ATG) Guidelines (December 2024 Approved Model Registry)',
      'TBS Petroleum Storage & Dispensing Standards',
    ],
    fiscalAndTelemetryMandate:
      'Mandatory Electronic Fiscal Devices (EFD) at pump (July 2017) & EWURA Real-Time ATG Tank Telemetry (December 2024)',
    regulatoryAuthorities: ['EWURA', 'OSHA Tanzania', 'TRA (Tanzania Revenue Authority)', 'NEMC'],
  },
  KE: {
    jurisdiction: 'KE',
    countryName: 'Kenya',
    primaryOhsStatute: 'Occupational Safety and Health Act (OSHA), No. 15 of 2007 (DOSH)',
    environmentalStatute: 'Environmental Management and Co-ordination Act (EMCA), 1999 (NEMA Kenya)',
    petroleumTechnicalStandards: [
      'Petroleum Act, No. 2 of 2019 & EPRA Retail Dispensing Site Regulations',
      'KEBS KS 2504 / ISO Forecourt Underground Storage & Dispensing Standards',
    ],
    fiscalAndTelemetryMandate:
      'KRA eTIMS Fuel System Real-Time Pump-to-Tax Integration Mandate (30 June / 31 December 2025 deadlines)',
    regulatoryAuthorities: ['EPRA (Energy and Petroleum Regulatory Authority)', 'KRA', 'DOSH', 'NEMA Kenya'],
  },
  UG: {
    jurisdiction: 'UG',
    countryName: 'Uganda',
    primaryOhsStatute: 'Occupational Safety and Health Act, 2006',
    environmentalStatute: 'National Environment Act, No. 5 of 2019 (NEMA Uganda)',
    petroleumTechnicalStandards: [
      'Petroleum Supply Act, 2003 & Petroleum (Marking and Quality Control) Regulations',
      'UNBS US 945: Petroleum Retail Service Station Design & Safety Code',
    ],
    fiscalAndTelemetryMandate:
      'URA EFRIS (Electronic Fiscal Receipting and Invoicing Solution) Fuel Retail Mandate (effective 1 July 2025; min UGX 6,000,000 penalty per missed invoice)',
    regulatoryAuthorities: ['Ministry of Energy and Mineral Development (MEMD)', 'URA', 'UNBS', 'NEMA Uganda'],
  },
  ET: {
    jurisdiction: 'ET',
    countryName: 'Ethiopia',
    primaryOhsStatute: 'Ethiopian Labour Proclamation No. 1156/2019 (Part Seven: Occupational Safety, Health and Working Environment)',
    environmentalStatute: 'Environmental Pollution Control Proclamation No. 300/2002 (EPA Ethiopia)',
    petroleumTechnicalStandards: [
      'Petroleum and Petroleum Products Supply and Distribution Operations Proclamation',
      'Ethiopian Standards Agency (ESA) Forecourt Storage & Dispensing Safety Code',
    ],
    fiscalAndTelemetryMandate:
      'Mandatory Cashless Forecourt Directive via Telebirr and Commercial Bank Digital Rails (Addis Ababa 24 April 2023; Nationwide 1 July 2023)',
    regulatoryAuthorities: ['Ministry of Trade and Regional Integration (MoTRI)', 'Petroleum and Energy Authority', 'MoLS'],
  },
  ISO: {
    jurisdiction: 'ISO',
    countryName: 'International / ISO Multi-Site Baseline',
    primaryOhsStatute: 'ISO 45001:2018 — Occupational Health and Safety Management Systems',
    environmentalStatute: 'ISO 14001:2015 — Environmental Management Systems',
    petroleumTechnicalStandards: [
      'ISO 9001:2015 — Quality Management Systems',
      'NFPA 30 / NFPA 30A — Code for Motor Fuel Dispensing Facilities',
    ],
    fiscalAndTelemetryMandate: 'Automated Forecourt Controller (FCC) + ATG + POS Closed-Loop Reconciliation',
    regulatoryAuthorities: ['Accredited Third-Party ISO Certifiers', 'Corporate HSE Stewardship Board'],
  },
};

/**
 * 9-Step Emergency Evacuation Protocol for Forecourt & Bulk Offload Operations.
 */
export const NINE_STEP_EVACUATION_PROTOCOL: readonly EmergencyProtocolStep[] = [
  {
    stepNumber: 1,
    actionTitle: 'Activate Emergency Stop (E-Stop)',
    instruction: 'Slam the red mushroom Emergency Stop button to cut electrical power to all dispensers and submersible turbine pumps (STPs).',
    criticalControl: 'Zero fuel flow and electrical isolation within 3 seconds.',
  },
  {
    stepNumber: 2,
    actionTitle: 'Sound Site Alarm & Alert Marshal',
    instruction: 'Trigger the audible forecourt siren and notify the designated Chief Fire / Evacuation Marshal.',
    criticalControl: 'Immediate site-wide acoustic and visual alert.',
  },
  {
    stepNumber: 3,
    actionTitle: 'Cease Bulk Tanker Offloading',
    instruction: 'Close tanker quick-release foot valves and emergency pneumatic shut-offs if a bulk drop is in progress.',
    criticalControl: 'Prevents catastrophic gravity-fed manifold spill.',
  },
  {
    stepNumber: 4,
    actionTitle: 'Instruct Motorists — Ignition Off',
    instruction: 'Direct all drivers on the forecourt to leave vehicle ignitions OFF, exit vehicles immediately, and leave doors unlocked.',
    criticalControl: 'Eliminates starter-motor spark ignition sources in vapour zones.',
  },
  {
    stepNumber: 5,
    actionTitle: 'Clear Convenience Store & Back-Office',
    instruction: 'Floor wardens sweep the convenience shop, cashier kiosk, lube bay, and rest areas.',
    criticalControl: 'Ensures zero trapped customers or contractors indoors.',
  },
  {
    stepNumber: 6,
    actionTitle: 'Retrieve Grab-Pack & Attendance Register',
    instruction: 'Duty Supervisor collects the statutory Emergency Grab-Pack, shift roster, and visitor logbook.',
    criticalControl: 'Required for accurate head-count verification at assembly point.',
  },
  {
    stepNumber: 7,
    actionTitle: 'Evacuate Upwind to Assembly Point',
    instruction: 'Guide all personnel and public upwind (cross-wind if necessary) away from underground tank vents and vapour plumes to the Assembly Point.',
    criticalControl: 'Prevents toxic benzene/hydrocarbon vapour inhalation and flash-fire exposure.',
  },
  {
    stepNumber: 8,
    actionTitle: 'Conduct Roll Call & Account for All Persons',
    instruction: 'Cross-check shift register, tanker driver, and visitors at the Assembly Point; report any missing person immediately.',
    criticalControl: 'Zero unauthorized re-entry; only trained rescue teams may enter.',
  },
  {
    stepNumber: 9,
    actionTitle: 'Liaise with Emergency Services & Lock Scene',
    instruction: 'Hand over hazardous substance SDS/site layout map to Fire & Rescue services and await formal Competent Person All-Clear.',
    criticalControl: 'Statutory scene preservation and post-incident log entry.',
  },
];

/**
 * 8-Step Hydrocarbon Spill Response Protocol.
 */
export const EIGHT_STEP_SPILL_PROTOCOL: readonly EmergencyProtocolStep[] = [
  {
    stepNumber: 1,
    actionTitle: 'Isolate Fuel Source & E-Stop',
    instruction: 'Release nozzle latch, close valve, or hit the pump Emergency Stop if spill exceeds 5 litres or continues flowing.',
    criticalControl: 'Stops active hydrocarbon release immediately.',
  },
  {
    stepNumber: 2,
    actionTitle: 'Eliminate Ignition Sources & Cordon Zone',
    instruction: 'Prohibit vehicle startup, smoking, or mobile phone use within a 15-metre hazard radius; deploy high-visibility hazard cones.',
    criticalControl: 'Prevents vapour flash ignition.',
  },
  {
    stepNumber: 3,
    actionTitle: 'Don Hydrocarbon-Resistant PPE',
    instruction: 'Put on nitrile chemical gauntlets, anti-static safety footwear, eye protection, and high-visibility vest from the Spill Kit.',
    criticalControl: 'Protects responder against dermal benzene absorption and static discharge.',
  },
  {
    stepNumber: 4,
    actionTitle: 'Protect Stormwater Drains & Oil Separator',
    instruction: 'Deploy hydrophobic absorbent socks/booms around the downstream perimeter and stormwater drain grates first.',
    criticalControl: 'Prevents environmental contamination breach under NEMA / EMCA.',
  },
  {
    stepNumber: 5,
    actionTitle: 'Apply Encapsulating Absorbent / Dry Sand',
    instruction: 'Spread hydrophobic peat/granules or dry forecourt sand from the outer edge of the spill inward.',
    criticalControl: 'Suppresses volatile hydrocarbon vapour pressure and absorbs liquid.',
  },
  {
    stepNumber: 6,
    actionTitle: 'Sweep with Non-Sparking Tools Only',
    instruction: 'Agitate and sweep saturated absorbent using a non-sparking polypropylene/brass shovel and stiff broom (never steel tools).',
    criticalControl: 'Eliminates frictional spark hazard.',
  },
  {
    stepNumber: 7,
    actionTitle: 'Seal in Hazardous Waste Drum',
    instruction: 'Place contaminated absorbent into heavy-duty yellow hazardous waste bags, seal, label, and store in the bunded hazmat bin.',
    criticalControl: 'Ensures cradle-to-grave hazardous waste manifest compliance.',
  },
  {
    stepNumber: 8,
    actionTitle: 'Restock Spill Kit & Log Incident',
    instruction: 'Replenish the forecourt Spill Kit immediately and record the spill volume, cause, and manifest ID in the statutory register.',
    criticalControl: 'Restores site readiness before resuming normal lane operation.',
  },
];

/**
 * P.A.S.S. Firefighting Protocol for Class B (Flammable Liquid) & Class C/E Forecourt Fires.
 */
export const PASS_FIREFIGHTING_PROTOCOL: readonly PassFirefightingStage[] = [
  {
    letter: 'P',
    word: 'PULL',
    instruction: 'Pull the safety tamper pin from the 9kg DCP (Dry Chemical Powder) or CO2 extinguisher handle while standing upwind.',
    safetyDistanceMetres: '3.0m – 4.5m upwind from flame edge',
  },
  {
    letter: 'A',
    word: 'AIM',
    instruction: 'Aim the discharge nozzle/horn low at the BASE of the fire (the leading edge of the burning fuel pool), never at the upper flames.',
    safetyDistanceMetres: '3.0m minimum initial standoff',
  },
  {
    letter: 'S_SQUEEZE',
    word: 'SQUEEZE',
    instruction: 'Squeeze the operating lever firmly and evenly to discharge the extinguishing agent in a continuous blanket.',
    safetyDistanceMetres: 'Maintain clear escape route behind you',
  },
  {
    letter: 'S_SWEEP',
    word: 'SWEEP',
    instruction: 'Sweep the nozzle side-to-side across the base of the fire beyond its width until smothered, watching for hot-surface re-ignition.',
    safetyDistanceMetres: 'Never turn your back on an extinguished hydrocarbon fire',
  },
];

/**
 * Hydrocarbon First Aid Protocol.
 */
export const HYDROCARBON_FIRST_AID_PROTOCOL: readonly HydrocarbonFirstAidRule[] = [
  {
    exposureRoute: 'INGESTION',
    immediateResponse: 'Rinse mouth thoroughly with water, keep casualty calm and seated upright, and transport to hospital immediately with product SDS.',
    strictProhibition: 'NEVER INDUCE VOMITING and never give milk, alcohol, or oils (aspiration of petrol/diesel into lungs causes fatal chemical pneumonitis).',
    medicalEscalationTrigger: 'Immediate emergency medical referral for any suspected hydrocarbon ingestion.',
  },
  {
    exposureRoute: 'INHALATION',
    immediateResponse: 'Move casualty immediately to fresh air upwind, loosen tight clothing at neck/waist, and monitor breathing.',
    strictProhibition: 'Never enter an unventilated tank sump or confined vapour pit without SCBA breathing apparatus.',
    medicalEscalationTrigger: 'Dizziness, slurred speech, nausea, or altered consciousness.',
  },
  {
    exposureRoute: 'SKIN_CONTACT',
    immediateResponse: 'Remove fuel-soaked clothing immediately (avoiding static sparks) and wash skin thoroughly with mild soap and running water for 15 minutes.',
    strictProhibition: 'Never use solvents, paraffin, or petrol to wash oil/grease off skin.',
    medicalEscalationTrigger: 'Persistent erythema, chemical burns, or high-pressure diesel injection injury.',
  },
  {
    exposureRoute: 'EYE_SPLASH',
    immediateResponse: 'Hold eyelids open and flush continuously with lukewarm eyewash solution or clean running water from nasal corner outward for at least 15 minutes.',
    strictProhibition: 'Never rub eyes or apply unprescribed eye drops.',
    medicalEscalationTrigger: 'Mandatory ophthalmological / clinic review after any fuel splash to the eye.',
  },
];

/**
 * Evaluates the 4+1 Spare Wheel Permeation Check grounded in Pascal's Law (P = F / A).
 * Even an unused spare tyre loses ~1.5 to 2.0 PSI per month due to natural diatomic gas
 * permeation through the butyl rubber liner. Checking all 4 road wheels plus the 1 spare
 * prevents stranded fleet/attendant breakdowns and tyre blowouts.
 */
export function evaluate4Plus1SpareWheelCheck(input: {
  frontLeftPsi: number;
  frontRightPsi: number;
  rearLeftPsi: number;
  rearRightPsi: number;
  spareWheelPsi: number;
  targetRoadPsi: number;
  monthsSinceLastSpareCheck?: number;
}): SpareWheelPermeationResult {
  const targetSparePsi = Math.round((input.targetRoadPsi + 2) * 10) / 10; // Spare inflated +2 PSI buffer for permeation
  const roadTolerance = 2.0;

  const roadTyres = [input.frontLeftPsi, input.frontRightPsi, input.rearLeftPsi, input.rearRightPsi];
  const roadTyresCompliant = roadTyres.every((psi) => Math.abs(psi - input.targetRoadPsi) <= roadTolerance);
  const spareWheelCompliant = input.spareWheelPsi >= input.targetRoadPsi;
  const overall4Plus1Compliant = roadTyresCompliant && spareWheelCompliant;

  const months = Math.max(input.monthsSinceLastSpareCheck ?? 1, 1);
  const estimatedMonthlyPermeationLossPsi =
    input.spareWheelPsi < targetSparePsi
      ? Math.round(((targetSparePsi - input.spareWheelPsi) / months) * 100) / 100
      : 1.5;

  // Pascal's Law: 1 PSI = 6,894.757 Pascals (N/m²)
  const pascalsLawForceNewtonPerSqM = Math.round(input.spareWheelPsi * 6894.757);

  let remediationNote = 'All 4 road tyres and the +1 spare wheel meet Pascal’s Law uniform pressure compliance.';
  if (!roadTyresCompliant && !spareWheelCompliant) {
    remediationNote = `NON-COMPLIANT: Road tyre pressure deviation detected AND Spare Wheel (${input.spareWheelPsi} PSI) has lost pressure via rubber permeation below ${input.targetRoadPsi} PSI minimum. Inflate all 4+1 tyres immediately.`;
  } else if (!spareWheelCompliant) {
    remediationNote = `SPARE PERMEATION DEFICIT: The 4 road tyres pass, but the +1 Spare Wheel is at ${input.spareWheelPsi} PSI (target ${targetSparePsi} PSI). Re-inflate spare and inspect valve core.`;
  } else if (!roadTyresCompliant) {
    remediationNote = `ROAD TYRE IMBALANCE: One or more active road tyres deviate by more than ±${roadTolerance} PSI from target ${input.targetRoadPsi} PSI.`;
  }

  return {
    frontLeftPsi: input.frontLeftPsi,
    frontRightPsi: input.frontRightPsi,
    rearLeftPsi: input.rearLeftPsi,
    rearRightPsi: input.rearRightPsi,
    spareWheelPsi: input.spareWheelPsi,
    targetRoadPsi: input.targetRoadPsi,
    targetSparePsi,
    estimatedMonthlyPermeationLossPsi,
    pascalsLawForceNewtonPerSqM,
    roadTyresCompliant,
    spareWheelCompliant,
    overall4Plus1Compliant,
    remediationNote,
  };
}

/**
 * Enforces mandatory corporate entity and personnel spelling governance across
 * all policy documents, certificates, and statutory training registers:
 * - "Roof King" -> "BRILLIANT GROUP ONE"
 * - "VEDAN" -> "VESHAN"
 */
export function enforceEntityAndPersonnelGovernance(text: string): string {
  if (!text) return '';
  return text
    .replace(/\bRoof\s*King(?:\s*\(Pty\)\s*Ltd)?\b/gi, 'BRILLIANT GROUP ONE')
    .replace(/\bVEDAN\b/gi, 'VESHAN');
}

/**
 * Normalizes a TrainingRegisterEntry by applying corporate and personnel governance rules.
 */
export function sanitizeTrainingRegisterEntry(entry: TrainingRegisterEntry): TrainingRegisterEntry {
  return {
    ...entry,
    companyName: enforceEntityAndPersonnelGovernance(entry.companyName),
    traineeName: enforceEntityAndPersonnelGovernance(entry.traineeName),
    role: enforceEntityAndPersonnelGovernance(entry.role),
  };
}

