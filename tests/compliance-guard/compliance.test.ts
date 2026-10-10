import { describe, it, expect } from 'vitest';
import { siteIntakeSchema, evaluateSiteCompliance } from '@/lib/compliance';
import { REGISTRY, renderCitations } from '@/lib/compliance/regulations-registry';
import { queryGroundedRob } from '@/lib/rob/grounded';
import { DocumentStateModel, transitionDocument } from '@/lib/compliance/document-state';

describe('Statutory Regulations Registry & Scope Notes', () => {
  it('contains over 20 distinct South African statutory instruments', () => {
    const keys = Object.keys(REGISTRY);
    expect(keys.length).toBeGreaterThanOrEqual(20);
    expect(REGISTRY['OHSA_S8']).toBeDefined();
    expect(REGISTRY['OHSA_S16_2']).toBeDefined();
    expect(REGISTRY['OHSA_S17']).toBeDefined();
    expect(REGISTRY['GSR_3']).toBeDefined();
    expect(REGISTRY['SANS_10087_1']).toBeDefined();
    expect(REGISTRY['SANS_10089_2']).toBeDefined();
    expect(REGISTRY['SANS_10089_3']).toBeDefined();
    expect(REGISTRY['MHI_2022']).toBeDefined();
    expect(REGISTRY['POPIA_S19']).toBeDefined();
    expect(REGISTRY['POPIA_S26']).toBeDefined();
    expect(REGISTRY['GPP']).toBeDefined();
    expect(REGISTRY['ERGO_2019']).toBeDefined();
  });

  it('accurately specifies SANS 10087-1 scope note regarding non-pressure fryers', () => {
    const sans10087 = REGISTRY['SANS_10087_1'];
    expect(sans10087.scopeNote).toContain('Pressure Equipment Regulations (PER) do not apply to non-pressure fryers');
  });

  it('renders citation references properly in development mode', () => {
    const rendered = renderCitations(['OHSA_S17', 'GSR_3']);
    expect(rendered).toContain('[OHSA_S17]');
    expect(rendered).toContain('[GSR_3]');
  });

  it('throws in release mode if unverified citations are rendered', () => {
    expect(() => renderCitations(['OHSA_S17'], { requireVerified: true })).toThrow(/Unverified citation in release mode/);
  });
});

describe('Site Compliance Evaluation Engine Headcount Thresholds', () => {
  it('enforces 0 reps and 0 first aiders for small site (headcount <= 10)', () => {
    const smallSite = siteIntakeSchema.parse({
      category: 'general_retail',
      employerName: 'Micro Retail Ltd',
      address: '10 High St',
      isShopOrOffice: true,
      branchName: 'Micro Retail Kiosk',
      headcount: 8,
    });
    const result = evaluateSiteCompliance(smallSite);
    expect(result.s17RepsRequired).toBe(0); // <= 20
    expect(result.firstAidersRequired).toBe(0); // <= 10
  });

  it('enforces 0 S17 reps but 1 first aider for medium site (10 < headcount <= 20)', () => {
    const mediumSite = siteIntakeSchema.parse({
      category: 'general_retail',
      employerName: 'Boutique Office Ltd',
      address: '15 High St',
      isShopOrOffice: true,
      branchName: 'Boutique Office',
      headcount: 15,
    });
    const result = evaluateSiteCompliance(mediumSite);
    expect(result.s17RepsRequired).toBe(0); // <= 20
    expect(result.firstAidersRequired).toBe(1); // > 10 requires 1:50
  });

  it('enforces 1:100 ratio for commercial/shops with headcount > 20', () => {
    const commercialSite = siteIntakeSchema.parse({
      category: 'fast_food',
      employerName: 'Wimpy Holdings',
      address: 'Southgate Mall',
      isShopOrOffice: true,
      branchName: 'Wimpy Southgate Mall',
      headcount: 35,
      equipment: {
        lpg: true,
        deepFryers: true,
      },
    });
    const result = evaluateSiteCompliance(commercialSite);
    expect(result.s17RepsRequired).toBe(1); // Math.ceil(35 / 100)
    expect(result.firstAidersRequired).toBe(1); // Math.ceil(35 / 50)
  });

  it('enforces 1:50 ratio for industrial/wholesale depots with headcount > 20', () => {
    const depot = siteIntakeSchema.parse({
      category: 'wholesale',
      employerName: 'Mega Logistics',
      address: 'Industrial Park',
      isShopOrOffice: false,
      branchName: 'Mega Logistics Depot',
      headcount: 105,
      equipment: {
        forklifts: true,
      },
    });
    const result = evaluateSiteCompliance(depot);
    expect(result.s17RepsRequired).toBe(3); // Math.ceil(105 / 50) = 3
    expect(result.firstAidersRequired).toBe(3); // Math.ceil(105 / 50) = 3
    expect(result.citationsUsed).toContain('DMR_18');
    expect(result.citationsUsed).toContain('GSR_2');
    expect(result.citationsUsed).toContain('ERGO_2019');
  });

  it('correctly includes MHI, SANS 10089-2 and SANS 10089-3 for service stations when MHI confirmed', () => {
    const forecourt = siteIntakeSchema.parse({
      category: 'forecourt',
      employerName: 'Astron Energy Ltd',
      address: 'Fairlands, JHB',
      isShopOrOffice: false,
      branchName: 'Astron Energy Fairlands',
      headcount: 22,
      equipment: {
        undergroundFuelTanks: true,
        mhiThresholdExceeded: true,
      },
    });
    const result = evaluateSiteCompliance(forecourt);
    expect(result.citationsUsed).toContain('SANS_10089_3');
    expect(result.citationsUsed).toContain('SANS_10089_2');
    expect(result.citationsUsed).toContain('MHI_2022');
  });

  it('correctly includes GPP, POPIA S19, POPIA S26, and HBAR for pharmacy', () => {
    const pharmacy = siteIntakeSchema.parse({
      category: 'pharmacy',
      employerName: 'Amampondo Holdings',
      address: 'Main Road',
      isShopOrOffice: true,
      branchName: 'Amampondo Pharmacy',
      headcount: 14,
      equipment: {
        coldRooms: true,
      },
    });
    const result = evaluateSiteCompliance(pharmacy);
    expect(result.citationsUsed).toContain('HBAR_2022');
    expect(result.citationsUsed).toContain('GPP');
    expect(result.citationsUsed).toContain('POPIA_S19');
    expect(result.citationsUsed).toContain('POPIA_S26');
  });
});

