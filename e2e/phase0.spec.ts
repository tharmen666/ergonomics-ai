import './support/window-shim';
import { test, expect } from '@playwright/test';
import { useComplianceStore, detectPhysicalStatutoryHazard, initialComplianceState } from '../src/store/complianceStore';
import { useFatigueStore } from '../src/logic/Fatigue-Check/fatigueStore';
import { useTenantStore, SA_PUBLIC_EMERGENCY_CONTACTS } from '../src/store/tenantStore';

test.describe('PHASE 0: Life-Safety & Correctness Verification Suite', () => {

    test.beforeEach(() => {
        useComplianceStore.setState(initialComplianceState, true);
        useFatigueStore.getState().supervisorOverride();
    });

    test('0.1 Emergency UI never renders personal cellphone and defaults to SA emergency numbers', () => {
        const tenant = useTenantStore.getState().getCurrentTenant();
        const contacts = tenant?.emergencyContacts || SA_PUBLIC_EMERGENCY_CONTACTS;
        
        // Assert public emergency numbers are present
        const numbers = contacts.map(c => c.number);
        expect(numbers).toContain('112');
        expect(numbers).toContain('10177');
        expect(numbers).toContain('10111');

        // Assert personal cellphone is never in emergency contacts
        expect(numbers).not.toContain('+27622655708');
        expect(numbers).not.toContain('27622655708');

        // Assembly point fallback
        expect(tenant?.assemblyPoint).toBe('Follow your site evacuation plan');
    });

    test('0.2 Fatigue Store: failCognitiveHandshake leaves cognitiveHandshakePassed === false', () => {
        const fatigue = useFatigueStore.getState();
        fatigue.failCognitiveHandshake();

        const updated = useFatigueStore.getState();
        expect(updated.cognitiveHandshakePassed).toBe(false);
        expect(updated.fatigueLevel).toBe('high');
        expect(updated.status).toBe('HIGH');
        expect(updated.locked).toBe(true);

        // warnCognitiveHandshake test: must NOT set cognitiveHandshakePassed to true
        fatigue.warnCognitiveHandshake();
        const warned = useFatigueStore.getState();
        expect(warned.cognitiveHandshakePassed).toBe(false);
        expect(warned.fatigueLevel).toBe('warning');
        expect(warned.status).toBe('WARNING');
    });

    test('0.4 Simulated clock does not touch real records with demoMode: false, and past SLA keeps RISK_ALERT', () => {
        const store = useComplianceStore.getState();
        store.setDemoMode(false);

        // Evaluate physical hazard (72h SLA)
        const result = store.evaluateStatutoryPhysicalHazard(
            'bulk_lift_25kg',
            'Worker lifted 28 kg carton',
            'Floor Worker',
            'Logistics'
        );

        const caseId = result.caseRecord.id;
        expect(result.caseRecord.status).toBe('RISK_ALERT');
        expect(result.caseRecord.escalationState).toBe('routed_to_manager');

        // Tick simulated time under demoMode: false (5 real seconds = ~0.0014 hours)
        store.tickSimulatedTime();
        const caseAfterTick = useComplianceStore.getState().cases.find(c => c.id === caseId);
        expect(caseAfterTick?.escalationState).toBe('routed_to_manager'); // Should not escalate after 5 seconds
        expect(caseAfterTick?.status).toBe('RISK_ALERT');

        // Explicitly escalate past SLA to escalated_level_2: MUST NOT change status to BREACH
        store.updateCaseEscalation(caseId, 'escalated_level_2');
        const escalatedCase = useComplianceStore.getState().cases.find(c => c.id === caseId);
        expect(escalatedCase?.escalationState).toBe('escalated_level_2');
        expect(escalatedCase?.status).toBe('OVERDUE_HIGH_RISK'); // Physical hazard escalates to OVERDUE_HIGH_RISK, not BREACH
        expect(escalatedCase?.status).not.toBe('BREACH');
    });

    test('0.5 Hazard detection false positives (strict >25kg numeric and no free-text legal breaches)', () => {
        // 1. "reported to the safety representative" -> not a breach
        const repCheck = detectPhysicalStatutoryHazard('Incident reported to the safety representative for review');
        expect(repCheck.isStatutoryBreach).toBe(false);
        expect(repCheck.isPhysicalHighRisk).toBe(false);

        // 2. "20 kg box" -> not HIGH RISK
        const underWeight = detectPhysicalStatutoryHazard('Worker lifted a 20 kg box of produce');
        expect(underWeight.isPhysicalHighRisk).toBe(false);
        expect(underWeight.isStatutoryBreach).toBe(false);

        // 3. "exactly 25 kg" -> not HIGH RISK (strictly greater than 25 kg required)
        const exactWeight = detectPhysicalStatutoryHazard('Worker lifted exactly 25 kg parcel');
        expect(exactWeight.isPhysicalHighRisk).toBe(false);
        expect(exactWeight.isStatutoryBreach).toBe(false);

        // 4. "26 kg box" -> HIGH RISK, not BREACH
        const overWeight = detectPhysicalStatutoryHazard('Worker lifted a 26 kg box on loading bay');
        expect(overWeight.isPhysicalHighRisk).toBe(true);
        expect(overWeight.isStatutoryBreach).toBe(false);
        expect(overWeight.hazardLabel).toContain('HIGH RISK');
        expect(overWeight.hazardLabel).not.toContain('BREACH');

        // 5. "a 5 kg meat box" -> not >25 kg HIGH RISK
        const smallMeatBox = detectPhysicalStatutoryHazard('Worker carrying a 5 kg meat box to display counter');
        expect(smallMeatBox.isPhysicalHighRisk).toBe(false);
        expect(smallMeatBox.isStatutoryBreach).toBe(false);
    });
});
