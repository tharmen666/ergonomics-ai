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
        
        // Custom search to enforce young, fluent female South African English voice
        const findSAYouthFemale = () => {
            // Priority 1: en-ZA female voice
            const saFemale = voices.find(v => 
                v.lang.toLowerCase() === 'en-za' && 
                (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
            );
            if (saFemale) return saFemale;

            // Priority 2: any en-ZA voice
            const saAny = voices.find(v => v.lang.toLowerCase() === 'en-za');
            if (saAny) return saAny;

            // Priority 3: high quality female English fallback (strictly avoid monotone Zira, David, Hazel)
            return voices.find(v => 
                v.lang.toLowerCase().startsWith('en') && 
                (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('salli') || v.name.toLowerCase().includes('joanna')) &&
                !v.name.toLowerCase().includes('zira') &&
                !v.name.toLowerCase().includes('david') &&
                !v.name.toLowerCase().includes('hazel')
            );
        };

        if (currentItem.lang === 'en') {
            selectedVoice = findSAYouthFemale();
        } else if (config) {
            // Match regional locale
            selectedVoice = voices.find(v => v.lang.toLowerCase() === config.locale.toLowerCase());
        }

        // Broad fallback if still not found
        if (!selectedVoice) {
            selectedVoice = voices.find(v => 
                v.lang.toLowerCase().startsWith('en') && 
                !v.name.toLowerCase().includes('zira') && 
                !v.name.toLowerCase().includes('david')
            );
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Enforce Nelly's voice parameters: natural, happy, vibrant cadence (rate: 0.9, pitch: 1.05) for English
        if (currentItem.lang === 'en') {
            utterance.pitch = 1.05;
            utterance.rate = 0.9;
        } else {
            utterance.pitch = (currentItem.lang === 'zu' || currentItem.lang === 'af' || currentItem.lang === 'xh' || currentItem.lang === 'st' || currentItem.lang === 'sw') ? 1.15 : 1.05;
            utterance.rate = (currentItem.lang === 'zu' || currentItem.lang === 'af' || currentItem.lang === 'xh' || currentItem.lang === 'st' || currentItem.lang === 'sw') ? 0.8 : 1.0;
        }

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

// Interactive root-level touch/click silent audio initialization breakout
if (typeof window !== 'undefined') {
    const unlockSpeech = () => {
        if (window.speechSynthesis) {
            const u = new SpeechSynthesisUtterance('');
            u.volume = 0;
            window.speechSynthesis.speak(u);
            console.log("SpeechSynthesis unlocked successfully via interaction breakout.");
        }
        window.removeEventListener('click', unlockSpeech, true);
        window.removeEventListener('touchstart', unlockSpeech, true);
    };
    window.addEventListener('click', unlockSpeech, true);
    window.addEventListener('touchstart', unlockSpeech, true);
}
