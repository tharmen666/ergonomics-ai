import { motion } from 'framer-motion';
import { X, Globe, PlayCircle, ShieldCheck } from 'lucide-react';
import { ReasoningLog } from '../agent/ReasoningLog';
import { translations, Language } from '../../utils/translations';

interface MellyInterfaceProps {
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

export const MellyInterface = ({
    language,
    setLanguage,
    onClose,
    onTour,
    onStewardship,
    userInput,
    setUserInput,
    onSend,
    isSpeaking
}: MellyInterfaceProps) => {
    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[300px] md:w-[350px] bg-ohs-navy/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest">Melly Intelligence Grid</span>
                <div className="flex items-center gap-2">
                    <Globe size={12} className="text-gray-500" />
                    <select
                        aria-label="Select Language"
                        title="Select Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-transparent text-[10px] font-bold text-gray-400 focus:outline-none cursor-pointer"
                    >
                        <option value="en" className="bg-ohs-navy">EN</option>
                        <option value="zu" className="bg-ohs-navy">ZU</option>
                        <option value="xh" className="bg-ohs-navy">XH</option>
                        <option value="af" className="bg-ohs-navy">AF</option>
                        <option value="sw" className="bg-ohs-navy">SW</option>
                        <option value="zh" className="bg-ohs-navy">ZH</option>
                        <option value="es" className="bg-ohs-navy">ES</option>
                        <option value="ko" className="bg-ohs-navy">KO</option>
                    </select>
                    <button 
                        aria-label="Close" 
                        title="Close" 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-white ml-2"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Intro Text */}
            <div className="mb-4">
                <p className="text-sm text-white font-medium italic leading-relaxed break-words whitespace-normal">
                    "{translations[language].melly_intro}"
                </p>
            </div>

            <ReasoningLog />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
                <button
                    onClick={onTour}
                    className="flex-1 flex items-center justify-center gap-2 bg-ohs-orange text-ohs-navy py-2.5 rounded-xl font-bold text-[10px] transform hover:scale-105 transition-all whitespace-nowrap"
                >
                    <PlayCircle size={14} />
                    SAFETY TOUR
                </button>
                <button
                    onClick={onStewardship}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-2.5 rounded-xl font-bold text-[10px] transform hover:scale-105 transition-all whitespace-nowrap"
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
                        {translations[language].stewardship_model}
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-ohs-orange/50 text-white"
                />
                <button
                    onClick={onSend}
                    className="bg-ohs-orange text-ohs-navy px-3 py-2 rounded-xl font-black text-[10px]"
                >
                    SEND
                </button>
            </div>
        </motion.div>
    );
};
