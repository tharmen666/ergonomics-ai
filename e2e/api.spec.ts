import { test, expect } from '@playwright/test';
import fatigueHandler from '../api/v1/fatigue-score.js';
import syncHandler from '../api/sync.js';
import complianceHandler from '../api/compliance.js';
import { rateLimit, __resetRateLimit } from '../api/_lib/security.js';

type MockRes = { statusCode: number; body: any; headers: Record<string, string> } & Record<string, any>;

const mockRes = (): MockRes => {
    const res: any = { statusCode: 200, body: undefined, headers: {} };
    res.setHeader = (k: string, v: string) => { res.headers[k.toLowerCase()] = v; };
    res.status = (code: number) => { res.statusCode = code; return res; };
    res.json = (b: any) => { res.body = b; return res; };
    res.end = () => res;
    return res;
};

const req = (method: string, body?: any, headers: Record<string, string> = {}) => ({
    method,
    body,
    headers: { authorization: 'Bearer test-token', ...headers },
    socket: { remoteAddress: `10.0.0.${Math.floor(Math.random() * 250)}` }
});

test.describe('API guards & validation', () => {
    test.beforeEach(() => {
        process.env.ERGOSAFE_API_TOKEN = 'test-token';
        delete process.env.ALLOWED_ORIGINS;
        __resetRateLimit();
    });

    test('C1: fails closed (500) when ERGOSAFE_API_TOKEN is not configured - no default token', async () => {
        delete process.env.ERGOSAFE_API_TOKEN;
        for (const h of [fatigueHandler, syncHandler, complianceHandler]) {
            const res = mockRes();
            await h(req('POST', {}, { authorization: 'Bearer ergosafe-dev-token' }) as any, res);
            expect(res.statusCode).toBe(500);
        }
    });

    test('C1: wrong or missing token -> 401', async () => {
        const res = mockRes();
        await complianceHandler({ ...req('GET'), headers: {} } as any, res);
        expect(res.statusCode).toBe(401);
        const res2 = mockRes();
        await fatigueHandler(req('POST', { drivingHours: 2 }, { authorization: 'Bearer nope' }) as any, res2);
        expect(res2.statusCode).toBe(401);
    });

    test('C1: CORS never sends a wildcard origin with credentials', async () => {
        const res = mockRes();
        await syncHandler(req('OPTIONS', undefined, { origin: 'https://evil.example' }) as any, res);
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        process.env.ALLOWED_ORIGINS = 'https://app.ergosafe.example';
        const ok = mockRes();
        await syncHandler(req('OPTIONS', undefined, { origin: 'https://app.ergosafe.example' }) as any, ok);
        expect(ok.headers['access-control-allow-origin']).toBe('https://app.ergosafe.example');
    });

    test('C1: rate limit returns 429 after the limit', () => {
        const r = { headers: {}, socket: { remoteAddress: '1.2.3.4' } } as any;
        const now = 1_000_000;
        for (let i = 0; i < 10; i++) expect(rateLimit(r, mockRes(), { limit: 10, windowMs: 600000, now })).toBe(true);
        const res = mockRes();
        expect(rateLimit(r, res, { limit: 10, windowMs: 600000, now })).toBe(false);
        expect(res.statusCode).toBe(429);
        expect(rateLimit(r, mockRes(), { limit: 10, windowMs: 600000, now: now + 600001 })).toBe(true);
    });

    test('2.3: sync returns 501 (not a fake success)', async () => {
        const res = mockRes();
        await syncHandler(req('POST', {}) as any, res);
        expect(res.statusCode).toBe(501);
        expect(res.body.success).toBe(false);
    });

    const fatigue = async (body: any) => {
        const res = mockRes();
        await fatigueHandler(req('POST', body) as any, res);
        return res;
    };

    test('C2: non-numeric hours -> 400 (not silently 0)', async () => {
        expect((await fatigue({ drivingHours: 'abc' })).statusCode).toBe(400);
    });
    test('C2: hours out of range -> 400', async () => {
        expect((await fatigue({ drivingHours: 25 })).statusCode).toBe(400);
        expect((await fatigue({ drivingHours: -1 })).statusCode).toBe(400);
    });
    test('C2: reactionDropPct out of range -> 400', async () => {
        expect((await fatigue({ drivingHours: 2, reactionDropPct: 150 })).statusCode).toBe(400);
    });
    test('C2: Infinity / negative / non-numeric reaction times -> 400', async () => {
        expect((await fatigue({ drivingHours: 2, reactionTimes: [Infinity] })).statusCode).toBe(400);
        expect((await fatigue({ drivingHours: 2, reactionTimes: [-5] })).statusCode).toBe(400);
        expect((await fatigue({ drivingHours: 2, reactionTimes: ['300'] })).statusCode).toBe(400);
    });
    test('C2: more than 100 reaction samples -> 400', async () => {
        expect((await fatigue({ drivingHours: 2, reactionTimes: Array(101).fill(300) })).statusCode).toBe(400);
    });
    test('C2: odd-length reaction times use real slice lengths ([100,200,300] -> +150%)', async () => {
        const res = await fatigue({ drivingHours: 1, reactionTimes: [100, 200, 300] });
        expect(res.statusCode).toBe(200);
        expect(res.body.reactionDropPct).toBe(150);
        expect(res.body.riskLevel).toBe('CRITICAL');
        expect(JSON.stringify(res.body)).not.toMatch(/BREACH|legal thresholds/);
    });
});
