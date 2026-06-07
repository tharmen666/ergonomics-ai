import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrainingModule } from './TrainingModule';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAgentLog } from '../../store/agentLogStore';
import { useNellyStore } from '../../store/nellyStore';
import { CheckCircle, Play } from 'lucide-react';
import { FRESH_OHS_PROJECT_REGISTRY } from '../../utils/master_ohs_boot';

// Define the Statutory OHS Curriculum dynamically using our master data registry
const stages = [
    {
        id: 'first-aid',
        title: "Stage 1: Basic First Aid (Service Stations)",
        description: "OHS Act compliance first-aid response and biohazard management.",
        modules: [
            {
                id: 'BASIC_FIRST_AID',
                title: FRESH_OHS_PROJECT_REGISTRY.BASIC_FIRST_AID.title,
                description: "Master emergency scene safety assessment, biological protection, high-pressure fuel eye flushes, and statutory handover.",
                duration: "7 min",
                steps: FRESH_OHS_PROJECT_REGISTRY.BASIC_FIRST_AID.steps.map(s => s.title)
            }
        ]
    },
    {
        id: 'fire-fighting',
        title: "Stage 2: Basic Fire Fighting & Equipment",
        description: "Emergency fire suppression, traffic containment, and evacuation control.",
        modules: [
            {
                id: 'BASIC_FIRE_FIGHTING',
                title: FRESH_OHS_PROJECT_REGISTRY.BASIC_FIRE_FIGHTING.title,
                description: "Master alarm activation, panic control, shift sheet log retention, and active fire suppression.",
                duration: "7 min",
                steps: FRESH_OHS_PROJECT_REGISTRY.BASIC_FIRE_FIGHTING.steps.map(s => s.title)
            }
        ]
    },
    {
        id: 'spill-response',
        title: "Stage 3: Emergency Spill Response Training",
        description: "Hydrocarbon and chemical spill containment and environmental protection.",
        modules: [
            {
                id: 'EMERGENCY_SPILL',
                title: FRESH_OHS_PROJECT_REGISTRY.EMERGENCY_SPILL.title,
                description: "Master emergency shutoff isolation, vapor egress, spill containment, and vehicle entry prevention.",
                duration: "7 min",
                steps: FRESH_OHS_PROJECT_REGISTRY.EMERGENCY_SPILL.steps.map(s => s.title)
            }
        ]
    }
];

export const TrainingPage = () => {
    const { addLog } = useAgentLog();
    const { completedModules, recommendations } = useNellyStore();
    const [selectedModule, setSelectedModule] = useState<any>(null);

    const handleStart = (mod: any) => {
        addLog('Nelly', `Initiating training module: ${mod.title}. Monitoring posture compliance.`);
        setSelectedModule(mod);
    };

    return (
        <div className="space-y-12 pb-32">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Professional Curriculum</h2>
                    <p className="text-gray-400 font-medium">Master the 3 Pillars of OHS Statutory Compliance.</p>
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
