import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useComplianceStore } from '../../store/complianceStore';

interface FatigueState {
    fatigueLevel: 'nominal' | 'warning' | 'high';
    cognitiveHandshakePassed: boolean;
    setFatigueLevel: (level: 'nominal' | 'warning' | 'high') => void;
    showCognitiveHandshake: boolean;
    setShowCognitiveHandshake: (show: boolean) => void;
    passCognitiveHandshake: () => void;
    failCognitiveHandshake: () => void;
    warnCognitiveHandshake: () => void;

    // Routine Audit
    lastLoginTime: number | null;
    consecutiveRestBreaks: number;
    logRoutine: () => void;

    // Memory Vault (Vector DB simulation)
    reactionMemory: number[];
    addReactionMemory: (avg: number) => void;

    // Shandray's Prizm Driver Fatigue Telemetry
    drivingHours: number;
    reactionDropPct: number;
    driverFatigueScore: number;
    prizmAlertActive: boolean;
    prizmRecommendedAction: string;
    setDrivingHours: (hours: number) => void;
    evaluateDriverFatigue: (hours?: number, dropPct?: number) => void;
}

export const useFatigueStore = create<FatigueState>()(
    persist(
        (set, get) => ({
            fatigueLevel: 'nominal',
            cognitiveHandshakePassed: false,
            showCognitiveHandshake: false,
            setShowCognitiveHandshake: (show) => set({ showCognitiveHandshake: show }),
            setFatigueLevel: (level) => set({ fatigueLevel: level }),
            passCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'nominal', showCognitiveHandshake: false }),
            failCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'high', showCognitiveHandshake: false }),
            warnCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'warning', showCognitiveHandshake: false }),

            lastLoginTime: Date.now(),
            consecutiveRestBreaks: 0,
            logRoutine: () => set((state) => ({ consecutiveRestBreaks: state.consecutiveRestBreaks + 1 })),

            reactionMemory: [],
            addReactionMemory: (avg) => set((state) => ({
                reactionMemory: [...state.reactionMemory, avg].slice(-10)
            })),

            // Shandray Prizm Driver Fatigue Defaults
            drivingHours: 4.5,
            reactionDropPct: 18,
            driverFatigueScore: 48,
            prizmAlertActive: false,
            prizmRecommendedAction: 'Nominal driving state. Maintain standard 2-hour rest break intervals.',

            setDrivingHours: (hours) => {
                set({ drivingHours: hours });
                get().evaluateDriverFatigue(hours);
            },

            evaluateDriverFatigue: (hoursParam, dropParam) => {
                const hours = hoursParam !== undefined ? hoursParam : get().drivingHours;
                const dropPct = dropParam !== undefined ? dropParam : get().reactionDropPct;

                let hourPenalty = 0;
                if (hours > 8) hourPenalty = 60;
                else if (hours > 6) hourPenalty = 45;
                else if (hours > 4) hourPenalty = 30;
                else if (hours > 2) hourPenalty = 15;

                let reactionPenalty = 0;
                if (dropPct > 35) reactionPenalty = 35;
                else if (dropPct > 20) reactionPenalty = 25;
                else if (dropPct > 10) reactionPenalty = 15;

                const score = Math.min(100, Math.round(hourPenalty + reactionPenalty));
                const alertTriggered = score >= 40 || hours >= 4 || dropPct >= 15;
                const isCritical = score >= 70 || hours >= 7.5 || dropPct >= 35;

                let action = 'Nominal driving state. Maintain standard 2-hour rest break intervals.';
                let level: 'nominal' | 'warning' | 'high' = 'nominal';

                if (isCritical) {
                    level = 'high';
                    action = 'SHANDRAY PRIZM ALERT: CRITICAL DRIVER FATIGUE! Pull over immediately for mandatory 30-min rest.';
                    useComplianceStore.getState().logHazardEvent('break_interval', `Shandray Prizm Alert: Critical Driver Fatigue (${hours}h driven, score ${score}/100)`, 'BREACH');
                } else if (alertTriggered) {
                    level = 'warning';
                    action = 'SHANDRAY PRIZM WARNING: Elevated continuous driving hours. Plan a 15-min rest break at next stop.';
                    useComplianceStore.getState().logHazardEvent('break_interval', `Shandray Prizm Warning: Driver Rest Break Advised (${hours}h driven)`, 'RISK_ALERT');
                }

                if (alertTriggered && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('TRIGGER_BBS_INTERVENTION', {
                        detail: {
                            type: 'driver-power-breathing',
                            duration: 60,
                            hazard: `Shandray Driver Fatigue (${hours}h driven, Score ${score}/100)`,
                            title: '60-Second Driver Power-Breathing & Hydration Protocol',
                            instructions: [
                                'Pull over safely at nearest rest stop or service area.',
                                'Consume 250ml water to rehydrate vascular system.',
                                'Perform 4-4-4 diaphragmatic breathing (Inhale 4s, Hold 4s, Exhale 4s) to reset focus.'
                            ]
                        }
                    }));
                }

                set({
                    fatigueLevel: level,
                    driverFatigueScore: score,
                    reactionDropPct: dropPct,
                    prizmAlertActive: alertTriggered,
                    prizmRecommendedAction: action
                });
            }
        }),
        { name: 'fatigue-vector-vault' }
    )
);
