export interface Employee {
    id: string;
    name: string;
    supervisorId: string;
    leaderId: string;
    complianceScore: number;
    lastScanDate: string;
    riskLevel: 'Low' | 'Medium' | 'High';
}

export const orgChart: {
    hierarchy: {
        [key: string]: { supervisor: string; leader: string; ceo: string; }
    }
} = {
    // Simple mapping: Employee -> Supervisor -> Leader -> CEO
    hierarchy: {
        'emp_001': { supervisor: 'sup_001', leader: 'lead_001', ceo: 'ceo_001' },
        'emp_002': { supervisor: 'sup_001', leader: 'lead_001', ceo: 'ceo_001' },
    }
};

export const checkEscalation = (employee: Employee) => {
    const now = new Date();
    const lastScan = new Date(employee.lastScanDate);
    const diffDays = Math.floor((now.getTime() - lastScan.getTime()) / (1000 * 3600 * 24));

    // Task 1: Escalation Logic
    if (diffDays >= 3 && diffDays < 7) {
        return {
            level: 'Supervisor',
            message: 'Weekly Scan incomplete. Auto-notifying Direct Supervisor.',
            notify: orgChart.hierarchy[employee.id]?.supervisor
        };
    } else if (diffDays >= 7 && diffDays < 14) {
        return {
            level: 'Functional Leader',
            message: 'Issue unresolved for 7 days. Auto-notifying Functional Leader.',
            notify: orgChart.hierarchy[employee.id]?.leader
        };
    } else if (diffDays >= 14) {
        return {
            level: 'CEO/HR',
            message: 'Unmanaged Corporate Liability. Flagged to CEO/HR Dashboard.',
            notify: 'ceo_001',
            isLiability: true
        };
    }

    return null;
};

export const getLegalShockContent = () => {
    return "Failure to adhere to Section 8(1) and 38(1) of the OHS Act 85 of 1993 may result in corporate liability, including fines up to R1,000,000 or imprisonment for top management.";
};
