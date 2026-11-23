import { useNellyStore } from '../store/nellyStore';
import { translations, type Language } from './translations';
import {
    NELLY_VOICE_PROFILE,
    resolveNellyVoice,
    type ResolvedNellyVoice,
} from './nelly-localization-engine';

export interface VoiceConfig {
    displayName: string;
    regionalAccent: string;
    elevenLabsVoiceId: string;
    persona: 'female';
    locale: string;
    audioPathPattern?: string;
}

export const VOICEOVER_ACCENT_MAP: Record<string, VoiceConfig> = {
    en: {
        displayName: 'South African English',
        regionalAccent: 'en-ZA',
        elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Natural Female en-ZA profile
        persona: 'female',
        locale: 'en-ZA',
        audioPathPattern: '/assets/audio/en_za/scene{scene}.mp3',
    },
    zu: {
        displayName: 'isiZulu',
        regionalAccent: 'zu-ZA',
        elevenLabsVoiceId: 'AZnzlk1XvdvUeBnXmlld',
        persona: 'female',
        locale: 'zu-ZA',
        audioPathPattern: '/assets/audio/zu/scene{scene}.mp3',
    },
    xh: {
        displayName: 'isiXhosa',
        regionalAccent: 'xh-ZA',
        elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
        persona: 'female',
        locale: 'xh-ZA',
        audioPathPattern: '/assets/audio/xh/scene{scene}.mp3',
    },
    st: {
        displayName: 'Sesotho',
        regionalAccent: 'st-ZA',
        elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
        persona: 'female',
        locale: 'st-ZA',
        audioPathPattern: '/assets/audio/st/scene{scene}.mp3',
    },
    sw: {
        displayName: 'KiSwahili',
        regionalAccent: 'sw-KE',
        elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
        persona: 'female',
        locale: 'sw-KE',
        audioPathPattern: '/assets/audio/sw/scene{scene}.mp3',
    },
    af: {
        displayName: 'Afrikaans',
        regionalAccent: 'af-ZA',
        elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
        persona: 'female',
        locale: 'af-ZA',
        audioPathPattern: '/assets/audio/af/scene{scene}.mp3',
    },
    fr: {
        displayName: 'Français',
        regionalAccent: 'fr-FR',
        elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
        persona: 'female',
        locale: 'fr-FR',
        audioPathPattern: '/assets/audio/fr/scene{scene}.mp3',
    },
    de: {
        displayName: 'German',
        regionalAccent: 'de-DE',
        elevenLabsVoiceId: 'MF3mGyEYCl7XYWbV9V6O',
        persona: 'female',
        locale: 'de-DE',
        audioPathPattern: '/assets/audio/de/scene{scene}.mp3',
    },
    zh: {
        displayName: 'Mandarin Chinese',
        regionalAccent: 'zh-CN',
        elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
        persona: 'female',
        locale: 'zh-CN',
        audioPathPattern: '/assets/audio/zh/scene{scene}.mp3',
    },
};

let isAudioMuted = false;
let cachedVoices: SpeechSynthesisVoice[] = [];
let pendingAutoplaySpeech: (() => void) | null = null;
let activeSpeakRequestId = 0;

export const toggleMute = (): boolean => {
    isAudioMuted = !isAudioMuted;
    if (isAudioMuted) {
        stopSpeaking();
    }
    return isAudioMuted;
};

export const getIsMuted = (): boolean => isAudioMuted;

const refreshVoices = (): SpeechSynthesisVoice[] => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
            cachedVoices = list;
        }
        return cachedVoices.length > 0 ? cachedVoices : list || [];
    } catch {
        return cachedVoices;
    }
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    try {
        const live = window.speechSynthesis.getVoices();
        if (live && live.length > 0) {
            cachedVoices = live;
            return live;
        }
    } catch {
        // Safe fallback in restrictive environments
    }
    return cachedVoices;
};

