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
    persona: 'male';
    locale: string;
    audioPathPattern?: string;
}

export const VOICEOVER_ACCENT_MAP: Record<string, VoiceConfig> = {
    en: {
        displayName: 'South African English',
        regionalAccent: 'en-ZA',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'en-ZA',
        audioPathPattern: '/assets/audio/en_za_luke/{clip}.mp3',
    },
    zu: {
        displayName: 'isiZulu',
        regionalAccent: 'zu-ZA',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'zu-ZA',
        audioPathPattern: '/assets/audio/zu/scene{scene}.mp3',
    },
    xh: {
        displayName: 'isiXhosa',
        regionalAccent: 'xh-ZA',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'xh-ZA',
        audioPathPattern: '/assets/audio/xh/scene{scene}.mp3',
    },
    st: {
        displayName: 'Sesotho',
        regionalAccent: 'st-ZA',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'st-ZA',
        audioPathPattern: '/assets/audio/st/scene{scene}.mp3',
    },
    sw: {
        displayName: 'KiSwahili',
        regionalAccent: 'sw-KE',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'sw-KE',
        audioPathPattern: '/assets/audio/sw/scene{scene}.mp3',
    },
    af: {
        displayName: 'Afrikaans',
        regionalAccent: 'af-ZA',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'af-ZA',
        audioPathPattern: '/assets/audio/af/scene{scene}.mp3',
    },
    fr: {
        displayName: 'Français',
        regionalAccent: 'fr-FR',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'fr-FR',
        audioPathPattern: '/assets/audio/fr/scene{scene}.mp3',
    },
    de: {
        displayName: 'German',
        regionalAccent: 'de-DE',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'de-DE',
        audioPathPattern: '/assets/audio/de/scene{scene}.mp3',
    },
    zh: {
        displayName: 'Mandarin Chinese',
        regionalAccent: 'zh-CN',
        elevenLabsVoiceId: 'en-ZA-LukeNeural',
        persona: 'male',
        locale: 'zh-CN',
        audioPathPattern: '/assets/audio/zh/scene{scene}.mp3',
    },
};

export const LUKE_VOICENOTE_CLIPS = {
    intro: '/assets/audio/en_za_luke/intro.mp3',
    stewardship: '/assets/audio/en_za_luke/stewardship.mp3',
    first_aid: '/assets/audio/en_za_luke/first_aid.mp3',
    emergency: '/assets/audio/en_za_luke/emergency.mp3',
    neck: '/assets/audio/en_za_luke/neck.mp3',
    back: '/assets/audio/en_za_luke/back.mp3',
    wrist: '/assets/audio/en_za_luke/wrist.mp3',
    eye: '/assets/audio/en_za_luke/eye.mp3',
    symptom: '/assets/audio/en_za_luke/symptom.mp3',
    ohs: '/assets/audio/en_za_luke/ohs.mp3',
    unknown: '/assets/audio/en_za_luke/unknown.mp3',
} as const;

export function matchLukeVoicenoteClip(cleanText: string): string | null {
    const t = cleanText.trim();
    if (!t) return null;
    if (t === translations.en.nelly_intro || t.startsWith("Hi, I'm Nelly. Your AI Safety companion.")) {
        return LUKE_VOICENOTE_CLIPS.intro;
    }
    if (t.toLowerCase().startsWith('stewardship audit:')) {
        return LUKE_VOICENOTE_CLIPS.stewardship;
    }
    if (t === translations.en.first_aid) {
        return LUKE_VOICENOTE_CLIPS.first_aid;
    }
    if (t.startsWith('EMERGENCY: Follow your site emergency procedure now.')) {
        return LUKE_VOICENOTE_CLIPS.emergency;
    }
    if (t.startsWith('Neck pain reported.')) {
        return LUKE_VOICENOTE_CLIPS.neck;
    }
    if (t.startsWith('Lower back discomfort reported.')) {
        return LUKE_VOICENOTE_CLIPS.back;
    }
    if (t.startsWith('Wrist or forearm discomfort reported.')) {
        return LUKE_VOICENOTE_CLIPS.wrist;
    }
    if (t.startsWith('ERGONOMIC TRIAGE: Visual fatigue')) {
        return LUKE_VOICENOTE_CLIPS.eye;
    }
    if (t.startsWith('Tingling or numbness reported.')) {
        return LUKE_VOICENOTE_CLIPS.symptom;
    }
    if (t.startsWith('OHS COMPLIANCE ADVISORY:')) {
        return LUKE_VOICENOTE_CLIPS.ohs;
    }
    if (t.startsWith('I did not recognise that.')) {
        return LUKE_VOICENOTE_CLIPS.unknown;
    }
    return null;
}

