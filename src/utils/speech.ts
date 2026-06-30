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

// Pre-buffered speech queue loop to eliminate speech latency
let speechQueue: { text: string; lang: string; onEnd?: () => void }[] = [];

export const speak = (text: string, lang: string = 'en', onEnd?: () => void) => {
    if (!window.speechSynthesis) {
        console.error("Speech Synthesis not supported");
        return;
    }

    const synth = window.speechSynthesis;
    
    // Preempt and clean queue to guarantee instant transitions
    speechQueue = [{ text, lang, onEnd }];

    const playNext = () => {
        if (speechQueue.length === 0) {
            return;
        }

        const currentItem = speechQueue.shift();
        if (!currentItem) return;

        // Perform clean cancel before speaking next block
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(currentItem.text);
        const voices = synth.getVoices();
        
        let selectedVoice;
        const config = VOICEOVER_ACCENT_MAP[currentItem.lang];
        
        if (config) {
            // Match regional locale (prefer exact match)
            selectedVoice = voices.find(v => v.lang.toLowerCase() === config.locale.toLowerCase());
        }

        // Force South African English ('en-ZA') search for 'en' lang
        if (currentItem.lang === 'en') {
            selectedVoice = voices.find(v => v.lang.toLowerCase() === 'en-za') || selectedVoice;
        }

        // Deep fallback searching specifically for local South African English accents
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.toLowerCase() === 'en-za') ||
                            voices.find(v => 
                                (v.lang.startsWith('en') && v.name.includes('Female')) || 
                                v.name.includes('Zira') || 
                                v.name.includes('Google UK')
                            ) || voices.find(v => v.lang.startsWith('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.pitch = (currentItem.lang === 'zu' || currentItem.lang === 'af' || currentItem.lang === 'xh' || currentItem.lang === 'st' || currentItem.lang === 'sw') ? 1.15 : 1.05;
        } else {
            utterance.pitch = 1.2;
        }

        utterance.rate = (currentItem.lang === 'zu' || currentItem.lang === 'af' || currentItem.lang === 'xh' || currentItem.lang === 'st' || currentItem.lang === 'sw') ? 0.8 : 1.0;

        utterance.onend = () => {
            if (currentItem.onEnd) currentItem.onEnd();
            playNext();
        };

        utterance.onerror = () => {
            playNext();
        };

        // Brief timeout ensures OS speech engine processes the cancel() cleanly before speak()
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
