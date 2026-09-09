import { useNellyStore } from '../store/nellyStore';

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
        displayName: "South African English",
        regionalAccent: "en-ZA",
        elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel / High-fidelity Natural Female
        persona: 'female',
        locale: "en-ZA",
        audioPathPattern: "/assets/audio/en_za/scene{scene}.mp3"
    },
    zu: {
        displayName: "isiZulu",
        regionalAccent: "zu-ZA",
        elevenLabsVoiceId: "AZnzlk1XvdvUeBnXmlld", // Domi / Natural Warm Female Accent
        persona: 'female',
        locale: "zu-ZA",
        audioPathPattern: "/assets/audio/zu/scene{scene}.mp3"
    },
    xh: {
        displayName: "isiXhosa",
        regionalAccent: "xh-ZA",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella / Natural Female
        persona: 'female',
        locale: "xh-ZA",
        audioPathPattern: "/assets/audio/xh/scene{scene}.mp3"
    },
    st: {
        displayName: "Sesotho",
        regionalAccent: "st-ZA",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella / Natural Female
        persona: 'female',
        locale: "st-ZA",
        audioPathPattern: "/assets/audio/st/scene{scene}.mp3"
    },
    sw: {
        displayName: "KiSwahili",
        regionalAccent: "sw-KE",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella / Female multilingual fallback
        persona: 'female',
        locale: "sw-KE",
        audioPathPattern: "/assets/audio/sw/scene{scene}.mp3"
    },
    zh: {
        displayName: "Mandarin Chinese",
        regionalAccent: "zh-CN",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella / Female multilingual fallback
        persona: 'female',
        locale: "zh-CN",
        audioPathPattern: "/assets/audio/zh/scene{scene}.mp3"
    },
    de: {
        displayName: "German",
        regionalAccent: "de-DE",
        elevenLabsVoiceId: "MF3mGyEYCl7XYWbV9V6O", // German Natural Female
        persona: 'female',
        locale: "de-DE",
        audioPathPattern: "/assets/audio/de/scene{scene}.mp3"
    },
    af: {
        displayName: "Afrikaans",
        regionalAccent: "af-ZA",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella / Female multilingual fallback
        persona: 'female',
        locale: "af-ZA",
        audioPathPattern: "/assets/audio/af/scene{scene}.mp3"
    }
};

let isAudioMuted = false;

export const toggleMute = (): boolean => {
    isAudioMuted = !isAudioMuted;
    if (isAudioMuted) {
        stopSpeaking();
    }
    return isAudioMuted;
};

export const getIsMuted = (): boolean => isAudioMuted;

/**
 * Finds the best female neural voice matching target locale/language
 */
const findBestNeuralVoice = (targetLang: string, targetLocale: string): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const locTarget = targetLocale.toLowerCase().replace('_', '-');
    const langPrefix = targetLang.split('-')[0].toLowerCase();
    
    const maleVoiceNames = ['adam', 'alex', 'antoni', 'daniel', 'david', 'fred', 'guy', 'james', 'jorge', 'mark', 'microsoft mark', 'rishi', 'tom'];
    const femaleVoiceNames = ['female', 'bella', 'karen', 'kathy', 'kyoko', 'luciana', 'moira', 'nomsa', 'samantha', 'salli', 'susan', 'tessa', 'zira', 'zola', 'rachel', 'victoria'];
    
    const isFemaleVoice = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();
        return !maleVoiceNames.some(marker => name.includes(marker)) && femaleVoiceNames.some(marker => name.includes(marker));
    };

    // 1. Try exact locale match with neural/natural female keywords
    const exactNeural = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-') === locTarget &&
        isFemaleVoice(v) &&
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('neural'))
    );
    if (exactNeural) return exactNeural;

    // 2. Try exact locale match, any female voice
    const exactAny = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(locTarget) && isFemaleVoice(v));
    if (exactAny) return exactAny;

    // 3. South African English fallback for ZA indigenous languages (zu, xh, st, af)
    if (['zu', 'xh', 'st', 'af', 'en'].includes(langPrefix)) {
        const saFemale = voices.find(v => 
            v.lang.toLowerCase().includes('en-za') && 
            isFemaleVoice(v)
        );
        if (saFemale) return saFemale;
    }

    // 4. High quality English female natural fallback
    return voices.find(v => 
        v.lang.toLowerCase().startsWith('en') && 
        isFemaleVoice(v) &&
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('salli') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('karen'))
    ) || voices.find(v => v.lang.toLowerCase().startsWith('en')) || null;
};

