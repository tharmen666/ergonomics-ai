import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReasoningLog } from '../agent/ReasoningLog';
import { useMellyStore } from '../../store/mellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { X, PlayCircle, Globe, ShieldCheck } from 'lucide-react';
import { translations, Language } from '../../utils/translations';

export const MellyAvatar = () => {
    const { isWingmanActive, isSpeaking, setSpeaking, setTourActive, language, setLanguage, setGuidance } = useMellyStore();
    const { fatigueLevel } = useFatigueStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [isEmergency, setIsEmergency] = useState(false);

    // Audio Kill-Switch & Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleSend = () => {
        if (!userInput.trim()) return;

        const lowCase = userInput.toLowerCase();
        const emergencyKeywords = ['severe pain', 'fainting', 'injury', 'accident', 'bleeding'];
        const isEmerg = emergencyKeywords.some(word => lowCase.includes(word));

        if (isEmerg) {
            setIsEmergency(true);
            setSpeaking(true);
            setGuidance("EMERGENCY PROTOCOL ACTIVATED. Halted all non-critical processes.");
        } else {
            // Normal interaction simulation
            // MPV ALGORITHM & Google-Prompting Synthesis (CAR Structure)
            const efficiency = fatigueLevel === 'nominal' ? 100 : (fatigueLevel === 'warning' ? 85 : 75);
            if (efficiency < 85) {
                setGuidance(`Based on your rising Muda % to ${100 - efficiency}% (Context), please perform a 20-20-20 eye reset and posture adjustment immediately (Action) to restore your 100% O.H.E. rating and Section 37 compliance status (Result).`);
            } else {
                setGuidance(`I hear you. Let me check the OHS standards regarding "${userInput}"...`);
            }
            setSpeaking(true);
            setTimeout(() => setSpeaking(false), 3000);
        }
        setUserInput('');
    };

    if (!isWingmanActive) return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-[40] flex flex-col items-end gap-3 pointer-events-none"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => !isSpeaking && setIsExpanded(false)}
        >
            <AnimatePresence>
                {/* FULL INTERFACE (Visible when expanded) */}
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="flex flex-col items-end gap-3 pointer-events-auto mr-2 mb-2"
                    >
                        <motion.div
                            className="relative group w-[40vw] max-w-[200px] aspect-square max-h-[30vh] md:w-40 md:h-40 rounded-full border-4 border-ohs-orange/30 p-1 bg-ohs-navy shadow-2xl overflow-hidden cursor-pointer"
                            layoutId="melly-core"
                            onClick={() => {
                                window.speechSynthesis.cancel();
                                setSpeaking(false);
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className={`w-full h-full rounded-full overflow-hidden relative border-[3px] flex items-center justify-center ${fatigueLevel === 'nominal' ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-black' : fatigueLevel === 'warning' ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-black' : 'border-red-500 bg-gradient-to-br from-red-500/20 to-black'}`}>
                                <img src="/assets/melly-new-avatar.png" className="w-full h-full object-cover" alt="Melly Avatar" />
                                {isSpeaking && (
                                    <div className="absolute inset-0 bg-ohs-orange/20 flex items-center justify-center animate-pulse">
                                        <div className="flex gap-1 absolute bottom-4">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 12, 4] }}
                                                    transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.05 }}
                                                    className="w-1 bg-white rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Reasoning Log & Demo Button */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-[300px] md:w-[350px] bg-ohs-navy/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                        >
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
                                    <button aria-label="Close" title="Close" onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-white ml-2"><X size={14} /></button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-white font-medium italic leading-relaxed break-words whitespace-normal">
                                    "{translations[language].melly_intro}"
                                </p>
                            </div>

                            <ReasoningLog />

                            <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        setTourActive(true);
                                        setIsExpanded(false);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-ohs-orange text-ohs-navy py-2.5 rounded-xl font-bold text-[10px] transform hover:scale-105 transition-all whitespace-nowrap"
                                >
                                    <PlayCircle size={14} />
                                    SAFETY TOUR
                                </button>
                                <button
                                    onClick={() => {
                                        setSpeaking(true);
                                        // Trigger stewardship explanation
                                        setTimeout(() => setSpeaking(false), 5000);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-2.5 rounded-xl font-bold text-[10px] transform hover:scale-105 transition-all whitespace-nowrap"
                                >
                                    <ShieldCheck size={14} className="text-ohs-orange" />
                                    STEWARDSHIP
                                </button>
                            </div>

                            {isSpeaking && !isEmergency && (
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

                            {/* EMERGENCY UI */}
                            {isEmergency && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 p-4 bg-red-600/90 border-2 border-white rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                                >
                                    <h4 className="text-white font-black uppercase text-xs mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                        Critical Escalation Active
                                    </h4>
                                    <p className="text-[10px] text-white font-bold mb-3 leading-tight">
                                        High-risk event detected. Immediate evacuation or medical assistance required.
                                    </p>
                                    <div className="bg-white/10 p-2 rounded-lg border border-white/20 mb-3">
                                        <p className="text-[9px] text-white opacity-80 uppercase font-black">Assembly Point</p>
                                        <p className="text-[11px] text-white font-bold">Main Gate - Sector A</p>
                                    </div>
                                    <a
                                        href="tel:+27622655708"
                                        className="w-full flex items-center justify-center gap-2 bg-white text-red-600 py-3 rounded-xl font-black text-sm hover:bg-gray-100 transition-all"
                                    >
                                        CALL EMERGENCY: +27 62 265 5708
                                    </a>
                                    <button
                                        onClick={() => setIsEmergency(false)}
                                        className="w-full text-[9px] text-white/60 font-black uppercase mt-2 hover:text-white"
                                    >
                                        De-escalate
                                    </button>
                                </motion.div>
                            )}

                            {/* USER INPUT AREA */}
                            {!isEmergency && (
                                <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type symptom or query..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-ohs-orange/50 text-white"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="bg-ohs-orange text-ohs-navy px-3 py-2 rounded-xl font-black text-[10px]"
                                    >
                                        SEND
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                layoutId="melly-core"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`pointer-events-auto w-14 h-14 rounded-full border-[3px] flex items-center justify-center overflow-hidden transition-all relative ${isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${fatigueLevel === 'nominal' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : fatigueLevel === 'warning' ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-ohs-navy to-black rounded-full flex items-center justify-center">
                    <img src="/assets/melly-new-avatar.png" className="w-full h-full object-cover rounded-full" alt="Melly Avatar" />
                </div>

                {/* Active Pulse */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`absolute inset-0 z-0 rounded-full ${fatigueLevel === 'nominal' ? 'bg-green-500' : fatigueLevel === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                />

                {isSpeaking && (
                    <div className="absolute bottom-1 w-full flex justify-center gap-0.5 z-20">
                        <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.2 }} className="w-1 bg-ohs-orange rounded-full" />
                        <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.2, delay: 0.1 }} className="w-1 bg-ohs-orange rounded-full" />
                        <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.2, delay: 0.2 }} className="w-1 bg-ohs-orange rounded-full" />
                    </div>
                )}
            </motion.button>
        </div>
    );
};
