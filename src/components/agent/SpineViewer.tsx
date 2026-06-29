import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';

const Vertebra = ({ position, rotation, color, scale, showDisc }: any) => {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* The main body of the vertebra */}
            <Cylinder name="bone" args={[0.48, 0.48, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
            </Cylinder>
            {/* Spinous process (back spike) */}
            <Box name="bone" args={[0.18, 0.18, 0.7]} position={[0, 0, -0.5]}>
                <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
            </Box>
            {/* Intervertebral disc (fibrous cartilage connection) */}
            {showDisc && (
                <Cylinder name="disc" args={[0.42, 0.42, 0.3, 16]} position={[0, -0.4, 0]}>
                    <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.1} />
                </Cylinder>
            )}
            {/* Spinal Cord segment (glowing tube in the vertebral canal) */}
            {showDisc && (
                <Cylinder name="cord" args={[0.08, 0.08, 0.8, 8]} position={[0, -0.4, -0.22]}>
                    <meshStandardMaterial 
                        color={color} 
                        emissive={color} 
                        emissiveIntensity={0.8}
                        roughness={0.3} 
                    />
                </Cylinder>
            )}
        </group>
    );
};

const SpineModel = ({ postureState }: { postureState: 'good' | 'warning' | 'critical' }) => {
    const groupRef = useRef<THREE.Group>(null);
    const numVertebrae = 12;

    const baseColors = {
        good: '#a2ff00',      // ohs-green
        warning: '#f9a825',   // ohs-orange
        critical: '#ef4444'   // red-500
    };

    const targetColor = new THREE.Color(baseColors[postureState]);
    const currentColor = useRef(new THREE.Color(baseColors.good));

    // Dynamic curve based on posture state (simulating tech-neck/slouch)
    const getCurve = (index: number) => {
        const normalized = index / numVertebrae;
        let zOffset = 0;
        let pitch = 0;

        if (postureState === 'good') {
            // Natural S-curve
            zOffset = Math.sin(normalized * Math.PI) * 0.5;
            pitch = Math.cos(normalized * Math.PI) * 0.1;
        } else if (postureState === 'warning') {
            // Forward head, loss of lumbar
            zOffset = Math.pow(normalized, 2) * 1.5;
            pitch = normalized * 0.3;
        } else {
            // Severe kyphosis / tech neck
            zOffset = Math.pow(normalized, 2) * 3;
            pitch = normalized * 0.6;
        }

        return { zOffset, pitch };
    };

    useFrame((state, delta) => {
        // Smoothly interpolate colors
        currentColor.current.lerp(targetColor, delta * 16);
        
        if (groupRef.current) {
            // Gentle breathing animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;

            groupRef.current.children.forEach((child, i) => {
                const { zOffset, pitch } = getCurve(i);
                
                // Interpolate positions for smooth transition (increased speed)
                child.position.z = THREE.MathUtils.lerp(child.position.z, -zOffset, delta * 16);
                child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, -pitch, delta * 16);

                // Update material color for bones and cord only
                child.children.forEach((mesh: any) => {
                    if (mesh.material && mesh.name !== 'disc') {
                        mesh.material.color.copy(currentColor.current);
                        if (mesh.name === 'cord') {
                            mesh.material.emissive.copy(currentColor.current).multiplyScalar(0.8);
                        } else {
                            mesh.material.emissive.copy(currentColor.current).multiplyScalar(0.2);
                        }
                    }
                });
            });
        }
    });

    return (
        <group ref={groupRef} position={[0, -3, 0]}>
            {Array.from({ length: numVertebrae }).map((_, i) => (
                <Vertebra
                    key={i}
                    position={[0, i * 0.8, 0]}
                    rotation={[0, 0, 0]}
                    scale={[1 - i * 0.02, 1 - i * 0.02, 1 - i * 0.02]} // Taper slightly towards top
                    color={baseColors.good}
                    showDisc={i > 0}
                />
            ))}
        </group>
    );
};

export const SpineViewer = () => {
    const [postureState, setPostureState] = useState<'good' | 'warning' | 'critical'>('good');

    // Simulate telemetry changes (reduced interval for faster demonstration pacing)
    useEffect(() => {
        const interval = setInterval(() => {
            const states: ('good' | 'warning' | 'critical')[] = ['good', 'warning', 'critical', 'warning'];
            const next = states[Math.floor(Math.random() * states.length)];
            setPostureState(next);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-ohs-navy/80 to-black/90">
            {/* Overlay Telemetry HUD */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Live Biomechanical Telemetry</h4>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                            postureState === 'good' ? 'bg-ohs-green shadow-[0_0_10px_#a2ff00]' : 
                            postureState === 'warning' ? 'bg-ohs-orange shadow-[0_0_10px_#f9a825]' : 
                            'bg-red-500 shadow-[0_0_10px_#ef4444]'
                        }`} />
                        <span className={`text-sm font-bold uppercase tracking-wider ${
                            postureState === 'good' ? 'text-ohs-green' : 
                            postureState === 'warning' ? 'text-ohs-orange' : 
                            'text-red-500'
                        }`}>
                            {postureState === 'good' ? 'Neutral S-Curve' : 
                             postureState === 'warning' ? 'Forward Head Posture' : 
                             'Critical Cervical Load'}
                        </span>
                    </div>
                </div>
            </div>

            <Canvas camera={{ position: [5, 2, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <directionalLight position={[-10, 0, -5]} intensity={0.5} color="#4ade80" />
                <pointLight position={[0, 5, 0]} intensity={0.8} color="#f9a825" />
                
                <SpineModel postureState={postureState} />
                
                <OrbitControls 
                    enablePan={false} 
                    minPolarAngle={Math.PI / 4} 
                    maxPolarAngle={Math.PI / 2} 
                    minDistance={5}
                    maxDistance={15}
                />
            </Canvas>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    MediaPipe 3D Integration Active
                </span>
            </div>
        </div>
    );
};
