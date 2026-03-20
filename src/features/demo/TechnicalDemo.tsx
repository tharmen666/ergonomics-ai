import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Globe, CheckCircle2, FileText, AlertTriangle, PlayCircle } from 'lucide-react';
import { speak, stopSpeaking } from '../../utils/speech';

export const TechnicalDemo = ({ onExit }: { onExit: () => void }) => {
    const [scene, setScene] = useState(0); // 0: Start Screen, 1: High Risk, 2: Melly, 3: CEO Dash, 4: Admin-Zero, 5: End

    // Timings: Start -> Scene 1 (30s) -> Scene 2 (40s) -> Scene 3 (40s) -> Scene 4 (40s) -> End
    useEffect(() => {
        if (scene === 0 || scene === 5) return;

        let timeoutId: ReturnType<typeof setTimeout>;
        if (scene === 1) timeoutId = setTimeout(() => setScene(2), 30000);
        else if (scene === 2) timeoutId = setTimeout(() => setScene(3), 40000);
        else if (scene === 3) timeoutId = setTimeout(() => setScene(4), 40000);
        else if (scene === 4) timeoutId = setTimeout(() => setScene(5), 40000);

        return () => clearTimeout(timeoutId);
    }, [scene]);

    const [langPhase, setLangPhase] = useState(0); // For Scene 2 Melly Translation

    useEffect(() => {
        if (scene === 2) {
            const i1 = setTimeout(() => setLangPhase(1), 10000); // EN
            const i2 = setTimeout(() => setLangPhase(2), 20000); // ZU
            const i3 = setTimeout(() => setLangPhase(3), 30000); // XH
            return () => { clearTimeout(i1); clearTimeout(i2); clearTimeout(i3); };
        }
    }, [scene]);

    useEffect(() => {
        if (scene === 1) {
            setTimeout(() => speak("Non-compliance detected. Critical cervical and carpal strain warning."), 2000);
        } else if (scene === 3) {
            speak("Stewardship Intelligence Grid loaded. Deploying immediate mitigation strategy for Section 37 and 38 legal liability alerts.");
        } else if (scene === 4) {
            speak("Admin-Zero Automation Sequencing. Assembling biometric risk factors and filing secure dossier.");
        } else if (scene === 5 || scene === 0) {
            stopSpeaking();
        }
    }, [scene]);

    useEffect(() => {
        if (scene === 2) {
            if (langPhase === 1) {
                speak("Warning. Severe posture hazard detected. Please adjust your screen height to eye level instantly.");
            } else if (langPhase === 2) {
                // Shortened for TTS reliability in browser
                speak("Isexwayiso. Kutholwe ingozi enkulu yokuma kabi komzimba.");
            } else if (langPhase === 3) {
                speak("Isilumkiso. Kubhaqwe ingozi enkulu yokuma kakubi komzimba.");
            }
        }
    }, [scene, langPhase]);

    return (
        <div className="fixed inset-0 bg-black text-white z-[9999] overflow-hidden flex flex-col font-sans">
            {/* Title Overlay */}
            <div className="absolute top-6 left-8 z-50 pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black tracking-tighter"
                >
                    DESIGAN THARMEN: <span className="text-ohs-orange">PREVENTION IN PRACTICE</span>
                </motion.h1>
            </div>

            <button
                onClick={onExit}
                className="absolute top-6 right-8 z-50 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-md"
            >
                EXIT DEMO
            </button>

            <AnimatePresence mode="wait">
                {scene === 0 && (
                    <motion.div
                        key="start"
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center bg-ohs-navy"
                    >
                        <button
                            onClick={() => setScene(1)}
                            className="flex items-center gap-3 bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-8 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(249,168,37,0.4)]"
                        >
                            <PlayCircle size={28} />
                            INITIATE 150s SIMULATION
                        </button>
                    </motion.div>
                )}

                {scene === 1 && (
                    <motion.div
                        key="scene1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 relative bg-black flex items-center justify-center"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-10" />
                            <img
                                src="/assets/high_risk_worker.png"
                                className="w-full h-full object-cover opacity-60"
                                alt="High Risk Worker"
                            />
                        </div>

                        {/* Heatmap Overlays - Animated SVG overlay mimicking RSI tracking */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 1.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 2, ease: "circOut" }}
                                className="relative w-full max-w-4xl h-full flex items-center justify-center"
                            >
                                {/* Simulated Neck Heatmap */}
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute top-[25%] left-[55%] w-32 h-32 bg-red-600/70 rounded-full blur-[40px]"
                                />

                                {/* Simulated Wrist Heatmap */}
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.2 }}
                                    className="absolute bottom-[35%] left-[40%] w-24 h-24 bg-red-600/80 rounded-full blur-[30px]"
                                />

                                {/* Tracking Lines */}
                                <svg className="absolute inset-0 w-full h-full" strokeDasharray="4 4">
                                    <line x1="20%" y1="50%" x2="40%" y2="65%" stroke="var(--ohs-orange)" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
                                    <line x1="80%" y1="20%" x2="55%" y2="25%" stroke="red" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Warning UI */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-xl border border-red-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)] min-w-[500px]"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <ShieldAlert className="text-red-500 animate-pulse" size={40} />
                                <div>
                                    <h2 className="text-3xl font-black text-red-500 tracking-widest uppercase">NON-COMPLIANCE DETECTED</h2>
                                    <p className="text-gray-400 font-bold tracking-tight">Cervical & Carpal Strain Warning. Risk Level: CRITICAL.</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <div className="flex-1 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                    <p className="text-sm font-bold text-gray-400 uppercase">Posture Metric</p>
                                    <p className="text-2xl font-black text-white">42° Forward Flex</p>
                                </div>
                                <div className="flex-1 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                    <p className="text-sm font-bold text-gray-400 uppercase">Time at Risk</p>
                                    <p className="text-2xl font-black text-white">3h 42m</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {scene === 2 && (
                    <motion.div
                        key="scene2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 bg-ohs-navy flex items-center justify-center relative overflow-hidden"
                    >
                        {/* Glowing Orb (Melly) */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                    "0 0 100px rgba(249, 168, 37, 0.4)",
                                    "0 0 200px rgba(249, 168, 37, 0.8)",
                                    "0 0 100px rgba(249, 168, 37, 0.4)"
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="w-64 h-64 rounded-full bg-gradient-to-br from-ohs-orange to-yellow-600 relative z-20 flex items-center justify-center border-4 border-white/20"
                        >
                            <Activity className="text-white opacity-80" size={80} />

                            {/* Soundwaves */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                                        className="absolute inset-0 rounded-full border border-ohs-orange"
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Multilingual Text */}
                        <div className="absolute bottom-32 w-full max-w-3xl mx-auto px-8 left-1/2 -translate-x-1/2 z-30">
                            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xltext-center flex flex-col items-center">
                                <Globe className="text-ohs-orange mb-4" size={32} />
                                <AnimatePresence mode="wait">
                                    {langPhase === 1 && (
                                        <motion.div key="en" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">English (Default)</p>
                                            <h3 className="text-3xl font-black text-white">"Warning: Severe posture hazard detected. Please adjust your screen height to eye level instantly."</h3>
                                        </motion.div>
                                    )}
                                    {langPhase === 2 && (
                                        <motion.div key="zu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">isiZulu</p>
                                            <h3 className="text-3xl font-black text-white">"Isexwayiso: Kutholwe ingozi enkulu yokuma kabi komzimba. Sicela ulungise ukuphakama kwesikrini sakho."</h3>
                                        </motion.div>
                                    )}
                                    {langPhase >= 3 && (
                                        <motion.div key="xh" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">isiXhosa</p>
                                            <h3 className="text-3xl font-black text-white">"Isilumkiso: Kubhaqwe ingozi enkulu yokuma kakubi komzimba. Nceda ulungise ukuphakama kwescreen sakho."</h3>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}

                {scene === 3 && (
                    <motion.div
                        key="scene3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="flex-1 bg-ohs-navy/95 flex flex-col items-center justify-center p-12"
                    >
                        <div className="w-full max-w-6xl">
                            <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-12">
                                <div>
                                    <h2 className="text-sm font-black text-ohs-orange tracking-[0.3em] uppercase mb-2">Executive Overview</h2>
                                    <h1 className="text-5xl font-black">STEWARDSHIP INTELLIGENCE GRID</h1>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 font-bold uppercase tracking-wider">Live Corporate Feed</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                {/* Safety Pulse Dial */}
                                <div className="col-span-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center relative shadow-2xl">
                                    <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-8">Safety Pulse</h3>

                                    {/* Dial implementation */}
                                    <div className="relative w-64 h-64">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="128" cy="128" r="110" stroke="rgba(255,255,255,0.1)" strokeWidth="20" fill="none" />
                                            <motion.circle
                                                cx="128" cy="128" r="110"
                                                stroke="var(--ohs-orange)" strokeWidth="20" fill="none"
                                                strokeDasharray={2 * Math.PI * 110}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                                                animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - 0.74) }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                                                className="text-6xl font-black text-white"
                                            >
                                                74<span className="text-3xl text-gray-500">%</span>
                                            </motion.span>
                                            <span className="text-sm font-bold text-ohs-orange uppercase mt-2">Deteriorating</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Legal Liability Alerts */}
                                <div className="col-span-2 flex flex-col gap-6">
                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex-1 bg-red-900/20 border-l-4 border-red-500 p-8 rounded-r-3xl flex items-start gap-6 relative overflow-hidden"
                                    >
                                        <motion.div
                                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-red-500/10 pointer-events-none"
                                        />
                                        <AlertTriangle className="text-red-500 shrink-0" size={48} />
                                        <div>
                                            <h3 className="text-2xl font-black text-red-500 tracking-tighter mb-2">LEGAL LIABILITY ALERT: SECTION 37 (OHS ACT)</h3>
                                            <p className="text-red-200/80 text-lg leading-relaxed font-medium">
                                                Employer negligence detected across remote workforce. "Acts or omissions by employees" making CEO strictly liable. Recommend immediate mitigation strategy deployment to avoid criminal prosecution.
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="flex-1 bg-orange-900/20 border-l-4 border-orange-500 p-8 rounded-r-3xl flex items-start gap-6 relative"
                                    >
                                        <ShieldAlert className="text-orange-500 shrink-0" size={48} />
                                        <div>
                                            <h3 className="text-2xl font-black text-orange-500 tracking-tighter mb-2">OFFENCES WARNING: SECTION 38 (OHS ACT)</h3>
                                            <p className="text-orange-200/80 text-lg leading-relaxed font-medium">
                                                Non-compliance with safety provisions. Continued failure to act on ergonomic risks may trigger R100,000 fine and/or 2-year imprisonment per incident.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {scene === 4 && (
                    <motion.div
                        key="scene4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden"
                    >
                        {/* Cyber Grid Background */}
                        <div className="absolute inset-0 bg-[#001c00] opacity-5 [background-image:linear-gradient(#0f0_1px,transparent_1px),linear-gradient(90deg,#0f0_1px,transparent_1px)] [background-size:40px_40px]" />

                        <div className="relative z-10 w-full max-w-4xl text-center">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-flex items-center gap-4 bg-ohs-navy/80 border border-ohs-orange/50 px-8 py-4 rounded-full mb-12 shadow-[0_0_30px_rgba(249,168,37,0.2)]"
                            >
                                <div className="w-4 h-4 rounded-full bg-ohs-orange animate-pulse" />
                                <span className="text-xl font-black tracking-[0.2em] text-ohs-orange">ADMIN-ZERO AUTOMATION SEQUENCING</span>
                            </motion.div>

                            {/* Dossier Terminal UI */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="bg-black/80 backdrop-blur-xl border border-green-500/30 rounded-2xl text-left overflow-hidden shadow-[0_0_80px_rgba(0,255,0,0.1)]"
                            >
                                <div className="bg-green-950/50 p-4 border-b border-green-500/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-green-500" size={20} />
                                        <span className="font-mono text-green-500 font-bold">COMPLIANCE_DOSSIER_AUTO_FILE.exe</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                </div>

                                <div className="p-8 font-mono text-green-400 h-80 relative overflow-hidden flex flex-col gap-4 text-lg">
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                                        &gt; Assembling biometric and postural risk factors... <span className="text-white">DONE</span>
                                    </motion.p>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                                        &gt; Cross-referencing OHS Act 85 of 1993... <span className="text-white">DONE</span>
                                    </motion.p>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}>
                                        &gt; Generating automated mitigation timeline... <span className="text-white">DONE</span>
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 5 }}
                                        className="mt-8 bg-green-500/20 border border-green-500 p-6 flex flex-col items-center justify-center gap-4 relative"
                                    >
                                        <CheckCircle2 className="text-white" size={48} />
                                        <h3 className="text-2xl font-black text-white px-4 py-1 bg-green-600">SECURE DOSSIER FILED TO BLOCKCHAIN LEDGER</h3>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {scene === 5 && (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center bg-ohs-navy"
                    >
                        <h1 className="text-5xl font-black mb-6">DEMO CONCLUDED</h1>
                        <button
                            onClick={onExit}
                            className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-8 py-4 rounded-xl font-black text-xl hover:scale-105 transition-all"
                        >
                            RETURN TO HUB
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
