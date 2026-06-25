import { useState, useEffect, useRef } from 'react';
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

interface SceneAudio {
    audioPath: string;
    text: string;
}

const SCENE_AUDIO_MAP: Record<string, Record<number, SceneAudio>> = {
    en: {
        1: {
            audioPath: '/assets/audio/en_za/scene1.mp3',
            text: "Welcome to ErgoSafe Reborn. Our live 3D skeletal framework tracks biomechanical stress in real-time, proactively preventing tech-neck and lumbar strain before it occurs."
        },
        2: {
            audioPath: '/assets/audio/en_za/scene2.mp3',
            text: "We employ a Human-in-the-Loop Loss Prevention System. High-risk posture alerts are securely flagged to your Health and Safety Officer for manual Corrective Action deployment."
        },
        3: {
            audioPath: '/assets/audio/en_za/scene3.mp3',
            text: "Crucially, our platform is insurance-ready. We provide verifiable compliance reporting to under-writers, proving organizational baseline targets without ever storing raw camera telemetry."
        }
    },
    zu: {
        1: {
            audioPath: '/assets/audio/zu/scene1.mp3',
            text: "Siyakwamukela ku-ErgoSafe. Lolu hlaka lwe-3D lulandelela ukuma kwakho ngesikhathi sangempela, ukuvimbela ukulimala kwekhanda nomgogodla."
        },
        2: {
            audioPath: '/assets/audio/zu/scene2.mp3',
            text: "Uhlelo lwethu lokubika isigameko lubandakanya umphathi wezempilo nokuphepha, oluqinisekisa isenzo sokulungisa esenziwa ngumuntu."
        },
        3: {
            audioPath: '/assets/audio/zu/scene3.mp3',
            text: "Sigcina ukuvunyelwa komshwalense kanye nokuhambisana komthetho we-OSHA. Azikho izithombe zomsebenzisi ezigciniwe zokugcina ubumfihlo."
        }
    },
    xh: {
        1: {
            audioPath: '/assets/audio/xh/scene1.mp3',
            text: "Wamkelekile ku-ErgoSafe Reborn. Isakhelo sethu se-3D esiphilayo silandelela uxinzelelo lomzimba ngexesha lokwenene, sikhusela ukunganyamezeleki kwentamo nomqolo."
        },
        2: {
            audioPath: '/assets/audio/xh/scene2.mp3',
            text: "Sisebenzisa inkqubo yokuthintela ilahleko ebandakanya abantu. Izilumkiso zokuma emngciphekweni zithunyelwa kwiGosa lezeMpilo neKhuselekileyo ukuze lithathe amanyathelo okulungisa."
        },
        3: {
            audioPath: '/assets/audio/xh/scene3.mp3',
            text: "Okubalulekileyo, iqonga lethu lilungele inshorensi. Sinikezela ngeengxelo zokuthobela eziqinisekisiweyo kubabhali bangaphantsi ngaphandle kokugcina idatha."
        }
    },
    st: {
        1: {
            audioPath: '/assets/audio/st/scene1.mp3',
            text: "Amohelehile ho ErgoSafe Reborn. Moralo oa rona oa 3D o latela ho ema ha hao ka nako ea nnete, ho thibela bohloko ba molala le mokokotlo pele bo hlaha."
        },
        2: {
            audioPath: '/assets/audio/st/scene2.mp3',
            text: "Re sebelisa sistimi e kenyelletsang batho ho thibela tahlehelo. Lialamo tsa kotsi li romeloa ho Ofisiri ea Bophelo bo Mofuthu le Tšireletseho bakeng sa khalemelo."
        },
        3: {
            audioPath: '/assets/audio/st/scene3.mp3',
            text: "Haholo-holo, sethala sa rona se loketse inshorense. Re fana ka litlaleho tsa tumellano tse netefalitsoeng ho ba-underwriter ntle le ho boloka linepe."
        }
    },
    af: {
        1: {
            audioPath: '/assets/audio/af/scene1.mp3',
            text: "Welkom by ErgoSafe. Hierdie 3D-raamwerk volg jou postuur intyds om beserings te voorkom."
        },
        2: {
            audioPath: '/assets/audio/af/scene2.mp3',
            text: "Ons voorvalstelsel betrek 'n veiligheidsbeampte, wat handmatige regstellende stappe verseker."
        },
        3: {
            audioPath: '/assets/audio/af/scene3.mp3',
            text: "Ons verseker versekeringsvoldoening en OSHA wettige beskerming. Geen rou beelde word gestoor nie."
        }
    },
    sw: {
        1: {
            audioPath: '/assets/audio/sw/scene1.mp3',
            text: "Karibu kwenye ErgoSafe Reborn. Mfumo wetu wa kufuatilia biomechanics wa 3D unaonyesha mkazo wa mwili kwa muda halisi, kuzuia maumivu ya shingo na mgongo."
        },
        2: {
            audioPath: '/assets/audio/sw/scene2.mp3',
            text: "Tunatumia mfumo wa kuzuia hasara unaohusisha binadamu. Tahadhari za hatari hutumwa kwa Afisa wa Afya na Usalama kwa hatua za kurekebisha."
        },
        3: {
            audioPath: '/assets/audio/sw/scene3.mp3',
            text: "Muhimu zaidi, mfumo wetu uko tayari kwa bima. Tunatoa ripoti zilizothibitishwa za utiifu bila kuhifadhi picha ghafi za kamera."
        }
    }
};

