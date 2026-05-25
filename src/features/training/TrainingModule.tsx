// @ts-nocheck
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import { GlowButton } from '../../components/ui/GlowButton';
import { Volume2, VolumeX, X, Play, Square, ChevronLeft, ChevronRight, CheckCircle, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { speak, stopSpeaking } from '../../utils/speech';
import { useMellyStore } from '../../store/mellyStore';
import { FRESH_OHS_PROJECT_REGISTRY } from '../../utils/master_ohs_boot';
import { Language } from '../../utils/translations';

interface TrainingModuleProps {
    id: string;
    title: string;
    description: string;
    duration: string;
    onClose: () => void;
}

// Shared material instantiations moved outside render cycle to prevent GC thrashing and frame drops
const botMaterial = new THREE.MeshStandardMaterial({
    color: "#F9A825",
    roughness: 0.3,
    metalness: 0.8
});
const botJointMaterial = new THREE.MeshStandardMaterial({
    color: "#003D5C",
    roughness: 0.5,
    metalness: 0.5
});

// Procedural "ErgoBot" Avatar for demonstrations
const ErgoBot = ({ isPlaying }: { isPlaying: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!isPlaying || !leftArmRef.current || !rightArmRef.current || !headRef.current) {
            // Idle breathing
            if (groupRef.current) groupRef.current.position.y = Math.sin(clock.elapsedTime) * 0.1;
            return;
        }

        const t = clock.elapsedTime * 2; // Speed

        // Generic Exercise Animation (Arm raises / Torso twists)
        // Arms up/down
        leftArmRef.current.rotation.z = Math.sin(t) * 1.5 + 0.5; // Flapping motion
        rightArmRef.current.rotation.z = -(Math.sin(t) * 1.5 + 0.5);

        // Head bob
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;

        // Body subtle sway
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                {/* HEAD */}
                <mesh ref={headRef} position={[0, 1.8, 0]} material={botMaterial}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                </mesh>

                {/* NECK */}
                <mesh position={[0, 1.25, 0]} material={botJointMaterial}>
                    <cylinderGeometry args={[0.15, 0.15, 0.5]} />
                </mesh>

                {/* TORSO */}
                <mesh position={[0, 0.5, 0]} material={botMaterial}>
                    <cylinderGeometry args={[0.4, 0.3, 1.5, 16]} />
                </mesh>

                {/* LEFT ARM GROUP (Pivot at shoulder) */}
                <group ref={leftArmRef} position={[0.5, 1.1, 0]}>
                    <mesh material={botJointMaterial}>
                        <sphereGeometry args={[0.2]} />
                    </mesh>
                    <mesh position={[0.1, -0.6, 0]} material={botMaterial} rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
                    </mesh>
                </group>

                {/* RIGHT ARM GROUP */}
                <group ref={rightArmRef} position={[-0.5, 1.1, 0]}>
                    <mesh material={botJointMaterial}>
                        <sphereGeometry args={[0.2]} />
                    </mesh>
                    <mesh position={[-0.1, -0.6, 0]} material={botMaterial} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
                    </mesh>
                </group>

            </Float>
            <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
        </group>
    );
};

