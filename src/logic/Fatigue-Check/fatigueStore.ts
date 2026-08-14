import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useComplianceStore } from '../../store/complianceStore';
import { useTenantStore } from '../../store/tenantStore';

interface FatigueState {
    status: 'NOMINAL' | 'WARNING' | 'HIGH';
    fatigueScore: number;
    locked: boolean;
    fatigueLevel: 'nominal' | 'warning' | 'high';
    cognitiveHandshakePassed: boolean;
    setFatigueLevel: (level: 'nominal' | 'warning' | 'high') => void;
    showCognitiveHandshake: boolean;
    setShowCognitiveHandshake: (show: boolean) => void;
    passCognitiveHandshake: () => void;
    failCognitiveHandshake: () => void;
    warnCognitiveHandshake: () => void;
    supervisorOverride: () => void;

    // Routine Audit
    lastLoginTime: number | null;
    consecutiveRestBreaks: number;
    logRoutine: () => void;

    // Memory Vault (Vector DB simulation)
    reactionMemory: number[];
    addReactionMemory: (avg: number) => void;

    // Prizm Driver Fatigue Telemetry
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
            status: 'NOMINAL',
            fatigueScore: 0,
            locked: false,
            fatigueLevel: 'nominal',
            cognitiveHandshakePassed: true,
            showCognitiveHandshake: false,
            setShowCognitiveHandshake: (show) => set({ showCognitiveHandshake: show }),
            setFatigueLevel: (level) => set({ fatigueLevel: level, status: level === 'high' ? 'HIGH' : (level === 'warning' ? 'WARNING' : 'NOMINAL') }),
            passCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'nominal', status: 'NOMINAL', fatigueScore: 0, locked: false, showCognitiveHandshake: false }),
            failCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'high', status: 'HIGH', fatigueScore: 85, locked: false, showCognitiveHandshake: false }),
            warnCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'warning', status: 'WARNING', fatigueScore: 45, locked: false, showCognitiveHandshake: false }),

            supervisorOverride: () => {
                try {
                    useTenantStore.getState().supervisorOverride?.();
                } catch (e) {
                    // Ignore if tenant store not yet ready
                }
                set({
                    status: 'NOMINAL',
                    fatigueScore: 0,
                    locked: false,
                    fatigueLevel: 'nominal',
                    driverFatigueScore: 0,
                    prizmAlertActive: false,
                    drivingHours: 0,
                    reactionDropPct: 0,
                    prizmRecommendedAction: 'Nominal driving state. Maintain standard 2-hour rest break intervals.',
                    cognitiveHandshakePassed: true,
                    showCognitiveHandshake: false,
                });
            },

            lastLoginTime: Date.now(),
            consecutiveRestBreaks: 0,
            logRoutine: () => set((state) => ({ consecutiveRestBreaks: state.consecutiveRestBreaks + 1 })),

            reactionMemory: [],
            addReactionMemory: (avg) => set((state) => ({
                reactionMemory: [...state.reactionMemory, avg].slice(-10)
            })),

            // Prizm Driver Fatigue Defaults - INITIAL STATE IS ALWAYS NOMINAL
            drivingHours: 0,
            reactionDropPct: 0,
            driverFatigueScore: 0,
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
                    action = 'PRIZM ALERT: CRITICAL DRIVER FATIGUE! Pull over immediately for mandatory 30-min rest.';
                    useComplianceStore.getState().logHazardEvent('break_interval', `Prizm Alert: Critical Driver Fatigue (${hours}h driven, score ${score}/100)`, 'BREACH');
                } else if (alertTriggered) {
                    level = 'warning';
                    action = 'PRIZM WARNING: Elevated continuous driving hours. Plan a 15-min rest break at next stop.';
                    useComplianceStore.getState().logHazardEvent('break_interval', `Prizm Warning: Driver Rest Break Advised (${hours}h driven)`, 'RISK_ALERT');
                }

                set({
                    status: isCritical ? 'HIGH' : (alertTriggered ? 'WARNING' : 'NOMINAL'),
                    fatigueScore: score,
                    locked: false, // Ensure full lockout is disabled
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
