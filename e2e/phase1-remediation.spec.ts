import './support/window-shim';
import { test, expect } from '@playwright/test';
import {
    useComplianceStore,
    detectPhysicalStatutoryHazard,
    initialComplianceState,
    HIGH_RISK_TAG
} from '../src/store/complianceStore';
import { useTenantStore, NO_TENANT_ID, APPOINTEE_NOT_ASSIGNED } from '../src/store/tenantStore';
import { newId } from '../src/utils/ids';
import { reportsEmergency } from '../src/utils/emergencyIntent';
import complianceHandler from '../api/compliance.js';
import { rateLimit, clientIp, __resetRateLimit } from '../api/_lib/security.js';

const risky = (t: string) => detectPhysicalStatutoryHazard(t).isPhysicalHighRisk;

const signOut = () => useTenantStore.setState({ companyId: null, userId: null, isAdmin: false });
const signInDemo = () => useTenantStore.setState({ companyId: 'COMP-001', userId: 'usr-test', isAdmin: false });

test.describe('Phase 1.3/1.4: hazard engine reads free text conservatively', () => {
    test('negated mentions do not count', () => {
        expect(risky('No carcass handling on site')).toBe(false);
        expect(risky('Freezer cleaned, no issues')).toBe(false);
        expect(risky('No cold room work today')).toBe(false);
        expect(risky('No manual lifting of 30 kg bags - pallet jack used')).toBe(false);
        expect(risky('Zero heavy lifts of 40 kg this shift')).toBe(false);
        expect(risky('There is no band saw in this store')).toBe(false);
    });

    test('machine-moved weights are not manual handling', () => {
        expect(risky('Forklift moves a 1 000 kg pallet to the racking')).toBe(false);
        expect(risky('Pallet jack used for 600 kg delivery')).toBe(false);
        // ...but a manual task mentioned alongside the forklift still counts
        expect(risky('Forklift unloads the truck, then staff manually lift 30 kg sacks')).toBe(true);
    });

    test('real hazards still trigger', () => {
        expect(risky('lifting 30 kg cement bags')).toBe(true);
        expect(risky('Worker spends 3 hours stacking in the cold room')).toBe(true);
        expect(risky('Worker exposed to -18C freezer')).toBe(true);
        expect(risky('Butcher unhooking a carcass from the rail')).toBe(true);
        expect(risky('Not wearing gloves while lifting 30 kg boxes')).toBe(true);
        expect(risky('No PPE for carcass handling')).toBe(true);
    });

    test('the weight threshold is a configurable company guidance figure, not a statutory limit', () => {
        const d = detectPhysicalStatutoryHazard('Worker lifted a 22 kg box', { guidanceKg: 20 });
        expect(d.isPhysicalHighRisk).toBe(true);
        expect(d.hazardLabel).toContain('Manual Handling > 20 kg');
        expect(d.hazardLabel).toContain('company guidance threshold');
        expect(d.hazardLabel.toLowerCase()).not.toContain('statutory');
        expect(detectPhysicalStatutoryHazard('Worker lifted a 22 kg box').isPhysicalHighRisk).toBe(false);
    });

    test('a category the user explicitly confirmed always counts', () => {
        const r = detectPhysicalStatutoryHazard('routine check', { confirmedCategories: ['cold_stress'] });
        expect(r.isPhysicalHighRisk).toBe(true);
        expect(r.categories).toEqual(['cold_stress']);
    });
});

