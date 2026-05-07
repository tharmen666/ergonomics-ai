import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak, stopSpeaking } from '../../utils/speech';
import { MellyAvatar } from '../../components/melly/MellyAvatar';
import { LeanPerformanceRail } from '../../components/AI-Coach/LeanPerformanceRail';
import {
    ShieldAlert,
    Activity,
    Lock,
    Target,
    Users,
    CheckCircle,
    TrendingUp,
    Presentation
} from 'lucide-react';

export const HQTechnicalDemo = ({ onExit }: { onExit: () => void }) => {
    // 0: Start, 1: Liability, 2: Handshake, 3: Stewardship Hub, 4: HR & LPS, 5: Training, 6: Industrial, 7: Credits, 8: End
    const [scene, setScene] = useState(0);

    const SCENE_DURATION = 14000;

    useEffect(() => {
        if (scene === 0 || scene === 8) return;

        const timeoutId = setTimeout(() => {
            setScene(prev => prev + 1);
        }, SCENE_DURATION);

        return () => clearTimeout(timeoutId);
    }, [scene]);


    // Synchronized Audio Narrative (sceneStart + 500ms)
    useEffect(() => {
        if (scene === 0 || scene === 8) {
            stopSpeaking();
            return;
        }

        const audioTimeout = setTimeout(() => {
            if (scene === 1) {
                speak("We don't just track posture; we shield the CEO from criminal liability by documenting proactive care in real-time.");
            } else if (scene === 2) {
                speak("Our 10-PhD Melly detects cognitive fatigue before an error happens. If you aren't fit for duty, the system locks the 'Sign-Off' button. We stop the accident before it occurs.");
            } else if (scene === 3) {
                speak("Welcome to the Stewardship Hub. We automate duty of care by cascading OHS accountability from the boardroom to the floor. Total transparency for every executive.");
            } else if (scene === 4) {
                speak("HR and Loss Prevention integration. Melly analyzes fatigue patterns over seven days, identifying risks before they become a worker's compensation claim.");
            } else if (scene === 5) {
                speak("Interactive Compliance Training. Our Iris and Friends modules deliver protocol in a way that resonates. 80 percent higher retention than traditional methods.");
            } else if (scene === 6) {
                speak("Industrial Logistics module. Forklift telemetry, safe-lifting heat maps, and dynamic DOA lockouts for high-hazard warehouse environments.");
            } else if (scene === 7) {
                speak("This is ErgoSafe reborn. v2.0 is the definitive standard for industrial safety. Driven by ambition. Empowered by premier Google frameworks.");
            }
        }, 500);

        return () => clearTimeout(audioTimeout);
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

            <AnimatePresence>
                {scene === 0 && (
                    <motion.div
                        key="start"
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-[#0b0f19]"
                    >
                        <button
                            onClick={() => setScene(1)}
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-[#0b0f19] px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-black text-base sm:text-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(249,168,37,0.5)]"
                        >
                            INITIATE FEATURE SHOWCASE (120s)
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
                        className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8"
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
                        className="absolute inset-0 bg-[#0b0f19] flex items-center justify-center p-12 overflow-hidden"
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

                {/* SCENE 3: Stewardship Hub (NEW) */}
                {scene === 3 && (
                    <motion.div
                        key="scene3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-ohs-navy flex items-center justify-center p-12 overflow-hidden relative"
                    >
                        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />

                        <div className="w-full max-w-6xl z-10">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex justify-between items-end mb-12 border-b border-white/10 pb-8"
                            >
                                <div>
                                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-2">STEWARDSHIP <span className="text-ohs-orange">HUB</span></h2>
                                    <p className="text-gray-400 text-xl font-medium">CEO Oversight & Cascading Accountability</p>
                                </div>
                                <ShieldAlert size={64} className="text-ohs-orange animate-pulse" />
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Board Compliance', value: '100%', icon: CheckCircle, color: 'text-green-400' },
                                    { label: 'Risk Mitigation', value: '+$1.2M', icon: TrendingUp, color: 'text-ohs-blue' },
                                    { label: 'Active Supervisors', value: '42', icon: Users, color: 'text-ohs-orange' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl group hover:border-ohs-orange/40 transition-all"
                                    >
                                        <stat.icon className={`${stat.color} mb-4`} size={40} />
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 4: HR & LPS Integration (NEW) */}
                {scene === 4 && (
                    <motion.div
                        key="scene4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0b0f19] flex items-center justify-center p-12 relative"
                    >
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center z-10 w-full max-w-6xl">
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className="text-xs sm:text-sm font-black text-ohs-orange tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-4">HR DATA SYNC</h2>
                                <h1 className="text-2xl sm:text-6xl font-black tracking-tighter mb-4 sm:mb-8 leading-tight">LOSS PREVENTION<br />INTEGRATION</h1>
                                <p className="text-sm sm:text-2xl text-gray-400 font-medium leading-relaxed">
                                    "Identifying fatigue patterns over 168 hours. Preventing claims before they are filed."
                                </p>
                            </div>

                            <div className="flex-1 bg-black/60 border border-white/20 p-4 sm:p-8 rounded-3xl backdrop-blur-xl relative h-64 sm:h-96 w-full flex flex-col justify-end overflow-hidden">
                                <Activity className="absolute top-4 sm:top-6 right-4 sm:right-6 text-red-500 animate-pulse" size={32} />
                                <h3 className="absolute top-4 sm:top-6 left-4 sm:left-6 text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm">7-Day Fatigue Curve</h3>

                                <div className="flex items-end justify-between gap-4 h-64 mt-12 pb-4 border-b border-white/20">
                                    {[60, 45, 55, 70, 85, 95, 40].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.3 }}
                                            className={`w-full rounded-t-lg ${height > 80 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-ohs-blue'}`}
                                        />
                                    ))}
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/20 border border-red-500 p-4 rounded-xl text-center backdrop-blur-md">
                                    <p className="text-xs font-black text-red-500 uppercase tracking-tighter">High Risk Flag</p>
                                    <p className="text-white font-bold">Shift Gap Violation</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 5: Compliance Training (NEW) */}
                {scene === 5 && (
                    <motion.div
                        key="scene5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-12 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 z-0 opacity-10 flex flex-wrap gap-8 justify-center items-center">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <Presentation key={i} size={100} className="text-ohs-navy" />
                            ))}
                        </div>

                        <div className="z-10 text-center max-w-4xl">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-ohs-navy p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-ohs-orange" />
                                <h1 className="text-5xl sm:text-7xl font-black text-white tracking-widest mb-4">IRIS & FRIENDS</h1>
                                <p className="text-ohs-orange font-bold text-2xl uppercase tracking-widest mb-8 italic">Interactive Safety Protocol</p>

                                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-8 border-4 border-white/10 group cursor-pointer shadow-[0_0_50px_rgba(249,168,37,0.3)]">
                                    <img src="/assets/iris_and_friends_training.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Training" />
                                    <div className="absolute inset-0 bg-ohs-navy/20 group-hover:bg-transparent transition-colors" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ width: ["0%", "70%"] }}
                                                transition={{ duration: 15, ease: "linear" }}
                                                className="h-full bg-ohs-orange"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-xl font-medium leading-relaxed">
                                    "Premium engagement through localized narrative. We bridge the gap between OHS legislation and worker comprehension 24/7."
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 6: Industrial Logistics */}
                {scene === 6 && (
                    <motion.div
                        key="scene6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center p-12 relative overflow-hidden"
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
                                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="relative">
                                            <div className="w-8 h-8 rounded-full border-4 border-green-500 absolute -top-10 left-1/2 -translate-x-1/2" />
                                            <div className="w-1 h-32 bg-green-500 absolute top-0 left-1/2 -translate-x-1/2" />
                                            <div className="w-24 h-1 bg-green-500 absolute top-6 transform rotate-12 left-1/2 -translate-x-1/2" />
                                            <div className="w-20 h-1 bg-green-500 absolute top-20 transform -rotate-12 left-1/2 -translate-x-1/2" />
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full blur-[10px] bg-red-600 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,1)]" />
                                        </motion.div>
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
                                <h1 className="text-2xl sm:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">INDUSTRIAL<br /><span className="text-ohs-orange">LOGISTICS MODULE</span></h1>
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

                {/* SCENE 7: Credits */}
                {scene === 7 && (
                    <motion.div
                        key="scene7"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden text-center"
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

                {/* SCENE 8: End */}
                {scene === 8 && (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black"
                    >
                        <ShieldAlert size={80} className="text-ohs-orange mb-8" />
                        <h1 className="text-2xl sm:text-6xl font-black mb-6 tracking-tighter uppercase">Showcase Complete</h1>
                        <p className="text-2xl text-gray-400 font-medium mb-12">v2.0 Feature Expansion Deployed.</p>
                        <button
                            onClick={onExit}
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-black px-12 py-5 rounded-xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(249,168,37,0.3)]"
                        >
                            RETURN TO HUB
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* PERSISTENT UI OVERLAYS FOR DEMO */}
            <div className="absolute bottom-4 left-0 w-full z-[10000] pointer-events-none px-4">
                <LeanPerformanceRail />
            </div>

            <div className="fixed bottom-10 right-10 z-[10000]">
                <MellyAvatar />
            </div>
        </div>
    );
};
