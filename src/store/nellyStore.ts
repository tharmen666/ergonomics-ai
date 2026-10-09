import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { translations, Language } from '../utils/translations';

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

interface NellyState {
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
    hasIntroduced: boolean;
    markIntroduced: () => void;
    isNellyExpanded: boolean;
    setNellyExpanded: (expanded: boolean) => void;
    isSidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    completedModules: string[];
    recommendations: string[];
    completeModule: (id: string) => void;
    addRecommendation: (id: string) => void;
    productiveStreak: number;
    incrementStreak: () => void;
    resetStreak: () => void;
}

export const useNellyStore = create<NellyState>()(
    persist(
        (set) => ({
            isSpeaking: false,
            currentGuidance: null,
            showAvatar: true,
            mood: 'neutral',
            isTourActive: false,
            isWingmanActive: false,
            hasIntroduced: false,
            isNellyExpanded: false,
            isSidebarCollapsed: false,
            language: 'en',
            completedModules: [],
            recommendations: [],
            setSpeaking: (isSpeaking) => set({ isSpeaking }),
            setGuidance: (currentGuidance) => set({ currentGuidance }),
            setMood: (mood) => set({ mood }),
            toggleAvatar: () => set((state) => ({ showAvatar: !state.showAvatar })),
            setTourActive: (isTourActive) => set({ isTourActive }),
            setWingmanActive: (isWingmanActive) => set({ isWingmanActive }),
            markIntroduced: () => set({ hasIntroduced: true }),
            setNellyExpanded: (isNellyExpanded) => set({ isNellyExpanded }),
            setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
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
        {
            name: 'nelly-storage',
            storage: createJSONStorage(() => safeStorage),
            merge: (persistedState: any, currentState) => {
                const merged = { ...currentState, ...persistedState };
                if (!merged.language || !translations[merged.language as Language]) {
                    merged.language = 'en';
                }
                merged.hasIntroduced = false;
                return merged;
            },
            // Exclude productiveStreak from persistence per task 4.3
            partialize: (state) => {
                const { hasIntroduced: _hasIntroduced, productiveStreak: _productiveStreak, ...persistedState } = state;
                return persistedState;
            }
        }
    )
);
