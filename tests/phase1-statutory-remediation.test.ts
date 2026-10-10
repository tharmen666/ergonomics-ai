import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateSiteCompliance } from '../src/features/compliance-guard/lib/compliance/evaluate-site-compliance';
import { SiteIntake } from '../src/features/compliance-guard/lib/compliance/site-intake-schema';
import { 
    useComplianceStore, 
    detectPhysicalStatutoryHazard, 
    parseMaxWeightKg 
} from '../src/store/complianceStore';
import { useTenantStore } from '../src/store/tenantStore';

describe('Phase 1.1: Section 17 Health & Safety Representatives', () => {
    const createIntake = (headcount: number, isShopOrOffice: boolean): SiteIntake => ({
        companyName: 'Test Corp',
        siteName: 'Test Site',
        province: 'Gauteng',
        industry: 'retail',
        headcount,
        isShopOrOffice,
        equipment: {
            switchboards: false,
            lpg: false,
            deepFryers: false,
            pressureVessels: false,
            mhiThresholdExceeded: false,
        },
    });

    it('Shop/Office: requires 0 reps when headcount <= 20', () => {
        const res = evaluateSiteCompliance(createIntake(20, true));
        expect(res.s17RepsRequired).toBe(0);
    });

    it('Shop/Office: requires 1 rep when headcount is 21', () => {
        const res = evaluateSiteCompliance(createIntake(21, true));
        expect(res.s17RepsRequired).toBe(1);
    });

    it('Shop/Office: requires 1 rep when headcount is 100', () => {
        const res = evaluateSiteCompliance(createIntake(100, true));
        expect(res.s17RepsRequired).toBe(1);
    });

    it('Shop/Office: requires 2 reps when headcount is 101', () => {
        const res = evaluateSiteCompliance(createIntake(101, true));
        expect(res.s17RepsRequired).toBe(2);
    });

    it('Other Workplace: requires 0 reps when headcount <= 20', () => {
        const res = evaluateSiteCompliance(createIntake(20, false));
        expect(res.s17RepsRequired).toBe(0);
    });

    it('Other Workplace: requires 1 rep when headcount is 21', () => {
        const res = evaluateSiteCompliance(createIntake(21, false));
        expect(res.s17RepsRequired).toBe(1);
    });

    it('Other Workplace: requires 1 rep when headcount is 50', () => {
        const res = evaluateSiteCompliance(createIntake(50, false));
        expect(res.s17RepsRequired).toBe(1);
    });

    it('Other Workplace: requires 2 reps when headcount is 51', () => {
        const res = evaluateSiteCompliance(createIntake(51, false));
        expect(res.s17RepsRequired).toBe(2);
    });
});

describe('Phase 1.2: GSR 3 First Aid & First Aid Box Requirements', () => {
    const createIntake = (headcount: number, isShopOrOffice: boolean): SiteIntake => ({
        companyName: 'Test Corp',
        siteName: 'Test Site',
        province: 'Gauteng',
        industry: isShopOrOffice ? 'retail' : 'manufacturing',
        headcount,
        isShopOrOffice,
        equipment: {
            switchboards: false,
            lpg: false,
            deepFryers: false,
            pressureVessels: false,
            mhiThresholdExceeded: false,
        },
    });

    it('Headcount 5: 0 first aid boxes, 0 first aiders', () => {
        const res = evaluateSiteCompliance(createIntake(5, false));
        expect(res.firstAidBoxesRequired).toBe(0);
        expect(res.firstAidersRequired).toBe(0);
    });

    it('Headcount 6: 1 first aid box, 0 first aiders (boxes required where employees > 5)', () => {
        const res = evaluateSiteCompliance(createIntake(6, false));
        expect(res.firstAidBoxesRequired).toBe(1);
        expect(res.firstAidersRequired).toBe(0);
    });

    it('Headcount 11 (Other): 1 first aid box, 1 first aider (aiders required where employees > 10)', () => {
        const res = evaluateSiteCompliance(createIntake(11, false));
        expect(res.firstAidBoxesRequired).toBe(1);
        expect(res.firstAidersRequired).toBe(1);
    });

    it('Headcount 11 (Shop/Office): 1 first aid box, 1 first aider (1:100 rounded up)', () => {
        const res = evaluateSiteCompliance(createIntake(11, true));
        expect(res.firstAidBoxesRequired).toBe(1);
        expect(res.firstAidersRequired).toBe(1);
    });

    it('Headcount 101 (Shop/Office): 2 first aid boxes, 2 first aiders', () => {
        const res = evaluateSiteCompliance(createIntake(101, true));
        expect(res.firstAidBoxesRequired).toBe(2);
        expect(res.firstAidersRequired).toBe(2);
    });

    it('Includes reference note to General Safety Regulations 1986 amended by GN 5954 of 2025', () => {
        const res = evaluateSiteCompliance(createIntake(11, false));
        const gsr3Obligation = res.obligations.find(o => o.regId === 'GSR_3');
        expect(gsr3Obligation).toBeDefined();
        expect(gsr3Obligation?.summary).toContain('GN 5954 of 2025');
    });
});

