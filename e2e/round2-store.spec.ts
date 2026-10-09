import './support/window-shim';
import { test, expect } from '@playwright/test';
import {
    useComplianceStore,
    detectPhysicalStatutoryHazard,
    parseMaxWeightKg,
    initialComplianceState,
    EmployeeCase
} from '../src/store/complianceStore';
import { useFatigueStore } from '../src/logic/Fatigue-Check/fatigueStore';
import { caseSlaLabel, caseStatusLabel } from '../src/utils/caseLabels';

const HOUR = 3600000;

const makeCase = (overrides: Partial<EmployeeCase>): EmployeeCase => ({
    id: `t-${Math.random()}`,
    companyId: 'COMP-001',
    employeeName: 'Test Worker',
    dept: 'Ops',
    score: 30,
    status: 'RISK_ALERT',
    managerName: 'Line Manager',
    hazardTrigger: 'test',
    createdAt: new Date().toISOString(),
    timeframeHours: 72,
    escalationState: 'routed_to_manager',
    statutoryMetadata: {
        retentionPeriod: 40,
        retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
        retentionDescription: 'x',
        isStatutoryBreach: false,
        requiresOMPReferral: false,
        statutoryCitation: 'x',
        hierarchyOfControlsMandate: 'x',
        competentPersonRequirement: 'x',
        riskClassification: 'RISK_ALERT',
        statutoryNotice: 'x'
    },
    ...overrides
});

test.describe('Round 2 - store correctness', () => {
    test.beforeEach(() => {
        useComplianceStore.setState(initialComplianceState, true);
    });

    test('A1: one logHazardEvent call writes exactly one log entry', () => {
        const before = useComplianceStore.getState().logs.length;
        useComplianceStore.getState().logHazardEvent('posture', 'Neck flexion > 30 degrees');
        expect(useComplianceStore.getState().logs.length).toBe(before + 1);
    });

    test('A1: one logStatutoryLegalBreach call writes exactly one log entry', () => {
        const before = useComplianceStore.getState().logs.length;
        useComplianceStore.getState().logStatutoryLegalBreach('missing_sec17_she_rep', 'No SHE rep designated');
        expect(useComplianceStore.getState().logs.length).toBe(before + 1);
    });

    test('A1: processTelemetry still logs (exactly once) after removing the self-listener', () => {
        const before = useComplianceStore.getState().logs.length;
        const r = useComplianceStore.getState().processTelemetry({
            pelvicSpineAngle: 125, cervicalSpineTilt: 35, shoulderElbowAngle: 100, shoulderElevation: 0, setupName: 'Bed'
        });
        expect(r.triggered).toBe(true);
        expect(useComplianceStore.getState().logs.length).toBe(before + 1);
    });

    test('A3: a manual unsafe-setup risk never sets global status to BREACH', () => {
        useComplianceStore.setState({ cases: [], status: 'COMPLIANT' });
        useComplianceStore.getState().logHazardEvent('posture', 'Manual Risk Assessment: Unsafe ergonomic setup flagged (Score: 20).', 'RISK_ALERT');
        expect(useComplianceStore.getState().status).not.toBe('BREACH');
        expect((useComplianceStore.getState() as any).triggerBreach).toBeUndefined();
    });

    test('A3: resolving one case while another is escalated (non-statutory) does not create a BREACH', () => {
        const x = makeCase({ id: 'x' });
        const y = makeCase({ id: 'y', escalationState: 'escalated_level_2', status: 'OVERDUE_HIGH_RISK' });
        useComplianceStore.setState({ cases: [x, y], status: 'RISK_ALERT' });
        useComplianceStore.getState().resolveCase('x');
        expect(useComplianceStore.getState().status).not.toBe('BREACH');
        expect(useComplianceStore.getState().status).toBe('RISK_ALERT');
    });

    test('A3: overdue RISK_ALERT (73h old) escalates to OVERDUE_HIGH_RISK on real time, not BREACH', () => {
        const old = makeCase({ id: 'old', createdAt: new Date(Date.now() - 73 * HOUR).toISOString() });
        useComplianceStore.setState({ cases: [old], demoMode: false });
        useComplianceStore.getState().tickSimulatedTime();
        const c = useComplianceStore.getState().cases.find(k => k.id === 'old')!;
        expect(c.escalationState).toBe('escalated_level_2');
        expect(c.status).toBe('OVERDUE_HIGH_RISK');
        expect(useComplianceStore.getState().status).not.toBe('BREACH');
    });

    test('A3: with demoMode off, a 72h case created 10 real seconds ago does not escalate', () => {
        const recent = makeCase({ id: 'recent', createdAt: new Date(Date.now() - 10_000).toISOString() });
        useComplianceStore.setState({ cases: [recent], demoMode: false });
        useComplianceStore.getState().tickSimulatedTime();
        expect(useComplianceStore.getState().cases[0].escalationState).toBe('routed_to_manager');
    });

    test('A3: an overdue genuine statutory breach does escalate as BREACH', () => {
        const breach = makeCase({
            id: 'b', status: 'BREACH', timeframeHours: 24,
            createdAt: new Date(Date.now() - 25 * HOUR).toISOString(),
            statutoryMetadata: { ...makeCase({}).statutoryMetadata!, isStatutoryBreach: true, riskClassification: 'STATUTORY_BREACH' }
        });
        useComplianceStore.setState({ cases: [breach], demoMode: false });
        useComplianceStore.getState().tickSimulatedTime();
        expect(useComplianceStore.getState().cases[0].status).toBe('BREACH');
        expect(useComplianceStore.getState().status).toBe('BREACH');
    });
});

