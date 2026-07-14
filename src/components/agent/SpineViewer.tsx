import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const Vertebra = ({ position, rotation, color, scale, showDisc }: any) => {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* The main body of the vertebra */}
            <Cylinder name="bone" args={[0.48, 0.48, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial {...({ color, roughness: 0.5, metalness: 0.2 } as any)} />
            </Cylinder>
            {/* Spinous process (back spike) */}
            <Box name="bone" args={[0.18, 0.18, 0.7]} position={[0, 0, -0.5]}>
                <meshStandardMaterial {...({ color, roughness: 0.6, metalness: 0.2 } as any)} />
            </Box>
            {/* Intervertebral disc (fibrous cartilage connection) */}
            {showDisc && (
                <Cylinder name="disc" args={[0.42, 0.42, 0.3, 16]} position={[0, -0.4, 0]}>
                    <meshStandardMaterial {...({ color: "#111827", roughness: 0.9, metalness: 0.1 } as any)} />
                </Cylinder>
            )}
            {/* Spinal Cord segment (glowing tube in the vertebral canal) */}
            {showDisc && (
                <Cylinder name="cord" args={[0.08, 0.08, 0.8, 8]} position={[0, -0.4, -0.22]}>
                    <meshStandardMaterial {...({ 
                        color: color, 
                        emissive: color, 
                        emissiveIntensity: 0.8,
                        roughness: 0.3 
                    } as any)} />
                </Cylinder>
            )}
        </group>
    );
};

const SpineModel = ({ 
    postureState, 
    selectedSection 
}: { 
    postureState: 'good' | 'warning' | 'critical', 
    selectedSection: 'C1-C7' | 'T1-T12' | 'L1-L5' | null 
}) => {
    const groupRef = useRef<any>(null);
    const numVertebrae = 12;

    const baseColors = {
        good: '#10b981',      // neon emerald/green
        warning: '#f59e0b',   // amber
        critical: '#ef4444'   // red
    };

    const targetColor = new (THREE as any).Color(baseColors[postureState]);
    const currentColor = useRef(new (THREE as any).Color(baseColors.good));

    // Dynamic curve based on posture state (simulating tech-neck/slouch)
    const getCurve = (index: number) => {
        const normalized = index / numVertebrae;
        let zOffset = 0;
        let pitch = 0;

        if (postureState === 'good') {
            zOffset = Math.sin(normalized * Math.PI) * 0.4;
            pitch = Math.cos(normalized * Math.PI) * 0.08;
        } else if (postureState === 'warning') {
            zOffset = Math.pow(normalized, 2) * 1.2;
            pitch = normalized * 0.25;
        } else {
            zOffset = Math.pow(normalized, 2) * 2.5;
            pitch = normalized * 0.5;
        }

        return { zOffset, pitch };
    };

    useFrame((state, delta) => {
        currentColor.current.lerp(targetColor, delta * 12);
        
        if (groupRef.current) {
            // Gentle breathing animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.08 - 2.5;

            // Auto-rotate based on selection to give dynamic inspection angles
            let targetRotationY = state.clock.elapsedTime * 0.2;
            if (selectedSection === 'C1-C7') {
                targetRotationY = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
            } else if (selectedSection === 'L1-L5') {
                targetRotationY = -Math.PI / 4 + Math.cos(state.clock.elapsedTime * 0.5) * 0.15;
            } else if (selectedSection === 'T1-T12') {
                targetRotationY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            }
            groupRef.current.rotation.y = (THREE as any).MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, delta * 8);

            groupRef.current.children.forEach((child: any, i: number) => {
                const { zOffset, pitch } = getCurve(i);
                
                // Interpolate positions for smooth transition
                child.position.z = (THREE as any).MathUtils.lerp(child.position.z, -zOffset, delta * 12);
                child.rotation.x = (THREE as any).MathUtils.lerp(child.rotation.x, -pitch, delta * 12);

                // Highlight regional selection
                let isRegionSelected = false;
                if (selectedSection === 'C1-C7' && i >= 8) isRegionSelected = true;
                if (selectedSection === 'T1-T12' && i >= 4 && i < 8) isRegionSelected = true;
                if (selectedSection === 'L1-L5' && i < 4) isRegionSelected = true;

                // Update material colors
                child.children.forEach((mesh: any) => {
                    if (mesh.material && mesh.name !== 'disc') {
                        const finalColor = isRegionSelected
                            ? new (THREE as any).Color(baseColors[postureState])
                            : (selectedSection ? new (THREE as any).Color('#1f2937') : currentColor.current);

                        mesh.material.color.copy(finalColor);
                        if (mesh.name === 'cord') {
                            mesh.material.emissive.copy(finalColor).multiplyScalar(isRegionSelected ? 2.0 : 0.3);
                        } else {
                            mesh.material.emissive.copy(finalColor).multiplyScalar(isRegionSelected ? 1.0 : 0.05);
                        }
                    }
                });
            });
        }
    });

    return (
        <group ref={groupRef} position={[0, -2.5, 0]}>
            {Array.from({ length: numVertebrae }).map((_, i) => (
                <Vertebra
                    key={i}
                    position={[0, i * 0.75, 0]}
                    rotation={[0, 0, 0]}
                    scale={[1 - i * 0.02, 1 - i * 0.02, 1 - i * 0.02]}
                    color={baseColors.good}
                    showDisc={i > 0}
                />
            ))}
        </group>
    );
};

