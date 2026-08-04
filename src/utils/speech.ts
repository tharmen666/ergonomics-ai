export interface VoiceConfig {
    displayName: string;
    regionalAccent: string;
    elevenLabsVoiceId: string;
    locale: string;
    audioPathPattern?: string;
}

export const VOICEOVER_ACCENT_MAP: Record<string, VoiceConfig> = {
    en: {
        displayName: "South African English",
        regionalAccent: "en-ZA",
        elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel / High-fidelity Natural Female
        locale: "en-ZA",
        audioPathPattern: "/assets/audio/en_za/scene{scene}.mp3"
    },
    zu: {
        displayName: "isiZulu",
        regionalAccent: "zu-ZA",
        elevenLabsVoiceId: "AZnzlk1XvdvUeBnXmlld", // Domi / Natural Warm Accent
        locale: "zu-ZA",
        audioPathPattern: "/assets/audio/zu/scene{scene}.mp3"
    },
    xh: {
        displayName: "isiXhosa",
        regionalAccent: "xh-ZA",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella
        locale: "xh-ZA",
        audioPathPattern: "/assets/audio/xh/scene{scene}.mp3"
    },
    st: {
        displayName: "Sesotho",
        regionalAccent: "st-ZA",
        elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL",
        locale: "st-ZA",
        audioPathPattern: "/assets/audio/st/scene{scene}.mp3"
    },
    sw: {
        displayName: "KiSwahili",
        regionalAccent: "sw-KE",
        elevenLabsVoiceId: "ErXwobaYiN019PkySvjV", // Antoni / Swahili Natural
        locale: "sw-KE",
        audioPathPattern: "/assets/audio/sw/scene{scene}.mp3"
    },
    zh: {
        displayName: "Mandarin Chinese",
        regionalAccent: "zh-CN",
        elevenLabsVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam / Chinese Multilingual
        locale: "zh-CN",
        audioPathPattern: "/assets/audio/zh/scene{scene}.mp3"
    },
    de: {
        displayName: "German",
        regionalAccent: "de-DE",
        elevenLabsVoiceId: "MF3mGyEYCl7XYWbV9V6O", // German Natural Female
        locale: "de-DE",
        audioPathPattern: "/assets/audio/de/scene{scene}.mp3"
    }
};

let speechQueue: { text: string; lang: string; onEnd?: () => void }[] = [];

/**
 * High-Fidelity Human Voice Engine for Nelly AI Safety Companion
 */
export const speak = (text: string, lang: string = 'en', onEnd?: () => void) => {
    if (!window.speechSynthesis) {
        console.warn("SpeechSynthesis not supported on this platform");
        return;
    }

    const synth = window.speechSynthesis;
    speechQueue = [{ text, lang, onEnd }];

    const playNext = () => {
        if (speechQueue.length === 0) return;

        const currentItem = speechQueue.shift();
        if (!currentItem) return;

        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(currentItem.text);
        const voices = synth.getVoices();
        const config = VOICEOVER_ACCENT_MAP[currentItem.lang] || VOICEOVER_ACCENT_MAP['en'];

        // Set native language locale tag (e.g. 'zu-ZA', 'sw-KE', 'zh-CN', 'de-DE', 'xh-ZA', 'st-ZA', 'en-ZA')
        utterance.lang = config.locale || config.regionalAccent;

        // Neural Voice Selector algorithm prioritizing warm female human personas
        const findBestNeuralVoice = () => {
            const localeTarget = config.locale.toLowerCase();
            const langPrefix = currentItem.lang.toLowerCase();

            // 1. Try exact locale match with neural/natural keywords
            const exactNeural = voices.find(v => 
                v.lang.toLowerCase().replace('_', '-') === localeTarget &&
                (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('neural'))
            );
            if (exactNeural) return exactNeural;

            // 2. Try exact locale match any voice
            const exactAny = voices.find(v => v.lang.toLowerCase().replace('_', '-') === localeTarget);
            if (exactAny) return exactAny;

            // 3. South African English fallback for ZA indigenous languages (zu, xh, st)
            if (['zu', 'xh', 'st', 'en'].includes(langPrefix)) {
                const saFemale = voices.find(v => 
                    v.lang.toLowerCase().includes('en-za') && 
                    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('nomsa') || v.name.toLowerCase().includes('zola'))
                );
                if (saFemale) return saFemale;

                const saAny = voices.find(v => v.lang.toLowerCase().includes('en-za'));
                if (saAny) return saAny;
            }

            // 4. High quality English female natural fallback
            return voices.find(v => 
                v.lang.toLowerCase().startsWith('en') && 
                (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('salli') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('karen')) &&
                !v.name.toLowerCase().includes('zira') &&
                !v.name.toLowerCase().includes('david')
            );
        };

        const selectedVoice = findBestNeuralVoice();
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Apply authentic human pitch, cadence, and warmth per locale
        utterance.volume = 1.0;
        if (currentItem.lang === 'en') {
            utterance.pitch = 1.04;
            utterance.rate = 0.92;
        } else if (['zu', 'xh', 'st'].includes(currentItem.lang)) {
            utterance.pitch = 1.02;
            utterance.rate = 0.88; // Warm, rhythmic South African female cadence
        } else if (['zh', 'sw', 'de'].includes(currentItem.lang)) {
            utterance.pitch = 1.0;
            utterance.rate = 0.90;
        } else {
            utterance.pitch = 1.04;
            utterance.rate = 0.92;
        }

        utterance.onend = () => {
            if (currentItem.onEnd) currentItem.onEnd();
            playNext();
        };

        utterance.onerror = () => {
            playNext();
        };

        setTimeout(() => {
            synth.speak(utterance);
        }, 30);
    };

    if (synth.getVoices().length > 0) {
        playNext();
    } else {
        synth.onvoiceschanged = () => {
            playNext();
            synth.onvoiceschanged = null;
        };
    }
};

export const stopSpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    speechQueue = [];
};

// Root-level interaction breakout to unlock speech engine on browser interaction
if (typeof window !== 'undefined') {
    const unlockSpeech = () => {
        if (window.speechSynthesis) {
            const u = new SpeechSynthesisUtterance('');
            u.volume = 0;
            window.speechSynthesis.speak(u);
        }
        window.removeEventListener('click', unlockSpeech, true);
        window.removeEventListener('touchstart', unlockSpeech, true);
    };
    window.addEventListener('click', unlockSpeech, true);
    window.addEventListener('touchstart', unlockSpeech, true);
}