test.describe('Phase 1.3: low-risk findings are not escalated', () => {
    test.beforeEach(() => {
        useComplianceStore.setState(initialComplianceState, true);
        useComplianceStore.setState({ cases: [], logs: [], status: 'COMPLIANT', requiresEscalation: false });
        signInDemo();
    });

    test('"freezer cleaned, no issues" is logged for review only', () => {
        const { triggered, caseRecord } = useComplianceStore.getState()
            .evaluateStatutoryPhysicalHazard('general_check', 'Freezer cleaned, no issues');
        const s = useComplianceStore.getState();
        expect(triggered).toBe(false);
        expect(caseRecord.hazardTrigger).not.toContain(HIGH_RISK_TAG);
        expect(caseRecord.hazardTrigger).not.toContain('HIGH RISK');
        expect(caseRecord.score).toBe(68);
        expect(caseRecord.escalationState).toBe('triggered');
        expect(caseRecord.statutoryMetadata?.requiresOMPReferral).toBe(false);
        expect(caseRecord.statutoryMetadata?.retentionCategory).toBe('REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR');
        expect(s.logs[0].requiresOMPReferral).toBe(false);
        expect(s.logs[0].retentionCategory).toBe('REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR');
        expect(s.requiresEscalation).toBe(false);
    });

    test('a real high-risk finding is escalated with OMP referral', () => {
        const { triggered, caseRecord } = useComplianceStore.getState()
            .evaluateStatutoryPhysicalHazard('bulk_lift_25kg', 'Lifting 30 kg cement bags');
        const s = useComplianceStore.getState();
        expect(triggered).toBe(true);
        expect(caseRecord.hazardTrigger).toContain('HIGH RISK');
        expect(caseRecord.escalationState).toBe('routed_to_manager');
        expect(s.logs[0].requiresOMPReferral).toBe(true);
        expect(s.logs[0].retentionCategory).toBe('REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR');
        expect(s.requiresEscalation).toBe(true);
        expect(s.status).not.toBe('BREACH');
    });
});

