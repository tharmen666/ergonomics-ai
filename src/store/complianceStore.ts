import { create } from 'zustand';

export type ComplianceStatus = 'COMPLIANT' | 'BREACH';

interface ComplianceLog {
    timestamp: string;
    score: number;
    threshold: number;
}

interface ComplianceState {
    status: ComplianceStatus;
    requiresEscalation: boolean;
    logs: ComplianceLog[];
    triggerBreach: (score: number, threshold: number, timestamp: string) => void;
    resetCompliance: () => void;
}

export const useComplianceStore = create<ComplianceState>((set) => {
    // Initialize window EventListener for 'NON_COMPLIANCE_TRIGGER'
    if (typeof window !== 'undefined') {
        window.addEventListener('NON_COMPLIANCE_TRIGGER', (event: Event) => {
            const customEvent = event as CustomEvent<{ score: number; threshold: number; timestamp: string }>;
            const { score, threshold, timestamp } = customEvent.detail || {};
            
            set((state) => ({
                status: 'BREACH',
                requiresEscalation: true,
                logs: [
                    {
                        timestamp: timestamp || new Date().toISOString(),
                        score: score !== undefined ? score : 0,
                        threshold: threshold !== undefined ? threshold : 0
                    },
                    ...state.logs
                ]
            }));
        });
    }

    return {
        status: 'COMPLIANT',
        requiresEscalation: false,
        logs: [],
        
        triggerBreach: (score, threshold, timestamp) => set((state) => ({
            status: 'BREACH',
            requiresEscalation: true,
            logs: [
                { timestamp, score, threshold },
                ...state.logs
            ]
        })),

        resetCompliance: () => set({
            status: 'COMPLIANT',
            requiresEscalation: false
        })
    };
});
