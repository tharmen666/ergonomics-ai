import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Target, ShieldAlert } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';

export const CognitiveHandshake = () => {
    const { cognitiveHandshakePassed, showCognitiveHandshake, setShowCognitiveHandshake, passCognitiveHandshake, failCognitiveHandshake, warnCognitiveHandshake } = useFatigueStore();
    const { setGuidance, setSpeaking, setMood } = useNellyStore();

    // Game State
    const [targetsHit, setTargetsHit] = useState(0);
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [lastTargetTime, setLastTargetTime] = useState(Date.now());
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showKaizenBonus, setShowKaizenBonus] = useState(false);
    const [showLiabilityWarning, setShowLiabilityWarning] = useState(false);

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
            setGuidance(`PROTOCOL ALERT: ${reason} detected. Handshake failed with ${Math.round(variancePercentage)}% variance. Section 37 Liability Warning activated.`);
            setShowLiabilityWarning(true);
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

    if (cognitiveHandshakePassed || (gameCompleted && !showLiabilityWarning)) return null;

    return (
        <AnimatePresence>
            {showLiabilityWarning && (
                <motion.div
                    key="liability-warning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-2xl p-6 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="max-w-2xl bg-black border-2 border-red-600 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(220,38,38,0.4)]"
                    >
                        <ShieldAlert size={80} className="text-red-500 mx-auto mb-6 animate-pulse" />
                        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Section 37 Liability Warning</h1>
                        <div className="h-1 w-24 bg-red-600 mx-auto mb-8 rounded-full" />
                        <p className="text-xl text-gray-300 font-bold mb-8 leading-relaxed">
                            UNACCEPTABLE COGNITIVE LATENCY DETECTED.
                            <br />
                            <span className="text-red-500 mt-2 block italic text-sm">Corporate Risk Protocol: Section 8(1) OHS Act 85 of 1993</span>
                        </p>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed px-4">
                            Your reaction times have deviated significantly from safe operational baselines. To protect the organization and your personal safety, <strong>DOA Lockout</strong> has been triggered. Please contact your supervisor for a mandatory wellness check.
                        </p>
                        <button
                            onClick={() => {
                                setShowLiabilityWarning(false);
                                setGameCompleted(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            ACKNOWLEDGE & DE-ESCALATE
                        </button>
                    </motion.div>
                </motion.div>
            )}

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
                    className="fixed inset-0 z-[99000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md font-sans text-white p-4"
                >
                    <div className="w-full max-w-md aspect-square flex flex-col items-center justify-center text-center bg-slate-900/90 border border-slate-800 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(249,168,37,0.15)] relative">
                        <BrainCircuit className="text-ohs-orange mb-2" size={32} />
                        <h2 className="text-xl font-black mb-1.5 gradient-heading tracking-tight">COGNITIVE HANDSHAKE</h2>
                        <p className="text-[11px] text-slate-100 font-bold text-shadow-sm px-4">Click the targets as quickly as possible to calibrate your baseline latency.</p>

                        <div className="mt-3 flex justify-center gap-1.5">
                            {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < targetsHit ? 'bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.8)]' : 'bg-white/10'}`} />
                            ))}
                        </div>
                        
                        <div className="w-full flex-1 relative mt-6 border border-slate-800 rounded-2xl bg-black/40 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] min-h-[180px]">
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ type: "spring", duration: 0.3 }}
                                onClick={handleTargetClick}
                                className="absolute flex items-center justify-center w-12 h-12 bg-ohs-orange hover:bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(249,168,37,0.6)] cursor-crosshair transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                            >
                                <Target size={20} className="text-ohs-navy" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