export const TrainingModule = ({ id, title, description, duration, onClose }: TrainingModuleProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const { completeModule, language, setLanguage } = useMellyStore();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);


    // Get the course from our stabilized master data registry
    const course = FRESH_OHS_PROJECT_REGISTRY[id];
    const steps = course ? course.steps : [];
    const currentStep = steps[currentStepIdx];

    // Trigger voice synthesis on step navigation, play toggle or language changes
    useEffect(() => {
        if (isPlaying && voiceEnabled && currentStep) {
            const stepText = currentStep[language] || currentStep['en'];
            const speechText = `Step ${currentStep.step}: ${currentStep.title}. ${stepText}`;
            
            // Callback-free call to speak completely eliminates stale closures and race conditions
            speak(speechText);
        } else {
            stopSpeaking();
        }

        return () => {
            stopSpeaking();
        };
    }, [isPlaying, voiceEnabled, currentStepIdx, language, id]);

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx(currentStepIdx + 1);
        } else {
            completeModule(id);
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStepIdx > 0) {
            setCurrentStepIdx(currentStepIdx - 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ohs-dark/95 backdrop-blur-xl p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] w-full max-w-6xl h-[85dvh] flex flex-col md:flex-row overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={20} />
                </button>

                {/* Left: 3D Visualization */}
                <div className="flex-1 md:flex-[1.2] bg-gradient-to-br from-black/40 to-transparent relative overflow-hidden flex flex-col min-h-[35vh] md:min-h-auto">
                    <div className="absolute inset-0 z-0">
                        <Canvas camera={{ position: [0, 1, 5] }}>
                            <ambientLight intensity={0.7} />
                            <pointLight position={[10, 10, 10]} intensity={2} color="#F9A825" />
                            <pointLight position={[-10, 5, -10]} intensity={2} color="#003D5C" />
                            <ErgoBot isPlaying={isPlaying} />
                        </Canvas>
                    </div>

                    <div className="mt-auto p-8 relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-ohs-orange/20 border border-ohs-orange/50 text-ohs-orange font-black px-4 py-2 rounded-xl text-xs uppercase tracking-widest backdrop-blur-md">
                                {duration} Session
                            </div>
                            <div className="bg-ohs-green/20 border border-ohs-green/50 text-ohs-green font-black px-4 py-2 rounded-xl text-xs uppercase tracking-widest backdrop-blur-md">
                                OHS ACT SEC 8
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[20px] border-white/5 rounded-[2rem]" />
                </div>

                {/* Right: Instructions & Steps */}
                <div className="flex-1 md:flex-[1.5] p-8 md:p-10 overflow-y-auto bg-ohs-dark/40 backdrop-blur-sm border-l border-white/5 scrollbar-hide flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Header with Title and Language Selector */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                            <div>
                                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block mb-1">
                                    {course?.courseId || 'ST-OHS-001'} Statutory Module
                                </span>
                                <h2 className="text-2xl font-black text-white tracking-tight leading-none">{title}</h2>
                            </div>
                            
                            {/* Multilingual Selector */}
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 self-stretch sm:self-auto justify-center sm:justify-start">
                                <Globe size={14} className="text-ohs-orange" />
                                <span className="text-xs font-black text-gray-400 mr-1 uppercase">Lang:</span>
                                <select
                                    aria-label="Active Language Selection"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer uppercase"
                                >
                                    <option value="en" className="bg-ohs-navy">EN</option>
                                    <option value="zu" className="bg-ohs-navy">ZU</option>
                                    <option value="xh" className="bg-ohs-navy">XH</option>
                                    <option value="st" className="bg-ohs-navy">ST</option>
                                </select>
                            </div>
                        </div>

                        {/* Step Display Area */}
                        {currentStep && (
                            <motion.div
                                key={currentStepIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 px-4 rounded-xl bg-ohs-orange/20 border border-ohs-orange/40 flex items-center justify-center font-black text-ohs-orange text-xs tracking-wider">
                                        STEP {currentStep.step} OF {steps.length}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-black text-white tracking-wide uppercase text-glow-orange">
                                    {currentStep.title}
                                </h3>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                                    <p className="text-gray-300 text-lg leading-relaxed font-medium italic break-words whitespace-normal">
                                        "{currentStep[language] || currentStep['en']}"
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Linear Step Indicators */}
                        <div className="flex items-center gap-1 py-2 overflow-x-auto">
                            {steps.map((s, idx) => (
                                <button
                                    key={idx}
                                    aria-label={`Jump to step ${idx + 1}`}
                                    onClick={() => setCurrentStepIdx(idx)}
                                    className={`h-1.5 rounded-full transition-all flex-1 min-w-[12px] ${
                                        idx === currentStepIdx 
                                            ? 'bg-ohs-orange shadow-[0_0_8px_#F9A825]' 
                                            : idx < currentStepIdx 
                                                ? 'bg-ohs-green' 
                                                : 'bg-white/10'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="border-t border-white/10 pt-6 mt-8 space-y-4">
                        {/* Audio Guidance Feedback */}
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                {voiceEnabled ? <Volume2 className="text-ohs-green" /> : <VolumeX className="text-gray-500" />}
                                <div>
                                    <span className="font-bold text-white text-sm block">Melly Active TTS Guidance</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Automatic voice playback for localized pipelines</span>
                                </div>
                            </div>
                            <button
                                aria-label="Toggle Voice Guidance"
                                onClick={() => setVoiceEnabled(!voiceEnabled)}
                                className={`w-14 h-8 rounded-full relative transition-colors ${voiceEnabled ? 'bg-ohs-green' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${voiceEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex gap-4">
                            <button
                                aria-label="Previous Step"
                                onClick={handlePrev}
                                disabled={currentStepIdx === 0}
                                className={`px-4 py-3 rounded-2xl border border-white/10 flex items-center justify-center transition-all ${
                                    currentStepIdx === 0 
                                        ? 'opacity-40 cursor-not-allowed bg-transparent text-gray-500' 
                                        : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <GlowButton
                                onClick={handleTogglePlay}
                                className={`flex-[1.5] text-sm py-3.5 flex items-center justify-center gap-2 ${
                                    isPlaying ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-ohs-orange text-ohs-navy'
                                }`}
                            >
                                {isPlaying ? (
                                    <>
                                        <Square size={16} fill="currentColor" />
                                        STOP GUIDANCE
                                    </>
                                ) : (
                                    <>
                                        <Play size={16} fill="currentColor" />
                                        VOICE INSTRUCTION
                                    </>
                                )}
                            </GlowButton>

                            <GlowButton
                                onClick={handleNext}
                                className="flex-[2] text-sm py-3.5 flex items-center justify-center gap-2 bg-ohs-green text-ohs-navy hover:bg-green-400 shadow-ohs-green/20"
                            >
                                {currentStepIdx === steps.length - 1 ? (
                                    <>
                                        <CheckCircle size={16} />
                                        COMPLETE SESSION
                                    </>
                                ) : (
                                    <>
                                        NEXT INSTRUCTION
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </GlowButton>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
