import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import { GlowButton } from '../../components/ui/GlowButton';
import { Volume2, VolumeX, X, Play, Square } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { speak, stopSpeaking } from '../../utils/speech';
import { useMellyStore } from '../../store/mellyStore';
import { translations } from '../../utils/translations';

interface TrainingModuleProps {
    id?: string;
    title: string;
    description: string;
    duration: string;
    steps: string[];
    onClose: () => void;
}

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

    const material = new THREE.MeshStandardMaterial({
        color: "#F9A825",
        roughness: 0.3,
        metalness: 0.8
    });
    const jointMat = new THREE.MeshStandardMaterial({
        color: "#003D5C",
        roughness: 0.5,
        metalness: 0.5
    });

    return (
        <group ref={groupRef} position={[0, -1, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                {/* HEAD */}
                <mesh ref={headRef} position={[0, 1.8, 0]} material={material}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                </mesh>

                {/* NECK */}
                <mesh position={[0, 1.25, 0]} material={jointMat}>
                    <cylinderGeometry args={[0.15, 0.15, 0.5]} />
                </mesh>

                {/* TORSO */}
                <mesh position={[0, 0.5, 0]} material={material}>
                    <cylinderGeometry args={[0.4, 0.3, 1.5, 16]} />
                </mesh>

                {/* LEFT ARM GROUP (Pivot at shoulder) */}
                <group ref={leftArmRef} position={[0.5, 1.1, 0]}>
                    <mesh material={jointMat}>
                        <sphereGeometry args={[0.2]} />
                    </mesh>
                    <mesh position={[0.1, -0.6, 0]} material={material} rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
                    </mesh>
                </group>

                {/* RIGHT ARM GROUP */}
                <group ref={rightArmRef} position={[-0.5, 1.1, 0]}>
                    <mesh material={jointMat}>
                        <sphereGeometry args={[0.2]} />
                    </mesh>
                    <mesh position={[-0.1, -0.6, 0]} material={material} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
                    </mesh>
                </group>

            </Float>
            <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
        </group>
    );
};

export const TrainingModule = ({ id, title, description, duration, steps, onClose }: TrainingModuleProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const { completeModule, language } = useMellyStore();

    useEffect(() => {
        if (isPlaying && voiceEnabled) {
            const trans = (translations as any)[language]?.training;
            const exrTrans = trans?.exercises?.[id as string];

            const transTitle = exrTrans?.title || title;
            const transDesc = exrTrans?.desc || description;
            const transStep = exrTrans?.step1 || steps[0];
            const startText = trans?.start_session || "Starting session:";
            const followText = trans?.follow_guide || "Follow the animated guide. Step 1:";

            const textToSpeak = `${startText} ${transTitle}. ${transDesc}. ${followText} ${transStep}.`;
            speak(textToSpeak, () => {
                // When speech finishes (simulating session end for this demo)
                if (id) completeModule(id);
            });
        } else {
            stopSpeaking();
        }

        return () => {
            stopSpeaking();
        };
    }, [isPlaying, voiceEnabled, title, description, steps]);

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
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
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={20} />
                </button>

                {/* Left: 3D Visualization */}
                <div className="flex-1 md:flex-[1.5] bg-gradient-to-br from-black/40 to-transparent relative overflow-hidden flex flex-col min-h-[40vh] md:min-h-auto">
                    <div className="absolute inset-0 z-0">
                        <Canvas camera={{ position: [0, 1, 5] }}>
                            <ambientLight intensity={0.7} />
                            <pointLight position={[10, 10, 10]} intensity={2} color="#F9A825" />
                            <pointLight position={[-10, 5, -10]} intensity={2} color="#003D5C" />
                            <ErgoBot isPlaying={isPlaying} />
                        </Canvas>
                    </div>

                    <div className="mt-auto p-8 relative z-10 flex items-center justify-between">
                        <div className="bg-ohs-orange/20 border border-ohs-orange/50 text-ohs-orange font-bold px-4 py-2 rounded-xl text-sm backdrop-blur-md">
                            {duration} Intensive Session
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[20px] border-white/5 rounded-[2rem]" />
                </div>

                {/* Right: Instructions */}
                <div className="flex-1 p-10 overflow-y-auto bg-ohs-dark/40 backdrop-blur-sm border-l border-white/5 scrollbar-hide flex flex-col">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{title}</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">{description}</p>

                        <div className="space-y-6 mb-10">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex gap-5 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-black text-ohs-orange group-hover:bg-ohs-orange group-hover:text-ohs-navy transition-all duration-300">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-300 text-lg py-1.5">{step}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Controls Footer */}
                    <div className="border-t border-white/10 pt-8 mt-auto sticky bottom-0 bg-ohs-dark/95 backdrop-blur-xl -mx-10 px-10 pb-4 space-y-4">

                        {/* Voice Toggle */}
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                {voiceEnabled ? <Volume2 className="text-ohs-green" /> : <VolumeX className="text-gray-500" />}
                                <span className="font-medium text-white">Melly Guidance Voice</span>
                            </div>
                            <button
                                aria-label="Toggle Voice Guidance"
                                title="Toggle Voice Guidance"
                                onClick={() => setVoiceEnabled(!voiceEnabled)}
                                className={`w-14 h-8 rounded-full relative transition-colors ${voiceEnabled ? 'bg-ohs-green' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${voiceEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Main Action Button */}
                        <GlowButton
                            onClick={handleTogglePlay}
                            className={`w-full text-lg py-4 flex items-center justify-center gap-3 ${isPlaying ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : ''}`}
                        >
                            {isPlaying ? (
                                <>
                                    <Square size={20} fill="currentColor" />
                                    STOP SESSION
                                </>
                            ) : (
                                <>
                                    <Play size={24} fill="currentColor" />
                                    START EXERCISE
                                </>
                            )}
                        </GlowButton>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
