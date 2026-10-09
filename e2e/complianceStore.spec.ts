import './support/window-shim';
import { test, expect } from '@playwright/test';
import { 
    useComplianceStore, 
    detectPhysicalStatutoryHazard,
    initialComplianceState,
    HIGH_RISK_TAG
} from '../src/store/complianceStore';
import { 
    PHYSICAL_AGENTS_REGS_2024_CITATION, 
    ERGONOMICS_REGS_2019_CITATION,
    REPEALED_ENVIRONMENTAL_REGS_1987,
    OMP_REFERRAL_STATUTORY_STRING 
} from '../src/types/statutory';
import { 
    wholesaleCashCarryPreset, 
    retailButcheryPreset 
} from '../src/data/industryPresets';

test.describe('Compliance Store & Statutory Scoring Engine Unit Tests', () => {
    test.beforeEach(() => {
        // Full reset (cases, logs, status) so no test depends on another's leftovers
        useComplianceStore.setState(initialComplianceState, true);
    });

    test('1. Legal Citations & Repeal of ERW 1987', () => {
        expect(PHYSICAL_AGENTS_REGS_2024_CITATION).toBe(
            'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025)'
        );
        expect(ERGONOMICS_REGS_2019_CITATION).toBe(
            'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
        );
        expect(REPEALED_ENVIRONMENTAL_REGS_1987).toContain('Repealed by Physical Agents Regulations, 2024');
    });

    test('2. 26 kg lift triggers HIGH RISK, NOT BREACH', () => {
        // Direct detection helper evaluation
        const detection = detectPhysicalStatutoryHazard('Manual handling of 26 kg heavy meat box on loading bay');
        
        expect(detection.isPhysicalHighRisk).toBe(true);
        expect(detection.isStatutoryBreach).toBe(false);
        expect(detection.statutoryMetadata.riskClassification).toBe('HIGH_RISK_PRIORITY_ACTION');
        expect(detection.hazardLabel).toContain('HIGH RISK');
        expect(detection.hazardLabel).not.toContain('BREACH');
        expect(detection.statutoryMetadata.requiresOMPReferral).toBe(true);
        expect(detection.statutoryMetadata.ompReferralStatus).toBe(OMP_REFERRAL_STATUTORY_STRING);

        // Store state evaluation
        const store = useComplianceStore.getState();
        const result = store.evaluateStatutoryPhysicalHazard(
            'bulk_lift_25kg',
            'Worker lifted 26 kg box of frozen lamb shoulders',
            'Sipho Dlamini',
            'Cold Storage'
        );

        expect(result.triggered).toBe(true);
        expect(result.caseRecord.status).toBe('RISK_ALERT'); // High risk alert, NOT BREACH
        expect(result.caseRecord.status).not.toBe('BREACH');
        expect(result.caseRecord.score).toBe(30);
        expect(result.caseRecord.statutoryMetadata?.riskClassification).toBe('HIGH_RISK_PRIORITY_ACTION');
        expect(result.caseRecord.hazardTrigger).toContain(HIGH_RISK_TAG);
    });

    test('3. Training records default to employee tenure retention (Regulation 10(1))', () => {
        const store = useComplianceStore.getState();
        store.logEmployeeTrainingRecord(
            'Safe Lifting & Manual Handling Techniques (Reg 3)',
            'Themba Nkosi',
            true
        );

        const updatedCases = useComplianceStore.getState().cases;
        const trainingCase = updatedCases.find(c => c.employeeName === 'Themba Nkosi');

        expect(trainingCase).toBeDefined();
        expect(trainingCase?.statutoryMetadata?.retentionPeriod).toBe('TENURE');
        expect(trainingCase?.statutoryMetadata?.retentionCategory).toBe('REG_3_EMPLOYEE_TRAINING_RECORD_TENURE');
        expect(trainingCase?.status).toBe('COMPLIANT');
    });

    test('4. Assessment and surveillance records enforce 40-year statutory retention', () => {
        const store = useComplianceStore.getState();
        
        // Surveillance record from physical hazard evaluation
        const evalResult = store.evaluateStatutoryPhysicalHazard(
            'carcass_handling',
            'Butcher handling 65 kg beef side on hanging rail',
            'Johan van der Merwe',
            'Meat Processing'
        );

        expect(evalResult.caseRecord.statutoryMetadata?.retentionPeriod).toBe(40);
        expect(evalResult.caseRecord.statutoryMetadata?.retentionCategory).toBe('REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR');

        // Risk log retention check
        const logs = useComplianceStore.getState().logs;
        const latestLog = logs[0];
        expect(latestLog.retentionPeriod).toBe(40);
        expect(latestLog.retentionCategory).toBe('REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR');
        expect(latestLog.ompReferralStatus).toBe(OMP_REFERRAL_STATUTORY_STRING);
    });

    test('5. Genuine statutory non-compliance strictly triggers BREACH', () => {
        const store = useComplianceStore.getState();

        const breachCase = store.logStatutoryLegalBreach(
            'missing_sec16_2',
            'Audit revealed no written Section 16(2) delegation exists for the branch manager',
            'Managing Director'
        );

        expect(breachCase.status).toBe('BREACH');
        expect(breachCase.statutoryMetadata?.isStatutoryBreach).toBe(true);
        expect(breachCase.statutoryMetadata?.riskClassification).toBe('STATUTORY_BREACH');
        expect(breachCase.hazardTrigger).toContain('[STATUTORY BREACH]');
        expect(breachCase.statutoryMetadata?.retentionPeriod).toBe(40);
    });

    test('6. Cold room stress maps to Regulation 9 of Physical Agents Regulations, 2024', () => {
        const detection = detectPhysicalStatutoryHazard('Worker exposed to -18C cold room freezer without thermal recovery intervals');
        
        expect(detection.isPhysicalHighRisk).toBe(true);
        expect(detection.statutoryMetadata.statutoryCitation).toContain('Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) Regulation 9 (Cold Stress)');
        expect(detection.statutoryMetadata.statutoryCitation).toContain('Repealing ERW 1987');
        expect(detection.statutoryMetadata.requiresOMPReferral).toBe(true);
    });

    test('7. Industry Presets: Wholesale Cash & Carry and Retail Butchery validation', () => {
        // Wholesale Cash & Carry
        expect(wholesaleCashCarryPreset.industryName).toBe('Wholesale Cash & Carry');
        expect(wholesaleCashCarryPreset.shiftConstraints.maxSingleManualLiftKg).toBe(25);
        expect(wholesaleCashCarryPreset.retentionPolicies.reg6RiskAssessmentsYears).toBe(40);
        expect(wholesaleCashCarryPreset.retentionPolicies.reg8_2MedicalSurveillanceYears).toBe(40);
        expect(wholesaleCashCarryPreset.retentionPolicies.reg7And9EquipmentInspectionYears).toBe(3);
        expect(wholesaleCashCarryPreset.retentionPolicies.reg3EmployeeTraining).toBe('TENURE');
        
        // Retail Butchery
        expect(retailButcheryPreset.industryName).toBe('Retail Butchery & Meat Processing');
        // No time limit is attributed to Reg 9 of GN 5952; the work-warming interval is site-configured
        expect(retailButcheryPreset.shiftConstraints.coldExposureWorkWarmingMinutes ?? null).toBeNull();
        expect(JSON.stringify(retailButcheryPreset)).not.toMatch(/45[- ]min/i);
        expect(retailButcheryPreset.primaryPhysicalHazards.some((h: any) => h.category === 'PHYSICAL_CARCASS_HANDLING')).toBe(true);
        expect(retailButcheryPreset.primaryPhysicalHazards.some((h: any) => h.category === 'PHYSICAL_KNIFE_DEBONING')).toBe(true);
        expect(retailButcheryPreset.primaryPhysicalHazards.some((h: any) => h.category === 'PHYSICAL_COLD_ROOM_STRESS_REG_9')).toBe(true);
    });

    test('8. Full 3-Tier Retention Schedule Verification', () => {
        const policies = wholesaleCashCarryPreset.retentionPolicies;

        // Tier 1: 40 Years
        expect(policies.reg6RiskAssessmentsYears).toBe(40);
        expect(policies.reg8_2MedicalSurveillanceYears).toBe(40);

        // Tier 2: 3 Years
        expect(policies.reg7And9EquipmentInspectionYears).toBe(3);
        expect(policies.gsr13FacilitiesYears).toBe(3);

        // Tier 3: Tenure (Duration of employment)
        expect(policies.reg3EmployeeTraining).toBe('TENURE');
    });
});
