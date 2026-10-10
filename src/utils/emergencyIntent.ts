/**
 * Decides whether a chat message reports an emergency. Negated mentions ("no injury",
 * "not an accident", "accident report training") do not open the emergency panel - false alarms
 * teach staff to ignore the real ones.
 */
const EMERGENCY_TERMS = ['severe pain', 'fainting', 'fainted', 'unconscious', 'injury', 'injured', 'accident', 'not breathing', 'collapsed', 'heavy bleeding'];
const NEGATORS = /\b(?:no|not|without|never|zero|nil|none)\b/;
const NON_EVENT_CONTEXT = /\b(?:report form|report template|training|course|policy|procedure|drill|statistics|stats|history|prevention)\b/;

export const reportsEmergency = (message: string): boolean => {
    const text = message.toLowerCase();
    return EMERGENCY_TERMS.some((term) => {
        let from = 0;
        let i: number;
        while ((i = text.indexOf(term, from)) !== -1) {
            const clause = (text.slice(Math.max(0, i - 40), i).split(/[.;!?\n,]/).pop() ?? '').trim();
            const lastWords = clause.split(/\s+/).slice(-3).join(' ');
            const after = text.slice(i + term.length, i + term.length + 25);
            if (!NEGATORS.test(lastWords) && !NON_EVENT_CONTEXT.test(after)) return true;
            from = i + term.length;
        }
        return false;
    });
};