test.describe('Round 2 - hazard text detection', () => {
    test('A4: free text never creates a statutory breach, only a suggested review', () => {
        const r = detectPhysicalStatutoryHazard('No SHE rep appointed on night shift');
        expect(r.isStatutoryBreach).toBe(false);
        expect(r.suggestedStatutoryReview).toBe(true);
        expect(r.hazardLabel).not.toContain('BREACH');

        const ok = detectPhysicalStatutoryHazard('Incident reported to the safety representative');
        expect(ok.isStatutoryBreach).toBe(false);
        expect(ok.suggestedStatutoryReview).toBe(false);
    });

    test('A5: weight parsing handles SA decimals, multiple weights and "2 x 15 kg"', () => {
        expect(parseMaxWeightKg('25,5 kg bag')).toBe(25.5);
        expect(parseMaxWeightKg('a 5 kg box and a 30 kg sack')).toBe(30);
        expect(parseMaxWeightKg('2 x 15 kg')).toBe(15);
        expect(parseMaxWeightKg('pallet of 1 000 kg')).toBe(1000);
        expect(parseMaxWeightKg('no weight mentioned')).toBe(0);

        expect(detectPhysicalStatutoryHazard('25,5 kg bag').isPhysicalHighRisk).toBe(true);
        expect(detectPhysicalStatutoryHazard('a 5 kg box and a 30 kg sack').isPhysicalHighRisk).toBe(true);
        expect(detectPhysicalStatutoryHazard('2 x 15 kg').isPhysicalHighRisk).toBe(false);
        expect(detectPhysicalStatutoryHazard('exactly 25 kg').isPhysicalHighRisk).toBe(false);
    });

    test('A5: a non-high-risk finding is not classified as HIGH_RISK or as a medical surveillance record', () => {
        const r = detectPhysicalStatutoryHazard('Worker lifted a 20 kg box');
        expect(r.statutoryMetadata.riskClassification).toBe('RISK_ALERT');
        expect(r.statutoryMetadata.retentionCategory).toBe('REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR');
        expect(r.statutoryMetadata.requiresOMPReferral).toBe(false);
    });

    test('B2: no unverified 45-minute Reg 9 limit or back-support belts in control text', () => {
        const cold = detectPhysicalStatutoryHazard('cold room freezer work');
        expect(cold.statutoryMetadata.hierarchyOfControlsMandate).not.toMatch(/45 ?min/i);
        const lift = detectPhysicalStatutoryHazard('lifting 30 kg sacks');
        expect(lift.statutoryMetadata.hierarchyOfControlsMandate).not.toMatch(/lumbar support/i);
        expect(lift.hazardLabel).toContain('72 hours');
    });
});

test.describe('Round 2 - labels', () => {
    test('SLA label shows real remaining/overdue time', () => {
        const now = Date.now();
        expect(caseSlaLabel({ createdAt: new Date(now - 31 * HOUR).toISOString(), timeframeHours: 72, escalationState: 'routed_to_manager' }, now))
            .toBe('SLA: 41h of 72h remaining');
        expect(caseSlaLabel({ createdAt: new Date(now - 75 * HOUR).toISOString(), timeframeHours: 72, escalationState: 'escalated_level_2' }, now))
            .toBe('SLA: overdue by 3h');
        expect(caseSlaLabel({ createdAt: new Date(now).toISOString(), timeframeHours: 72, escalationState: 'resolved' }, now))
            .toBe('SLA: closed');
        expect(caseStatusLabel({ status: 'OVERDUE_HIGH_RISK' })).not.toMatch(/breach/i);
    });
});

test.describe('Round 2 - fatigue', () => {
    test('3.2: moving the slider 4.5 -> 5.0 -> 5.5 h creates at most one new case', () => {
        useComplianceStore.setState(initialComplianceState, true);
        useFatigueStore.getState().supervisorOverride();
        useFatigueStore.setState({ fatigueLevel: 'nominal', reactionDropPct: 0 });
        const before = useComplianceStore.getState().cases.length;
        useFatigueStore.getState().setDrivingHours(4.5);
        useFatigueStore.getState().setDrivingHours(5.0);
        useFatigueStore.getState().setDrivingHours(5.5);
        expect(useComplianceStore.getState().cases.length - before).toBeLessThanOrEqual(1);
    });

    test('0.2: a failed handshake is never recorded as passed', () => {
        useFatigueStore.getState().failCognitiveHandshake();
        const s = useFatigueStore.getState();
        expect(s.cognitiveHandshakePassed).toBe(false);
        expect(s.status).toBe('HIGH');
    });
});