// Non-destructive module-level voice preloading on browsers that load voices asynchronously
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
        refreshVoices();
        const synth = window.speechSynthesis;
        if (typeof synth.addEventListener === 'function') {
            synth.addEventListener('voiceschanged', refreshVoices);
        } else {
            const prevHandler = synth.onvoiceschanged;
            synth.onvoiceschanged = (ev: Event) => {
                refreshVoices();
                if (typeof prevHandler === 'function') {
                    prevHandler.call(synth, ev);
                }
            };
        }
    } catch {
        // Safe fallback in restrictive sandbox environments
    }
}

/**
 * Returns the resolved Nelly voice metadata following the South African English (en-ZA)
 * priority chain: en-ZA -> en-GB natural -> default female English.
 */
export function getResolvedNellyVoice(): ResolvedNellyVoice {
    return resolveNellyVoice(getAvailableVoices());
}

/**
 * Prioritized female voice selection strategy strictly targeting South African English (en-ZA),
 * British English (en-GB), or high-quality female English voices.
 */
export function getPreferredNellyVoice(): SpeechSynthesisVoice | null {
    return resolveNellyVoice(getAvailableVoices()).voice;
}

// Chrome TTS Garbage Collection Guard: module-level and window instance persistence
let activeSpeechUtterance: SpeechSynthesisUtterance | null = null;
let speechHeartbeatTimer: ReturnType<typeof setInterval> | null = null;

if (typeof window !== 'undefined') {
    (window as any).__activeUtterance = null;
    (window as any).__activeSpeechUtterance = null;
    (window as any).__nellyActiveVoice = null;
}

const startSpeechHeartbeat = () => {
    stopSpeechHeartbeat();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // 10-second pause/resume heartbeat interval to bypass the 15-second Chromium audio timeout
    speechHeartbeatTimer = setInterval(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const synth = window.speechSynthesis;
        if (synth.speaking && !synth.paused) {
            try {
                synth.pause();
                synth.resume();
            } catch (e) {
                console.warn('Speech synthesis heartbeat error:', e);
            }
        }
    }, 10000);
};

const stopSpeechHeartbeat = () => {
    if (speechHeartbeatTimer) {
        clearInterval(speechHeartbeatTimer);
        speechHeartbeatTimer = null;
    }
};

const clearActiveUtteranceRefs = (utterance: SpeechSynthesisUtterance) => {
    if (activeSpeechUtterance === utterance) {
        activeSpeechUtterance = null;
    }
    if (typeof window !== 'undefined') {
        if ((window as any).__activeUtterance === utterance) {
            (window as any).__activeUtterance = null;
        }
        if ((window as any).__activeSpeechUtterance === utterance) {
            (window as any).__activeSpeechUtterance = null;
        }
    }
};

const normalizeSubtitleLanguage = (lang?: string): Language => {
    const storeLang = useNellyStore.getState().language;
    const prefix = (lang || '').split('-')[0].toLowerCase() as Language;
    if (prefix && Object.prototype.hasOwnProperty.call(translations, prefix)) {
        return prefix;
    }
    return storeLang && Object.prototype.hasOwnProperty.call(translations, storeLang)
        ? storeLang
        : 'en';
};

/**
 * High-Fidelity South African English (en-ZA) Speech Engine for Nelly AI Companion.
 * Keeps Nelly's voice locked to en-ZA (with en-GB natural -> female EN fallback) while
 * syncing real-time multilingual subtitles (en, sw, zu, xh, st, af, fr, de, zh).
 */
