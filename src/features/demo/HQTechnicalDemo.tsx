import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak, stopSpeaking } from '../../utils/speech';
import { useNellyStore } from '../../store/nellyStore';
import { SpineViewer } from '../../components/agent/SpineViewer';
import {
    ShieldAlert,
    ShieldCheck,
    FileText,
    Activity,
    Target
} from 'lucide-react';

export const HQTechnicalDemo = ({ onExit }: { onExit: () => void }) => {
    // 0: Start, 1: Spine, 2: HITL, 3: Insurance, 4: End
    const [scene, setScene] = useState(0);
    const { language } = useNellyStore();

    const SCENE_DURATION = 30000; // exactly 30 seconds

    useEffect(() => {
        if (scene === 0 || scene === 4) return;

        const timeoutId = setTimeout(() => {
            setScene(prev => prev + 1);
        }, SCENE_DURATION);

        return () => clearTimeout(timeoutId);
    }, [scene]);

    // Synchronized Audio Narrative
    useEffect(() => {
        if (scene === 0 || scene === 4) {
            stopSpeaking();
            return;
        }

        const audioTimeout = setTimeout(() => {
            if (scene === 1) {
                const text = language === 'zu' ? "Siyakwamukela ku-ErgoSafe. Lolu hlaka lwe-3D lulandelela ukuma kwakho ngesikhathi sangempela, ukuvimbela ukulimala kwekhanda." :
                             language === 'af' ? "Welkom by ErgoSafe. Hierdie 3D-raamwerk volg jou postuur intyds om beserings te voorkom." :
                             "Welcome to ErgoSafe Reborn. Our live 3D skeletal framework tracks biomechanical stress in real-time, proactively preventing tech-neck and lumbar strain before it occurs.";
                speak(text, language);
            } else if (scene === 2) {
                const text = language === 'zu' ? "Uhlelo lwethu lokubika isigameko lubandakanya umphathi wezempilo nokuphepha, oluqinisekisa isenzo sokulungisa." :
                             language === 'af' ? "Ons voorvalstelsel betrek 'n veiligheidsbeampte, wat handmatige regstellende stappe verseker." :
                             "We employ a Human-in-the-Loop Loss Prevention System. High-risk posture alerts are securely flagged to your Health and Safety Officer for manual Corrective Action deployment.";
                speak(text, language);
            } else if (scene === 3) {
                const text = language === 'zu' ? "Sigcina ukuvunyelwa komshwalense kanye nokuhambisana komthetho we-OSHA. Azikho izithombe ezigciniwe." :
                             language === 'af' ? "Ons verseker versekeringsvoldoening en OSHA wettige beskerming. Geen rou beelde word gestoor nie." :
                             "Crucially, our platform is insurance-ready. We provide verifiable compliance reporting to under-writers, proving organizational baseline targets without ever storing raw camera telemetry.";
                speak(text, language);
            }
        }, 500);

        return () => clearTimeout(audioTimeout);
    }, [scene, language]);

    return (
        <div className="fixed inset-0 bg-black text-white z-[9999] overflow-hidden flex flex-col font-sans">
            <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-50 pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] xs:text-xs sm:text-xl md:text-3xl font-black tracking-tighter"
                >
                    ERGOSAFE REBORN <span className="text-ohs-orange">ENTERPRISE DEMO</span>
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
                            INITIATE FEATURE SHOWCASE (90s)
                        </button>
                    </motion.div>
                )}

                {/* SCENE 1: 3D Spine Tracking (0-30s) */}
                {scene === 1 && (
                    <motion.div
                        key="scene1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0b0f19] flex flex-col md:flex-row items-center justify-center p-8 md:p-16"
                    >
                        <div className="flex-1 w-full text-center md:text-left z-10 mb-8 md:mb-0">
                            <Activity size={60} className="text-ohs-green mb-6 mx-auto md:mx-0 animate-pulse" />
                            <h2 className="text-3xl sm:text-6xl font-black mb-4 tracking-tighter leading-tight">LIVE 3D SPINE<br/>TRACKING</h2>
                            <p className="text-lg sm:text-2xl text-gray-400 font-medium leading-relaxed max-w-xl">
                                Real-time MediaPipe postural telemetry mapped to procedurally generated 3D primitives. Visualizing dynamic structural load stress.
                            </p>
                        </div>
                        <div className="flex-1 w-full h-[300px] md:h-[600px] rounded-3xl overflow-hidden border border-white/20">
                            <SpineViewer />
                        </div>
                    </motion.div>
                )}

                {/* SCENE 2: Human-in-the-loop (30-60s) */}
                {scene === 2 && (
                    <motion.div
                        key="scene2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-ohs-navy flex items-center justify-center p-12 overflow-hidden relative"
                    >
                        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center z-10 w-full max-w-6xl">
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-3xl sm:text-6xl font-black tracking-tighter mb-4 sm:mb-8 leading-tight">HUMAN-IN-THE-LOOP<br /><span className="text-ohs-orange">INCIDENT REPORTING</span></h1>
                                <p className="text-lg sm:text-2xl text-gray-400 font-medium leading-relaxed">
                                    No automated lockouts. High-risk thresholds generate secure alerts for your Health & Safety Officer. Manual certification, human context.
                                </p>
                            </div>

                            <div className="flex-1 bg-black/60 border border-white/20 p-8 rounded-3xl backdrop-blur-xl relative w-full">
                                <ShieldAlert className="absolute top-6 right-6 text-red-500 animate-pulse" size={32} />
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">LPS Alert Queue</h3>
                                <div className="space-y-4">
                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                                        <p className="text-xs font-black text-red-500 uppercase">Threshold Breach</p>
                                        <p className="text-white font-bold mt-1">Pending Officer Review</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                        <p className="text-xs font-black text-ohs-orange uppercase">Action Required</p>
                                        <p className="text-white font-bold mt-1">Assign Corrective Training</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 3: Insurance Underwriting (60-90s) */}
                {scene === 3 && (
                    <motion.div
                        key="scene3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-12 relative overflow-hidden"
                    >
                        <div className="z-10 text-center max-w-4xl">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-ohs-navy p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-ohs-green" />
                                <ShieldCheck size={80} className="text-ohs-green mx-auto mb-6" />
                                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-widest mb-4 uppercase">Insurance-Ready</h1>
                                <p className="text-ohs-green font-bold text-2xl uppercase tracking-widest mb-8">Underwriting Compliance Verification</p>
                                
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                        <Target className="text-ohs-orange mb-2" />
                                        <p className="text-xl font-black text-white">35% Baseline</p>
                                        <p className="text-gray-400 text-sm">Target verified globally.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                        <FileText className="text-ohs-blue mb-2" />
                                        <p className="text-xl font-black text-white">Zero Raw Data</p>
                                        <p className="text-gray-400 text-sm">Privacy-first aggregate scaling.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 4: End */}
                {scene === 4 && (
                    <motion.div
                        key="end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0f19]"
                    >
                        <ShieldCheck size={80} className="text-ohs-green mb-8" />
                        <h1 className="text-3xl sm:text-6xl font-black mb-6 tracking-tighter uppercase">Showcase Complete</h1>
                        <p className="text-xl text-gray-400 font-medium mb-12">Scalable. Insurance-Ready. Executive Shield.</p>
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
