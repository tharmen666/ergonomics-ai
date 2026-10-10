import { SiteIntake } from './site-intake-schema';
import { RegId, REGISTRY } from '../regulations';

/**
 * UNVERIFIED: Statutory threshold and ratios per OHSA Section 17 & GSR 3.
 * Kept in one central constant. A human verifier must confirm before production sign-off.
 */
export const RATIOS = {
  HSR_THRESHOLD: 20,
  HSR_SHOP_OFFICE: 100,
  HSR_OTHER: 50,
  FIRST_AID_THRESHOLD: 10,
  FIRST_AID_RATIO: 50,
  FIRE_MARSHAL_PLANNING_RATIO: 20,
} as const;

export interface StatutoryObligation {
  token: string;
  regId: RegId;
  title: string;
  summary: string;
  evidenceToHold: string[];
}

export interface CalculatedSafetyRequirements {
  s17RepsRequired: number;
  firstAidersRequired: number;
  fireMarshalsRecommended: number; // Planning default, NOT statutory
  citationsUsed: RegId[];
  obligations: StatutoryObligation[];
  mhiStatus: {
    applied: boolean;
    reason: string;
  };
  consultantReviewItems: string[];
}

export function evaluateSiteCompliance(intake: SiteIntake): CalculatedSafetyRequirements {
  const citations = new Set<RegId>();
  const obligations: StatutoryObligation[] = [];
  const consultantReviewItems: string[] = [
    '[CONSULTANT] Conduct site-specific Hazard Identification and Risk Assessment (HIRA) on premises.',
    '[CONSULTANT] Confirm all employee headcount thresholds, equipment counts, and cited provisions.',
  ];

  // 1. Core Statutory Baseline (Always mandatory for all South African workplaces)
  citations.add('OHSA_S8');
  citations.add('OHSA_S16_2');
  citations.add('OHSA_S24');
  citations.add('ERGO_2019');

  // 2. Health and Safety Representatives (OHSA Section 17)
  let s17RepsRequired = 0;
  if (intake.headcount > RATIOS.HSR_THRESHOLD) {
    s17RepsRequired = intake.isShopOrOffice
      ? Math.ceil(intake.headcount / RATIOS.HSR_SHOP_OFFICE)
      : Math.ceil(intake.headcount / RATIOS.HSR_OTHER);
    citations.add('OHSA_S17');
  }

  // 3. First Aiders (GSR 3) calculated from peakOnSite ?? headcount
  const effectiveHeadcount = intake.peakOnSite ?? intake.headcount;
  let firstAidersRequired = 0;
  if (effectiveHeadcount > RATIOS.FIRST_AID_THRESHOLD) {
    firstAidersRequired = Math.ceil(effectiveHeadcount / RATIOS.FIRST_AID_RATIO);
    citations.add('GSR_3');
  }

  // 4. Fire Marshals (Planning default, NOT statutory)
  const fireMarshalsRecommended = Math.ceil(effectiveHeadcount / RATIOS.FIRE_MARSHAL_PLANNING_RATIO);

  // 5. Electrical Switchboards
  if (intake.equipment.switchboards) {
    citations.add('EIR_2009_R7');
  }

  // 6. Thermal & Gas: SANS 10087-1 ONLY when lpg is true (electric fryers alone do NOT trigger gas standard)
  if (intake.equipment.lpg) {
    citations.add('SANS_10087_1');
  }

  // Deep fryers (electric or gas): thermal burn hazard control with NO pressure equipment citation
  if (intake.equipment.deepFryers && !intake.equipment.pressureVessels) {
    // Thermal control noted in consultant review without PER citation
    consultantReviewItems.push(
      '[CONSULTANT] Verify thermal burn controls, splatter shields, and Class F wet-chemical firefighting appliances for deep fryers (PER does not apply).'
    );
  }

  // 7. Pressure Vessels (PER 2009 cited ONLY when pressureVessels is true)
  if (intake.equipment.pressureVessels) {
    citations.add('PER_2009');
  }

  // 8. Major Hazard Installation (MHI 2022 cited ONLY when threshold is confirmed exceeded)
  let mhiStatus = {
    applied: false,
    reason: 'MHI threshold exceeded flag was not confirmed by applicant; MHI regulations not triggered.',
  };
  if (intake.equipment.mhiThresholdExceeded) {
    citations.add('MHI_2022');
    mhiStatus = {
      applied: true,
      reason: 'Applicant confirmed bulk flammable storage exceeds Major Hazard Installation notification thresholds.',
    };
  }

  // 9. Sector: Food Handling (R638 and COA)
  const isFoodSector = (
    intake.category === 'fast_food' ||
    intake.category === 'coffee_bakery' ||
    intake.category === 'general_retail' ||
    intake.category === 'wholesale' ||
    intake.equipment.deepFryers
  );
  if (isFoodSector) {
    citations.add('R638');
    citations.add('COA');
  }

  // 10. Sector: Forecourt / Petroleum Retail
  if (intake.category === 'forecourt' || intake.equipment.undergroundFuelTanks) {
    citations.add('SANS_10089_3');
    citations.add('SANS_10089_2');
  }

  // 11. Sector: Pharmacy
  if (intake.category === 'pharmacy') {
    citations.add('HBAR_2022');
    citations.add('GPP');
    citations.add('POPIA_S19');
    citations.add('POPIA_S26');
  }

  // 12. Machinery & High Bay Stacking
  if (intake.equipment.forklifts) {
    citations.add('DMR_18');
  }
  if (intake.equipment.highBayStacking || intake.equipment.forklifts) {
    citations.add('GSR_2');
  }

  // Build obligations referencing strictly what the registry summary says + evidence to hold
  for (const regId of citations) {
    const entry = REGISTRY[regId];
    if (entry) {
      obligations.push({
        token: `[REG:${regId}]`,
        regId,
        title: entry.title,
        summary: entry.summary,
        evidenceToHold: getEvidenceForRegId(regId, intake),
      });
    }
  }

  return {
    s17RepsRequired,
    firstAidersRequired,
    fireMarshalsRecommended,
    citationsUsed: Array.from(citations),
    obligations,
    mhiStatus,
    consultantReviewItems,
  };
}

