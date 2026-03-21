import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Globe, Activity, Lock, Target } from 'lucide-react';
import { speak, stopSpeaking } from '../../utils/speech';

export const TechnicalDemo = ({ onExit }: { onExit: () => void }) => {
    // 0: Start, 1: Liability Trigger, 2: Cognitive Handshake, 3: Global Standard, 4: Memory Vault, 5: End
    const [scene, setScene] = useState(0);
    const [isoToggle, setIsoToggle] = useState(false);

    useEffect(() => {
        if (scene === 0 || scene === 5) return;

        let timeoutId: ReturnType<typeof setTimeout>;
        if (scene === 1) timeoutId = setTimeout(() => setScene(2), 40000);
        else if (scene === 2) timeoutId = setTimeout(() => setScene(3), 40000);
        else if (scene === 3) timeoutId = setTimeout(() => setScene(4), 40000);
        else if (scene === 4) timeoutId = setTimeout(() => setScene(5), 30000);

        return () => clearTimeout(timeoutId);
    }, [scene]);

    // ISO Dashboard Toggle Animation for Scene 3
    useEffect(() => {
        if (scene === 3) {
            const temp = setInterval(() => setIsoToggle(prev => !prev), 4000);
            return () => clearInterval(temp);
        }
    }, [scene]);

    useEffect(() => {
        if (scene === 1) {
            speak("We don't just track posture; we shield the CEO from criminal liability by documenting proactive care in real-time.");
        } else if (scene === 2) {
            speak("Our 10-PhD Melly detects cognitive fatigue before an error happens. If you aren't fit for duty, the system locks the 'Sign-Off' button. We stop the accident before it occurs.");
        } else if (scene === 3) {
            speak("One platform, any jurisdiction. Melly cross-references local laws with global ISO standards, giving multinationals a single 'Truth Dashboard' for fifty countries.");
        } else if (scene === 4) {
            speak("Melly remembers your history. She doesn't just see a worker; she sees a trend. This is the 'Awakening' of OHS, A.I. that knows your team's health better than they do.");
        } else if (scene === 5 || scene === 0) {
            stopSpeaking();
        }
    }, [scene]);

    return (
        <div className="fixed inset-0 bg-black text-white z-[9999] overflow-hidden flex flex-col font-sans">
            <div className="absolute top-6 left-8 z-50 pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black tracking-tighter"
                >
                    ERGOSAFE REBORN: <span className="text-ohs-orange">GOD MODE v1.3</span>
                </motion.h1>
            </div>

            <button
                onClick={onExit}
                className="absolute top-6 right-8 z-50 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-md transition-all z-[10000]"
            >
                EXIT DEMO
            </button>

            <AnimatePresence mode="wait">
                {scene === 0 && (
                    <motion.div
                        key="start"
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center bg-[#0b0f19]"
                    >
                        <button
                            onClick={() => setScene(1)}
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-[#0b0f19] px-10 py-5 rounded-2xl font-black text-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(249,168,37,0.5)]"
                        >
                            INITIATE MASTER PIPELINE (150s)
                        </button>
                    </motion.div>
                )}

                {/* SCENE 1: The Liability Trigger (0-40s) */}
                {scene === 1 && (
                    <motion.div
                        key="scene1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 relative bg-black flex flex-col items-center justify-center p-8"
                    >
                        <div className="absolute inset-0 z-0 opacity-40">
                            <img src="/assets/high_risk_worker.png" className="w-full h-full object-cover grayscale" alt="Worker" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                        </div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="relative z-10 text-center"
                        >
                            <ShieldAlert size={100} className="mx-auto text-red-600 animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,1)]" />
                            <h2 className="text-7xl font-black mt-6 text-red-600 tracking-widest drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">SECTION 37 & 38</h2>
                            <h3 className="text-5xl font-black mt-2 text-white tracking-widest bg-red-600/20 py-2 px-8 inline-block border border-red-500/50">AT RISK</h3>
                        </motion.div>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="absolute bottom-16 bg-black/80 backdrop-blur-xl border-l-8 border-ohs-orange p-8 max-w-3xl rounded-r-2xl"
                        >
                            <p className="text-ohs-orange font-bold uppercase tracking-widest mb-2">Proactive Stewardship</p>
                            <p className="text-2xl font-medium leading-relaxed">"We don't just track posture; we shield the CEO from criminal liability by documenting proactive care in real-time."</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 2: The Cognitive Handshake (40-80s) */}
                {scene === 2 && (
                    <motion.div
                        key="scene2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 relative bg-[#0b0f19] flex items-center justify-center p-12 overflow-hidden"
                    >
                        <div className="w-full max-w-5xl flex gap-12 items-center">
                            {/* Handshake Simulator */}
                            <div className="flex-1 bg-black/50 border border-white/10 h-96 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-8">
                                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest absolute top-8">30s Verification Sequence</h3>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-16 h-16 bg-ohs-orange rounded-full absolute"
                                    style={{ top: '40%', left: '30%' }}
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="w-16 h-16 bg-ohs-orange rounded-full absolute"
                                    style={{ top: '60%', left: '70%' }}
                                />

                                {/* Lockout Overlay triggers at 5s */}
                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                                    transition={{ delay: 4, duration: 1 }}
                                    className="absolute inset-0 bg-red-900/40 z-20 flex flex-col items-center justify-center"
                                >
                                    <Lock size={64} className="text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                                    <h2 className="text-5xl font-black text-white tracking-widest drop-shadow-xl">DOA LOCKOUT</h2>
                                    <p className="text-red-300 font-bold mt-2 uppercase tracking-widest tracking-[0.3em]">Sign-Off Capability Disabled</p>
                                </motion.div>
                            </div>

                            {/* Wingman Quote */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex-1"
                            >
                                <Target size={48} className="text-ohs-orange mb-6" />
                                <h2 className="text-4xl font-black mb-6">PREVENTATIVE OVERWATCH</h2>
                                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                                    "Our 10-PhD Melly detects cognitive fatigue before an error happens. If you aren't fit for duty, the system locks the 'Sign-Off' button. We stop the accident before it occurs."
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 3: The Global Standard (80-120s) */}
                {scene === 3 && (
                    <motion.div
                        key="scene3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 bg-black flex flex-col items-center justify-center p-12 relative"
                    >
                        <Globe size={120} className="absolute text-ohs-orange/10 z-0 animate-spin-slow" style={{ animationDuration: '30s' }} />

                        <div className="z-10 text-center mb-12">
                            <h2 className="text-sm font-black text-ohs-orange tracking-[0.4em] uppercase mb-4">Semantic Firewall Routing</h2>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">THE GLOBAL STANDARD</h1>
                        </div>

                        <div className="w-full max-w-4xl bg-[#0b0f19] border border-white/20 p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl z-10 h-80 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {!isoToggle ? (
                                    <motion.div key="sa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full">
                                        <h3 className="text-3xl font-black text-white mb-4">South African OHS Act 85</h3>
                                        <p className="text-xl text-gray-400 font-medium">Monitoring Section 37 & 38 Liabilities</p>
                                        <div className="mt-8 flex justify-center gap-2">
                                            <div className="h-2 w-16 bg-ohs-orange rounded-full" />
                                            <div className="h-2 w-16 bg-white/20 rounded-full" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="iso" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full">
                                        <h3 className="text-3xl font-black text-white mb-4">ISO 45001 & 45003 Protocols</h3>
                                        <p className="text-xl text-gray-400 font-medium">Monitoring Global Psychosocial Risks & Safety</p>
                                        <div className="mt-8 flex justify-center gap-2">
                                            <div className="h-2 w-16 bg-white/20 rounded-full" />
                                            <div className="h-2 w-16 bg-ohs-orange rounded-full" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.div className="max-w-4xl text-center mt-12 bg-white/5 p-6 rounded-2xl backdrop-blur-md border border-white/10 z-10">
                            <p className="text-xl font-bold text-gray-300">"One platform, any jurisdiction. Melly cross-references local laws with global ISO standards, giving multinationals a single 'Truth Dashboard' for 50 countries."</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 4: The Memory Vault (120-150s) */}
                {scene === 4 && (
                    <motion.div
                        key="scene4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 bg-[#0b0f19] flex items-center justify-center p-12 relative"
                    >
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:40px_40px]" />

                        <div className="flex flex-col lg:flex-row gap-16 items-center z-10 w-full max-w-6xl">
                            <div className="flex-1">
                                <h2 className="text-sm font-black text-ohs-orange tracking-[0.4em] uppercase mb-4">Predictive Wellness</h2>
                                <h1 className="text-5xl font-black tracking-tighter mb-8 leading-tight">THE PERSISTENT MEMORY VAULT</h1>
                                <p className="text-2xl text-gray-400 font-medium leading-relaxed">
                                    "Melly remembers your history. She doesn't just see a worker; she sees a trend. This is the 'Awakening' of OHS—AI that knows your team's health better than they do."
                                </p>
                            </div>

                            <div className="flex-1 bg-black/60 border border-white/20 p-8 rounded-3xl backdrop-blur-xl relative h-96 w-full flex flex-col justify-end">
                                <Activity className="absolute top-6 right-6 text-green-500 animate-pulse" size={32} />
                                <h3 className="absolute top-6 left-6 text-gray-400 font-bold uppercase tracking-widest text-sm">Vector History</h3>

                                {/* Animated Vector Graph */}
                                <div className="flex items-end justify-between gap-4 h-64 mt-12 pb-4 border-b border-white/20">
                                    {[20, 35, 45, 40, 60, 50, 85].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: i * 0.2, duration: 1, type: 'spring' }}
                                            className={`w-full rounded-t-lg ${height > 80 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-ohs-orange'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-xs font-bold text-gray-500">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span className="text-red-500">Today</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 5: End */}
                {scene === 5 && (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center bg-black"
                    >
                        <ShieldAlert size={80} className="text-ohs-orange mb-8" />
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">SYSTEM OVERWATCH ONLINE</h1>
                        <p className="text-2xl text-gray-400 font-medium mb-12">v1.3 God Mode Architecture Initialized.</p>
                        <button
                            onClick={onExit}
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-black px-12 py-5 rounded-xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(249,168,37,0.3)]"
                        >
                            RETURN TO HUB
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