/**
 * High-Fidelity Multilingual Speech Engine for Nelly AI Companion
 */
export const speakNellyGuidance = (
    text: string, 
    lang: string = 'en-US', 
    onStart?: () => void, 
    onEnd?: () => void
) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Web Speech API is not supported in this browser.');
        if (onEnd) onEnd();
        return;
    }

    if (isAudioMuted) {
        if (onEnd) onEnd();
        return;
    }

    const synth = window.speechSynthesis;

    // Resume synth if paused
    if (synth.paused) {
        try {
            synth.resume();
        } catch (e) {
            console.warn('Error resuming speech synth:', e);
        }
    }

    // Cancel any ongoing speech loops
    try {
        synth.cancel();
    } catch (e) {
        console.warn('Error cancelling speech synth:', e);
    }

    const cleanText = text.trim();
    if (!cleanText) {
        if (onEnd) onEnd();
        return;
    }

    const langKey = lang.split('-')[0].toLowerCase();
    const config = VOICEOVER_ACCENT_MAP[langKey] || VOICEOVER_ACCENT_MAP[lang] || VOICEOVER_ACCENT_MAP['en'];
    const targetLocale = config ? config.locale : lang;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLocale;
    utterance.rate = 0.95; // Natural conversational tempo
    utterance.pitch = 1.0;

    const voice = findBestNeuralVoice(langKey, targetLocale);
    if (voice) {
        utterance.voice = voice;
    }

    utterance.onstart = () => {
        try {
            useNellyStore.getState().setSpeaking(true);
        } catch (e) {
            // ignore store errors if uninitialized
        }
        if (onStart) onStart();
    };

    utterance.onend = () => {
        try {
            useNellyStore.getState().setSpeaking(false);
        } catch (e) {
            // ignore store errors if uninitialized
        }
        if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
        console.error('Nelly Speech Error:', e);
        try {
            useNellyStore.getState().setSpeaking(false);
        } catch (err) {
            // ignore store errors if uninitialized
        }
        if (onEnd) onEnd();
    };

    const doSpeak = () => {
        try {
            const recheckVoice = findBestNeuralVoice(langKey, targetLocale);
            if (recheckVoice) {
                utterance.voice = recheckVoice;
            }
            synth.speak(utterance);
        } catch (e) {
            console.error('Failed to trigger speech synthesis:', e);
            try {
                useNellyStore.getState().setSpeaking(false);
            } catch (err) {
                // ignore
            }
            if (onEnd) onEnd();
        }
    };

    if (synth.getVoices().length > 0) {
        doSpeak();
    } else {
        let fired = false;
        const handleVoices = () => {
            if (fired) return;
            fired = true;
            synth.onvoiceschanged = null;
            doSpeak();
        };
        synth.onvoiceschanged = handleVoices;
        setTimeout(() => {
            if (!fired) {
                fired = true;
                synth.onvoiceschanged = null;
                doSpeak();
            }
        }, 100);
    }
};

/**
 * Convenience export for backward compatibility
 */
export const speak = (text: string, lang: string = 'en', onEnd?: () => void) => {
    speakNellyGuidance(text, lang, undefined, onEnd);
};

export const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (e) {
            console.warn('Error stopping speech synth:', e);
        }
    }
    try {
        useNellyStore.getState().setSpeaking(false);
    } catch (e) {
        // ignore
    }
};

// Root-level interaction breakout to unlock speech engine on browser interaction
if (typeof window !== 'undefined') {
    const unlockSpeech = () => {
        if ('speechSynthesis' in window) {
            try {
                const u = new SpeechSynthesisUtterance('');
                u.volume = 0;
                window.speechSynthesis.speak(u);
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
            } catch (e) {
                console.warn('Unlock speech failed:', e);
            }
        }
        window.removeEventListener('click', unlockSpeech, true);
        window.removeEventListener('touchstart', unlockSpeech, true);
        window.removeEventListener('touchend', unlockSpeech, true);
    };
    window.addEventListener('click', unlockSpeech, true);
    window.addEventListener('touchstart', unlockSpeech, true);
    window.addEventListener('touchend', unlockSpeech, true);
}
