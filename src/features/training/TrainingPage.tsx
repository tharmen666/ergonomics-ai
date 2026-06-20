import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrainingModule } from './TrainingModule';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAgentLog } from '../../store/agentLogStore';
import { useNellyStore } from '../../store/nellyStore';
import { useLpsStore } from '../../store/lpsStore';
import { CheckCircle, Play, ShieldAlert } from 'lucide-react';
import { NOTEBOOK_LM_LIBRARIES, OperationalLibrary } from '../../data/notebookLM_content';

export const TrainingPage = () => {
    const { addLog } = useAgentLog();
    const { completedModules, recommendations } = useNellyStore();
    const { incidents } = useLpsStore();
    const [selectedModule, setSelectedModule] = useState<any>(null);

    const hasAssignedTraining = incidents.some(inc => inc.status === 'corrective_action_assigned');

    const handleStart = (lib: OperationalLibrary) => {
        addLog('Nelly', `Initiating NotebookLM training module: ${lib.title}.`);
        
        const mod = {
            id: lib.id,
            title: lib.title,
            description: lib.description,
            duration: lib.duration,
            steps: lib.sections.map(s => `[${s.format.toUpperCase()}] ${s.title}`)
        };
        setSelectedModule(mod);
    };

    return (
        <div className="space-y-12 pb-32">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Professional Curriculum</h2>
                    <p className="text-gray-400 font-medium">NotebookLM Automated Training Modules</p>
                </div>
                <GlassCard className="py-2 px-6 bg-ohs-green/10 border-ohs-green/30">
                    <span className="text-ohs-green font-black uppercase text-xs tracking-widest">
                        Modules Mastered: {completedModules.length}
                    </span>
                </GlassCard>
            </div>

            {hasAssignedTraining && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border bg-ohs-orange/20 border-ohs-orange/50"
                >
                    <div className="flex items-center gap-4">
                        <ShieldAlert className="text-ohs-orange animate-bounce" size={32} />
                        <div>
                            <h3 className="text-xl font-black text-ohs-orange">
                                H&S OFFICER ASSIGNED CORRECTIVE TRAINING
                            </h3>
                            <p className="text-gray-300 font-medium">
                                A Health & Safety Officer has flagged a recent LPS incident for corrective action. Please complete a relevant module.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {NOTEBOOK_LM_LIBRARIES.map((lib, i) => {
                    const isCompleted = completedModules.includes(lib.id);
                    const isRecommended = recommendations.includes(lib.id) || (hasAssignedTraining && !isCompleted);

                    return (
                        <motion.div
                            key={lib.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => handleStart(lib)}
                            className={`relative group cursor-pointer rounded-2xl p-1 transition-all duration-300 ${isRecommended ? 'bg-gradient-to-br from-ohs-orange to-red-500 shadow-[0_0_20px_rgba(249,168,37,0.3)]' : 'bg-transparent'
                                }`}
                        >
                            <GlassCard className="h-full hover:bg-white/5 transition-colors relative overflow-hidden flex flex-col">
                                {isRecommended && (
                                    <div className="absolute top-0 right-0 bg-ohs-orange text-ohs-navy text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest z-10">
                                        Required
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-ohs-green text-ohs-navy' : 'bg-white/10 text-white'
                                        }`}>
                                        {isCompleted ? <CheckCircle size={20} /> : <Play size={20} fill="currentColor" />}
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md">{lib.duration}</span>
                                </div>

                                <div className="mb-4">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-ohs-blue block mb-1">
                                        NotebookLM: {lib.category}
                                    </span>
                                    <h4 className="text-xl font-black text-white leading-tight">{lib.title}</h4>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed flex-1">{lib.description}</p>
                                
                                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
                                    {lib.sections.map((sec, idx) => (
                                        <div key={idx} className="text-center bg-white/5 rounded-md p-1">
                                            <span className="text-[8px] font-black uppercase text-gray-500 block">{sec.format}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
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