describe('Document State Machine, HMAC Sealing & Stale Hash Defense', () => {
  it('transitions through full review, sign, and delivery lifecycle', () => {
    const initial: DocumentStateModel = {
      id: 'doc_test_001',
      version: 1,
      status: 'draft',
      contentHash: 'hash1234567890123456789012345678901234567890',
      history: [],
    };

    const inReview = transitionDocument(initial, 'submit_for_review');
    expect(inReview.status).toBe('under_review');

    const signed = transitionDocument(inReview, 'sign', {
      reviewerName: 'Professional Auditor',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-991',
      reviewedContentHash: inReview.contentHash,
    });
    expect(signed.status).toBe('signed_verified');
    expect(signed.seal).toBeDefined();

    const delivered = transitionDocument(signed, 'deliver', { orderPaid: true });
    expect(delivered.status).toBe('delivered');
  });

  it('blocks reviewer from signing if reviewedContentHash is stale', () => {
    const inReview: DocumentStateModel = {
      id: 'doc_test_stale',
      version: 2,
      status: 'under_review',
      contentHash: 'new_active_hash_xyz',
      history: [],
    };

    expect(() => {
      transitionDocument(inReview, 'sign', {
        reviewerName: 'Professional Auditor',
        reviewerBody: 'SAIOSH',
        reviewerRegNo: 'SAIOSH-2026-991',
        reviewedContentHash: 'old_stale_hash_abc', // Does not match current active hash!
      });
    }).toThrow(/Stale content hash/);
  });

  it('invalidates signature on edit and reverts to draft with incremented version', () => {
    const signed: DocumentStateModel = {
      id: 'doc_test_002',
      version: 1,
      status: 'signed_verified',
      contentHash: 'hash123',
      reviewerName: 'Professional Auditor',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-991',
      seal: 'seal123',
      history: [],
    };

    const edited = transitionDocument(signed, 'edit', {
      newContentHash: 'newHash456',
    });

    expect(edited.status).toBe('draft');
    expect(edited.version).toBe(2);
    expect(edited.seal).toBeUndefined();
    expect(edited.reviewerName).toBeUndefined();
  });
});

describe('ROB AI Persona Grounding & Production Gate', () => {
  it('returns grounded response for Section 17 inquiry citing exact ID', () => {
    const res = queryGroundedRob('What are the rules for Health and Safety Representatives?');
    expect(res.citationsUsed).toContain('OHSA_S17');
    expect(res.answer).toContain('[OHSA_S17]');
  });

  it('defensively falls back when no statutory match exists', () => {
    const res = queryGroundedRob('How to register a trademark for deep space satellites?');
    expect(res.citationsUsed).toHaveLength(0);
    expect(res.answer).toBe('This requires human professional legal interpretation.');
  });

  it('refuses to answer in production mode if matched citation is unverified', () => {
    const res = queryGroundedRob('What are the rules for Health and Safety Representatives?', {
      requireVerified: true,
    });
    expect(res.citationsUsed).toHaveLength(0);
    expect(res.answer).toBe('This requires human professional legal interpretation.');
  });
});
