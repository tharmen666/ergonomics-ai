export interface VoiceConfig {
    displayName: string;
    regionalAccent: string;
    elevenLabsModel: string;
    locale: string;
    audioPathPattern?: string;
}

export const VOICEOVER_ACCENT_MAP: Record<string, VoiceConfig> = {
    en: {
        displayName: "South African English",
        regionalAccent: "Gauteng Corporate",
        elevenLabsModel: "eleven_multilingual_v2",
        locale: "en-ZA",
        audioPathPattern: "/assets/audio/en_za/scene{scene}.mp3"
    },
    zu: {
        displayName: "isiZulu",
        regionalAccent: "Authentic Native",
        elevenLabsModel: "eleven_multilingual_v2",
        locale: "zu-ZA",
        audioPathPattern: "/assets/audio/zu/scene{scene}.mp3"
    },
    xh: {
        displayName: "isiXhosa",
        regionalAccent: "Authentic Native",
        elevenLabsModel: "eleven_multilingual_v2",
        locale: "xh-ZA",
        audioPathPattern: "/assets/audio/xh/scene{scene}.mp3"
    },
    st: {
        displayName: "Sesotho",
        regionalAccent: "Authentic Native",
        elevenLabsModel: "eleven_multilingual_v2",
        locale: "st-ZA",
        audioPathPattern: "/assets/audio/st/scene{scene}.mp3"
    },
    af: {
        displayName: "Afrikaans",
        regionalAccent: "Natural RSA Regional",
        elevenLabsModel: "eleven_multilingual_v2",
        locale: "af-ZA",
        audioPathPattern: "/assets/audio/af/scene{scene}.mp3"
    },
    sw: {
        displayName: "KiSwahili",
        regionalAccent: "East African Elite Standard",
        elevenLabsModel: "eleven_multilingual_v2",
        locale: "sw-KE",
        audioPathPattern: "/assets/audio/sw/scene{scene}.mp3"
    }
};

export const speak = (text: string, lang: string = 'en', onEnd?: () => void) => {
    if (!window.speechSynthesis) {
        console.error("Speech Synthesis not supported");
        return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const loadVoices = () => {
        const voices = synth.getVoices();
        
        let selectedVoice;
        const config = VOICEOVER_ACCENT_MAP[lang];
        
        if (config) {
            // Find voice matching regional locale first (e.g. en-ZA, zu-ZA)
            selectedVoice = voices.find(v => 
                v.lang.toLowerCase() === config.locale.toLowerCase() ||
                v.lang.toLowerCase().replace('_', '-').startsWith(lang.toLowerCase())
            );
        }

        if (!selectedVoice) {
            // Fallback: Default to English (prefer female voices)
            selectedVoice = voices.find(v => 
                (v.lang.startsWith('en') && v.name.includes('Female')) || 
                v.name.includes('Zira') || 
                v.name.includes('Google UK')
            ) || voices.find(v => v.lang.startsWith('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.pitch = (lang === 'zu' || lang === 'af' || lang === 'xh' || lang === 'st' || lang === 'sw') ? 1.15 : 1.05;
        } else {
            utterance.pitch = 1.2;
        }

        utterance.rate = (lang === 'zu' || lang === 'af' || lang === 'xh' || lang === 'st' || lang === 'sw') ? 0.8 : 1.0;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        synth.speak(utterance);
    };

    if (synth.getVoices().length > 0) {
        loadVoices();
    } else {
        synth.onvoiceschanged = () => {
            loadVoices();
            synth.onvoiceschanged = null;
        };
    }
};

export const stopSpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};

