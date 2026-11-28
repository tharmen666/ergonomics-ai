/**
 * Nelly triage (prototype): banter for silly questions, a short structured pain check,
 * and safe referral. Pure functions, rule-based, session-only.
 *
 * PRIVACY RULES (do not change without Dezo's written approval):
 *  - Nothing in here writes to localStorage, sessionStorage, cookies, a server or any store.
 *  - The session object lives in memory and disappears on refresh.
 *  - Nothing here is reported to a manager, supervisor, HR or the compliance store.
 *  - There is no scoring or ranking of people. Banter count only changes Nelly's tone, in this session.
 *  - Nelly never diagnoses. She says "this needs a doctor", never what it is.
 */
import { EXERCISES, AREA_LABEL, type PainArea } from '../data/nellyExercises';

export type PainStep = 'rest' | 'move' | 'spread' | 'tingle' | 'weak' | 'injury' | 'days';

export interface PainCheckState {
    area: PainArea;
    step: PainStep;
    retried: boolean;
    restScore?: number;
    moveScore?: number;
    spreads?: boolean;
    tingles?: boolean;
    weak?: boolean;
    injury?: boolean;
    days?: number;
}

export interface TriageSession {
    banterCount: number;
    awaitingArea: boolean;
    pain: PainCheckState | null;
}

export type TriageReplyKind = 'banter' | 'private_referral' | 'pain_question' | 'pain_result' | 'hr_leave' | 'info';

export type TriageResult =
    | { type: 'emergency' }
    | { type: 'reply'; kind: TriageReplyKind; text: string }
    | null;

export const newTriageSession = (): TriageSession => ({ banterCount: 0, awaitingArea: false, pain: null });

/* ---------- detection ---------- */

const EMERGENCY =
    /\b(chest pain|can'?t breathe|cannot breathe|not breathing|unconscious|collapsed|fainted|heavy bleeding|slurred speech|face (is )?droop(ing)?|can'?t feel (my )?(legs?|feet)|lost control of (my )?(bladder|bowels?)|worst headache)\b/;
