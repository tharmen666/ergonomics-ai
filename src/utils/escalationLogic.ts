/**
 * ErgoSafe is a coaching tool, not a monitoring tool.
 *
 * The old per-person escalation (missed weekly scan -> supervisor -> leader -> CEO, with a
 * "complianceScore" and "Unmanaged Corporate Liability" flag) was removed. It was not used
 * anywhere in the app, and it contradicts the promise on the camera consent screen: no
 * disciplinary action, no performance scoring, no productivity surveillance.
 *
 * Manager accountability for real workplace hazards lives in complianceStore (cases that a
 * manager must resolve within a time limit) and is unchanged.
 */

/** A gentle reminder that goes to the person themselves only. Never to a manager. */
export const checkSelfReminder = (
    lastCheckInDate: string | null,
    now: Date = new Date()
): { message: string } | null => {
    if (!lastCheckInDate) return null;
    const last = new Date(lastCheckInDate).getTime();
    if (Number.isNaN(last)) return null;
    const days = Math.floor((now.getTime() - last) / (1000 * 3600 * 24));
    if (days < 7) return null;
    return {
        message: 'Quick check-in? It has been a week. A two-minute stretch and posture check keeps small aches from becoming big ones.',
    };
};

// TODO(legal-verify): removed specific fine amount of R1,000,000
export const getLegalShockContent = () => {
    return "Failure to adhere to Section 8(1) and Section 38 of the Occupational Health and Safety Act 85 of 1993 may result in statutory liability and penalties as prescribed under the Act.";
};
