import { create } from 'zustand';

export type LPSCategory = 'personal_complacency' | 'job_system_factor';

export interface IncidentRecord {
    id: string;
    timestamp: Date;
    description: string;
    category: LPSCategory;
    status: 'pending_review' | 'corrective_action_assigned' | 'resolved';
}

interface LPSState {
    incidents: IncidentRecord[];
    requiresManualReview: boolean;
    logIncident: (description: string, category: LPSCategory) => void;
    assignCorrectiveAction: (incidentId: string) => void;
    resolveIncident: (incidentId: string) => void;
}

export const useLpsStore = create<LPSState>((set) => ({
    incidents: [],
    requiresManualReview: false,

    logIncident: (description, category) => set((state) => {
        const newIncident: IncidentRecord = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            description,
            category,
            status: 'pending_review'
        };

        return {
            incidents: [newIncident, ...state.incidents], // Prepended so newest is first
            requiresManualReview: true
        };
    }),

    assignCorrectiveAction: (incidentId) => set((state) => {
        const updatedIncidents = state.incidents.map(inc => 
            inc.id === incidentId ? { ...inc, status: 'corrective_action_assigned' as const } : inc
        );
        // Check if any other incidents are still pending review
        const stillRequiresReview = updatedIncidents.some(inc => inc.status === 'pending_review');
        
        return {
            incidents: updatedIncidents,
            requiresManualReview: stillRequiresReview
        };
    }),

    resolveIncident: (incidentId) => set((state) => {
        const updatedIncidents = state.incidents.map(inc => 
            inc.id === incidentId ? { ...inc, status: 'resolved' as const } : inc
        );
        const stillRequiresReview = updatedIncidents.some(inc => inc.status === 'pending_review');
        
        return {
            incidents: updatedIncidents,
            requiresManualReview: stillRequiresReview
        };
    })
}));
