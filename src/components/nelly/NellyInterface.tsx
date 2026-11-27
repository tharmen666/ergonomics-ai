import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, PlayCircle, ShieldCheck, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { ReasoningLog } from '../agent/ReasoningLog';
import { translations, Language } from '../../utils/translations';
import { VOICEOVER_ACCENT_MAP, speakWithSubtitles, toggleMute, getIsMuted } from '../../utils/speech';

import { useNellyStore } from '../../store/nellyStore';
import { useAgentLog } from '../../store/agentLogStore';
import { nellyReplyPair, type NellyReplyKey } from './nellyReplies';
import { AITransparencyBadge } from '../compliance/AITransparencyBadge';

interface NellyInterfaceProps {
    language?: Language;
    setLanguage?: (lang: Language) => void;
    onClose?: () => void;
    onTour?: () => void;
    onStewardship?: () => void;
    userInput?: string;
    setUserInput?: (input: string) => void;
    onSend?: () => void;
    isSpeaking?: boolean;
}

export const NellyInterface = ({
    language: propLang,
    setLanguage: propSetLang,
    onClose = () => {},
    onTour = () => {},
    onStewardship,
    userInput: propUserInput,
    setUserInput: propSetUserInput,
    onSend,
    isSpeaking: propIsSpeaking
}: NellyInterfaceProps) => {
    const store = useNellyStore();
    const { addLog } = useAgentLog();
    const [localInput, setLocalInput] = useState('');
    const language = propLang || store.language || 'en';
    const setLanguage = propSetLang || store.setLanguage;
    const isSpeaking = propIsSpeaking !== undefined ? propIsSpeaking : store.isSpeaking;
    const { markIntroduced, activeSubtitle, activeVoice } = store;

    const activeLang: Language = (language && translations[language]) ? language : 'en';
    const currentAccent = VOICEOVER_ACCENT_MAP[activeLang] || VOICEOVER_ACCENT_MAP['en'];
    const subtitleDisplay =
        activeSubtitle && activeSubtitle.lang === activeLang
            ? activeSubtitle.text
            : translations[activeLang].nelly_intro;

    const userInput = propUserInput !== undefined ? propUserInput : localInput;
    const setUserInput = propSetUserInput || setLocalInput;

    const handleStewardship = onStewardship || (() => {
        store.setSpeaking(true);
        const prompt = "STEWARDSHIP AUDIT: Are you currently seated at a desk or working from a bed/couch? (Please type your response)";
        store.setGuidance(prompt);
        addLog('Nelly', prompt);
        speakWithSubtitles(prompt, prompt, activeLang, () => store.setSpeaking(false));
    });

    const handleSend = onSend || (() => {
        const trimmed = userInput.trim();
        if (!trimmed) return;
        const low = trimmed.toLowerCase();
        addLog('User', trimmed);
        let key: NellyReplyKey = 'unknown';
        if (/\b(emergency|collapse|unconscious|chest pain|severe bleeding)\b/.test(low)) key = 'emergency';
        else if (/\b(neck|cervical)\b/.test(low)) key = 'neck';
        else if (/\b(back|lumbar|spine)\b/.test(low)) key = 'back';
        else if (/\b(wrist|carpal|hand|mouse)\b/.test(low)) key = 'wrist';
        else if (/\b(eye|eyes|headache|vision|screen)\b/.test(low)) key = 'eye';
        else if (/\b(tingling|numbness|burning)\b/.test(low)) key = 'symptom';
        else if (/\b(ohs|iso|section 37|compliance|act)\b/.test(low)) key = 'ohs';

        const { spokenEnglish, subtitleText } = nellyReplyPair(key, activeLang);
        store.setSpeaking(true);
        store.setGuidance(subtitleText);
        addLog('Nelly', subtitleText);
        speakWithSubtitles(spokenEnglish, subtitleText, activeLang, () => store.setSpeaking(false));
        setUserInput('');
    });

    return (
        <motion.div
            data-testid="nelly-side-panel"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[calc(100vw-2rem)] max-w-[340px] sm:max-w-[350px] bg-ohs-navy/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[80dvh] flex flex-col min-h-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
                        <img
                            src="/assets/nelly-male-avatar.png"
                            alt="Nelly AI Advisor"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest">Nelly Intelligence Grid</span>
                    <button
                        onClick={() => {
                            const muted = toggleMute();
                            store.setSpeaking(!muted);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            getIsMuted() 
                                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                : 'bg-ohs-orange/20 text-ohs-orange border-ohs-orange/30 hover:bg-ohs-orange/30'
                        }`}
                        title={getIsMuted() ? "Unmute Nelly Voice Synthesis" : "Mute Nelly Voice Synthesis"}
                    >
                        {getIsMuted() ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        aria-label="Minimize" 
                        title="Minimize" 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-white p-1"
                    >
                        <Minimize2 size={14} />
                    </button>
                    <button 
                        aria-label="Close" 
                        title="Close" 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-white p-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 space-y-3">
            {/* EU AI Act Art. 50 Transparency Notice */}
            <AITransparencyBadge compact />

            {/* Premium Language Preference Selection Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 bg-slate-950 border border-slate-800 p-1.5 rounded-xl">
                {Object.entries(VOICEOVER_ACCENT_MAP).map(([code, config]) => {
                    const isSelected = activeLang === code;
                    const langCode = code as Language;
                    return (
                        <button
                            key={code}
                            onClick={() => {
                                setLanguage(langCode);
                                const localizedIntro = translations[langCode]?.nelly_intro || translations['en'].nelly_intro;
                                const englishIntro = translations['en'].nelly_intro;
                                markIntroduced();
                                speakWithSubtitles(englishIntro, localizedIntro, langCode);
                            }}
                            className={`flex-1 text-[10px] font-black py-2 px-1 rounded-lg cursor-pointer transition-all duration-300 ${
                                isSelected 
                                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]' 
                                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/50'
                            }`}
                        >
                            {config.regionalAccent}
                        </button>
                    );
                })}
            </div>

            {/* Live Multilingual Subtitle Bar synced with South African English (en-ZA) Voice */}
            <div
                data-testid="nelly-subtitle-bar"
                className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2"
            >
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-bold">
                    <span
                        data-testid="nelly-voice-badge"
                        title={activeVoice?.name || 'en-ZA-LukeNeural (Demo Voicenote)'}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300"
                    >
                        {activeVoice?.engine === 'voicenote' || !activeVoice
                            ? 'Voice: en-ZA (LukeNeural)'
                            : `Voice: ${activeVoice.tier === 'en-ZA' ? 'en-ZA' : activeVoice.lang} • 0.96x`}
                    </span>
                    <span
                        data-testid="nelly-subtitle-lang"
                        className="inline-flex items-center gap-1 text-amber-300"
                    >
                        <Globe size={11} />
                        Subtitles: {currentAccent.displayName} ({currentAccent.regionalAccent})
                    </span>
                </div>
                <p
                    data-testid="nelly-subtitle-text"
                    className="text-xs sm:text-sm text-white font-medium italic leading-relaxed break-words whitespace-normal"
                >
                    "{subtitleDisplay}"
                </p>
            </div>

            {/* Agent Reasoning Log Container */}
            <div className="w-full max-w-full overflow-hidden rounded-xl">
                <ReasoningLog />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
                <button
                    onClick={onTour}
                    className="flex-1 flex items-center justify-center gap-2 bg-ohs-orange text-ohs-navy hover:bg-yellow-400 py-2.5 min-h-[44px] rounded-xl font-black text-[10px] transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(249,168,37,0.4)] transition-all duration-300 ease-out active:scale-95 whitespace-nowrap cursor-pointer"
                >
                    <PlayCircle size={14} />
                    SAFETY TOUR
                </button>
                <button
                    onClick={handleStewardship}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-ohs-orange/50 hover:bg-white/10 text-white py-2.5 min-h-[44px] rounded-xl font-bold text-[10px] transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(249,168,37,0.2)] transition-all duration-300 ease-out active:scale-95 whitespace-nowrap cursor-pointer"
                >
                    <ShieldCheck size={14} className="text-ohs-orange" />
                    STEWARDSHIP
                </button>
            </div>

            {/* Stewardship Model Feedback */}
            {isSpeaking && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-ohs-orange/10 border border-ohs-orange/20 rounded-xl"
                >
                    <p className="text-[11px] text-ohs-orange font-bold leading-tight">
                        {translations[activeLang].stewardship_model}
                    </p>
                </motion.div>
            )}
            </div>

            {/* User Input Area */}
            <div className="mt-3 flex gap-2 border-t border-white/5 pt-3 shrink-0">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type symptom or query..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-h-[44px] text-[10px] focus:outline-none focus:border-ohs-orange/50 text-white"
                />
                <button
                    onClick={handleSend}
                    className="bg-ohs-orange text-ohs-navy px-3 py-2 min-h-[44px] rounded-xl font-black text-[10px] cursor-pointer"
                >
                    SEND
                </button>
            </div>
        </motion.div>
    );
};
