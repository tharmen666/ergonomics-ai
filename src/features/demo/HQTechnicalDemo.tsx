import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Globe, Activity, Lock, Target } from 'lucide-react';
import { speak, stopSpeaking } from '../../utils/speech';

export const HQTechnicalDemo = ({ onExit }: { onExit: () => void }) => {
    // 0: Start, 1: Liability Trigger, 2: Cognitive Handshake, 3: Global Standard, 4: Memory Vault, 5: Industrial Mode, 6: Credits, 7: End
    const [scene, setScene] = useState(0);
    const [isoToggle, setIsoToggle] = useState(false);

    useEffect(() => {
        if (scene === 0 || scene === 7) return;

        let timeoutId: ReturnType<typeof setTimeout>;
        if (scene === 1) timeoutId = setTimeout(() => setScene(2), 30000);
        else if (scene === 2) timeoutId = setTimeout(() => setScene(3), 30000);
        else if (scene === 3) timeoutId = setTimeout(() => setScene(4), 30000);
        else if (scene === 4) timeoutId = setTimeout(() => setScene(5), 25000);
        else if (scene === 5) timeoutId = setTimeout(() => setScene(6), 25000);
        else if (scene === 6) timeoutId = setTimeout(() => setScene(7), 25000);

        return () => clearTimeout(timeoutId);
    }, [scene]);

    // ISO Dashboard Toggle Animation for Scene 3
    useEffect(() => {
        if (scene === 3) {
            const temp = setInterval(() => setIsoToggle(prev => !prev), 2000);
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
        } else if (scene === 5) {
            speak("Introducing the Industrial Nodes. Manual handlings, forklift telemetry, and dynamic DOA lockouts specifically tailored for the hazards of a warehouse floor.");
        } else if (scene === 6) {
            speak("This is ErgoSafe reborn. Driven by ambition. Empowered by premier Google frameworks.");
        } else if (scene === 7 || scene === 0) {
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
                className="absolute top-2 right-2 sm:top-6 sm:right-8 z-50 bg-white/10 hover:bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold backdrop-blur-md transition-all z-[10000]"
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
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-[#0b0f19] px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-black text-base sm:text-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(249,168,37,0.5)]"
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
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="relative z-10 text-center"
                        >
                            <ShieldAlert size={100} className="mx-auto text-red-600 animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,1)] scale-75 sm:scale-100" />
                            <h2 className="text-2xl sm:text-6xl font-black mt-4 sm:mt-6 text-red-600 tracking-widest drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] leading-tight">SECTION 37 & 38</h2>
                            <h3 className="text-lg sm:text-4xl font-black mt-2 text-white tracking-widest bg-red-600/20 py-2 px-4 sm:px-8 inline-block border border-red-500/50">AT RISK</h3>
                        </motion.div>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                            className="absolute bottom-8 sm:bottom-16 bg-black/80 backdrop-blur-xl border-l-4 sm:border-l-8 border-ohs-orange p-4 sm:p-8 max-w-[90%] sm:max-w-3xl rounded-r-2xl left-0"
                        >
                            <p className="text-ohs-orange font-bold uppercase tracking-widest mb-1 sm:mb-2 text-xs sm:text-base">Proactive Stewardship</p>
                            <p className="text-sm sm:text-2xl font-medium leading-relaxed">"We don't just track posture; we shield the CEO from criminal liability by documenting proactive care in real-time."</p>
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
                        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                            {/* Handshake Simulator */}
                            <div className="flex-1 w-full bg-black/50 border border-white/10 h-64 sm:h-96 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
                                <h3 className="text-xs sm:text-xl font-bold text-gray-400 uppercase tracking-widest absolute top-4 sm:top-8 text-center px-4">30s Verification Sequence</h3>
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

                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                                    transition={{ delay: 1.5, duration: 0.4 }}
                                    className="absolute inset-0 bg-red-900/40 z-20 flex flex-col items-center justify-center"
                                >
                                    <Lock size={64} className="text-red-500 mb-2 sm:mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-75 sm:scale-100" />
                                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-widest drop-shadow-xl text-center">DOA LOCKOUT</h2>
                                    <p className="text-red-300 font-bold mt-1 sm:mt-2 text-[8px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center px-2">Sign-Off Capability Disabled</p>
                                </motion.div>
                            </div>

                            {/* Wingman Quote */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="flex-1 w-full text-center md:text-left"
                            >
                                <Target size={48} className="text-ohs-orange mb-4 sm:mb-6 mx-auto md:mx-0 scale-75 sm:scale-100" />
                                <h2 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-6">PREVENTATIVE OVERWATCH</h2>
                                <p className="text-sm sm:text-xl text-gray-400 leading-relaxed font-medium">
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
                        <Globe size={120} className="absolute text-ohs-orange/10 z-0 animate-spin-slow scale-75 sm:scale-100" style={{ animationDuration: '30s' }} />

                        <div className="z-10 text-center mb-6 sm:mb-12">
                            <h2 className="text-xs sm:text-sm font-black text-ohs-orange tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-4">Semantic Firewall Routing</h2>
                            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter">THE GLOBAL STANDARD</h1>
                        </div>

                        <div className="w-full max-w-4xl bg-[#0b0f19] border border-white/20 p-6 sm:p-12 rounded-[2.5rem] relative overflow-x-auto shadow-2xl z-10 min-h-[16rem] sm:min-h-[20rem] flex flex-col items-center justify-center">
                            <AnimatePresence mode="wait">
                                {!isoToggle ? (
                                    <motion.div key="sa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full min-w-max px-4">
                                        <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-4">South African OHS Act 85</h3>
                                        <p className="text-sm sm:text-xl text-gray-400 font-medium">Monitoring Section 37 & 38 Liabilities</p>
                                        <div className="mt-8 flex justify-center gap-2">
                                            <div className="h-2 w-16 bg-ohs-orange rounded-full" />
                                            <div className="h-2 w-16 bg-white/20 rounded-full" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="iso" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full min-w-[280px] px-4">
                                        <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-4">ISO 45001 & 45003 Protocols</h3>
                                        <p className="text-sm sm:text-xl text-gray-400 font-medium">Monitoring Global Psychosocial Risks & Safety</p>
                                        <div className="mt-8 flex justify-center gap-2">
                                            <div className="h-2 w-16 bg-white/20 rounded-full" />
                                            <div className="h-2 w-16 bg-ohs-orange rounded-full" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.div className="max-w-4xl text-center mt-6 sm:mt-12 bg-white/5 p-4 sm:p-6 rounded-2xl backdrop-blur-md border border-white/10 z-10">
                            <p className="text-sm sm:text-xl font-bold text-gray-300">"One platform, any jurisdiction. Melly cross-references local laws with global ISO standards, giving multinationals a single 'Truth Dashboard' for 50 countries."</p>
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

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center z-10 w-full max-w-6xl">
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className="text-xs sm:text-sm font-black text-ohs-orange tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-4">Predictive Wellness</h2>
                                <h1 className="text-2xl sm:text-6xl font-black tracking-tighter mb-4 sm:mb-8 leading-tight">THE PERSISTENT MEMORY VAULT</h1>
                                <p className="text-sm sm:text-2xl text-gray-400 font-medium leading-relaxed">
                                    "Melly remembers your history. She doesn't just see a worker; she sees a trend. This is the 'Awakening' of OHS—AI that knows your team's health better than they do."
                                </p>
                            </div>

                            <div className="flex-1 bg-black/60 border border-white/20 p-4 sm:p-8 rounded-3xl backdrop-blur-xl relative h-64 sm:h-96 w-full flex flex-col justify-end">
                                <Activity className="absolute top-4 sm:top-6 right-4 sm:right-6 text-green-500 animate-pulse scale-75 sm:scale-100" size={32} />
                                <h3 className="absolute top-4 sm:top-6 left-4 sm:left-6 text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">Vector History</h3>

                                {/* Animated Vector Graph */}
                                <div className="flex items-end justify-between gap-4 h-64 mt-12 pb-4 border-b border-white/20">
                                    {[20, 35, 45, 40, 60, 50, 85].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.3, type: 'spring' }}
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

                {/* SCENE 5: Industrial Logistics (140-165s) */}
                {scene === 5 && (
                    <motion.div
                        key="scene5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center p-12 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                        <div className="flex flex-col md:flex-row gap-8 z-10 w-full max-w-6xl items-center">
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex-1 relative"
                            >
                                <div className="absolute inset-0 translate-x-4 translate-y-4 bg-ohs-orange rounded-3xl opacity-20 filter blur-xl" />
                                <div className="bg-black/80 backdrop-blur-md border border-white/20 p-8 rounded-3xl relative h-[400px] flex flex-col justify-between">
                                    <h3 className="text-ohs-orange font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                        <Activity size={18} /> Safe Lifting Heat Map
                                    </h3>

                                    <div className="flex-1 flex items-center justify-center relative mt-4">
                                        {/* Abstract Human Figure Skeleton */}
                                        <div className="w-8 h-8 rounded-full border-4 border-green-500 absolute top-10" />
                                        <div className="w-1 h-32 bg-green-500 absolute top-18" />
                                        <div className="w-24 h-1 bg-green-500 absolute top-24 transform rotate-12" />
                                        <div className="w-20 h-1 bg-green-500 absolute top-36 transform -rotate-12" />
                                        <div className="absolute bottom-10 w-8 h-8 rounded-full blur-[10px] bg-red-600 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,1)]" />
                                    </div>

                                    <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/50 mt-4">
                                        <h4 className="text-red-500 font-bold mb-1 flex items-center gap-2"><ShieldAlert size={16} /> DOA Lockout Triggered</h4>
                                        <p className="text-white text-xs font-medium">Strain exceeding limits on L4-L5 vertebrae. Manual handling procedures violated.</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="flex-1 text-left"
                            >
                                <h1 className="text-2xl sm:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">INDUSTRIAL<br /><span className="text-ohs-orange">ERGONOMICS MODULE</span></h1>
                                <p className="text-lg text-gray-400 font-medium mb-6">Forklifts. Trolley Jacks. Manual Heavy Lifting.</p>
                                <p className="text-gray-300 mb-8 border-l-4 border-ohs-orange pl-4 bg-white/5 py-2">
                                    We have extended the intelligence to warehouses and assembly lines. Monitor physiological stress factors in high-demand zones instantly.
                                </p>
                                <div className="flex gap-4">
                                    <span className="bg-white/10 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest text-[#a2ff00] border border-[#a2ff00]/30">Dominant Foot Analysis</span>
                                    <span className="bg-white/10 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest text-blue-400 border border-blue-400/30">Forklift Telemetry</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 6: Credits Overlay (165-190s) */}
                {scene === 6 && (
                    <motion.div
                        key="scene6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden text-center"
                    >
                        <h2 className="text-ohs-orange font-black uppercase text-xl sm:text-3xl tracking-widest mb-12 flex items-center justify-center gap-3">
                            <Target size={32} /> 2026 Google Strategic Showcase
                        </h2>

                        <div className="relative w-full max-w-2xl h-64 overflow-hidden mb-12 mask-image-fade">
                            <motion.div
                                animate={{ y: ["100%", "-200%"] }}
                                transition={{ duration: 8, ease: "linear" }}
                                className="absolute w-full flex flex-col gap-6 items-center"
                            >
                                <div className="text-2xl font-bold text-gray-300">Gemini Pro (The Savior)</div>
                                <div className="text-2xl font-bold text-gray-300">Google AI Studio</div>
                                <div className="text-2xl font-bold text-gray-300">Google Cloud TTS</div>
                                <div className="text-2xl font-bold text-gray-300">GDG Discovery</div>
                                <div className="text-2xl font-bold text-gray-300">Crew AI</div>
                                <div className="text-2xl font-bold text-gray-300">Base 44</div>
                                <div className="text-2xl font-bold text-gray-300">GitHub & Replit</div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2, duration: 0.4 }}
                            className="bg-white/10 backdrop-blur-md p-8 border border-white/20 rounded-2xl max-w-4xl"
                        >
                            <p className="text-xl sm:text-3xl text-white font-black italic tracking-tight leading-relaxed">
                                "Developed by a 53-Year-Old AI Architect — Empowered by Google Skills & Premiere Tier Credits. Age is not a barrier to God-Mode Innovation."
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 7: End */}
                {scene === 7 && (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center bg-black"
                    >
                        <ShieldAlert size={80} className="text-ohs-orange mb-8" />
                        <h1 className="text-2xl sm:text-6xl font-black mb-6 tracking-tighter uppercase">System Overwatch Online</h1>
                        <p className="text-2xl text-gray-400 font-medium mb-12">v1.8 God Mode Architecture Initialized.</p>
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
