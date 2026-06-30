import { create } from 'zustand';

export type ComplianceStatus = 'COMPLIANT' | 'BREACH';
export type EscalationState = 'triggered' | 'routed_to_manager' | 'escalated_level_2' | 'resolved';

export interface EmployeeCase {
    id: string;
    employeeName: string;
    dept: string;
    score: number;
    status: 'COMPLIANT' | 'RISK_ALERT' | 'BREACH';
    managerName: string;
    hazardTrigger: string;
    createdAt: string; // ISO string
    timeframeHours: number;
    escalationState: EscalationState;
}

interface ComplianceLog {
    timestamp: string;
    score: number;
    threshold: number;
    reason?: string;
}

interface ComplianceState {
    status: ComplianceStatus;
    requiresEscalation: boolean;
    logs: ComplianceLog[];
    exceptions: string[];
    cases: EmployeeCase[];
    gear: {
        governance: number;
        efficiency: number;
        accountability: number;
        resilience: number;
    };
    addWorkspaceException: (exception: string) => void;
    triggerBreach: (score: number, threshold: number, timestamp: string, reason?: string) => void;
    resetCompliance: () => void;
    resolveCase: (id: string) => void;
    updateCaseEscalation: (id: string, state: EscalationState) => void;
    tickSimulatedTime: () => void;
    processTelemetry: (data: {
        pelvicSpineAngle: number;
        cervicalSpineTilt: number;
        shoulderElbowAngle: number;
        shoulderElevation: number;
        setupName: string;
    }) => { triggered: boolean; reason: string };
}

// Initial mockup cases (seeded with baseline OHS compliance situations)
const initialCases = (): EmployeeCase[] => {
    const now = new Date();
    
    // Mike Ross created "22 simulated hours ago" (22 seconds ago)
    const mikeCreated = new Date(now.getTime() - 22 * 1000).toISOString();
    // Louis Litt created "26 simulated hours ago" (26 seconds ago)
    const louisCreated = new Date(now.getTime() - 26 * 1000).toISOString();
    // Sarah Jenkins resolved
    const sarahCreated = new Date(now.getTime() - 48 * 1000).toISOString();
    // Harvey Specter pending review
    const harveyCreated = new Date(now.getTime() - 5 * 1000).toISOString();

    return [
        {
            id: 'case-1',
            employeeName: 'Sarah Jenkins',
            dept: 'Marketing',
            score: 98,
            status: 'COMPLIANT',
            managerName: 'Robert Zane',
            hazardTrigger: 'Ergonomic Desk Adjustment',
            createdAt: sarahCreated,
            timeframeHours: 72,
            escalationState: 'resolved'
        },
        {
            id: 'case-2',
            employeeName: 'Mike Ross',
            dept: 'Engineering',
            score: 65,
            status: 'RISK_ALERT',
            managerName: 'Harvey Specter',
            hazardTrigger: 'Kitchen Counter Workspace (typing on high surface)',
            createdAt: mikeCreated,
            timeframeHours: 24,
            escalationState: 'routed_to_manager'
        },
        {
            id: 'case-3',
            employeeName: 'Louis Litt',
            dept: 'Finance',
            score: 42,
            status: 'BREACH',
            managerName: 'Sheila Sazs',
            hazardTrigger: 'Working from Bed (severe lumbar instability)',
            createdAt: louisCreated,
            timeframeHours: 24,
            escalationState: 'escalated_level_2'
        },
        {
            id: 'case-4',
            employeeName: 'Harvey Specter',
            dept: 'Legal',
            score: 88,
            status: 'RISK_ALERT',
            managerName: 'Jessica Pearson',
            hazardTrigger: 'Monitor Height mismatch',
            createdAt: harveyCreated,
            timeframeHours: 72,
            escalationState: 'routed_to_manager'
        }
    ];
};

