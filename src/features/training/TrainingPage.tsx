import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrainingModule } from './TrainingModule';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAgentLog } from '../../store/agentLogStore';
import { useMellyStore } from '../../store/mellyStore';
import { CheckCircle, Play } from 'lucide-react';

// Define the Professional Curriculum Stages
const stages = [
    {
        id: 'foundation',
        title: "Stage 1: Ergonomic Foundation",
        description: "Master the basics of neutral posture and workspace setup.",
        modules: [
            {
                id: 'monitor-mastery',
                title: "Monitor Mastery",
                description: "Optimize screen height and distance to prevent neck strain. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "3 min",
                steps: ["Sit at arm's length", "Top of screen at eye level", "Tilt slightly back", "Adjust brightness"]
            },
            {
                id: 'lumbar-lock',
                title: "Lumbar Lock-In",
                description: "Secure your lower back for all-day spinal support. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "2 min",
                steps: ["Sit deep in chair", "Adjust lumbar support height", "Feet flat on floor", "Hips slightly above knees"]
            },
            {
                id: '20-20-20',
                title: "The 20-20-20 Eye Rule",
                description: "Digital eye strain prevention protocol (for digital strain). OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "1 min",
                steps: ["Every 20 mins", "Look 20 feet away", "For 20 seconds", "Blink rapidly"]
            }
        ]
    },
    {
        id: 'office-alignment',
        title: "Stage 2: Office Alignment",
        description: "Targeted exercises for desk workers.",
        modules: [
            {
                id: 'shoulder-rolls',
                title: "Shoulder Rolls",
                description: "Release upper body tension with simple circular motions. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "2 min",
                steps: ["Sit up straight", "Roll shoulders back", "Repeat 10 times", "Breathe deeply"]
            },
            {
                id: 'wrist-flexor',
                title: "Wrist Flexor Stretches",
                description: "Prevent repetitive strain in the wrists and forearms. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "2 min",
                steps: ["Extend arm forward", "Pull fingers back", "Hold 15 seconds", "Switch arms"]
            },
            {
                id: 'lateral-neck',
                title: "Lateral Neck Tilts",
                description: "Relieve neck stiffness from extended screen monitoring. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "1 min",
                steps: ["Look straight ahead", "Tilt ear to shoulder", "Hold 10 seconds", "Switch sides"]
            }
        ]
    },
    {
        id: 'remote',
        title: "Stage 3: Remote & Call Center Pro",
        description: "Specialized tactics for mobile and high-volume desk work.",
        modules: [
            {
                id: 'mobile-command',
                title: "Mobile Command Center",
                description: "Ergonomics for laptops and temporary workstations. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "4 min",
                steps: ["Elevate laptop", "External keyboard/mouse", "Check lighting", "Sit supportive"]
            },
            {
                id: 'stress-dump',
                title: "High-Volume Decompression",
                description: "Micro-breaks to reset after difficult calls. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "2 min",
                steps: ["Deep breath in", "Box breathing", "Shake out hands", "Reset posture"]
            }
        ]
    },
    {
        id: 'continuous',
        title: "Stage 4: Continuous Improvement",
        description: "Agent-led analysis of risky behaviors and corrective actions.",
        modules: [
            {
                id: 'risk-audit',
                title: "Self-Audit Procedures",
                description: "How to spot your own ergonomic red flags. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "5 min",
                steps: ["Scan environment", "Check body tension", "Review daily log", "Adjust as needed"]
            },
            {
                id: 'corrective-flow',
                title: "Corrective Flow",
                description: "Advanced stretches for chronic trouble spots. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "6 min",
                steps: ["Targeted neck release", "Deep hip opener", "Thoracic extension", "Nerve gliding"]
            }
        ]
    }
];

export const TrainingPage = () => {
    const { addLog } = useAgentLog();
    const { completedModules, recommendations } = useMellyStore();
    const [selectedModule, setSelectedModule] = useState<any>(null);

    const handleStart = (mod: any) => {
        addLog('Melly', `Initiating training module: ${mod.title}. Monitoring posture compliance.`);
        setSelectedModule(mod);
    };

    return (
        <div className="space-y-12 pb-32">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Professional Curriculum</h2>
                    <p className="text-gray-400 font-medium">Master the 4 Pillars of Ergonomic Excellence.</p>
                </div>
                <GlassCard className="py-2 px-6 bg-ohs-green/10 border-ohs-green/30">
                    <span className="text-ohs-green font-black uppercase text-xs tracking-widest">
                        Modules Mastered: {completedModules.length}
                    </span>
                </GlassCard>
            </div>

            <div className="space-y-16">
                {stages.map((stage, i) => (
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-6"
                    >
                        <div className="border-b border-white/10 pb-4">
                            <h3 className="text-2xl font-black text-ohs-orange uppercase tracking-wide">{stage.title}</h3>
                            <p className="text-gray-400 text-sm">{stage.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stage.modules.map((mod) => {
                                const isCompleted = completedModules.includes(mod.id);
                                const isRecommended = recommendations.includes(stage.id) || recommendations.includes(mod.id);

                                return (
                                    <div
                                        key={mod.id}
                                        onClick={() => handleStart(mod)}
                                        className={`relative group cursor-pointer rounded-2xl p-1 transition-all duration-300 ${isRecommended ? 'bg-gradient-to-br from-ohs-orange to-red-500 shadow-[0_0_20px_rgba(249,168,37,0.3)]' : 'bg-transparent'
                                            }`}
                                    >
                                        <GlassCard className="h-full hover:bg-white/5 transition-colors relative overflow-hidden">
                                            {isRecommended && (
                                                <div className="absolute top-0 right-0 bg-ohs-orange text-ohs-navy text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest z-10">
                                                    Recommended
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-ohs-green text-ohs-navy' : 'bg-white/10 text-white'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle size={20} /> : <Play size={20} fill="currentColor" />}
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md">{mod.duration}</span>
                                            </div>

                                            <h4 className="text-lg font-bold text-white mb-2 leading-tight">{mod.title}</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">{mod.description}</p>
                                        </GlassCard>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedModule && (
                    <TrainingModule
                        {...selectedModule}
                        onClose={() => setSelectedModule(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