export const speakNellyGuidance = (
    text: string,
    lang: string = 'en-ZA',
    onStart?: () => void,
    onEnd?: () => void,
    subtitleText?: string
): SpeechSynthesisUtterance | null => {
    const cleanText = text.trim();
    if (!cleanText) {
        if (onEnd) onEnd();
        return null;
    }

    const normalizedSubtitleLang = normalizeSubtitleLanguage(lang);
    const effectiveSubtitle = (subtitleText || cleanText).trim();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Web Speech API is not supported in this browser.');
        try {
            useNellyStore.getState().setActiveSubtitle({
                text: effectiveSubtitle,
                lang: normalizedSubtitleLang,
                spokenText: cleanText,
            });
        } catch {
            // ignore store errors
        }
        if (onEnd) onEnd();
        return null;
    }

    if (isAudioMuted) {
        if (onEnd) onEnd();
        return null;
    }

    const synth = window.speechSynthesis;
    const requestId = ++activeSpeakRequestId;
    pendingAutoplaySpeech = null;

    if (synth.paused) {
        try {
            synth.resume();
        } catch (e) {
            console.warn('Error resuming speech synth:', e);
        }
    }

    try {
        synth.cancel();
    } catch (e) {
        console.warn('Error cancelling speech synth:', e);
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = NELLY_VOICE_PROFILE.locale; // 'en-ZA'
    utterance.rate = NELLY_VOICE_PROFILE.rate; // 0.96
    utterance.pitch = NELLY_VOICE_PROFILE.pitch; // 1.02

    // Chrome TTS Garbage Collection Guard
    activeSpeechUtterance = utterance;
    (window as any).__activeUtterance = utterance;
    (window as any).__activeSpeechUtterance = utterance;

    const initialResolved = resolveNellyVoice(getAvailableVoices());
    if (initialResolved.voice) {
        try {
            utterance.voice = initialResolved.voice;
        } catch {
            // Mock environments may reject synthetic SpeechSynthesisVoice objects
        }
        utterance.lang =
            initialResolved.tier === 'en-ZA'
                ? 'en-ZA'
                : initialResolved.voice.lang || NELLY_VOICE_PROFILE.locale;
    }

    try {
        useNellyStore.getState().setActiveSubtitle({
            text: effectiveSubtitle,
            lang: normalizedSubtitleLang,
            spokenText: cleanText,
        });
    } catch {
        // ignore store errors if uninitialized
    }

    utterance.onstart = () => {
        startSpeechHeartbeat();
        try {
            useNellyStore.getState().setSpeaking(true);
        } catch {
            // ignore
        }
        if (onStart) onStart();
    };

    utterance.onend = () => {
        stopSpeechHeartbeat();
        clearActiveUtteranceRefs(utterance);
        try {
            useNellyStore.getState().setSpeaking(false);
        } catch {
            // ignore
        }
        if (onEnd) onEnd();
    };

    const applyResolvedVoiceAndSpeak = () => {
        if (requestId !== activeSpeakRequestId || isAudioMuted) {
            return;
        }
        try {
            const resolved = resolveNellyVoice(getAvailableVoices());
            if (resolved.voice) {
                try {
                    utterance.voice = resolved.voice;
                } catch {
                    // Mock environments may reject synthetic SpeechSynthesisVoice objects
                }
            }
            utterance.lang =
                resolved.tier === 'en-ZA'
                    ? 'en-ZA'
                    : resolved.voice?.lang || NELLY_VOICE_PROFILE.locale;
            utterance.rate = resolved.rate;
            utterance.pitch = resolved.pitch;

            const activeTelemetry = {
                name: resolved.name,
                lang: resolved.lang,
                tier: resolved.tier,
                targetLocale: 'en-ZA' as const,
                utteranceLang: utterance.lang,
                rate: utterance.rate,
                pitch: utterance.pitch,
                subtitleLang: normalizedSubtitleLang,
                subtitleText: effectiveSubtitle,
            };

            (window as any).__nellyActiveVoice = activeTelemetry;

            try {
                const store = useNellyStore.getState();
                store.setActiveVoice({
                    name: resolved.name,
                    lang: resolved.lang,
                    tier: resolved.tier,
                    rate: resolved.rate,
                    pitch: resolved.pitch,
                });
                store.setActiveSubtitle({
                    text: effectiveSubtitle,
                    lang: normalizedSubtitleLang,
                    spokenText: cleanText,
                });
            } catch {
                // ignore store errors
            }

            console.info(
                '[Nelly TTS]',
                JSON.stringify({
                    voice: resolved.name,
                    voiceLang: resolved.lang,
                    tier: resolved.tier,
                    utteranceLang: utterance.lang,
                    rate: Number(utterance.rate.toFixed(2)),
                    pitch: Number(utterance.pitch.toFixed(2)),
                    subtitleLang: normalizedSubtitleLang,
                })
            );

            if (synth.paused) {
                synth.resume();
            }
            synth.speak(utterance);
        } catch (e) {
            console.error('Failed to trigger speech synthesis:', e);
            clearActiveUtteranceRefs(utterance);
            try {
                useNellyStore.getState().setSpeaking(false);
            } catch {
                // ignore
            }
            if (onEnd) onEnd();
        }
    };

    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        stopSpeechHeartbeat();
        if (e.error === 'not-allowed') {
            pendingAutoplaySpeech = () => {
                if (requestId === activeSpeakRequestId && !isAudioMuted) {
                    applyResolvedVoiceAndSpeak();
                }
            };
            try {
                useNellyStore.getState().setSpeaking(false);
            } catch {
                // ignore
            }
            return;
        }
        clearActiveUtteranceRefs(utterance);
        try {
            useNellyStore.getState().setSpeaking(false);
        } catch {
            // ignore
        }
        if (e.error === 'canceled' || e.error === 'interrupted') {
            return;
        }
        console.error('Nelly Speech Error:', e);
        if (onEnd) onEnd();
    };

    if (getAvailableVoices().length > 0) {
        applyResolvedVoiceAndSpeak();
    } else {
        let fired = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const finishWait = () => {
            if (fired) return;
            fired = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (typeof synth.removeEventListener === 'function') {
                synth.removeEventListener('voiceschanged', finishWait);
            }
            refreshVoices();
            applyResolvedVoiceAndSpeak();
        };

        if (typeof synth.addEventListener === 'function') {
            synth.addEventListener('voiceschanged', finishWait);
        } else {
            const prevHandler = synth.onvoiceschanged;
            synth.onvoiceschanged = (ev: Event) => {
                if (typeof prevHandler === 'function') {
                    prevHandler.call(synth, ev);
                }
                finishWait();
            };
        }

        timeoutId = setTimeout(finishWait, 350);
    }

    return utterance;
};

