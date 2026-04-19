import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export const useFatigueStore = create<FatigueState>()(
    persist(
        (set) => ({
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
            }))
        }),
        { name: 'fatigue-vector-vault' }
    )
);
