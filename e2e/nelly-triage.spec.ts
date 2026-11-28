import { test, expect } from '@playwright/test';
import { triage, newTriageSession, type TriageSession } from '../src/lib/nellyTriage';
import { useAgentLog } from '../src/store/agentLogStore';

const run = (messages: string[]) => {
    let session: TriageSession = newTriageSession();
    const replies: Array<ReturnType<typeof triage>['result']> = [];
    for (const m of messages) {
        const out = triage(m, session);
        session = out.session;
        replies.push(out.result);
    }
    return { replies, session };
};
const last = (r: ReturnType<typeof run>) => r.replies[r.replies.length - 1];
const text = (r: ReturnType<typeof triage>['result']) => (r && r.type === 'reply' ? r.text : '');

test.describe('Nelly triage: banter', () => {
    test('sore bum gets a funny reply that ends in advice', () => {
        const r = last(run(['my ass is sore today']));
        expect(r?.type).toBe('reply');
        expect(text(r)).toMatch(/chair/i);
        expect(text(r)).toMatch(/stretch|walk/i);
    });

    test('private-parts pain: doctor referral, never a diagnosis, never "STD"', () => {
        const t = text(last(run(['my dick is sore'])));
        expect(t).toMatch(/doctor/i);
        expect(t).not.toMatch(/\b(std|sti|infection|disease)\b/i);
        expect(t).toMatch(/do not have to say why|don't have to say why|nothing more/i);
    });

    test('banter gets capped, but a private-parts referral still works afterwards', () => {
        const r = run(['my ass hurts', 'my ass hurts', 'my ass hurts', 'my ass hurts']);
        expect(text(last(r))).toMatch(/comedy hour/i);
        const after = triage('my balls hurt', r.session);
        expect(text(after.result)).toMatch(/doctor/i);
    });

    test('unrelated and look-alike words fall through to the old flow', () => {
        expect(last(run(['what is the OHS act']))).toBeNull();
        expect(last(run(['desk assessment please']))).toBeNull();
    });
});

test.describe('Nelly triage: law and scope', () => {
    test('leave and sick-note questions go to HR, Nelly does not handle them', () => {
        const t = text(last(run(['can I get a sick note for tomorrow'])));
        expect(t).toMatch(/HR/);
        expect(t).toMatch(/can't approve, record or check/i);
    });

    test('emergencies hand over to the existing emergency reply', () => {
        expect(last(run(['I have chest pain']))?.type).toBe('emergency');
        expect(last(run(['stiff neck and a fever']))?.type).toBe('emergency');
    });
});

test.describe('Nelly triage: pain check', () => {
    test('no red flags -> self-care with exercises, session cleared', () => {
        const r = run(['my neck is stiff', '3', '5', 'no', 'no', 'no', 'no', 'since yesterday']);
        expect(text(last(r))).toMatch(/Chin tuck/);
        expect(text(last(r))).not.toMatch(/needs a doctor/i);
        expect(r.session.pain).toBeNull();
    });

    test('pain spreading down the leg -> doctor, no diagnosis words', () => {
        const t = text(last(run(['my back hurts', '6', '7', 'yes it goes down my leg', 'no', 'no', 'no', '3 days'])));
        expect(t).toMatch(/needs a doctor/i);
        expect(t).not.toMatch(/sciatica|slipped disc|herniat|diagnosed with/i);
    });

    test('very high score plus 3 weeks -> doctor', () => {
        const t = text(last(run(['neck pain', '8', '9', 'no', 'no', 'no', 'no', '3 weeks'])));
        expect(t).toMatch(/needs a doctor/i);
        expect(t).toMatch(/two weeks or more/);
    });

    test('tingling alone is enough for a doctor referral', () => {
        const t = text(last(run(['wrist pain', '2', '2', 'no', 'yes', 'no', 'no', '2 days'])));
        expect(t).toMatch(/needs a doctor/i);
        expect(t).toMatch(/tingling or numbness/);
    });

    test('an answer Nelly cannot read twice counts as the cautious answer (yes)', () => {
        const t = text(last(run(['wrist pain', '2', '2', 'banana', 'banana', 'no', 'no', 'no', '1 day'])));
        expect(t).toMatch(/needs a doctor/i);
    });

    test('"where does it hurt?" follow-up works and cancel works', () => {
        const a = run(['everything hurts today', 'my shoulder']);
        expect(text(last(a))).toMatch(/sitting still/);
        const b = run(['knee pain', 'cancel']);
        expect(b.session.pain).toBeNull();
    });
});

test.describe('Privacy: nothing leaves the session', () => {
    test('triage does not touch browser storage', () => {
        const touched: string[] = [];
        const fake = { getItem: () => (touched.push('get'), null), setItem: () => touched.push('set'), removeItem: () => touched.push('remove') };
        const names = ['localStorage', 'sessionStorage'] as const;
        const saved = names.map((n) => Object.getOwnPropertyDescriptor(globalThis, n));
        names.forEach((n) => Object.defineProperty(globalThis, n, { value: fake, configurable: true, writable: true }));
        try {
            run(['my ass is sore', 'my dick hurts', 'my neck hurts', '4', '5', 'no', 'no', 'no', 'no', '2 days']);
            expect(touched).toEqual([]);
        } finally {
            names.forEach((n, i) => {
                const d = saved[i];
                if (d) Object.defineProperty(globalThis, n, d);
                else delete (globalThis as Record<string, unknown>)[n];
            });
        }
    });
});

test.describe('Activity log no longer mangles Nelly', () => {
    test("Nelly's own 'see a doctor' and 'diagnosis' pass through", () => {
        useAgentLog.setState({ logs: [], isLowConfidence: false });
        useAgentLog.getState().addLog('Nelly', 'This needs a doctor. This is general guidance, not a diagnosis.');
        const entry = useAgentLog.getState().logs[0];
        expect(entry.agent).toBe('Nelly');
        expect(entry.message).toMatch(/needs a doctor/);
    });

    test('a person asking to be diagnosed is still stopped', () => {
        useAgentLog.setState({ logs: [], isLowConfidence: false });
        useAgentLog.getState().addLog('User', 'can you diagnose me please');
        expect(useAgentLog.getState().logs[0].message).toMatch(/HARD-STOP/);
    });
});

