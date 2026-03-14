export const speak = (text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) {
        console.error("Speech Synthesis not supported");
        return;
    }

    const synth = window.speechSynthesis;
    // Cancel previous
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Robust voice selection
    const loadVoices = () => {
        const voices = synth.getVoices();

        // Priority: Google UK English Female -> Microsoft Zira -> Any Female
        let selectedVoice = voices.find(v =>
            (v.name.includes('Google') && v.name.includes('UK') && v.name.includes('Female')) ||
            v.name.includes('Zira')
        );

        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Female'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.pitch = 1.05; // Natural lift
        } else {
            // Fallback to default but slightly higher pitch to sound less robotic/male if possible
            utterance.pitch = 1.2;
        }

        utterance.rate = 1.0;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        synth.speak(utterance);
    };

    if (synth.getVoices().length > 0) {
        loadVoices();
    } else {
        // Wait for voices to load
        synth.onvoiceschanged = () => {
            loadVoices();
            // Remove listener to prevent multiple triggers
            synth.onvoiceschanged = null;
        };
    }
};

export const stopSpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};