/**
 * Returns standard evidence to hold for each citation without asserting unverified text.
 */
function getEvidenceForRegId(regId: RegId, intake: SiteIntake): string[] {
  switch (regId) {
    case 'OHSA_S8':
      return ['General health and safety policy signed by CEO', 'Employee safety induction records'];
    case 'OHSA_S16_2':
      return ['Written Section 16(2) managerial designation letter signed by Chief Executive Officer'];
    case 'OHSA_S17':
      return ['Signed Section 17 H&S representative appointment letters', 'Monthly workplace inspection records'];
    case 'OHSA_S24':
      return ['Section 24 incident register and statutory reporting procedure'];
    case 'GSR_3':
      return ['First aid appointment letters', 'Valid Level 1/2 first aid certificates', 'First aid box inspection checklist'];
    case 'GSR_2':
      return ['Stacking stability inspection logs'];
    case 'ERGO_2019':
      return ['Ergonomic hazard identification assessment', 'Ergonomics employee awareness records'];
    case 'EIR_2009_R7':
      return ['Valid Electrical Certificate of Compliance (CoC)'];
    case 'SANS_10087_1':
      return ['Valid Certificate of Conformity (Gas CoC) for commercial LPG installation'];
    case 'PER_2009':
      return ['Pressure vessel manufacturer data plates and valid inspection certificates'];
    case 'SANS_10089_3':
      return ['Underground storage tank dip logs and interstitial leak monitoring reports'];
    case 'SANS_10089_2':
      return ['Hazardous area classification drawing and explosion-proof equipment certificates'];
    case 'MHI_2022':
      return ['Quantitative Risk Assessment (QRA) report', 'Local authority emergency notification proof'];
    case 'R638':
      return ['Food safety hygiene checklist', 'Foodhandler medical screening and training records'];
    case 'COA':
      return ['Valid municipal Certificate of Acceptability (COA) displayed on premises'];
    case 'HBAR_2022':
      return ['Sharps disposal protocol and hazardous biological waste destruction manifests'];
    case 'GPP':
      return ['Twice-daily cold chain temperature logs (2°C to 8°C)', 'Dispensary security key register'];
    case 'POPIA_S19':
      return ['Physical and digital records access control policy'];
    case 'POPIA_S26':
      return ['Confidential employee health record safeguard procedure'];
    case 'DMR_18':
      return ['Valid forklift operator licenses', 'Lifting tackle 6-monthly inspection register', 'Annual load test certificate'];
    default:
      return ['Statutory compliance records'];
  }
}
