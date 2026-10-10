import { describe, it, expect } from 'vitest';
import { siteIntakeSchema } from '@/lib/compliance/site-intake-schema';
import { evaluateSiteCompliance, RATIOS } from '@/lib/compliance/evaluate-site-compliance';
import { buildDocumentSnapshot, computeSnapshotContentHash } from '@/lib/compliance/document-builder';

describe('Phase 3: Statutory Engine Rules & Document Builder', () => {
  const baseIntake = {
    category: 'coffee_bakery' as const,
    employerName: 'Mugg & Bean Franchisee Pty Ltd',
    branchName: 'Mugg & Bean Sandton City',
    address: 'Sandton City Mall, Rivonia Rd, Sandton',
    headcount: 25,
    isShopOrOffice: true,
    equipment: {
      lpg: false,
      pressureVessels: false,
      deepFryers: false,
      switchboards: true,
      coldRooms: false,
      hazardousChemicals: false,
      forklifts: false,
      highBayStacking: false,
      undergroundFuelTanks: false,
      mhiThresholdExceeded: false,
    },
  };

  it('electric fryer without LPG cites no gas standard (SANS 10087-1)', () => {
    const intake = siteIntakeSchema.parse({
      ...baseIntake,
      equipment: {
        ...baseIntake.equipment,
        deepFryers: true, // Electric deep fryer
        lpg: false,       // No LPG
      },
    });

    const res = evaluateSiteCompliance(intake);
    expect(res.citationsUsed).not.toContain('SANS_10087_1');
  });

  it('commercial fryer NEVER cites Pressure Equipment Regulations (PER 2009)', () => {
    const intake = siteIntakeSchema.parse({
      ...baseIntake,
      equipment: {
        ...baseIntake.equipment,
        deepFryers: true,
        lpg: true, // Gas fryer
        pressureVessels: false, // No genuine pressure vessels
      },
    });

    const res = evaluateSiteCompliance(intake);
    expect(res.citationsUsed).toContain('SANS_10087_1'); // Gas cited for LPG
    expect(res.citationsUsed).not.toContain('PER_2009'); // PER NEVER cited for fryers
  });

  it('cites PER 2009 ONLY when genuine pressure vessels are declared', () => {
    const intake = siteIntakeSchema.parse({
      ...baseIntake,
      equipment: {
        ...baseIntake.equipment,
        pressureVessels: true,
      },
    });

    const res = evaluateSiteCompliance(intake);
    expect(res.citationsUsed).toContain('PER_2009');
  });

  it('forecourt without MHI confirmation NEVER cites MHI 2022', () => {
    const intake = siteIntakeSchema.parse({
      ...baseIntake,
      category: 'forecourt',
      equipment: {
        ...baseIntake.equipment,
        undergroundFuelTanks: true,
        mhiThresholdExceeded: false, // Not confirmed
      },
    });

    const res = evaluateSiteCompliance(intake);
    expect(res.citationsUsed).toContain('SANS_10089_3');
    expect(res.citationsUsed).toContain('SANS_10089_2');
    expect(res.citationsUsed).not.toContain('MHI_2022');
    expect(res.mhiStatus.applied).toBe(false);
  });

  it('cites MHI 2022 when applicant confirms threshold is exceeded', () => {
    const intake = siteIntakeSchema.parse({
      ...baseIntake,
      category: 'forecourt',
      equipment: {
        ...baseIntake.equipment,
        undergroundFuelTanks: true,
        mhiThresholdExceeded: true, // Confirmed
      },
    });

    const res = evaluateSiteCompliance(intake);
    expect(res.citationsUsed).toContain('MHI_2022');
    expect(res.mhiStatus.applied).toBe(true);
  });

  it('coffee shop with 150 staff uses 1:100 ratio if isShopOrOffice is true, and 1:50 if false', () => {
    // Case A: isShopOrOffice: true -> 1:100 -> Math.ceil(150 / 100) = 2
    const intakeShop = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 150,
      isShopOrOffice: true,
    });
    const resShop = evaluateSiteCompliance(intakeShop);
    expect(resShop.s17RepsRequired).toBe(2);

    // Case B: isShopOrOffice: false -> 1:50 -> Math.ceil(150 / 50) = 3
    const intakeIndustrial = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 150,
      isShopOrOffice: false,
    });
    const resIndustrial = evaluateSiteCompliance(intakeIndustrial);
    expect(resIndustrial.s17RepsRequired).toBe(3);
  });

  it('headcount 20 requires 0 reps, while headcount 21 requires reps', () => {
    // Headcount 20: below or equal to threshold of 20 -> 0 reps
    const intake20 = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 20,
      isShopOrOffice: true,
    });
    const res20 = evaluateSiteCompliance(intake20);
    expect(res20.s17RepsRequired).toBe(0);
    expect(res20.citationsUsed).not.toContain('OHSA_S17');

    // Headcount 21: exceeds threshold of 20 -> 1 rep
    const intake21 = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 21,
      isShopOrOffice: true,
    });
    const res21 = evaluateSiteCompliance(intake21);
    expect(res21.s17RepsRequired).toBe(1);
    expect(res21.citationsUsed).toContain('OHSA_S17');
  });

  it('first aiders use peakOnSite ?? headcount with threshold > 10', () => {
    // Headcount 10: 0 first aiders
    const intake10 = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 10,
    });
    expect(evaluateSiteCompliance(intake10).firstAidersRequired).toBe(0);

    // Headcount 11: 1 first aider
    const intake11 = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 11,
    });
    expect(evaluateSiteCompliance(intake11).firstAidersRequired).toBe(1);

    // Total headcount 50, but peak on site is 8: 0 first aiders required
    const intakePeak8 = siteIntakeSchema.parse({
      ...baseIntake,
      headcount: 50,
      peakOnSite: 8,
    });
    expect(evaluateSiteCompliance(intakePeak8).firstAidersRequired).toBe(0);
  });

  it('document builder renders snapshot with [CONSULTANT] placeholders and token replacement', () => {
    const intake = siteIntakeSchema.parse(baseIntake);
    const snapshot = buildDocumentSnapshot('doc_test_snapshot_001', intake, 1);

    expect(snapshot.id).toBe('doc_test_snapshot_001');
    expect(snapshot.consultantPlaceholders.length).toBeGreaterThan(0);
    expect(snapshot.renderedLegalText).toContain('[CONSULTANT]');
    // Ensures tokens like [REG:OHSA_S8] are replaced by legal text
    expect(snapshot.renderedLegalText).not.toContain('[REG:OHSA_S8]');
    expect(snapshot.renderedLegalText).toContain('Section 8');

    const hash = computeSnapshotContentHash(snapshot);
    expect(hash).toHaveLength(64);
  });
});
