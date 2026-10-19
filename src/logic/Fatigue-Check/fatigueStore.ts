import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const safeStorage = {
    getItem: (name: string): string | null => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(name);
            }
        } catch {
            return null;
        }
        return null;
    },
    setItem: (name: string, value: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(name, value);
            }
        } catch {
            // Safe fallback
        }
    },
    removeItem: (name: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(name);
            }
        } catch {
            // Safe fallback
        }
    }
};

interface CognitiveHandshakeState {
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

    // Memory Vault (Workstation Cognitive Baseline)
    reactionMemory: number[];
    addReactionMemory: (avg: number) => void;
    resetToNominal: () => void;
}

export const useFatigueStore = create<CognitiveHandshakeState>()(
    persist(
        (set) => ({
            status: 'NOMINAL',
            fatigueScore: 0,
            locked: false,
            fatigueLevel: 'nominal',
            cognitiveHandshakePassed: false,
            showCognitiveHandshake: false,
            setShowCognitiveHandshake: (show) => set({ showCognitiveHandshake: show }),
            setFatigueLevel: (level) => set({ fatigueLevel: level }),
            passCognitiveHandshake: () => set({ 
                cognitiveHandshakePassed: true, 
                fatigueLevel: 'nominal', 
                status: 'NOMINAL', 
                locked: false,
                showCognitiveHandshake: false 
            }),
            failCognitiveHandshake: () => set({ 
                cognitiveHandshakePassed: false, 
                fatigueLevel: 'high', 
                status: 'HIGH', 
                locked: true,
                showCognitiveHandshake: false 
            }),
            warnCognitiveHandshake: () => set({ 
                cognitiveHandshakePassed: false, 
                fatigueLevel: 'warning', 
                status: 'WARNING', 
                locked: false,
                showCognitiveHandshake: false 
            }),
            supervisorOverride: () => set({ 
                cognitiveHandshakePassed: true, 
                fatigueLevel: 'nominal', 
                showCognitiveHandshake: false, 
                status: 'NOMINAL', 
                locked: false 
            }),

            lastLoginTime: Date.now(),
            consecutiveRestBreaks: 0,
            logRoutine: () => set((state) => ({ consecutiveRestBreaks: state.consecutiveRestBreaks + 1 })),

            reactionMemory: [],
            addReactionMemory: (avg) => set((state) => ({
                reactionMemory: [...state.reactionMemory, avg].slice(-10)
            })),

            resetToNominal: () => set({
                fatigueLevel: 'nominal',
                cognitiveHandshakePassed: true,
                showCognitiveHandshake: false,
                status: 'NOMINAL',
                fatigueScore: 0,
                locked: false
            })
        }),
        { 
            name: 'workstation-cognitive-vault',
            storage: createJSONStorage(() => safeStorage)
        }
    )
);
