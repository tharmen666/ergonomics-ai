import { motion } from 'framer-motion';
import { X, Globe, PlayCircle, ShieldCheck, Minimize2 } from 'lucide-react';
import { ReasoningLog } from '../agent/ReasoningLog';
import { translations, Language } from '../../utils/translations';
import { VOICEOVER_ACCENT_MAP } from '../../utils/speech';

interface NellyInterfaceProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    onClose: () => void;
    onTour: () => void;
    onStewardship: () => void;
    userInput: string;
    setUserInput: (input: string) => void;
    onSend: () => void;
    isSpeaking: boolean;
}

export const NellyInterface = ({
    language,
    setLanguage,
    onClose,
    onTour,
    onStewardship,
    userInput,
    setUserInput,
    onSend,
    isSpeaking
}: NellyInterfaceProps) => {
    const activeLang: Language = (language && translations[language]) ? language : 'en';

    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[92vw] max-w-[350px] bg-ohs-navy/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest">Nelly Intelligence Grid</span>
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

            {/* Premium Language Preference Selection Bar */}
            <div className="flex items-center justify-between gap-1 mb-4 bg-white/5 p-1 rounded-xl border border-white/5">
                {Object.entries(VOICEOVER_ACCENT_MAP).map(([code, config]) => {
                    const isSelected = activeLang === code;
                    return (
                        <button
                            key={code}
                            onClick={() => setLanguage(code as Language)}
                            className={`flex-1 text-[9px] font-black py-1.5 px-1 rounded-lg transition-all duration-300 ${
                                isSelected 
                                    ? 'bg-ohs-orange text-ohs-navy shadow-[0_0_10px_rgba(249,168,37,0.3)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {config.regionalAccent}
                        </button>
                    );
                })}
            </div>

            {/* Intro Text */}
            <div className="mb-4">
                <p className="text-sm text-white font-medium italic leading-relaxed break-words whitespace-normal">
                    "{translations[activeLang].nelly_intro}"
                </p>
            </div>

            <ReasoningLog />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
                <button
                    onClick={onTour}
                    className="flex-1 flex items-center justify-center gap-2 bg-ohs-orange text-ohs-navy hover:bg-yellow-400 py-2.5 min-h-[44px] rounded-xl font-black text-[10px] transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(249,168,37,0.4)] transition-all duration-300 ease-out active:scale-95 whitespace-nowrap"
                >
                    <PlayCircle size={14} />
                    SAFETY TOUR
                </button>
                <button
                    onClick={onStewardship}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-ohs-orange/50 hover:bg-white/10 text-white py-2.5 min-h-[44px] rounded-xl font-bold text-[10px] transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(249,168,37,0.2)] transition-all duration-300 ease-out active:scale-95 whitespace-nowrap"
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
                    className="mt-4 p-3 bg-ohs-orange/10 border border-ohs-orange/20 rounded-xl"
                >
                    <p className="text-[11px] text-ohs-orange font-bold leading-tight">
                        {translations[activeLang].stewardship_model}
                    </p>
                </motion.div>
            )}

            {/* User Input Area */}
            <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSend()}
                    placeholder="Type symptom or query..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-h-[44px] text-[10px] focus:outline-none focus:border-ohs-orange/50 text-white"
                />
                <button
                    onClick={onSend}
                    className="bg-ohs-orange text-ohs-navy px-3 py-2 min-h-[44px] rounded-xl font-black text-[10px]"
                >
                    SEND
                </button>
            </div>
        </motion.div>
    );
};
