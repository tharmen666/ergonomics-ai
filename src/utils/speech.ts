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

// Ensure voice list is pre-loaded on modern browsers as soon as available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    } catch {
        // Safe fallback in restrictive sandbox environments
    }
}

/**
 * Prioritized female voice selection strategy strictly targeting South African English (en-ZA),
 * British English (en-GB), Australian English (en-AU), or high-quality female voices.
 * Explicitly guards against defaulting to male voices like "Microsoft David".
 */
export function getPreferredNellyVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const maleVoiceRegex = /david|mark|george|richard|male|guy|adam|alex|daniel|fred|james|jorge|rishi|tom|stefan/i;

  // 1. Tier 1: South African Female (if available on system/browser)
  const zaFemale = voices.find(
    v => (v.lang === 'en-ZA' || v.lang.startsWith('en_ZA') || v.lang.toLowerCase().replace('_', '-') === 'en-za') && 
         !maleVoiceRegex.test(v.name)
  );
  if (zaFemale) return zaFemale;

  // 2. Tier 2: High-quality Commonwealth / Natural Female voices
  const preferredFemaleNames = [
    'microsoft zira desktop',
    'microsoft zira',
    'microsoft jenny',
    'microsoft susan',
    'microsoft hazel',
    'microsoft libby',
    'google uk english female',
    'google south africa english female',
    'google us english female',
    'samantha',
    'karen',
    'victoria',
    'ayanda',
    'leah'
  ];

  for (const name of preferredFemaleNames) {
    const match = voices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }

  // 3. Tier 3: Regex match for any English female voice
  const genericFemale = voices.find(
    v => v.lang.toLowerCase().startsWith('en') && 
         /female|woman|zira|susan|hazel|jenny|ayanda|samantha|karen|libby|leah/i.test(v.name) &&
         !maleVoiceRegex.test(v.name)
  );
  if (genericFemale) return genericFemale;

  // 4. Fallback: Any English voice that is explicitly NOT David, Mark, George, or Richard
  const nonMaleEnglish = voices.find(
    v => v.lang.toLowerCase().startsWith('en') && 
         !maleVoiceRegex.test(v.name)
  );
  if (nonMaleEnglish) return nonMaleEnglish;

  // 5. Any voice in system that is not male
  const nonMaleAny = voices.find(v => !maleVoiceRegex.test(v.name));
  return nonMaleAny || voices[0] || null;
}

/**
 * Finds the best female neural voice matching target locale/language
 */
const findBestNeuralVoice = (targetLang: string, targetLocale: string): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const locTarget = targetLocale.toLowerCase().replace('_', '-');
    const langPrefix = targetLang.split('-')[0].toLowerCase();
    const maleVoiceRegex = /david|mark|george|richard|male|guy|adam|alex|daniel|fred|james|jorge|rishi|tom|stefan/i;

    // 1. For English, South African languages (en, zu, xh, st, af) or default, use getPreferredNellyVoice()
    if (['en', 'zu', 'xh', 'st', 'af'].includes(langPrefix)) {
        return getPreferredNellyVoice();
    }

    // 2. For foreign language targets (de, zh, sw), find female voice matching exact target locale
    const exactFemale = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-') === locTarget &&
        !maleVoiceRegex.test(v.name) &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural'))
    );
    if (exactFemale) return exactFemale;

    const exactAnyNonMale = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix) &&
        !maleVoiceRegex.test(v.name)
    );
    if (exactAnyNonMale) return exactAnyNonMale;

    // 3. Fall back to preferred Commonwealth / SA female voice
    return getPreferredNellyVoice();
};

// Chrome TTS Garbage Collection Guard: module-level and window instance persistence
let activeSpeechUtterance: SpeechSynthesisUtterance | null = null;
let speechHeartbeatTimer: ReturnType<typeof setInterval> | null = null;

if (typeof window !== 'undefined') {
    (window as any).__activeUtterance = null;
    (window as any).__activeSpeechUtterance = null;
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

/**
 * High-Fidelity Multilingual Speech Engine for Nelly AI Companion
 */
export const speakNellyGuidance = (
    text: string, 
    lang: string = 'en-US', 
    onStart?: () => void, 
    onEnd?: () => void
): SpeechSynthesisUtterance | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Web Speech API is not supported in this browser.');
        if (onEnd) onEnd();
        return null;
    }

    if (isAudioMuted) {
        if (onEnd) onEnd();
        return null;
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
        return null;
    }

    const langKey = lang.split('-')[0].toLowerCase();
    const config = VOICEOVER_ACCENT_MAP[langKey] || VOICEOVER_ACCENT_MAP[lang] || VOICEOVER_ACCENT_MAP['en'];
    const targetLocale = config ? config.locale : lang;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLocale;
    utterance.rate = 0.95; // Natural conversational tempo
    utterance.pitch = 1.08; // Warm, natural female cadence (1.05 - 1.1)

    // Chrome TTS Garbage Collection Guard:
    // Chromium aggressively garbage-collects active SpeechSynthesisUtterance instances mid-speech
    // if not retained in an active reference.
    activeSpeechUtterance = utterance;
    if (typeof window !== 'undefined') {
        (window as any).__activeUtterance = utterance;
        (window as any).__activeSpeechUtterance = utterance;
    }

    const voice = findBestNeuralVoice(langKey, targetLocale);
    if (voice) {
        utterance.voice = voice;
    }

    utterance.onstart = () => {
        startSpeechHeartbeat();
        try {
            useNellyStore.getState().setSpeaking(true);
        } catch (e) {
            // ignore store errors if uninitialized
        }
        if (onStart) onStart();
    };

    utterance.onend = () => {
        stopSpeechHeartbeat();
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
        try {
            useNellyStore.getState().setSpeaking(false);
        } catch (e) {
            // ignore store errors if uninitialized
        }
        if (onEnd) onEnd();
    };

    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        stopSpeechHeartbeat();
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
        try {
            useNellyStore.getState().setSpeaking(false);
        } catch (err) {
            // ignore store errors if uninitialized
        }
        // If canceled or interrupted by another utterance, do not trigger error completion
        if (e.error === 'canceled' || e.error === 'interrupted') {
            return;
        }
        console.error('Nelly Speech Error:', e);
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

    return utterance;
};

/**
 * Convenience export for backward compatibility
 */
export const speak = (text: string, lang: string = 'en', onEnd?: () => void): SpeechSynthesisUtterance | null => {
    return speakNellyGuidance(text, lang, undefined, onEnd);
};

export const stopSpeaking = () => {
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
