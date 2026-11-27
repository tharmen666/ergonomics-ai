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

import type { NellyVoiceTier } from '../utils/nelly-localization-engine';

export const NELLY_SIDE_PANEL_TABS = [
    'advisor',
    'ergonomics',
    'first-aid',
    'prompts',
    'voice',
    'compliance',
] as const;

export type NellySidePanelTab = (typeof NELLY_SIDE_PANEL_TABS)[number];

export function normalizeNellySidePanelTab(tab?: string | null): NellySidePanelTab {
    const clean = (tab || '').toLowerCase().trim() as NellySidePanelTab;
    return (NELLY_SIDE_PANEL_TABS as readonly string[]).includes(clean) ? clean : 'advisor';
}

export interface ActiveSubtitleState {
    text: string;
    lang: Language;
    spokenText: string;
}

export interface ActiveVoiceState {
    name: string;
    lang: string;
    tier: NellyVoiceTier;
    rate: number;
    pitch: number;
    engine?: 'voicenote' | 'speech-synthesis';
    audioSrc?: string | null;
}

interface NellyState {
    isSpeaking: boolean;
    currentGuidance: string | null;
    activeSubtitle: ActiveSubtitleState | null;
    activeVoice: ActiveVoiceState | null;
    showAvatar: boolean;
    mood: 'neutral' | 'happy' | 'concerned';
    setSpeaking: (speaking: boolean) => void;
    setGuidance: (text: string | null) => void;
    setActiveSubtitle: (subtitle: ActiveSubtitleState | null) => void;
    setActiveVoice: (voice: ActiveVoiceState | null) => void;
    setMood: (mood: 'neutral' | 'happy' | 'concerned') => void;
    isTourActive: boolean;
    setTourActive: (active: boolean) => void;
    isWingmanActive: boolean;
    setWingmanActive: (active: boolean) => void;
    isLiveTelemetryOpen: boolean;
    setIsLiveTelemetryOpen: (open: boolean) => void;
    isDemoModalOpen: boolean;
    setIsDemoModalOpen: (open: boolean) => void;
    isWorkspaceModalOpen: boolean;
    setIsWorkspaceModalOpen: (open: boolean) => void;
    hasIntroduced: boolean;
    markIntroduced: () => void;
    isNellyExpanded: boolean;
    setNellyExpanded: (expanded: boolean) => void;
    activeSidePanelTab: NellySidePanelTab;
    setActiveSidePanelTab: (tab: string) => void;
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
            activeSubtitle: null,
            activeVoice: null,
            showAvatar: true,
            mood: 'neutral',
            isTourActive: false,
            isWingmanActive: false,
            isLiveTelemetryOpen: false,
            isDemoModalOpen: false,
            isWorkspaceModalOpen: false,
            hasIntroduced: false,
            isNellyExpanded: false,
            activeSidePanelTab: 'advisor',
            isSidebarCollapsed: typeof window !== 'undefined' ? window.innerWidth < 1024 : true,
            language: 'en',
            completedModules: [],
            recommendations: [],
            setSpeaking: (isSpeaking) => set({ isSpeaking }),
            setGuidance: (currentGuidance) => set({ currentGuidance }),
            setActiveSubtitle: (activeSubtitle) => set({ activeSubtitle }),
            setActiveVoice: (activeVoice) => set({ activeVoice }),
            setMood: (mood) => set({ mood }),
            toggleAvatar: () => set((state) => ({ showAvatar: !state.showAvatar })),
            setTourActive: (isTourActive) => set({ isTourActive }),
            setWingmanActive: (isWingmanActive) => set({ isWingmanActive }),
            setIsLiveTelemetryOpen: (isLiveTelemetryOpen) => set({ isLiveTelemetryOpen }),
            setIsDemoModalOpen: (isDemoModalOpen) => set({ isDemoModalOpen }),
            setIsWorkspaceModalOpen: (isWorkspaceModalOpen) => set({ isWorkspaceModalOpen }),
            markIntroduced: () => set({ hasIntroduced: true }),
            setNellyExpanded: (isNellyExpanded) => set({ isNellyExpanded }),
            setActiveSidePanelTab: (tab) => set({ activeSidePanelTab: normalizeNellySidePanelTab(tab) }),
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
                merged.activeSidePanelTab = normalizeNellySidePanelTab(merged.activeSidePanelTab);
                merged.hasIntroduced = false;
                merged.isLiveTelemetryOpen = false;
                merged.isDemoModalOpen = false;
                merged.isWorkspaceModalOpen = false;
                merged.activeSubtitle = null;
                merged.activeVoice = null;
                merged.isSidebarCollapsed = typeof window !== 'undefined' ? window.innerWidth < 1024 : true;
                return merged;
            },
            // Exclude non-persistent UI states
            partialize: (state) => {
                const { 
                    hasIntroduced: _hasIntroduced, 
                    productiveStreak: _productiveStreak, 
                    isLiveTelemetryOpen: _isLiveTelemetryOpen, 
                    isDemoModalOpen: _isDemoModalOpen,
                    isWorkspaceModalOpen: _isWorkspaceModalOpen,
                    activeSubtitle: _activeSubtitle,
                    activeVoice: _activeVoice,
                    ...persistedState 
                } = state;
                return persistedState;
            }
        }
    )
);