describe('Phase 1.4: Contextual Hazard Parsing & Negation', () => {
    it('Negation: "no cold room exposure" does not trigger cold room hazard', () => {
        const res = detectPhysicalStatutoryHazard('Worker performs tasks with no cold room exposure');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Negation: "not deboning" does not trigger knife deboning hazard', () => {
        const res = detectPhysicalStatutoryHazard('General packing area, not deboning or knife boning');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Negation: "without carcass handling" does not trigger carcass hazard', () => {
        const res = detectPhysicalStatutoryHazard('Receiving dock inspection without carcass handling');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Negation: "never lift > 25kg" does not trigger manual handling risk', () => {
        const res = detectPhysicalStatutoryHazard('Staff never lift 30kg items manually');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Negation: "cold room: n/a" does not trigger cold stress', () => {
        const res = detectPhysicalStatutoryHazard('Cold room: N/A, ambient room temperature only');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Mechanical Exclusion: Forklift operations do not trigger manual handling', () => {
        const res = detectPhysicalStatutoryHazard('Forklift operator moving 500 kg pallets in warehouse');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Mechanical Exclusion: Overhead hoist does not trigger manual handling', () => {
        const res = detectPhysicalStatutoryHazard('Motorized hoist lifting 120 kg mechanical parts');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Mechanical Exclusion: Pallet jack does not trigger manual handling', () => {
        const res = detectPhysicalStatutoryHazard('Electric pallet jack moving 800 kg goods');
        expect(res.isPhysicalHighRisk).toBe(false);
    });

    it('Manual Handling Verbs: Explicit manual lifting of 30kg crate triggers guidance alert', () => {
        const res = detectPhysicalStatutoryHazard('Operator manually lifting and carrying 30 kg crates by hand');
        expect(res.isPhysicalHighRisk).toBe(true);
        expect(res.hazardLabel).toContain('Manual Handling');
    });
});

describe('Phase 1.3 & 1.5: Fix Over-Escalation & Guidance Threshold in evaluateStatutoryPhysicalHazard', () => {
    beforeEach(() => {
        // Reset stores
        useTenantStore.getState().logout();
        useTenantStore.getState().login('COMP-TEST', 'test-user', true);
    });

    it('Non-hazardous evaluation yields compliant score, no OMP referral, and no escalation', () => {
        const { caseRecord } = useComplianceStore.getState().evaluateStatutoryPhysicalHazard(
            'Ergonomic Workstation',
            'Adjustable ergonomic task chair and dual monitors at eye level'
        );

        expect(caseRecord.status).toBe('COMPLIANT');
        expect(caseRecord.score).toBeGreaterThanOrEqual(80);
        expect(caseRecord.statutoryMetadata.requiresOMPReferral).toBe(false);
        expect(caseRecord.statutoryMetadata.retentionCategory).toBe('REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR');
        expect(caseRecord.hazardTrigger).not.toContain('HIGH RISK');
        expect(useComplianceStore.getState().requiresEscalation).toBe(false);
    });

    it('Genuine physical hazard triggers High Risk with OMP recommendation and escalation', () => {
        const { caseRecord } = useComplianceStore.getState().evaluateStatutoryPhysicalHazard(
            'Manual Handling',
            'Worker manually lifting 35 kg boxes repeatedly from ground level'
        );

        expect(caseRecord.status).toBe('RISK_ALERT');
        expect(caseRecord.score).toBe(30);
        expect(caseRecord.statutoryMetadata.requiresOMPReferral).toBe(true);
        expect(caseRecord.statutoryMetadata.retentionCategory).toBe('REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR');
        expect(caseRecord.hazardTrigger).toContain('Exceeds company manual handling guidance threshold');
        expect(useComplianceStore.getState().requiresEscalation).toBe(true);
    });
});

describe('Phase 1.6: Demo Data Elimination & Tenant Guardrails', () => {
    it('Refuses record creation and fails closed when tenant is unassigned (no COMP-001 fallback)', () => {
        useTenantStore.getState().logout(); // companyId is null

        expect(() => {
            useComplianceStore.getState().evaluateStatutoryPhysicalHazard(
                'Workstation Review',
                'General office desk setup'
            );
        }).toThrow(/Tenant unassigned|Company ID required/i);
    });

    it('Dynamically resolves Section 16(2) appointee from tenant config, flags unassigned when missing', () => {
        useTenantStore.getState().login('COMP-TEST', 'test-user', true);
        
        const tenant = useTenantStore.getState().getCurrentTenant();
        // If not assigned in tenant config, managerName must be '16(2) appointee not assigned'
        const { caseRecord } = useComplianceStore.getState().evaluateStatutoryPhysicalHazard(
            'Workstation Review',
            'General office desk setup'
        );

        expect(caseRecord.managerName).not.toContain('Harvey Specter');
        expect(caseRecord.managerName).toBe('16(2) appointee not assigned');
    });

    it('Uses crypto.randomUUID() for case IDs', () => {
        useTenantStore.getState().login('COMP-TEST', 'test-user', true);

        const { caseRecord } = useComplianceStore.getState().evaluateStatutoryPhysicalHazard(
            'Workstation Review',
            'General office desk setup'
        );

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(caseRecord.id).toMatch(uuidRegex);
    });
});