const STIFF_NECK_RED = /\b(stiff neck)\b.*\b(fever|high temperature)\b|\b(fever|high temperature)\b.*\b(stiff neck)\b/;
const PAIN_WORD = /\b(sore|hurt|hurts|hurting|pain|painful|aching|ache|aches|stiff|swollen|burning|cramp|cramps|tender)\b/;
const GENERIC_PAIN = /\b(pain|hurts|hurting|sore|ache|aching)\b/;
const BUM = /\b(ass|arse|butt|bum|buttocks|tailbone)\b/;
const PRIVATE_PARTS = /\b(dick|penis|balls|testicles?|groin|vagina|vulva|boobs?|breasts?|nipples?)\b/;
const CRUDE = /\b(fuck|fucking|shit|sex|sexy|naked)\b/;
const LEAVE = /\b(sick (leave|note|day)|doctor'?s? (note|letter)|medical certificate|day off|work from home|wfh|off sick|take leave)\b/;
const CANCEL = /\b(stop|cancel|never ?mind|forget it|skip)\b/;

const AREA_WORDS: Array<[RegExp, PainArea]> = [
    [/\b(neck|cervical)\b/, 'neck'],
    [/\b(back|lumbar|spine|spinal)\b/, 'back'],
    [/\b(shoulder|shoulders)\b/, 'shoulder'],
    [/\b(wrist|wrists|carpal|hand|hands|finger|fingers|thumb|elbow|forearm)\b/, 'wrist'],
    [/\b(eye|eyes|vision|headache)\b/, 'eyes'],
    [/\b(leg|legs|knee|knees|ankle|foot|feet|hip|hips|calf)\b/, 'legs'],
];

export const detectArea = (low: string): PainArea | null => {
    for (const [pattern, area] of AREA_WORDS) if (pattern.test(low)) return area;
    return null;
};

/* ---------- banter (clean, funny, always ends somewhere useful) ---------- */

const BUM_REPLIES = [
    "A sore bum? That's your chair filing a complaint. Up you get: two minutes of walking and stretching right now. From tomorrow, add some gentle core and glute work, like a few crunches or glute bridges, starting small. If it's sharp, or it runs down your leg, tell me and we'll do a proper check.",
    "Your seat has been working harder than you have. Stand up, walk to the water cooler and back, and do a few calf raises on the way. Then make a deal with yourself: a few bridges or crunches a day, building up slowly.",
    "Sitting for hours does that. Stand, stretch, walk for two minutes. If it keeps coming back, it's your chair, your posture, or too few breaks, and all three are fixable. Want me to run a quick check?",
];

const PRIVATE_REPLIES = [
    "Eish, that one is above my pay grade. I'm an ergonomics assistant, not a doctor! Take a moment away from your desk, tell your supervisor you need to see a doctor (you don't have to say why), and get it checked. Don't sit there suffering.",
    "I'll leave that one to the professionals. Please go and see a doctor soon. Your supervisor only needs to know you have a medical appointment, nothing more.",
];

const CRUDE_REPLIES = [
    "I've heard worse in a call centre! Let's keep it clean and useful. Is something actually bothering you, like your neck, back, wrists or eyes?",
    "Ha, nice try. I'm a very professional ergonomics assistant. What can I really help with today?",
    "You're keeping me on my toes! Quick question though: when last did you stand up and stretch?",
];

const BANTER_CAP =
    "Okay, comedy hour is over! Is something really bothering you today, or shall we do a quick two-minute stretch together?";

const HR_LEAVE_REPLY =
    "Leave and sick notes are an HR matter, so I can't approve, record or check them. Please speak to your supervisor or HR. If your body is the problem, tell me where it hurts and I'll do a quick check and tell you if it's worth seeing a doctor.";

const pick = (list: string[], n: number): string => list[n % list.length];

/* ---------- pain check ---------- */

const STEPS_FOR: Record<PainArea, PainStep[]> = {
    neck: ['rest', 'move', 'spread', 'tingle', 'weak', 'injury', 'days'],
    back: ['rest', 'move', 'spread', 'tingle', 'weak', 'injury', 'days'],
    shoulder: ['rest', 'move', 'spread', 'tingle', 'weak', 'injury', 'days'],
    wrist: ['rest', 'move', 'spread', 'tingle', 'weak', 'injury', 'days'],
    legs: ['rest', 'move', 'spread', 'tingle', 'weak', 'injury', 'days'],
    eyes: ['rest', 'move', 'spread', 'injury', 'days'],
};

const MOVE_Q: Record<PainArea, string> = {
    neck: 'Slowly turn your head to the left, then the right, only as far as is comfortable. Stop if it turns sharp. What is the pain score at the worst point?',
    back: 'Slowly stand up from your chair, or lean forward a little and come back up. What is the pain score at the worst point?',
    shoulder: 'Slowly lift your arm out to the side, only as far as is comfortable. What is the pain score at the worst point?',
    wrist: 'Gently bend your wrist up and down. Stop if it turns sharp. What is the pain score at the worst point?',
    legs: 'Stand up and take a few slow steps. What is the pain score at the worst point?',
    eyes: 'Look at your screen for a moment. What is the discomfort score now?',
};

const SPREAD_Q: Record<PainArea, string> = {
    neck: 'Does the pain run or spread anywhere, for example down your arm or into your hand?',
    back: 'Does the pain run or spread anywhere, for example down your leg?',
    shoulder: 'Does the pain run or spread anywhere, for example down your arm or into your hand?',
    wrist: 'Does the pain run or spread anywhere, for example up your arm?',
    legs: 'Does the pain run or spread anywhere, for example up or down the leg?',
    eyes: 'Any sudden blurred vision, flashing lights, or part of your vision missing?',
};

const INJURY_Q: Record<PainArea, string> = {
    neck: 'Did this start after a fall, a knock, or lifting something heavy?',
    back: 'Did this start after a fall, a knock, or lifting something heavy?',
    shoulder: 'Did this start after a fall, a knock, or lifting something heavy?',
    wrist: 'Did this start after a fall, a knock, or lifting something heavy?',
    legs: 'Did this start after a fall, a knock, or lifting something heavy?',
    eyes: 'Did something hit or get into your eye, such as a chemical splash?',
};

const questionFor = (state: PainCheckState): string => {
    switch (state.step) {
        case 'rest':
            return `Let's check that ${AREA_LABEL[state.area]} properly. On a scale of 0 to 10, how bad is it when you are sitting still? (0 = nothing, 10 = the worst)`;
        case 'move':
            return MOVE_Q[state.area];
        case 'spread':
            return SPREAD_Q[state.area];
        case 'tingle':
            return 'Any tingling, pins and needles, or numbness in your hands or legs?';
        case 'weak':
            return 'Any weakness, like dropping things or your leg giving way?';
        case 'injury':
            return INJURY_Q[state.area];
        case 'days':
            return 'How long has this been going on? For example "since today", "3 days" or "2 weeks".';
    }
};

export const startPainCheck = (area: PainArea): PainCheckState => ({ area, step: 'rest', retried: false });

const parseScore = (text: string): number | null => {
    const m = text.match(/\b(10|[0-9])\b/);
    return m ? Number(m[1]) : null;
};

const parseYesNo = (text: string): boolean | null => {
    if (/\b(no|nope|nah|never|none|not really)\b/.test(text)) return false;
    if (/\b(yes|yeah|yep|ya|yup|sometimes|a bit|little|slightly)\b/.test(text)) return true;
    return null;
};

const parseDays = (text: string): number | null => {
    if (/\b(today|this morning|just now)\b/.test(text)) return 0;
    if (/\byesterday\b/.test(text)) return 1;
    const unit = (u: string): number => (u.startsWith('day') ? 1 : u.startsWith('week') ? 7 : 30);
    const withNumber = text.match(/(\d+)\s*(day|days|week|weeks|month|months)/);
    if (withNumber) return Number(withNumber[1]) * unit(withNumber[2]);
    const withWord = text.match(/\b(a|one)\s*(day|week|month)/);
    if (withWord) return unit(withWord[2]);
    const bare = text.match(/\b(\d+)\b/);
    return bare ? Number(bare[1]) : null;
};

const nextStep = (state: PainCheckState): PainStep | null => {
    const steps = STEPS_FOR[state.area];
    const i = steps.indexOf(state.step);
    return i >= 0 && i + 1 < steps.length ? steps[i + 1] : null;
};

export interface PainOutcome {
    outcome: 'see_doctor' | 'self_care';
    reasons: string[];
}

export const decide = (s: PainCheckState): PainOutcome => {
    const reasons: string[] = [];
    if (s.spreads) reasons.push(s.area === 'eyes' ? 'a sudden change in your vision' : 'the pain is spreading');
    if (s.tingles) reasons.push('tingling or numbness');
    if (s.weak) reasons.push('weakness');
    if (s.injury) reasons.push(s.area === 'eyes' ? 'something hit or got into your eye' : 'it started after a knock, fall or heavy lift');
    if ((s.restScore ?? 0) >= 7) reasons.push(`the pain is high even at rest (${s.restScore}/10)`);
    if ((s.moveScore ?? 0) >= 8) reasons.push(`the pain is very high when you move (${s.moveScore}/10)`);
    if ((s.days ?? 0) >= 14) reasons.push('it has lasted two weeks or more');
    return { outcome: reasons.length > 0 ? 'see_doctor' : 'self_care', reasons };
};

const resultText = (s: PainCheckState): string => {
    const { outcome, reasons } = decide(s);
    if (outcome === 'see_doctor') {
        return (
            `Thanks for answering. Because of this: ${reasons.join('; ')}. This needs a doctor. ` +
            `Please step away from your desk, tell your supervisor you need to see a doctor (you do not have to say why), and get checked today. ` +
            `I can't tell you what it is, and that is exactly why a doctor should look at it.`
        );
    }
    const list = EXERCISES[s.area].map((e) => `- ${e.name}: ${e.how}`).join('\n');
    return (
        `Thanks for answering. Nothing you told me points to a doctor visit right now. Try these gently, and stop if anything turns sharp:\n${list}\n` +
        `Also stand and walk for 2 minutes every 30 to 45 minutes. Tell me tomorrow how it feels. If it gets worse, spreads, or starts tingling, come back and we will check again. ` +
        `This is general guidance, not a diagnosis.`
    );
};

export const answerPain = (state: PainCheckState, text: string): { state: PainCheckState | null; reply: string; done: boolean } => {
    const next: PainCheckState = { ...state };
    let parsed = true;

    switch (state.step) {
        case 'rest': {
            const v = parseScore(text);
            if (v === null) parsed = false;
            else next.restScore = v;
            break;
        }
        case 'move': {
            const v = parseScore(text);
            if (v === null) parsed = false;
            else next.moveScore = v;
            break;
        }
        case 'spread':
        case 'tingle':
        case 'weak':
        case 'injury': {
            const v = parseYesNo(text);
            if (v === null) parsed = false;
            else if (state.step === 'spread') next.spreads = v;
            else if (state.step === 'tingle') next.tingles = v;
            else if (state.step === 'weak') next.weak = v;
            else next.injury = v;
            break;
        }
        case 'days': {
            const v = parseDays(text);
            if (v === null) parsed = false;
            else next.days = v;
            break;
        }
    }

    if (!parsed && !state.retried) {
        const retry: PainCheckState = { ...state, retried: true };
        return { state: retry, reply: `Sorry, I didn't catch that. ${questionFor(retry)}`, done: false };
    }

    // Second failure: yes/no questions count as "yes" (the cautious answer). Scores and days are left blank.
    if (!parsed) {
        if (state.step === 'spread') next.spreads = true;
        if (state.step === 'tingle') next.tingles = true;
        if (state.step === 'weak') next.weak = true;
        if (state.step === 'injury') next.injury = true;
    }

    const step = nextStep(next);
    if (step === null) return { state: null, reply: resultText(next), done: true };
    const advanced: PainCheckState = { ...next, step, retried: false };
    return { state: advanced, reply: questionFor(advanced), done: false };
};

/* ---------- entry point ---------- */

export const triage = (text: string, session: TriageSession): { result: TriageResult; session: TriageSession } => {
    const low = text.toLowerCase().trim();

    if (EMERGENCY.test(low) || STIFF_NECK_RED.test(low)) {
        return { result: { type: 'emergency' }, session: { ...session, awaitingArea: false, pain: null } };
    }

    if (session.pain) {
        if (CANCEL.test(low)) {
            return {
                result: { type: 'reply', kind: 'info', text: 'No problem, we can stop there. If anything gets worse or starts tingling, come back and tell me.' },
                session: { ...session, pain: null },
            };
        }
        const { state, reply, done } = answerPain(session.pain, low);
        return {
            result: { type: 'reply', kind: done ? 'pain_result' : 'pain_question', text: reply },
            session: { ...session, pain: state },
        };
    }

    if (session.awaitingArea) {
        const area = detectArea(low);
        if (area) {
            const pain = startPainCheck(area);
            return {
                result: { type: 'reply', kind: 'pain_question', text: questionFor(pain) },
                session: { ...session, awaitingArea: false, pain },
            };
        }
        // Not an answer to our question: drop the question and let the normal flow handle this message.
        session = { ...session, awaitingArea: false };
    }

    if (LEAVE.test(low)) {
        return { result: { type: 'reply', kind: 'hr_leave', text: HR_LEAVE_REPLY }, session };
    }

    const hasPain = PAIN_WORD.test(low);

    if (PRIVATE_PARTS.test(low)) {
        if (hasPain) {
            return {
                result: { type: 'reply', kind: 'private_referral', text: pick(PRIVATE_REPLIES, session.banterCount) },
                session: { ...session, banterCount: session.banterCount + 1 },
            };
        }
        return banter(session, CRUDE_REPLIES);
    }

    if (BUM.test(low) && hasPain) return banter(session, BUM_REPLIES);
    if (CRUDE.test(low)) return banter(session, CRUDE_REPLIES);

    if (hasPain) {
        const area = detectArea(low);
        if (area) {
            const pain = startPainCheck(area);
            return { result: { type: 'reply', kind: 'pain_question', text: questionFor(pain) }, session: { ...session, pain } };
        }
        if (GENERIC_PAIN.test(low)) {
            return {
                result: { type: 'reply', kind: 'pain_question', text: 'Sorry to hear that. Where does it hurt: neck, back, shoulder, wrist or hand, eyes, or legs?' },
                session: { ...session, awaitingArea: true },
            };
        }
    }

    return { result: null, session };
};

const banter = (session: TriageSession, replies: string[]): { result: TriageResult; session: TriageSession } => {
    const text = session.banterCount >= 3 ? BANTER_CAP : pick(replies, session.banterCount);
    return {
        result: { type: 'reply', kind: 'banter', text },
        session: { ...session, banterCount: session.banterCount + 1 },
    };
};

