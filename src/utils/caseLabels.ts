import type { EmployeeCase } from '../store/complianceStore';

/** Human label for a case status. "Breach" is used ONLY for genuine statutory breaches. */
export const caseStatusLabel = (c: Pick<EmployeeCase, 'status'>): string => {
    switch (c.status) {
        case 'BREACH': return 'Statutory Breach';
        case 'OVERDUE_HIGH_RISK': return 'Overdue - High Risk';
        case 'ESCALATED_UNRESOLVED': return 'Escalated - Unresolved';
        case 'RISK_ALERT': return 'Risk Alert';
        case 'COMPLIANT': return 'Closed';
        default: return String(c.status);
    }
};

/** Where the case currently sits in the escalation chain (separate from its status). */
export const caseEscalationLabel = (c: Pick<EmployeeCase, 'escalationState'>): string => {
    switch (c.escalationState) {
        case 'escalated_level_2': return 'Escalated to CEO / HR Head';
        case 'routed_to_manager': return 'With Line Manager';
        case 'resolved': return 'Resolved';
        case 'triggered': return 'Logged';
        default: return String(c.escalationState);
    }
};

/** SLA text from real elapsed time: "SLA: 41h remaining", "SLA: overdue by 3h", or "SLA: closed". */
export const caseSlaLabel = (
    c: Pick<EmployeeCase, 'createdAt' | 'timeframeHours' | 'escalationState'>,
    now: number = Date.now()
): string => {
    if (c.escalationState === 'resolved') return 'SLA: closed';
    const elapsedHours = (now - new Date(c.createdAt).getTime()) / 3600000;
    const remaining = c.timeframeHours - elapsedHours;
    if (remaining >= 0) return `SLA: ${Math.ceil(remaining)}h of ${c.timeframeHours}h remaining`;
    return `SLA: overdue by ${Math.ceil(-remaining)}h`;
};

export const formatLogged = (iso: string): string => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};
