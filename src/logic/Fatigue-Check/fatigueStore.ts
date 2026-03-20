import { create } from 'zustand';

interface FatigueState {
    fatigueLevel: 'nominal' | 'high';
    cognitiveHandshakePassed: boolean;
    setFatigueLevel: (level: 'nominal' | 'high') => void;
    showCognitiveHandshake: boolean;
    setShowCognitiveHandshake: (show: boolean) => void;
    passCognitiveHandshake: () => void;
    failCognitiveHandshake: () => void;

    // Routine Audit
    lastLoginTime: number | null;
    consecutiveRestBreaks: number;
    logRoutine: () => void;
}

export const useFatigueStore = create<FatigueState>((set) => ({
    fatigueLevel: 'nominal',
    cognitiveHandshakePassed: false,
    showCognitiveHandshake: false,
    setShowCognitiveHandshake: (show) => set({ showCognitiveHandshake: show }),
    setFatigueLevel: (level) => set({ fatigueLevel: level }),
    passCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'nominal', showCognitiveHandshake: false }),
    failCognitiveHandshake: () => set({ cognitiveHandshakePassed: true, fatigueLevel: 'high', showCognitiveHandshake: false }),

    // behavioral routine
    lastLoginTime: Date.now(),
    consecutiveRestBreaks: 0,
    logRoutine: () => set((state) => ({ consecutiveRestBreaks: state.consecutiveRestBreaks + 1 }))
}));