export const useComplianceStore = create<ComplianceState>((set, get) => {
    
    // Dispatch compliance trigger events on window
    const fireEvent = (name: string, detail: any) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(name, { detail }));
        }
    };

    // Calculate G.E.A.R. metrics based on current cases & exceptions
    const calculateGEARMetrics = (cases: EmployeeCase[]) => {
        // 1. Governance (G): drops if there are active breaches/escalations
        const activeTrackingCases = cases.filter(c => c.escalationState === 'routed_to_manager' || c.escalationState === 'escalated_level_2');
        const level2Count = cases.filter(c => c.escalationState === 'escalated_level_2').length;
        const governance = Math.max(40, 100 - (activeTrackingCases.length * 10) - (level2Count * 15));

        // 2. Efficiency (E): linked to resolution speed / active violations
        const efficiency = Math.max(50, 100 - (level2Count * 20));

        // 3. Accountability (A): stays high to reward transparency (flagging exceptions keeps it up)
        const accountability = 98; // remains high when reports are filed honestly

        // 4. Resilience (R): drops on breached windows, increases on clean resolution
        const breachedCount = cases.filter(c => c.escalationState === 'escalated_level_2').length;
        const resolvedCount = cases.filter(c => c.escalationState === 'resolved').length;
        const resilience = Math.max(30, Math.min(100, 85 - (breachedCount * 25) + (resolvedCount * 5)));

        return { governance, efficiency, accountability, resilience };
    };

    // Setup window event listener
    if (typeof window !== 'undefined') {
        window.addEventListener('NON_COMPLIANCE_TRIGGER', (event: Event) => {
            const customEvent = event as CustomEvent<{ score: number; threshold: number; timestamp: string; reason?: string }>;
            const { score, threshold, timestamp, reason } = customEvent.detail || {};
            
            set((state) => {
                const updatedLogs = [
                    {
                        timestamp: timestamp || new Date().toISOString(),
                        score: score !== undefined ? score : 0,
                        threshold: threshold !== undefined ? threshold : 0,
                        reason: reason || 'Ergonomic threshold violation'
                    },
                    ...state.logs
                ];
                return {
                    status: 'BREACH',
                    requiresEscalation: true,
                    logs: updatedLogs
                };
            });
        });
    }

    const initialCasesList = initialCases();

    return {
        status: 'BREACH', // Louis Litt starts in breach
        requiresEscalation: true,
        logs: [],
        exceptions: [],
        cases: initialCasesList,
        gear: calculateGEARMetrics(initialCasesList),

        addWorkspaceException: (exception) => set((state) => {
            const newExs = [...state.exceptions, exception];
            
            // Create a new employee case for this logged exception
            const newCase: EmployeeCase = {
                id: `case-${Date.now()}`,
                employeeName: 'Self (Remote User)',
                dept: 'Engineering',
                score: 70,
                status: 'RISK_ALERT',
                managerName: 'Harvey Specter',
                hazardTrigger: `Workspace Exception: ${exception}`,
                createdAt: new Date().toISOString(),
                timeframeHours: 24, // 24h level 1 window
                escalationState: 'routed_to_manager'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                exceptions: newExs,
                cases: newCases,
                gear: newGear,
                status: 'BREACH',
                requiresEscalation: true,
                logs: [
                    {
                        timestamp: new Date().toISOString(),
                        score: 18,
                        threshold: 15,
                        reason: `Workspace Exception Flagged: ${exception}`
                    },
                    ...state.logs
                ]
            };
        }),

        triggerBreach: (score, threshold, timestamp, reason) => set((state) => {
            const updatedLogs = [
                { timestamp, score, threshold, reason },
                ...state.logs
            ];
            return {
                status: 'BREACH',
                requiresEscalation: true,
                logs: updatedLogs
            };
        }),

        resetCompliance: () => set((state) => {
            // Resolve all cases
            const resolvedCases = state.cases.map(c => ({
                ...c,
                status: 'COMPLIANT' as const,
                score: 98,
                escalationState: 'resolved' as const
            }));
            return {
                status: 'COMPLIANT',
                requiresEscalation: false,
                exceptions: [],
                cases: resolvedCases,
                gear: calculateGEARMetrics(resolvedCases)
            };
        }),

        resolveCase: (id) => set((state) => {
            const updatedCases = state.cases.map(c => 
                c.id === id ? { ...c, status: 'COMPLIANT' as const, score: 98, escalationState: 'resolved' as const } : c
            );
            
            const stillBreached = updatedCases.some(c => c.status === 'BREACH' || c.escalationState === 'escalated_level_2');
            const newGear = calculateGEARMetrics(updatedCases);

            fireEvent('OHS_TRACKING_UPDATE', { id, newStatus: 'resolved' });

            return {
                cases: updatedCases,
                status: stillBreached ? 'BREACH' : 'COMPLIANT',
                requiresEscalation: stillBreached,
                gear: newGear
            };
        }),

        updateCaseEscalation: (id, escalationState) => set((state) => {
            const updatedCases = state.cases.map(c => {
                if (c.id === id) {
                    const status = escalationState === 'escalated_level_2' ? 'BREACH' : c.status;
                    return { ...c, escalationState, status };
                }
                return c;
            });
            const stillBreached = updatedCases.some(c => c.status === 'BREACH' || c.escalationState === 'escalated_level_2');
            const newGear = calculateGEARMetrics(updatedCases);

            fireEvent('OHS_TRACKING_UPDATE', { id, newStatus: escalationState });

            return {
                cases: updatedCases,
                status: stillBreached ? 'BREACH' : 'COMPLIANT',
                requiresEscalation: stillBreached,
                gear: newGear
            };
        }),

        tickSimulatedTime: () => set((state) => {
            const now = new Date().getTime();
            let changed = false;

            const updatedCases = state.cases.map((c) => {
                if (c.escalationState === 'routed_to_manager') {
                    // Calculate simulated hours: 1 real second = 1 simulated hour
                    const createdTime = new Date(c.createdAt).getTime();
                    const elapsedSimulatedHours = (now - createdTime) / 1000;
                    
                    if (elapsedSimulatedHours > c.timeframeHours) {
                        changed = true;
                        
                        // Escalate case to Level 2 (Department Head / CEO)
                        fireEvent('OHS_TRACKING_UPDATE', { 
                            id: c.id, 
                            employeeName: c.employeeName, 
                            newStatus: 'escalated_level_2',
                            reason: `Timeframe Breach: Manager ${c.managerName} failed to resolve within ${c.timeframeHours} hours.` 
                        });

                        return {
                            ...c,
                            status: 'BREACH' as const,
                            escalationState: 'escalated_level_2' as const
                        };
                    }
                }
                return c;
            });

            if (changed) {
                const stillBreached = updatedCases.some(c => c.status === 'BREACH' || c.escalationState === 'escalated_level_2');
                return {
                    cases: updatedCases,
                    status: stillBreached ? 'BREACH' : 'COMPLIANT',
                    requiresEscalation: stillBreached,
                    gear: calculateGEARMetrics(updatedCases)
                };
            }
            
            return {};
        }),

        processTelemetry: (data) => {
            const { pelvicSpineAngle, cervicalSpineTilt, shoulderElbowAngle, shoulderElevation, setupName } = data;
            
            let triggered = false;
            let reason = '';

            if (setupName === 'Bed' && pelvicSpineAngle >= 120 && cervicalSpineTilt >= 30) {
                triggered = true;
                reason = `Unsafe Bed Workspace (MediaPipe 3D): Pelvic-to-Spine angle is ${pelvicSpineAngle}° (>=120°) with cervical spine forward tilt of ${cervicalSpineTilt}° (>=30°).`;
            } else if (setupName === 'Kitchen Counter' && shoulderElbowAngle < 90 && shoulderElevation >= 15) {
                triggered = true;
                reason = `Unsafe Kitchen Counter (MediaPipe 3D): Shoulder-to-Elbow acute angle is ${shoulderElbowAngle}° (<90°) with elevated shoulder shrugging of ${shoulderElevation}px (>=15px).`;
            } else if (setupName === 'Couch' && (pelvicSpineAngle >= 115 || cervicalSpineTilt >= 25)) {
                triggered = true;
                reason = `Unsafe Couch Workspace (MediaPipe 3D): Poor spinal alignment (Pelvic-to-Spine: ${pelvicSpineAngle}°, Cervical Tilt: ${cervicalSpineTilt}°).`;
            }

            if (triggered) {
                // Add an active case in the dashboard
                const newCase: EmployeeCase = {
                    id: `case-${Date.now()}`,
                    employeeName: 'Self (Remote User)',
                    dept: 'Engineering',
                    score: 55,
                    status: 'BREACH',
                    managerName: setupName === 'Bed' ? 'Sheila Sazs' : 'Harvey Specter',
                    hazardTrigger: reason,
                    createdAt: new Date().toISOString(),
                    timeframeHours: 24,
                    escalationState: 'routed_to_manager'
                };

                set((state) => {
                    const newCases = [newCase, ...state.cases];
                    return {
                        cases: newCases,
                        gear: calculateGEARMetrics(newCases),
                        status: 'BREACH',
                        requiresEscalation: true
                    };
                });

                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('NON_COMPLIANCE_TRIGGER', {
                        detail: {
                            score: 20,
                            threshold: 15,
                            timestamp: new Date().toISOString(),
                            reason
                        }
                    });
                    window.dispatchEvent(event);
                }
            }

            return { triggered, reason };
        }
    };
});
