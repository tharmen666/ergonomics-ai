import { create } from 'zustand';

export type ComplianceStatus = 'COMPLIANT' | 'BREACH';

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
    triggerBreach: (score: number, threshold: number, timestamp: string, reason?: string) => void;
    resetCompliance: () => void;
    processTelemetry: (data: {
        pelvicSpineAngle: number;
        cervicalSpineTilt: number;
        shoulderElbowAngle: number;
        shoulderElevation: number;
        setupName: string;
    }) => { triggered: boolean; reason: string };
}

export const useComplianceStore = create<ComplianceState>((set) => {
    // Initialize window EventListener for 'NON_COMPLIANCE_TRIGGER'
    if (typeof window !== 'undefined') {
        window.addEventListener('NON_COMPLIANCE_TRIGGER', (event: Event) => {
            const customEvent = event as CustomEvent<{ score: number; threshold: number; timestamp: string; reason?: string }>;
            const { score, threshold, timestamp, reason } = customEvent.detail || {};
            
            set((state) => ({
                status: 'BREACH',
                requiresEscalation: true,
                logs: [
                    {
                        timestamp: timestamp || new Date().toISOString(),
                        score: score !== undefined ? score : 0,
                        threshold: threshold !== undefined ? threshold : 0,
                        reason: reason || 'Ergonomic threshold violation'
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
        
        triggerBreach: (score, threshold, timestamp, reason) => set((state) => ({
            status: 'BREACH',
            requiresEscalation: true,
            logs: [
                { timestamp, score, threshold, reason },
                ...state.logs
            ]
        })),

        resetCompliance: () => set({
            status: 'COMPLIANT',
            requiresEscalation: false
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
                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('NON_COMPLIANCE_TRIGGER', {
                        detail: {
                            score: 20, // Critical breach score
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
