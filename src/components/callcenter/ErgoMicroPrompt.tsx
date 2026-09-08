import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, ShieldCheck, Volume2, Sparkles, X, Activity, User, Monitor, Play, Pause } from 'lucide-react';
import { getOredaxUser, oredaxPilotConfig } from '../../data/tenantOredax';
import { speak } from '../../utils/speech';
import { useComplianceStore } from '../../store/complianceStore';

interface ErgoMicroPromptProps {
    currentUser?: string;
}

const STRETCH_STEPS = [
    {
        id: 1,
        title: "Cervical Neck Retraction & Chin Tuck",
        duration: "20s",
        target: "Headset Strain & Cervical Extension",
        instructions: "Sit upright. Gently tuck your chin straight back toward your throat like making a double chin. Hold 5s, repeat 4 times.",
        icon: "🧘‍♀️",
    },
    {
        id: 2,
        title: "Thoracic Extension & Wrist Flexor Glide",
        duration: "20s",
        target: "Keyboard Carpal Compression & Slouching",
        instructions: "Interlace fingers behind lower back, pull shoulders down and back, extend wrists gently forward for 10s per side.",
        icon: "👐",
    },
    {
        id: 3,
        title: "Ocular 20-20-20 & Diaphragmatic Rest",
        duration: "20s",
        target: "Monitor Eye Strain & Call Stress",
        instructions: "Look 20 feet (6 meters) away for 20 seconds. Take 2 deep diaphragmatic breaths through your nose.",
        icon: "👁️",
    }
];