export const SpineViewer = () => {
    const [postureState, setPostureState] = useState<'good' | 'warning' | 'critical'>('good');
    const [selectedSection, setSelectedSection] = useState<'C1-C7' | 'T1-T12' | 'L1-L5' | null>(null);

    // Watch for intervention triggers (like Nelly's neck pain notification)
    useEffect(() => {
        const handleIntervention = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail === 'micro-stretch') {
                setSelectedSection('C1-C7');
                setPostureState('critical');
            }
        };
        window.addEventListener('TRIGGER_INTERVENTION', handleIntervention);
        return () => window.removeEventListener('TRIGGER_INTERVENTION', handleIntervention);
    }, []);

    // Interactive Selector Calculations
    const sectionDetails = {
        'C1-C7': {
            title: "Cervical Spine (Neck)",
            standard: "10-12 lbs",
            current: postureState === 'good' ? "12 lbs" : postureState === 'warning' ? "32 lbs" : "60 lbs",
            advice: "Tech-neck curvature detected. Activating Tier 2 orthopedic decompression. Perform a retraction stretch immediately."
        },
        'T1-T12': {
            title: "Thoracic Spine (Upper Back)",
            standard: "35-40 lbs",
            current: postureState === 'good' ? "40 lbs" : postureState === 'warning' ? "65 lbs" : "90 lbs",
            advice: "Scapular rounding detected. Roll shoulders back and pull shoulder blades downward to open chest."
        },
        'L1-L5': {
            title: "Lumbar Spine (Lower Back)",
            standard: "100 lbs",
            current: postureState === 'good' ? "100 lbs" : postureState === 'warning' ? "145 lbs" : "210 lbs",
            advice: "Lower back slouching detected. Slide hips fully backward and engage the lumbar chair support."
        }
    };

    return (
        <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-ohs-navy/90 to-black/95 flex flex-col md:flex-row p-4 md:p-6 gap-4">
            
            {/* 3D Canvas */}
            <div className="flex-1 min-h-[220px] md:min-h-0 relative rounded-2xl bg-black/45 border border-white/5 overflow-hidden">
                <Canvas camera={{ position: [0, 0, 7.5], fov: 40 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
                    <directionalLight position={[-10, 0, -5]} intensity={0.6} color="#10b981" />
                    <pointLight position={[0, 4, 0]} intensity={1.0} color="#f59e0b" />
                    
                    <SpineModel postureState={postureState} selectedSection={selectedSection} />
                    
                    <OrbitControls 
                        enablePan={false} 
                        minPolarAngle={Math.PI / 4} 
                        maxPolarAngle={Math.PI / 2} 
                        minDistance={4}
                        maxDistance={12}
                    />
                </Canvas>

                {/* Status Indicator overlay */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                            postureState === 'good' ? 'bg-[#10b981] shadow-[0_0_10px_#10b981]' : 
                            postureState === 'warning' ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' : 
                            'bg-red-500 shadow-[0_0_10px_#ef4444]'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-100">
                            {postureState === 'good' ? 'NEUTRAL S-CURVE' : 
                             postureState === 'warning' ? 'POSTURAL DEVIATION' : 
                             'CRITICAL TIER 2 LOAD'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Diagnostic Control Hub Panel */}
            <div className="w-full md:w-[240px] flex flex-col justify-between gap-4">
                
                {/* Regional Vertebrae Selector Buttons */}
                <div className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Interactive Selectors</h4>
                    <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                        {(['C1-C7', 'T1-T12', 'L1-L5'] as const).map((sec) => {
                            const isSelected = selectedSection === sec;
                            return (
                                <button
                                    key={sec}
                                    onClick={() => setSelectedSection(selectedSection === sec ? null : sec)}
                                    className={`py-2 px-3 rounded-xl text-left transition-all duration-300 border font-black text-[10px] flex flex-col justify-between ${
                                        isSelected 
                                            ? 'bg-gradient-to-r from-teal-900/60 to-emerald-950/60 border-[#10b981]/50 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10'
                                    }`}
                                >
                                    <span>{sec === 'C1-C7' ? 'Cervical' : sec === 'T1-T12' ? 'Thoracic' : 'Lumbar'}</span>
                                    <span className="text-[8px] font-bold text-gray-500 mt-1">{sec}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Real-time Dynamic Stress & Advice Diagnostic HUD */}
                <div className="flex-1 flex flex-col justify-center bg-black/35 border border-white/5 rounded-2xl p-4 min-h-[140px] relative overflow-hidden">
                    {selectedSection ? (
                        <div className="space-y-2">
                            <h5 className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 uppercase tracking-wider">
                                {sectionDetails[selectedSection].title}
                            </h5>
                            
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-[9px] font-bold text-gray-500 uppercase">Standard Load</span>
                                <span className="text-[10px] font-black text-slate-100">{sectionDetails[selectedSection].standard}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-[9px] font-bold text-gray-500 uppercase">Calculated Stress</span>
                                <span className={`text-[11px] font-black ${
                                    postureState === 'good' ? 'text-[#10b981]' : 
                                    postureState === 'warning' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                    {sectionDetails[selectedSection].current}
                                </span>
                            </div>

                            <p className="text-[9.5px] text-slate-300 font-medium leading-relaxed mt-2 text-shadow-sm">
                                {sectionDetails[selectedSection].advice}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Diagnostic State</p>
                            <p className="text-[9px] text-gray-500 font-medium leading-normal px-2">
                                Click a vertebrae region selector above to synchronize biomechanical stress calculations and receive corrective posture advice.
                            </p>
                        </div>
                    )}
                </div>

                {/* Posture State Toggle Controls for Demo verification */}
                <div className="flex justify-between gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                    {(['good', 'warning', 'critical'] as const).map((state) => (
                        <button
                            key={state}
                            onClick={() => setPostureState(state)}
                            className={`flex-1 text-[9px] font-black py-1.5 rounded-lg uppercase transition-all duration-300 ${
                                postureState === state
                                    ? state === 'good' ? 'bg-[#10b981] text-ohs-navy shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                    : state === 'warning' ? 'bg-amber-400 text-ohs-navy shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                                    : 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {state}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};
