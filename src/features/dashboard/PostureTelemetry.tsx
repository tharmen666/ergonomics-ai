import { useState, useEffect } from 'react';
import { Camera, CameraOff, ShieldAlert, Activity, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../utils/telemetry';

export const PostureTelemetry = () => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [postureState, setPostureState] = useState<'optimal' | 'warning' | 'danger'>('optimal');
    const [flexAngle, setFlexAngle] = useState(12); // degrees
    const [trapLoad, setTrapLoad] = useState(4.2); // kg
    const [activeIntervention, setActiveIntervention] = useState<'eye-reset' | 'micro-stretch' | 'active-recovery' | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // Dynamic angles and loads based on posture state
    useEffect(() => {
        if (postureState === 'optimal') {
            setFlexAngle(12);
            setTrapLoad(4.2);
        } else if (postureState === 'warning') {
            setFlexAngle(32);
            setTrapLoad(12.8);
        } else {
            setFlexAngle(58);
            setTrapLoad(24.5);
        }
    }, [postureState]);

    // Timer logic for interventions
    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }
        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const triggerIntervention = (tier: 'eye-reset' | 'micro-stretch' | 'active-recovery') => {
        trackEvent('INTERVENTION_TRIGGERED', { tier });
        setActiveIntervention(tier);
        if (tier === 'eye-reset') setTimeLeft(30);
        else if (tier === 'micro-stretch') setTimeLeft(120);
        else setTimeLeft(300);
    };

    const triggerNeckPainCircuit = () => {
        trackEvent('NECK_PAIN_REPORTED', { severity: 'cervical' });
        // Auto trigger micro-stretch (Tier 2) immediately for cervical relief
        triggerIntervention('micro-stretch');
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ohs-orange/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ohs-orange/20 rounded-xl text-ohs-orange">
                        <Activity className="animate-pulse" size={22} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">MediaPipe 3D Posture Telemetry</h3>
                        <p className="text-[10px] text-gray-400">Client-Side Edge-AI Skeletal Mapping</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        isCameraActive
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-ohs-orange hover:bg-yellow-400 text-ohs-navy shadow-lg shadow-ohs-orange/20'
                    }`}
                >
                    {isCameraActive ? (
                        <>
                            <CameraOff size={14} /> Disable Camera
                        </>
                    ) : (
                        <>
                            <Camera size={14} /> Enable Camera
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 3D Skeletal Feed Area */}
                <div className="lg:col-span-7 aspect-video bg-black/80 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                    {isCameraActive ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Simulated webcam stream background */}
                            <div className="absolute inset-0 bg-[#111] opacity-35" />
                            {/* Green Skeletal Overlay lines */}
                            <svg className="absolute inset-0 w-full h-full text-emerald-500" viewBox="0 0 100 100" fill="none">
                                {/* Joints */}
                                <circle cx="50" cy="20" r="2.5" fill="currentColor" className="animate-pulse" /> {/* Head */}
                                <circle cx="50" cy="26" r="1.5" fill="currentColor" /> {/* Cervical C1 */}
                                <circle cx="50" cy="38" r="1.5" fill="currentColor" /> {/* Spine Thoracic */}
                                <circle cx="38" cy="28" r="2" fill="currentColor" /> {/* Left Shoulder */}
                                <circle cx="62" cy="28" r="2" fill="currentColor" /> {/* Right Shoulder */}
                                
                                {/* Bones/Connections */}
                                <line x1="50" y1="20" x2="50" y2="38" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="38" y1="28" x2="62" y2="28" stroke="currentColor" strokeWidth="1.5" />
                                
                                {/* Dynamic cervical deflection line based on posture */}
                                <path
                                    d={postureState === 'optimal' 
                                        ? "M 50 20 Q 50 23 50 26" 
                                        : postureState === 'warning'
                                        ? "M 50 20 Q 53 23 50 26"
                                        : "M 50 20 Q 56 23 50 26"
                                    }
                                    stroke={postureState === 'danger' ? '#ef4444' : postureState === 'warning' ? '#f59e0b' : '#10b981'}
                                    strokeWidth="2.5"
                                    fill="none"
                                />

                                {/* Trapezius Load Vector */}
                                <path
                                    d="M 38 28 L 50 26 L 62 28"
                                    stroke={postureState === 'danger' ? '#ef4444' : postureState === 'warning' ? '#f59e0b' : '#10b981'}
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="1 1"
                                />
                            </svg>
                            
                            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-emerald-400 border border-emerald-500/20 tracking-wider">
                                live skeletal wireframe active
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-8 space-y-3">
                            <Camera size={36} className="text-gray-600 mx-auto" />
                            <p className="text-xs text-gray-400 font-medium">Webcam mapping is off. Turn on camera to initialize real-time edge posture telemetry.</p>
                        </div>
                    )}
                </div>

                {/* Telemetry Metrics & Intervention Trigger controls */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Cervical Flex</span>
                                <h4 className={`text-2xl font-black mt-1 ${
                                    postureState === 'danger' ? 'text-red-500' : postureState === 'warning' ? 'text-yellow-500' : 'text-emerald-500'
                                }`}>{flexAngle}°</h4>
                                <span className="text-[9px] text-gray-400 font-medium">Deg. from vertical axis</span>
                            </div>

                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Trapezius Load</span>
                                <h4 className={`text-2xl font-black mt-1 ${
                                    postureState === 'danger' ? 'text-red-500' : postureState === 'warning' ? 'text-yellow-500' : 'text-emerald-500'
                                }`}>{trapLoad} kg</h4>
                                <span className="text-[9px] text-gray-400 font-medium">Equivalent force</span>
                            </div>
                        </div>

                        {/* Telemetry Simulation Controllers */}
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                            <span className="text-[10px] font-black text-ohs-orange uppercase tracking-wider block">Calibrate Telemetry State</span>
                            <div className="flex gap-2">
                                {(['optimal', 'warning', 'danger'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setPostureState(s)}
                                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                            postureState === s
                                                ? s === 'danger' ? 'bg-red-500 border-red-500 text-white' 
                                                  : s === 'warning' ? 'bg-yellow-500 border-yellow-500 text-ohs-navy'
                                                  : 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'bg-black/40 border-white/15 text-gray-400 hover:bg-white/5'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orthopedic pain triggers */}
                        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={16} className="text-red-500" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Workspace Diagnostic</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-normal">
                                If you are experiencing stiffness or neck fatigue, report to activate the orthopedic relief circuit.
                            </p>
                            <button
                                onClick={triggerNeckPainCircuit}
                                className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 hover:border-red-500/60 text-red-200 font-black py-2 rounded-xl uppercase tracking-widest text-[9px] transition-all"
                            >
                                Report Active Neck Pain
                            </button>
                        </div>
                    </div>

                    {/* Zero-Bypass Interventions Triggers */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Micro-Break Interventions</span>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => triggerIntervention('eye-reset')}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all text-center"
                            >
                                30s Eye Reset
                            </button>
                            <button
                                onClick={() => triggerIntervention('micro-stretch')}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all text-center"
                            >
                                2m Stretch
                            </button>
                            <button
                                onClick={() => triggerIntervention('active-recovery')}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all text-center"
                            >
                                5m Recovery
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zero-Bypass Intervention Full-Screen Overlay */}
            <AnimatePresence>
                {activeIntervention && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center font-sans"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="max-w-xl bg-ohs-navy/80 border border-ohs-orange/30 p-10 rounded-[3rem] shadow-[0_0_50px_rgba(249,168,37,0.15)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-black">
                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: activeIntervention === 'eye-reset' ? 30 : activeIntervention === 'micro-stretch' ? 120 : 300, ease: 'linear' }}
                                    className="h-full bg-ohs-orange"
                                />
                            </div>

                            <Timer size={64} className="text-ohs-orange mx-auto mb-6 animate-pulse" />
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">
                                {activeIntervention === 'eye-reset' ? 'Tier 1: Eye Reset Break' :
                                 activeIntervention === 'micro-stretch' ? 'Tier 2: Orthopedic Micro-Stretch' :
                                 'Tier 3: Active Posture Recovery'}
                            </h2>
                            <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.2em] block mb-6">
                                Zero-Bypass OHS Mandated Intervention
                            </span>

                            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl mb-8">
                                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                                    {activeIntervention === 'eye-reset' ? 'Focus on an object 20 feet away for 20 seconds. Relax the ciliary muscles of the eyes.' :
                                     activeIntervention === 'micro-stretch' ? 'Stand up, roll your shoulders backward, and tilt your head laterally left-to-right to relieve C1-C7 cervical load.' :
                                     'Stand up completely, step away from the display screen, walk for 5 minutes, and take deep diaphragmatic breaths.'}
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="text-3xl font-mono font-black text-white">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </div>

                                <button
                                    onClick={() => {
                                        if (timeLeft <= 0) {
                                            setActiveIntervention(null);
                                        } else {
                                            alert("This is a Zero-Bypass safety stretch. Please complete the countdown.");
                                        }
                                    }}
                                    disabled={timeLeft > 0}
                                    className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        timeLeft <= 0
                                            ? 'bg-ohs-orange hover:bg-yellow-400 text-ohs-navy shadow-lg shadow-ohs-orange/20 cursor-pointer'
                                            : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {timeLeft > 0 ? 'Stretch in Progress...' : 'Complete Break'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