export const ErgoMicroPrompt = ({ currentUser = 'ODX-AGT-01' }: ErgoMicroPromptProps) => {
    const user = getOredaxUser(currentUser);
    const settings = oredaxPilotConfig.workstationSettings;
    const logVerifiedBBSIntervention = useComplianceStore((state) => state.logVerifiedBBSIntervention);

    const [isOpen, setIsOpen] = useState(false);
    const [secondsToNextBreak, setSecondsToNextBreak] = useState(settings.screenBreakIntervalMinutes * 60);
    const [stretchSecondsLeft, setStretchSecondsLeft] = useState(settings.microStretchDurationSeconds);
    const [isPaused, setIsPaused] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Periodic Interval Timer (counts down to next micro-break)
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSecondsToNextBreak((prev) => {
                if (prev <= 1) {
                    handleTriggerBreak();
                    return settings.screenBreakIntervalMinutes * 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [settings.screenBreakIntervalMinutes]);

    // Active 60-Second Stretch Modal Countdown Timer
    useEffect(() => {
        if (isOpen && !isPaused && stretchSecondsLeft > 0) {
            countdownRef.current = setInterval(() => {
                setStretchSecondsLeft((prev) => {
                    if (prev <= 1) {
                        handleCompleteBreak();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (countdownRef.current) clearInterval(countdownRef.current);
        }

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [isOpen, isPaused, stretchSecondsLeft]);

    // Update active stretch step based on remaining seconds
    useEffect(() => {
        if (stretchSecondsLeft > 40) {
            setActiveStepIndex(0);
        } else if (stretchSecondsLeft > 20) {
            setActiveStepIndex(1);
        } else if (stretchSecondsLeft > 0) {
            setActiveStepIndex(2);
        }
    }, [stretchSecondsLeft]);

    const handleTriggerBreak = () => {
        setStretchSecondsLeft(settings.microStretchDurationSeconds);
        setIsPaused(false);
        setIsCompleted(false);
        setActiveStepIndex(0);
        setIsOpen(true);

        // Vocal alert via Nelly
        speak(
            `Oredax Call-Centre Micro-Break Alert: 60-second ergonomics stretch sequence initiated for ${user.label} at ${user.station}. Please pause call logging for 60 seconds.`,
            'en-ZA'
        );
    };

    const handleCompleteBreak = () => {
        setIsCompleted(true);
        setIsPaused(true);
        setCompletedCount((prev) => prev + 1);

        // Log verified intervention into compliance ledger
        logVerifiedBBSIntervention(
            'Oredax Call-Centre Micro-Break',
            `${user.station} (${user.label}) completed 60s ergonomic postural stretch protocol`,
            settings.microStretchDurationSeconds
        );

        speak(
            `Micro-break verified for station ${user.station}. Postural compliance recorded for Oredax audit ledger.`,
            'en-ZA'
        );

        // Auto close after 2.5 seconds
        setTimeout(() => {
            setIsOpen(false);
            setSecondsToNextBreak(settings.screenBreakIntervalMinutes * 60);
        }, 2500);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {/* Unobtrusive Floating Call-Centre Micro-Break Sentinel Badge */}
            <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-ohs-navy/90 backdrop-blur-md border border-ohs-orange/30 shadow-2xl px-3 py-2 rounded-2xl text-xs text-white">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 font-bold text-gray-200">
                            <ShieldCheck size={13} className="text-ohs-orange" />
                            <span>{oredaxPilotConfig.companyName}</span>
                            <span className="text-[10px] text-gray-400">({user.station})</span>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                            <span>Next Micro-Break:</span>
                            <span className="font-mono text-ohs-orange font-bold">{formatTime(secondsToNextBreak)}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleTriggerBreak}
                    className="ml-2 bg-ohs-orange/20 hover:bg-ohs-orange/30 text-ohs-orange border border-ohs-orange/40 font-bold px-2.5 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                    title="Manual trigger for demo verification"
                >
                    <Sparkles size={12} />
                    <span>60s Break</span>
                </button>
            </div>

            {/* 60-Second Call-Centre Ergonomic Stretch Prompt Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-xl bg-ohs-navy/95 border-2 border-ohs-orange/50 rounded-3xl p-6 shadow-[0_0_60px_rgba(249,168,37,0.25)] text-white relative overflow-hidden"
                        >
                            {/* Glowing Header Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ohs-orange via-yellow-400 to-emerald-400" />

                            {/* Top Header Row */}
                            <div className="flex items-start justify-between gap-4 mb-5 border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-ohs-orange/15 rounded-2xl border border-ohs-orange/30 text-ohs-orange">
                                        <Timer size={26} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-ohs-orange/20 text-ohs-orange border border-ohs-orange/30">
                                                {oredaxPilotConfig.companyName} Pilot
                                            </span>
                                            <span className="text-xs text-gray-400">60-Sec Call-Centre Reset</span>
                                        </div>
                                        <h2 className="text-lg font-black text-white tracking-wide mt-0.5">
                                            Ergonomic Micro-Break Stretch Prompt
                                        </h2>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User & Station Telemetry Strip */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Operator</span>
                                    <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                                        <User size={12} className="text-ohs-orange" />
                                        {user.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Station ID</span>
                                    <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                                        <Monitor size={12} />
                                        {user.station}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Industry</span>
                                    <span className="font-medium text-gray-300 truncate block mt-0.5">
                                        Call Centre
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Ambient Limit</span>
                                    <span className="font-mono font-bold text-yellow-400 flex items-center gap-1 mt-0.5">
                                        <Volume2 size={12} />
                                        {settings.ambientNoiseWarningDba} dBA
                                    </span>
                                </div>
                            </div>

                            {/* Active Stretch Progress / Completed State */}
                            {isCompleted ? (
                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400"
                                    >
                                        <CheckCircle size={36} />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white">Micro-Break Verified!</h3>
                                    <p className="text-xs text-gray-300 max-w-md">
                                        Postural decompression recorded for <span className="text-emerald-400 font-semibold">{user.label}</span> on the Oredax pilot ledger. Total completed resets today: <span className="font-bold text-ohs-orange">{completedCount}</span>.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Big Countdown Clock */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-ohs-orange/30">
                                        <div>
                                            <span className="text-xs text-gray-400 font-medium block">60-Second Stretch Timer</span>
                                            <span className="text-xs text-ohs-orange font-semibold">
                                                Step {activeStepIndex + 1} of 3: {STRETCH_STEPS[activeStepIndex].title}
                                            </span>
                                        </div>
                                        <div className="text-3xl font-mono font-black text-ohs-orange tracking-widest bg-ohs-orange/10 px-4 py-1.5 rounded-xl border border-ohs-orange/40">
                                            {stretchSecondsLeft}s
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-ohs-orange to-emerald-400"
                                            initial={{ width: "100%" }}
                                            animate={{ width: `${(stretchSecondsLeft / settings.microStretchDurationSeconds) * 100}%` }}
                                            transition={{ ease: "linear", duration: 1 }}
                                        />
                                    </div>

                                    {/* Interactive Exercise Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {STRETCH_STEPS.map((step, idx) => {
                                            const isActive = idx === activeStepIndex;
                                            return (
                                                <div
                                                    key={step.id}
                                                    className={`p-3 rounded-2xl border transition-all text-xs ${
                                                        isActive
                                                            ? 'bg-ohs-orange/15 border-ohs-orange text-white shadow-lg ring-1 ring-ohs-orange/50'
                                                            : 'bg-white/5 border-white/10 text-gray-400 opacity-70'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-lg">{step.icon}</span>
                                                        <span className="font-mono text-[10px] font-bold text-ohs-orange">{step.duration}</span>
                                                    </div>
                                                    <h4 className="font-bold text-[11px] mb-1 line-clamp-1">{step.title}</h4>
                                                    <p className="text-[10px] leading-tight text-gray-300">{step.instructions}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center justify-between gap-3 pt-3">
                                        <button
                                            onClick={() => setIsPaused(!isPaused)}
                                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                                        >
                                            {isPaused ? <Play size={14} /> : <Pause size={14} />}
                                            <span>{isPaused ? 'Resume Timer' : 'Pause'}</span>
                                        </button>

                                        <button
                                            onClick={handleCompleteBreak}
                                            className="flex-1 bg-gradient-to-r from-ohs-orange to-yellow-400 hover:from-yellow-400 hover:to-ohs-orange text-ohs-navy font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <CheckCircle size={16} />
                                            <span>Complete & Log Micro-Break</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Footer Legal Subtext */}
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                                <span>OHS Act 85 Compliance Engine</span>
                                <span className="flex items-center gap-1">
                                    <Activity size={10} className="text-emerald-400" />
                                    Acoustic & Ergonomic Telemetry Active
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
