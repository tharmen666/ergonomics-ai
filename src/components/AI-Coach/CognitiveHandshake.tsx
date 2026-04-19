import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Target } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useMellyStore } from '../../store/mellyStore';

export const CognitiveHandshake = () => {
    const { cognitiveHandshakePassed, showCognitiveHandshake, setShowCognitiveHandshake, passCognitiveHandshake, failCognitiveHandshake, warnCognitiveHandshake } = useFatigueStore();
    const { setGuidance, setSpeaking, setMood } = useMellyStore();

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

        // Connect to Memory Vault
        const { reactionMemory, addReactionMemory } = useFatigueStore.getState();
        let isFatigued = false;
        let historicalBaseline = 0;

        if (reactionMemory.length > 0) {
            const historicalBaselineValue = reactionMemory.reduce((a, b) => a + b, 0) / reactionMemory.length;
            historicalBaseline = historicalBaselineValue;
            // >20% Cognitive Overload detection
            isFatigued = avgReaction > (historicalBaselineValue * 1.20);
        } else {
            isFatigued = avgReaction > 800; // Seed threshold
        }

        addReactionMemory(avgReaction);

        setSpeaking(true);
        if (isFatigued) {
            failCognitiveHandshake();
            setMood('concerned');
            setGuidance("Cognitive lag detected in your handshake. I'm flagging a High-Fatigue status. Please consider a 15-minute Professional Reset.");
        } else if (historicalBaseline && avgReaction < (historicalBaseline * 1.10) && avgReaction < 700) {
            passCognitiveHandshake();
            setShowKaizenBonus(true);
            setMood('happy');
            setGuidance("KAIZEN BONUS: Handshake cleared effortlessly. Optimal latency detected. Productive Streak multiplied.");
            setTimeout(() => setShowKaizenBonus(false), 2000);
        } else if (historicalBaseline && avgReaction >= (historicalBaseline * 1.15)) {
            warnCognitiveHandshake();
            setMood('concerned');
            setGuidance("Muda lag detected. Tracking high variance from baseline. Consider an ergonomic adjustment.");
        } else {
            passCognitiveHandshake();
            setMood('happy');
            setGuidance("Cognitive Handshake passed! You're performing safely at standard work rates.");
        }

        setTimeout(() => setSpeaking(false), 6000);
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
                    className="fixed inset-0 z-[99000] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md font-sans text-white p-4"
                >
                    <div className="absolute top-12 text-center max-w-lg">
                        <BrainCircuit className="text-ohs-orange mx-auto mb-4" size={48} />
                        <h2 className="text-3xl font-black mb-2 tracking-tight">MANDATORY COGNITIVE HANDSHAKE</h2>
                        <p className="text-gray-400 font-medium">Click the targets as quickly as possible to establish your baseline. Lag &gt; 20% will trigger Digital Wingman protocols.</p>

                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < targetsHit ? 'bg-ohs-orange shadow-[0_0_10px_rgba(249,168,37,0.8)]' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="w-full max-w-4xl h-[60vh] relative mt-24 border border-white/10 rounded-3xl bg-ohs-navy/30 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ type: "spring" }}
                            onClick={handleTargetClick}
                            className="absolute flex items-center justify-center w-20 h-20 md:w-16 md:h-16 bg-ohs-orange hover:bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(249,168,37,0.6)] cursor-crosshair transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                        >
                            <Target size={28} className="text-ohs-navy" />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