let isAudioMuted = false;
let cachedVoices: SpeechSynthesisVoice[] = [];
let pendingAutoplaySpeech: (() => void) | null = null;
let activeSpeakRequestId = 0;
let activeVoicenoteAudio: HTMLAudioElement | null = null;

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
 * Returns the resolved Nelly voice metadata matching the demo video male narrator
 * (en-ZA-LukeNeural -> en-GB natural male -> English male fallback).
 */
export function getResolvedNellyVoice(): ResolvedNellyVoice {
    return resolveNellyVoice(getAvailableVoices());
}

/**
 * Prioritized male voice selection strategy strictly targeting South African English (en-ZA),
 * British English (en-GB), or high-quality male English voices.
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

const stopVoicenoteAudio = () => {
    if (activeVoicenoteAudio) {
        try {
            activeVoicenoteAudio.onplay = null;
            activeVoicenoteAudio.onended = null;
            activeVoicenoteAudio.onerror = null;
            activeVoicenoteAudio.pause();
            activeVoicenoteAudio.currentTime = 0;
            activeVoicenoteAudio.src = '';
        } catch {
            // Safe cleanup
        }
        activeVoicenoteAudio = null;
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
 * High-Fidelity South African English (en-ZA-LukeNeural) Speech Engine.
 * Plays exact demo-matched en-ZA-LukeNeural MP3 voicenotes for core guidance and
 * falls back to male en-ZA Web Speech API synthesis for dynamic content, while keeping
 * multilingual subtitles synced in real time.
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

    if (typeof window === 'undefined') {
        try {
            useNellyStore.getState().setActiveSubtitle({
                text: effectiveSubtitle,
                lang: normalizedSubtitleLang,
                spokenText: cleanText,
            });
        } catch {
            // ignore
        }
        if (onEnd) onEnd();
        return null;
    }

    if (isAudioMuted) {
        if (onEnd) onEnd();
        return null;
    }

    const requestId = ++activeSpeakRequestId;
    pendingAutoplaySpeech = null;
    stopVoicenoteAudio();

    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
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
    }

    try {
        useNellyStore.getState().setActiveSubtitle({
            text: effectiveSubtitle,
            lang: normalizedSubtitleLang,
            spokenText: cleanText,
        });
    } catch {
        // ignore
    }

    const startWebSpeechFallback = (): SpeechSynthesisUtterance | null => {
        if (requestId !== activeSpeakRequestId || isAudioMuted) {
            return null;
        }
        if (!('speechSynthesis' in window)) {
            if (onEnd) onEnd();
            return null;
        }

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = NELLY_VOICE_PROFILE.locale; // 'en-ZA'
        utterance.rate = NELLY_VOICE_PROFILE.rate; // 0.96
        utterance.pitch = NELLY_VOICE_PROFILE.pitch; // 1.0

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

                (window as any).__nellyActiveVoice = {
                    name: resolved.name,
                    voiceId: NELLY_VOICE_PROFILE.voiceId,
                    lang: resolved.lang,
                    tier: resolved.tier,
                    targetLocale: 'en-ZA' as const,
                    utteranceLang: utterance.lang,
                    rate: utterance.rate,
                    pitch: utterance.pitch,
                    engine: 'speech-synthesis',
                    audioSrc: null,
                    subtitleLang: normalizedSubtitleLang,
                    subtitleText: effectiveSubtitle,
                };

                try {
                    const store = useNellyStore.getState();
                    store.setActiveVoice({
                        name: resolved.name,
                        lang: resolved.lang,
                        tier: resolved.tier,
                        rate: resolved.rate,
                        pitch: resolved.pitch,
                        engine: 'speech-synthesis',
                        audioSrc: null,
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
                        engine: 'speech-synthesis',
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

    const voicenoteUrl = matchLukeVoicenoteClip(cleanText);
    if (voicenoteUrl && typeof Audio !== 'undefined') {
        const audio = new Audio(voicenoteUrl);
        audio.preload = 'auto';
        activeVoicenoteAudio = audio;

        const voicenoteTelemetry = {
            name: 'en-ZA-LukeNeural (Demo Voicenote)',
            voiceId: NELLY_VOICE_PROFILE.voiceId,
            lang: 'en-ZA',
            tier: 'en-ZA' as const,
            targetLocale: 'en-ZA' as const,
            utteranceLang: 'en-ZA',
            rate: NELLY_VOICE_PROFILE.rate,
            pitch: NELLY_VOICE_PROFILE.pitch,
            engine: 'voicenote' as const,
            audioSrc: voicenoteUrl,
            subtitleLang: normalizedSubtitleLang,
            subtitleText: effectiveSubtitle,
        };

        (window as any).__nellyActiveVoice = voicenoteTelemetry;

        try {
            const store = useNellyStore.getState();
            store.setActiveVoice({
                name: voicenoteTelemetry.name,
                lang: 'en-ZA',
                tier: 'en-ZA',
                rate: NELLY_VOICE_PROFILE.rate,
                pitch: NELLY_VOICE_PROFILE.pitch,
                engine: 'voicenote',
                audioSrc: voicenoteUrl,
            });
            store.setActiveSubtitle({
                text: effectiveSubtitle,
                lang: normalizedSubtitleLang,
                spokenText: cleanText,
            });
        } catch {
            // ignore
        }

        console.info(
            '[Nelly TTS]',
            JSON.stringify({
                voice: voicenoteTelemetry.name,
                voiceId: NELLY_VOICE_PROFILE.voiceId,
                voiceLang: 'en-ZA',
                tier: 'en-ZA',
                engine: 'voicenote',
                audioSrc: voicenoteUrl,
                rate: NELLY_VOICE_PROFILE.rate,
                pitch: NELLY_VOICE_PROFILE.pitch,
                subtitleLang: normalizedSubtitleLang,
            })
        );

        let fallbackTriggered = false;
        const triggerFallback = () => {
            if (fallbackTriggered || requestId !== activeSpeakRequestId || isAudioMuted) return;
            fallbackTriggered = true;
            stopVoicenoteAudio();
            startWebSpeechFallback();
        };

        audio.onplay = () => {
            if (requestId !== activeSpeakRequestId) return;
            try {
                useNellyStore.getState().setSpeaking(true);
            } catch {
                // ignore
            }
            if (onStart) onStart();
        };

        audio.onended = () => {
            if (activeVoicenoteAudio === audio) {
                activeVoicenoteAudio = null;
            }
            try {
                useNellyStore.getState().setSpeaking(false);
            } catch {
                // ignore
            }
            if (onEnd) onEnd();
        };

        audio.onerror = () => {
            triggerFallback();
        };

        const startPlayback = () => {
            if (requestId !== activeSpeakRequestId || isAudioMuted) return;
            try {
                const playPromise = audio.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch((err: any) => {
                        if (requestId !== activeSpeakRequestId || isAudioMuted) return;
                        if (err && err.name === 'NotAllowedError') {
                            pendingAutoplaySpeech = () => {
                                if (requestId === activeSpeakRequestId && !isAudioMuted) {
                                    audio.play().catch(() => triggerFallback());
                                }
                            };
                            try {
                                useNellyStore.getState().setSpeaking(false);
                            } catch {
                                // ignore
                            }
                            return;
                        }
                        triggerFallback();
                    });
                }
            } catch {
                triggerFallback();
            }
        };

        startPlayback();
        return null;
    }

    return startWebSpeechFallback();
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
    stopVoicenoteAudio();
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
            } catch (e) {
                console.warn('Unlock speech failed:', e);
            }
        }
        if (pendingAutoplaySpeech) {
            const retry = pendingAutoplaySpeech;
            pendingAutoplaySpeech = null;
            try {
                retry();
            } catch (e) {
                console.warn('Autoplay retry failed:', e);
            }
        }
    };
    window.addEventListener('pointerdown', unlockSpeech, true);
    window.addEventListener('click', unlockSpeech, true);
    window.addEventListener('keydown', unlockSpeech, true);
    window.addEventListener('touchstart', unlockSpeech, true);
}
