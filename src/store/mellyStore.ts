import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MellyState {
    isSpeaking: boolean;
    currentGuidance: string | null;
    showAvatar: boolean;
    mood: 'neutral' | 'happy' | 'concerned';
    setSpeaking: (speaking: boolean) => void;
    setGuidance: (text: string | null) => void;
    setMood: (mood: 'neutral' | 'happy' | 'concerned') => void;
    isTourActive: boolean;
    setTourActive: (active: boolean) => void;
    isWingmanActive: boolean;
    setWingmanActive: (active: boolean) => void;
    isIndustrialMode: boolean;
    setIndustrialMode: (active: boolean) => void;
    language: import('../utils/translations').Language;
    setLanguage: (lang: import('../utils/translations').Language) => void;
    completedModules: string[];
    recommendations: string[];
    completeModule: (id: string) => void;
    addRecommendation: (id: string) => void;
    productiveStreak: number;
    incrementStreak: () => void;
    resetStreak: () => void;
}

export const useMellyStore = create<MellyState>()(
    persist(
        (set) => ({
            isSpeaking: false,
            currentGuidance: null,
            showAvatar: true,
            mood: 'neutral',
            isTourActive: false,
            isWingmanActive: false,
            isIndustrialMode: false,
            language: 'en',
            completedModules: [],
            recommendations: [],
            setSpeaking: (isSpeaking) => set({ isSpeaking }),
            setGuidance: (currentGuidance) => set({ currentGuidance }),
            setMood: (mood) => set({ mood }),
            toggleAvatar: () => set((state) => ({ showAvatar: !state.showAvatar })),
            setTourActive: (isTourActive) => set({ isTourActive }),
            setWingmanActive: (isWingmanActive) => set({ isWingmanActive }),
            setIndustrialMode: (isIndustrialMode) => set({ isIndustrialMode }),
            setLanguage: (language) => set({ language }),
            completeModule: (id) => set((state) => ({
                completedModules: state.completedModules.includes(id) ? state.completedModules : [...state.completedModules, id]
            })),
            addRecommendation: (id) => set((state) => ({
                recommendations: state.recommendations.includes(id) ? state.recommendations : [...state.recommendations, id]
            })),
            productiveStreak: 0,
            incrementStreak: () => set((state) => ({ productiveStreak: state.productiveStreak + 1 })),
            resetStreak: () => set({ productiveStreak: 0 }),
        }),
        { name: 'melly-storage' }
    )
);