test.describe('Phase 1.6: tenant safety, appointee and IDs', () => {
    test.beforeEach(() => {
        useComplianceStore.setState(initialComplianceState, true);
    });

    test('with no session, records never land in a real tenant and show no fake manager', () => {
        signOut();
        const { caseRecord } = useComplianceStore.getState()
            .evaluateStatutoryPhysicalHazard('bulk_lift_25kg', 'Lifting 30 kg cement bags');
        expect(caseRecord.companyId).toBe(NO_TENANT_ID);
        expect(caseRecord.managerName).toBe(APPOINTEE_NOT_ASSIGNED);
        expect(useTenantStore.getState().getCurrentTenant()).toBeUndefined();
    });

    test('signed in, records use the tenant and its configured s16(2) appointee', () => {
        signInDemo();
        const { caseRecord } = useComplianceStore.getState()
            .evaluateStatutoryPhysicalHazard('bulk_lift_25kg', 'Lifting 30 kg cement bags');
        expect(caseRecord.companyId).toBe('COMP-001');
        expect(caseRecord.managerName).toBe('Pieter van Wyk (demo)');
    });

    test('no TV-character demo names remain in the store', () => {
        const all = JSON.stringify(useComplianceStore.getState().cases);
        for (const name of ['Harvey Specter', 'Mike Ross', 'Louis Litt', 'Jessica Pearson']) {
            expect(all).not.toContain(name);
        }
    });

    test('record IDs are UUID-based and unique', () => {
        const ids = new Set(Array.from({ length: 500 }, () => newId('case')));
        expect(ids.size).toBe(500);
        expect([...ids][0]).toMatch(/^case-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
});

test.describe('Phase 5: emergency panel only opens for a real emergency report', () => {
    test('negated or non-event mentions do not open it', () => {
        expect(reportsEmergency('No injury today, just checking in')).toBe(false);
        expect(reportsEmergency('Where is the accident report form?')).toBe(false);
        expect(reportsEmergency('We had no accident this month')).toBe(false);
        expect(reportsEmergency('freezer cleaned, no issues')).toBe(false);
    });
    test('real reports open it', () => {
        expect(reportsEmergency('There was an accident, worker has a severe injury')).toBe(true);
        expect(reportsEmergency('Someone fainted at till 3')).toBe(true);
    });
});

type MockRes = { statusCode: number; body: any; headers: Record<string, string> } & Record<string, any>;
const mockRes = (): MockRes => {
    const res: any = { statusCode: 200, body: undefined, headers: {} };
    res.setHeader = (k: string, v: string) => { res.headers[k.toLowerCase()] = v; };
    res.status = (code: number) => { res.statusCode = code; return res; };
    res.json = (b: any) => { res.body = b; return res; };
    res.end = () => res;
    return res;
};
const apiReq = (method: string, body?: any, headers: Record<string, string> = {}) => ({
    method,
    body,
    headers: { authorization: 'Bearer test-token', ...headers },
    socket: { remoteAddress: '10.9.9.9' }
});

test.describe('Phase 2: API security', () => {
    test.beforeEach(() => {
        process.env.ERGOSAFE_API_TOKEN = 'test-token';
        delete process.env.ALLOWED_ORIGINS;
        __resetRateLimit();
    });

    test('a spoofed first x-forwarded-for entry cannot bypass the rate limit', () => {
        const now = 2_000_000;
        let lastStatus = 200;
        for (let i = 0; i < 11; i++) {
            const r = { headers: { 'x-forwarded-for': `6.6.6.${i}, 203.0.113.7` }, socket: { remoteAddress: '127.0.0.1' } } as any;
            const res = mockRes();
            rateLimit(r, res, { limit: 10, windowMs: 60_000, now });
            lastStatus = res.statusCode;
        }
        expect(lastStatus).toBe(429);
    });

    test('Vercel / real-ip headers are preferred over x-forwarded-for', () => {
        expect(clientIp({ headers: { 'x-real-ip': '198.51.100.4', 'x-forwarded-for': '6.6.6.6' } })).toBe('198.51.100.4');
        expect(clientIp({ headers: { 'x-vercel-forwarded-for': '198.51.100.9', 'x-forwarded-for': '6.6.6.6' } })).toBe('198.51.100.9');
    });

    test('malformed JSON -> 400, not 500', async () => {
        const res = mockRes();
        await complianceHandler(apiReq('POST', '{not json') as any, res);
        expect(res.statusCode).toBe(400);
    });

    test('non-string siteContext / hazards are rejected', async () => {
        for (const body of [
            { taskType: 'HIRA', siteContext: { a: 'x'.repeat(5000) } },
            { taskType: 'HIRA', hazards: ['x'.repeat(5000)] }
        ]) {
            const res = mockRes();
            await complianceHandler(apiReq('POST', body) as any, res);
            expect(res.statusCode).toBe(400);
        }
    });

    test('CORS does not allow credentialed requests', async () => {
        process.env.ALLOWED_ORIGINS = 'https://app.ergosafe.example';
        const res = mockRes();
        await complianceHandler(apiReq('OPTIONS', undefined, { origin: 'https://app.ergosafe.example' }) as any, res);
        expect(res.headers['access-control-allow-origin']).toBe('https://app.ergosafe.example');
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
    });

    test('a server error never leaks internal details to the client', async () => {
        delete process.env.ANTHROPIC_API_KEY;
        const res = mockRes();
        await complianceHandler(apiReq('POST', { taskType: 'HIRA', siteContext: 'Shop 1' }) as any, res);
        expect(res.body?.details).toBeUndefined();
        if (res.statusCode >= 500) expect(typeof res.body.requestId).toBe('string');
    });
});

test.describe('Phase 5: emergency panel UI', () => {
    test('a negated mention does not open the panel; a real report does', async ({ page }) => {
        const { seedSession } = await import('./support/ui');
        await seedSession(page);
        await page.goto('/');
        await page.getByRole('button', { name: /ACTIVATE WINGMAN/i }).click();
        await page.getByRole('button', { name: 'Nelly AI Avatar' }).click();
        const input = page.getByPlaceholder('Type symptom or query...');
        await input.fill('No injury today, just checking in');
        await input.press('Enter');
        await expect(page.getByRole('alertdialog')).toHaveCount(0);

        await input.fill('There was an accident, worker has a severe injury');
        await input.press('Enter');
        const panel = page.getByRole('alertdialog');
        await expect(panel).toBeVisible();
        await expect(panel.getByRole('link', { name: /Call Emergency Services/ })).toBeVisible();

        // De-escalation needs a confirmation step
        await panel.getByRole('button', { name: 'De-escalate' }).click();
        await expect(panel).toBeVisible();
        await panel.getByRole('button', { name: /Yes, situation is safe/i }).click();
        await expect(page.getByRole('alertdialog')).toHaveCount(0);
    });
});
