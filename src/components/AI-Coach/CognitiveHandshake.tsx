import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Target, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';
import { HandshakeCardHeader } from '../common/HandshakeCardHeader';

interface CognitiveHandshakeProps {
    isInlinePage?: boolean;
}

export const CognitiveHandshake = ({ isInlinePage = false }: CognitiveHandshakeProps) => {
    const { cognitiveHandshakePassed, showCognitiveHandshake, setShowCognitiveHandshake, passCognitiveHandshake, failCognitiveHandshake, warnCognitiveHandshake, supervisorOverride } = useFatigueStore();
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

    const resetTest = () => {
        setTargetsHit(0);
        setReactionTimes([]);
        setGameCompleted(false);
        setShowLiabilityWarning(false);
        setLastTargetTime(Date.now());
        setTargetPos({
            x: Math.floor(Math.random() * 80) + 10,
            y: Math.floor(Math.random() * 70) + 15
        });
    };

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
        const { reactionMemory, addReactionMemory, evaluateDriverFatigue, drivingHours } = useFatigueStore.getState();
        let isFatigued = false;
        let historicalBaseline = 0;

        if (reactionMemory.length > 0) {
            const historicalBaselineValue = reactionMemory.reduce((a, b) => a + b, 0) / reactionMemory.length;
            historicalBaseline = historicalBaselineValue;
            
            isFatigued = avgReaction > (historicalBaselineValue * 1.20) || 
                         variancePercentage > 35 ||
                         avgReaction > 1000;
        } else {
            isFatigued = avgReaction > 1000; 
        }

        addReactionMemory(avgReaction);

        // Sync with Prizm Driver Shift Fatigue score
        const dropPct = Math.round(Math.min(50, Math.max(0, (variancePercentage / 2))));
        evaluateDriverFatigue(drivingHours, dropPct);

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
            setGuidance("KAIZEN BONUS: Optimal latency (<700ms) and low variance detected. Handshake cleared. Prizm Driver Fatigue Telemetry updated.");
            setTimeout(() => setShowKaizenBonus(false), 1200);
        } else if (historicalBaseline && (avgReaction >= (historicalBaseline * 1.15) || variancePercentage > 25)) {
            warnCognitiveHandshake();
            setMood('concerned');
            setGuidance(`MUDA DETECTED: Variance is ${Math.round(variancePercentage)}% from baseline. Your cognitive consistency is slipping. Consider a professional reset.`);
        } else {
            passCognitiveHandshake();
            setMood('happy');
            setGuidance("Cognitive Handshake passed! Prizm Shift & Ergonomic Latency status set to NOMINAL.");
        }

        setTimeout(() => setSpeaking(false), 3000);
    };

    // If rendered as an inline page, display full interactive page UI
    if (isInlinePage) {
        return (
            <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto space-y-6 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                        <div>
                            <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.2em] block mb-1">Cognitive Latency & Shift Telemetry</span>
                            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
                                <BrainCircuit size={36} className="text-ohs-orange shrink-0" />
                                Ergonomics Cognitive Handshake
                            </h1>
                            <p className="text-gray-300 text-sm mt-1">
                                Interactive dot-click latency test. Calibrate reaction times to pass the Mandatory Cognitive Handshake and evaluate fatigue.
                            </p>
                        </div>

                        <button
                            onClick={resetTest}
                            className="bg-ohs-orange hover:bg-yellow-400 text-ohs-navy px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg cursor-pointer"
                        >
                            RE-CALIBRATE HANDSHAKE
                        </button>
                    </div>

                    {/* Interactive Dot-Click Test Area */}
                    <div className="bg-gradient-to-br from-slate-900 via-ohs-navy to-slate-950 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Target className="text-ohs-orange" size={20} />
                                <span className="text-xs font-black uppercase text-white tracking-wider">Dot-Click Latency Calibrator</span>
                            </div>
                            <div className="flex gap-1.5">
                                {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
                                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < targetsHit ? 'bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.8)]' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-72 sm:h-80 relative border border-slate-800 rounded-2xl bg-black/60 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">
                            {!gameCompleted ? (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ type: "spring", duration: 0.3 }}
                                    onClick={handleTargetClick}
                                    className="absolute flex items-center justify-center w-14 h-14 min-h-[48px] min-w-[48px] bg-ohs-orange hover:bg-yellow-400 text-ohs-navy rounded-full shadow-[0_0_30px_rgba(249,168,37,0.8)] cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                                    style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                                >
                                    <Target size={24} className="text-ohs-navy" />
                                </motion.button>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900/90 backdrop-blur-md">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30 mb-4">
                                        <BrainCircuit size={36} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">HANDSHAKE VERIFIED & PASSED</h3>
                                    <p className="text-gray-300 text-xs mt-2 max-w-md">
                                        Cognitive latency nominal. Average Reaction Time: <strong className="text-emerald-400">{Math.round(reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length || 650)}ms</strong>. Prizm Driver Fatigue Telemetry updated to NOMINAL.
                                    </p>
                                    <button
                                        onClick={resetTest}
                                        className="mt-6 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                                    >
                                        RUN ANOTHER TEST
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-400 pt-2">
                            <span>Target Hits: <strong className="text-white">{targetsHit} / {TOTAL_TARGETS}</strong></span>
                            <span>Status: <strong className={cognitiveHandshakePassed ? 'text-emerald-400' : 'text-ohs-orange'}>{cognitiveHandshakePassed ? 'PASSED & COMPLIANT' : 'READY FOR TEST'}</strong></span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => {
                                    useFatigueStore.getState().resetToNominal();
                                    setShowLiabilityWarning(false);
                                    setGameCompleted(true);
                                }}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShieldCheck size={20} /> SUPERVISOR OVERRIDE / EMERGENCY RESET
                            </button>

                            <button
                                onClick={() => {
                                    setShowLiabilityWarning(false);
                                    setGameCompleted(true);
                                }}
                                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 rounded-2xl transition-all cursor-pointer"
                            >
                                ACKNOWLEDGE & DE-ESCALATE
                            </button>
                        </div>
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
                                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < targetsHit ? 'bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.8)]' : 'bg-white/10'}`} />
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