/**
 * Speaks Nelly's English (en-ZA) guidance aloud while displaying a localized
 * multilingual subtitle in the user's selected subtitle language.
 */
export const speakWithSubtitles = (
    spokenEnglishText: string,
    subtitleText: string,
    subtitleLang: Language,
    onEnd?: () => void
): SpeechSynthesisUtterance | null => {
    return speakNellyGuidance(spokenEnglishText, subtitleLang, undefined, onEnd, subtitleText);
};

/**
 * Convenience export for backward compatibility
 */
export const speak = (
    text: string,
    lang: string = 'en-ZA',
    onEnd?: () => void,
    subtitleText?: string
): SpeechSynthesisUtterance | null => {
    return speakNellyGuidance(text, lang, undefined, onEnd, subtitleText);
};

export const stopSpeaking = () => {
    activeSpeakRequestId++;
    pendingAutoplaySpeech = null;
    stopSpeechHeartbeat();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (e) {
            console.warn('Error stopping speech synth:', e);
        }
    }
    activeSpeechUtterance = null;
    if (typeof window !== 'undefined') {
        (window as any).__activeUtterance = null;
        (window as any).__activeSpeechUtterance = null;
    }
    try {
        useNellyStore.getState().setSpeaking(false);
    } catch {
        // ignore
    }
};

// Root-level interaction unlock: resumes speech engine and replays any queued line blocked by autoplay
if (typeof window !== 'undefined') {
    const unlockSpeech = () => {
        if ('speechSynthesis' in window) {
            try {
                refreshVoices();
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
                if (pendingAutoplaySpeech) {
                    const retry = pendingAutoplaySpeech;
                    pendingAutoplaySpeech = null;
                    retry();
                }
            } catch (e) {
                console.warn('Unlock speech failed:', e);
            }
        }
    };
    window.addEventListener('pointerdown', unlockSpeech, true);
    window.addEventListener('click', unlockSpeech, true);
    window.addEventListener('keydown', unlockSpeech, true);
    window.addEventListener('touchstart', unlockSpeech, true);
}