export const HQTechnicalDemo = ({ onExit }: { onExit: () => void }) => {
    // 0: Start, 1: Spine, 2: HITL, 3: Insurance, 4: End
    const [scene, setScene] = useState(0);
    const { language, setLanguage } = useNellyStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cleanupAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        stopSpeaking();
        if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
        }
    };

    // Transition helper
    const triggerNextScene = () => {
        setScene(prev => {
            if (prev >= 4) return prev;
            return prev + 1;
        });
    };

    // Handle scene changes and audio narration
    useEffect(() => {
        cleanupAudio();

        if (scene === 0 || scene === 4) {
            return;
        }

        // Set a safety fallback timeout (e.g. 25 seconds) to prevent getting stuck
        safetyTimeoutRef.current = setTimeout(() => {
            console.warn("Safety timeout reached, forcing transition.");
            triggerNextScene();
        }, 25000);

        // Fetch scene config
        const currentLang = SCENE_AUDIO_MAP[language] ? language : 'en';
        const sceneConfig = SCENE_AUDIO_MAP[currentLang]?.[scene];

        if (sceneConfig) {
            const playAudio = () => {
                const audio = new Audio(sceneConfig.audioPath);
                audioRef.current = audio;
                let fallbackTriggered = false;

                const handleFallback = () => {
                    if (fallbackTriggered) return;
                    fallbackTriggered = true;
                    console.log(`Audio file not found or failed to load: ${sceneConfig.audioPath}. Falling back to TTS.`);
                    speak(sceneConfig.text, currentLang, () => {
                        // After speech ends, wait 2 seconds and transition
                        setTimeout(() => {
                            triggerNextScene();
                        }, 2000);
                    });
                };

                audio.addEventListener('error', handleFallback);
                audio.addEventListener('ended', () => {
                    // After audio ends, wait 2 seconds and transition
                    setTimeout(() => {
                        triggerNextScene();
                    }, 2000);
                });

                audio.play().catch(() => {
                    // Autoplay blocked or general play failure -> fallback to speech synthesis
                    handleFallback();
                });
            };

            // Small delay to let scene render before starting audio
            const delayTimeout = setTimeout(playAudio, 600);
            return () => {
                clearTimeout(delayTimeout);
                cleanupAudio();
            };
        }
    }, [scene, language]);

    // Handle unmount cleanup
    useEffect(() => {
        return () => {
            cleanupAudio();
        };
    }, []);

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang as any);
    };

    return (
        <div className="fixed inset-0 bg-[#070b13] text-white z-[9999] overflow-hidden flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <div className="w-full h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md z-50">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs xs:text-sm sm:text-lg md:text-2xl font-black tracking-tighter"
                >
                    ERGOSAFE REBORN <span className="text-ohs-orange">ENTERPRISE DEMO</span>
                </motion.h1>

                <div className="flex items-center gap-3">
                    {/* Language Dropdown Selector */}
                    {scene > 0 && scene < 4 && (
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ohs-orange backdrop-blur-md cursor-pointer transition-all"
                            >
                                <option value="en" className="bg-[#0b0f19] text-white">English (ZA)</option>
                                <option value="zu" className="bg-[#0b0f19] text-white">isiZulu</option>
                                <option value="xh" className="bg-[#0b0f19] text-white">isiXhosa</option>
                                <option value="st" className="bg-[#0b0f19] text-white">Sesotho</option>
                                <option value="af" className="bg-[#0b0f19] text-white">Afrikaans</option>
                                <option value="sw" className="bg-[#0b0f19] text-white">KiSwahili</option>
                            </select>
                        </div>
                    )}

                    <button
                        onClick={onExit}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer border border-transparent hover:border-white/10"
                    >
                        EXIT DEMO
                    </button>
                </div>
            </div>

            {/* Scene Body Area */}
            <div className="flex-grow w-full relative min-h-0">
                <AnimatePresence mode="wait">
                    {scene === 0 && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#0b0f19]"
                        >
                            <h2 className="text-xl sm:text-3xl font-black text-center mb-6 max-w-lg tracking-tight leading-snug">
                                Interactive Showcase: Standalone Ergonomics Web Platform
                            </h2>
                            <button
                                onClick={() => setScene(1)}
                                className="bg-ohs-orange hover:bg-ohs-orange/90 text-[#0b0f19] px-6 py-3.5 sm:px-10 sm:py-5 rounded-2xl font-black text-base sm:text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(249,168,37,0.4)] cursor-pointer"
                            >
                                INITIATE FEATURE SHOWCASE
                            </button>
                        </motion.div>
                    )}

                    {/* SCENE 1: 3D Spine Tracking */}
                    {scene === 1 && (
                        <motion.div
                            key="scene1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0b0f19] flex flex-col md:flex-row items-center justify-center gap-6 p-4 sm:p-8 md:p-12 lg:p-16 overflow-y-auto md:overflow-hidden"
                        >
                            <div className="w-full md:flex-1 text-center md:text-left z-10 select-none">
                                <Activity size={40} className="text-ohs-green mb-4 sm:mb-6 mx-auto md:mx-0 animate-pulse md:w-[60px] md:h-[60px]" />
                                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 tracking-tighter leading-tight">
                                    LIVE 3D SPINE<br className="hidden md:inline"/>TRACKING
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                                    Real-time postural telemetry mapped to procedurally connected 3D primitives. Visualizing spinal cord stress and intervertebral loads.
                                </p>
                            </div>
                            <div className="w-full md:flex-1 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                                <SpineViewer />
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 2: Human-in-the-loop */}
                    {scene === 2 && (
                        <motion.div
                            key="scene2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#070b13] flex flex-col lg:flex-row items-center justify-center gap-6 p-4 sm:p-8 md:p-12 lg:p-16 overflow-y-auto lg:overflow-hidden relative w-full"
                        >
                            <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:60px_60px] pointer-events-none" />
                            
                            <div className="w-full lg:flex-1 text-center lg:text-left z-10 select-none">
                                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 sm:mb-6 leading-tight">
                                    HUMAN-IN-THE-LOOP<br /><span className="text-ohs-orange">INCIDENT REPORTING</span>
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    No automated lockouts. High-risk posture thresholds generate secure alerts for your Health & Safety Officer. Manual certification, human context.
                                </p>
                            </div>

                            <div className="w-full lg:flex-1 max-w-md bg-black/60 border border-white/10 p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl relative z-10">
                                <ShieldAlert className="absolute top-6 right-6 text-red-500 animate-pulse" size={28} />
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-4">LPS Alert Queue</h3>
                                <div className="space-y-4">
                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                                        <p className="text-xs font-black text-red-500 uppercase tracking-wider">Threshold Breach</p>
                                        <p className="text-white font-bold mt-1 text-sm sm:text-base">Pending Officer Review</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                        <p className="text-xs font-black text-ohs-orange uppercase tracking-wider">Action Required</p>
                                        <p className="text-white font-bold mt-1 text-sm sm:text-base">Assign Corrective Training</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 3: Insurance Underwriting */}
                    {scene === 3 && (
                        <motion.div
                            key="scene3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0f1422] flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto w-full"
                        >
                            <div className="z-10 text-center w-full max-w-2xl">
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-black/40 border border-white/10 p-6 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-ohs-green" />
                                    <ShieldCheck size={60} className="text-ohs-green mx-auto mb-4 sm:mb-6" />
                                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-2 uppercase">Insurance-Ready</h2>
                                    <p className="text-ohs-green font-bold text-sm sm:text-lg uppercase tracking-widest mb-6 sm:mb-8">
                                        Underwriting Compliance Verification
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                        <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl">
                                            <Target className="text-ohs-orange mb-2" size={20} />
                                            <p className="text-lg font-black text-white">35% Baseline</p>
                                            <p className="text-gray-400 text-xs sm:text-sm">Target verified globally.</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl">
                                            <FileText className="text-ohs-blue mb-2" size={20} />
                                            <p className="text-lg font-black text-white">Zero Raw Data</p>
                                            <p className="text-gray-400 text-xs sm:text-sm">Privacy-first aggregate scaling.</p>
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
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0b0f19]"
                        >
                            <ShieldCheck size={60} className="text-ohs-green mb-6 sm:mb-8 animate-bounce" />
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-tight">
                                Showcase Complete
                            </h2>
                            <p className="text-base sm:text-xl text-gray-400 font-medium mb-8 max-w-md">
                                Standalone. Insurance-Ready. Privacy-First Ergonomic Shield.
                            </p>
                            <button
                                onClick={onExit}
                                className="bg-ohs-orange hover:bg-ohs-orange/90 text-black px-8 py-3.5 sm:px-12 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(249,168,37,0.3)] cursor-pointer"
                            >
                                RETURN TO HUB
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
