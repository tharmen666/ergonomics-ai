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
        
        // Match voice to selected language
        if (lang === 'zu') {
            selectedVoice = voices.find(v => v.lang.startsWith('zu') || v.lang === 'en-ZA');
        } else if (lang === 'af') {
            selectedVoice = voices.find(v => v.lang.startsWith('af') || v.lang === 'en-ZA');
        } else {
            // Default to English (prefer female voices)
            selectedVoice = voices.find(v => 
                (v.lang.startsWith('en') && v.name.includes('Female')) || 
                v.name.includes('Zira') || 
                v.name.includes('Google UK')
            ) || voices.find(v => v.lang.startsWith('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.pitch = (lang === 'zu' || lang === 'af') ? 1.15 : 1.05;
        } else {
            utterance.pitch = 1.2;
        }

        utterance.rate = (lang === 'zu' || lang === 'af') ? 0.8 : 1.0;

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

