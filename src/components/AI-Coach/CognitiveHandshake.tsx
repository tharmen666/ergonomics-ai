import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Target, ShieldAlert } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';
import { HandshakeCardHeader } from '../common/HandshakeCardHeader';

export const CognitiveHandshake = () => {
    const { cognitiveHandshakePassed, showCognitiveHandshake, setShowCognitiveHandshake, passCognitiveHandshake, failCognitiveHandshake, warnCognitiveHandshake, supervisorOverride } = useFatigueStore();
    const { setGuidance, setSpeaking, setMood } = useNellyStore();

    // Game State
    const [targetsHit, setTargetsHit] = useState(0);
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [lastTargetTime, setLastTargetTime] = useState(Date.now());
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showKaizenBonus, setShowKaizenBonus] = useState(false);

    const TOTAL_TARGETS = 5;

    const handleTargetClick = () => {
        const timeToClick = Date.now() - lastTargetTime;
        setReactionTimes(prev => [...prev, timeToClick]);

        if (targetsHit + 1 >= TOTAL_TARGETS) {
            finishGame([...reactionTimes, timeToClick]);
        } else {
            setTargetsHit(prev => prev + 1);
            setTargetPos({
                x: Math.floor(Math.random() * 80) + 10,
                y: Math.floor(Math.random() * 70) + 15
            });
            setLastTargetTime(Date.now());
        }
    };

    const finishGame = (finalTimes: number[]) => {
        setShowCognitiveHandshake(false);
        setGameCompleted(true);

        const avgReaction = finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length;
        
        // Calculate Standard Deviation (Variance Analysis)
        const squareDiffs = finalTimes.map(time => Math.pow(time - avgReaction, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        const stdDev = Math.sqrt(avgSquareDiff);
        const variancePercentage = (stdDev / avgReaction) * 100;

        // Connect to Memory Vault
        const { reactionMemory, addReactionMemory } = useFatigueStore.getState();
        let isFatigued = false;
        let historicalBaseline = 0;

        if (reactionMemory.length > 0) {
            const historicalBaselineValue = reactionMemory.reduce((a, b) => a + b, 0) / reactionMemory.length;
            historicalBaseline = historicalBaselineValue;
            
            // COGNITIVE LOAD CALCULATION:
            // 1. Reaction time > 20% of baseline
            // 2. Variance > 35% (Inconsistent focus)
            // 3. Absolute threshold > 1000ms
            isFatigued = avgReaction > (historicalBaselineValue * 1.20) || 
                         variancePercentage > 35 ||
                         avgReaction > 1000;
        } else {
            isFatigued = avgReaction > 1000; 
        }

        addReactionMemory(avgReaction);

        setSpeaking(true);
        if (isFatigued) {
            failCognitiveHandshake();
            setMood('concerned');
            
            const reason = variancePercentage > 35 ? "High Cognitive Variance" : "Latency Threshold Breach";
            setGuidance(`PROTOCOL ALERT: ${reason} detected. Handshake failed with ${Math.round(variancePercentage)}% variance. Status logged as High Fatigue.`);
        } else if (historicalBaseline && avgReaction < (historicalBaseline * 1.10) && avgReaction < 700) {
            passCognitiveHandshake();
            setShowKaizenBonus(true);
            setMood('happy');
            setGuidance("KAIZEN BONUS: Optimal latency (<700ms) and low variance detected. Handshake cleared. Productive Streak multiplied.");
            setTimeout(() => setShowKaizenBonus(false), 800);
        } else if (historicalBaseline && (avgReaction >= (historicalBaseline * 1.15) || variancePercentage > 25)) {
            warnCognitiveHandshake();
            setMood('concerned');
            setGuidance(`MUDA DETECTED: Variance is ${Math.round(variancePercentage)}% from baseline. Your cognitive consistency is slipping. Consider a professional reset.`);
        } else {
            passCognitiveHandshake();
            setMood('happy');
            setGuidance("Cognitive Handshake passed! You're performing safely at standard work rates.");
        }

        setTimeout(() => setSpeaking(false), 3000);
    };

    if (cognitiveHandshakePassed || gameCompleted) return null;

    return (
        <AnimatePresence>
            {showKaizenBonus && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="fixed inset-0 z-[99001] flex flex-col items-center justify-center bg-[#a2ff00]/10 backdrop-blur-sm pointer-events-none"
                >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, ease: 'linear' }}>
                        <BrainCircuit size={120} className="text-[#a2ff00] drop-shadow-[0_0_50px_rgba(162,255,0,1)]" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#a2ff00] drop-shadow-[0_0_20px_rgba(162,255,0,0.8)] mt-8 tracking-[0.2em] uppercase">
                        Kaizen Master
                    </h1>
                </motion.div>
            )}
            {showCognitiveHandshake && !cognitiveHandshakePassed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[99000] flex items-center justify-center bg-black/80 backdrop-blur-md font-sans text-white p-3 sm:p-4 overflow-x-hidden overflow-y-auto"
                >
                    <div className="w-[95vw] max-w-md max-h-[90vh] max-h-[90dvh] m-auto flex flex-col items-center justify-between bg-slate-900/95 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-[0_0_50px_rgba(249,168,37,0.15)] relative overflow-y-auto z-50">
                        <HandshakeCardHeader
                            title="COGNITIVE HANDSHAKE"
                            subtext="Click the targets as quickly as possible to calibrate your baseline latency."
                            icon={<BrainCircuit size={28} />}
                            className="p-3 sm:p-4 mb-2"
                        />

                        <div className="mt-3 flex justify-center gap-1.5">
                            {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < targetsHit ? 'bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.8)]' : 'bg-white/10'}`} />
                            ))}
                        </div>
                        
                        <div className="w-full flex-1 relative mt-4 border border-slate-800 rounded-2xl bg-black/40 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] min-h-[160px]">
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ type: "spring", duration: 0.3 }}
                                onClick={handleTargetClick}
                                className="absolute flex items-center justify-center w-12 h-12 min-h-[48px] min-w-[48px] bg-ohs-orange hover:bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(249,168,37,0.6)] cursor-crosshair transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                            >
                                <Target size={20} className="text-ohs-navy" />
                            </motion.button>
                        </div>

                        {/* Instant Supervisor Override Button */}
                        <button
                            onClick={() => {
                                supervisorOverride();
                                setGameCompleted(true);
                            }}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-xl transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/40"
                        >
                            ⚡ SUPERVISOR OVERRIDE / EMERGENCY RESET
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
