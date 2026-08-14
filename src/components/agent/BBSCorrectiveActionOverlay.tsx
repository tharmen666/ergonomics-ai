import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Truck, Eye, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { useComplianceStore } from '../../store/complianceStore';
import { useNellyStore } from '../../store/nellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { speak, stopSpeaking } from '../../utils/speech';

export interface BBSInterventionPayload {
    type: 'postural-reset' | 'driver-power-breathing' | 'ocular-cervical-glide' | string;
    duration: number;
    hazard: string;
    title: string;
    instructions: string[];
}

export const BBSCorrectiveActionOverlay = () => {
    const { language } = useNellyStore();
    const { supervisorOverride } = useFatigueStore();
    const [activeIntervention, setActiveIntervention] = useState<BBSInterventionPayload | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(15);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    useEffect(() => {
        const handleBBS = (e: Event) => {
            const detail = (e as CustomEvent<BBSInterventionPayload>).detail;
            if (detail) {
                setActiveIntervention(detail);
                setTimeLeft(detail.duration || 15);
                setIsCompleted(false);

                // Speak instruction via Nelly voice engine
                const spokenText = `CORRECTIVE ACTION TRIGGERED for ${detail.hazard}. ${detail.title}. Please follow instructions for ${detail.duration} seconds.`;
                speak(spokenText, language);
            }
        };

        window.addEventListener('TRIGGER_BBS_INTERVENTION', handleBBS);
        return () => window.removeEventListener('TRIGGER_BBS_INTERVENTION', handleBBS);
    }, [language]);

    // Timer countdown
    useEffect(() => {
        if (!activeIntervention || isCompleted || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeIntervention, isCompleted, timeLeft]);

    const handleVerifyCompletion = () => {
        if (!activeIntervention) return;

        setIsCompleted(true);
        stopSpeaking();

        // Log verified BBS intervention to compliance store
        useComplianceStore.getState().logVerifiedBBSIntervention(
            activeIntervention.title,
            activeIntervention.hazard,
            activeIntervention.duration
        );

        // Feedback speech
        const confirmText = `Verified BBS Micro-Intervention logged for ${activeIntervention.hazard}. Your ergonomic compliance rating has been restored.`;
        speak(confirmText, language);

        setTimeout(() => {
            setActiveIntervention(null);
            setIsCompleted(false);
        }, 2000);
    };

    if (!activeIntervention) return null;

    const getIcon = () => {
        if (activeIntervention.type.includes('driver')) return Truck;
        if (activeIntervention.type.includes('ocular')) return Eye;
        return Activity;
    };

    const IconComp = getIcon();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 font-sans text-white overflow-x-hidden overflow-y-auto"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-[95vw] max-w-lg bg-slate-900 border-2 border-ohs-orange rounded-2xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-[0_0_100px_rgba(249,168,37,0.3)] relative overflow-hidden max-h-[90vh] max-h-[90dvh] overflow-y-auto z-50"
                >
                    <button
                        onClick={() => {
                            stopSpeaking();
                            setActiveIntervention(null);
                        }}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-ohs-orange/20 border border-ohs-orange/40 text-ohs-orange">
                            <IconComp size={28} />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-ohs-orange uppercase tracking-widest block">
                                Corrective Action & Micro-Training
                            </span>
                            <h2 className="text-xl font-black text-white leading-tight">
                                {activeIntervention.title}
                            </h2>
                        </div>
                    </div>

                    {/* Hazard Callout */}
                    <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">Hazard Target:</span>
                        <span className="text-xs font-bold text-white truncate max-w-[220px]">
                            {activeIntervention.hazard}
                        </span>
                    </div>

                    {/* Interactive Instructions */}
                    <div className="space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                            BBS Reset Protocol:
                        </span>
                        {activeIntervention.instructions.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200 font-medium">
                                <span className="w-5 h-5 rounded-full bg-ohs-orange/20 text-ohs-orange font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>

                    {/* Countdown Progress */}
                    <div className="flex items-center justify-between bg-black/60 border border-white/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <RefreshCw size={20} className={`text-ohs-orange ${timeLeft > 0 ? 'animate-spin' : ''}`} />
                            <div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase block">Remaining Reset Time</span>
                                <span className="text-lg font-mono font-black text-white">{timeLeft}s</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-ohs-orange uppercase bg-ohs-orange/10 border border-ohs-orange/30 px-3 py-1 rounded-full">
                            {timeLeft > 0 ? 'ACTIVE INTERVENTION' : 'RESET READY'}
                        </span>
                    </div>

                    {/* Completion & Override Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleVerifyCompletion}
                            className={`w-full py-4 rounded-2xl font-black text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                                isCompleted 
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                                    : 'bg-ohs-orange hover:bg-yellow-400 text-ohs-navy shadow-ohs-orange/30'
                            }`}
                        >
                            {isCompleted ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                            {isCompleted ? 'VERIFIED & LOGGED IN OHS LEDGER' : 'COMPLETE & VERIFY INTERVENTION'}
                        </button>
                        <button
                            onClick={() => {
                                stopSpeaking();
                                supervisorOverride();
                                setActiveIntervention(null);
                            }}
                            className="w-full py-3 rounded-2xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                            ⚡ SUPERVISOR OVERRIDE / EMERGENCY RESET
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
