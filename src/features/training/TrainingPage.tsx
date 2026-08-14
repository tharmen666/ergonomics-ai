import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrainingModule } from './TrainingModule';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAgentLog } from '../../store/agentLogStore';
import { useNellyStore } from '../../store/nellyStore';
import { useLpsStore } from '../../store/lpsStore';
import { useTenantStore } from '../../store/tenantStore';
import { CheckCircle, Play, ShieldAlert, Award, FileCheck, CheckSquare, Sparkles, X, Printer } from 'lucide-react';
import { NOTEBOOK_LM_LIBRARIES, OperationalLibrary } from '../../data/notebookLM_content';

export const TrainingPage = () => {
    const { addLog } = useAgentLog();
    const { completedModules, recommendations, completeModule } = useNellyStore();
    const { incidents } = useLpsStore();
    const { companyId } = useTenantStore();
    const [selectedModule, setSelectedModule] = useState<any>(null);
    const [certificateModule, setCertificateModule] = useState<OperationalLibrary | null>(null);

    const hasAssignedTraining = incidents.some(inc => inc.status === 'corrective_action_assigned');
    const totalModules = NOTEBOOK_LM_LIBRARIES.length;
    const progressPct = Math.round((completedModules.length / totalModules) * 100);

    const handleStart = (lib: OperationalLibrary) => {
        addLog('Nelly', `Initiating OHS training module: ${lib.title}.`);
        
        const mod = {
            id: lib.id,
            title: lib.title,
            description: lib.description,
            duration: lib.duration,
            steps: lib.sections.map(s => `[${s.format.toUpperCase()}] ${s.title}`),
            onComplete: () => completeModule(lib.id)
        };
        setSelectedModule(mod);
    };

    return (
        <div className="space-y-8 pb-32 font-sans">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block mb-1">
                        SA OHS Act & ISO 45001 Accredited Curriculum
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
                        <Award size={36} className="text-ohs-orange shrink-0" />
                        Enterprise OHS Ergonomics Curriculum
                    </h1>
                    <p className="text-gray-300 text-sm mt-1">
                        Multi-module biomechanics, fleet driving ergonomics, manual material handling, and industrial safety compliance.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <GlassCard className="py-2.5 px-5 bg-emerald-500/10 border-emerald-500/30">
                        <span className="text-emerald-400 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                            <CheckCircle size={16} /> Progress: {progressPct}% ({completedModules.length}/{totalModules} Completed)
                        </span>
                    </GlassCard>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Enterprise Certification Compliance Score</span>
                    <span className="text-ohs-orange font-mono font-black">{progressPct}% Complete</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-ohs-orange via-yellow-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
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

            {/* Course Cards Grid */}
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
                            className={`relative group rounded-2xl p-1 transition-all duration-300 ${isRecommended ? 'bg-gradient-to-br from-ohs-orange to-red-500 shadow-[0_0_20px_rgba(249,168,37,0.3)]' : 'bg-transparent'
                                }`}
                        >
                            <GlassCard className="h-full hover:bg-white/5 transition-colors relative overflow-hidden flex flex-col justify-between p-6">
                                {isRecommended && (
                                    <div className="absolute top-0 right-0 bg-ohs-orange text-ohs-navy text-[9px] font-black px-2.5 py-1 rounded-bl-lg uppercase tracking-widest z-10">
                                        Required Module
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/10 text-white'
                                            }`}>
                                            {isCompleted ? <CheckCircle size={24} /> : <Play size={24} fill="currentColor" />}
                                        </div>
                                        <span className="text-xs font-mono font-bold text-ohs-orange bg-ohs-orange/10 px-3 py-1 rounded-full border border-ohs-orange/20">{lib.duration}</span>
                                    </div>

                                    <div>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-ohs-orange block mb-1">
                                            OHS Category: {lib.category.toUpperCase()}
                                        </span>
                                        <h4 className="text-xl font-black text-white leading-tight">{lib.title}</h4>
                                    </div>

                                    <p className="text-sm text-gray-300 leading-relaxed flex-1">{lib.description}</p>
                                    
                                    <div className="pt-2 grid grid-cols-3 gap-2">
                                        {lib.sections.map((sec, idx) => (
                                            <div key={idx} className="text-center bg-white/5 rounded-lg p-2 border border-white/5">
                                                <span className="text-[9px] font-black uppercase text-gray-400 block truncate">{sec.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                                    <button
                                        onClick={() => handleStart(lib)}
                                        className="flex-1 py-3 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy rounded-xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Play size={16} fill="currentColor" /> {isCompleted ? 'REVIEW MODULE' : 'START COURSE'}
                                    </button>

                                    {isCompleted && (
                                        <button
                                            onClick={() => setCertificateModule(lib)}
                                            className="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer"
                                            title="Generate Official OHS Certificate"
                                        >
                                            <Award size={16} /> CERTIFICATE
                                        </button>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* Selected Course Modal */}
            <AnimatePresence>
                {selectedModule && (
                    <TrainingModule
                        {...selectedModule}
                        onClose={() => setSelectedModule(null)}
                    />
                )}
            </AnimatePresence>

            {/* OHS Certificate Generator Modal */}
            <AnimatePresence>
                {certificateModule && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <div className="max-w-2xl w-full bg-slate-900 border-2 border-emerald-400/50 rounded-3xl p-6 sm:p-10 shadow-[0_0_100px_rgba(16,185,129,0.3)] space-y-6 relative text-white">
                            <button
                                onClick={() => setCertificateModule(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="border-4 border-double border-emerald-400/40 p-6 rounded-2xl bg-black/40 text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40">
                                        <Award size={48} />
                                    </div>
                                </div>

                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] block">
                                    REPUBLIC OF SOUTH AFRICA • OHS ACT 85 OF 1993 COMPLIANT
                                </span>
                                
                                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                    CERTIFICATE OF COMPETENCY
                                </h2>

                                <p className="text-xs text-gray-300 font-medium max-w-md mx-auto">
                                    This certifies that the employee has successfully completed the accredited ergonomics and biomechanics curriculum module:
                                </p>

                                <div className="py-3 bg-white/5 border border-white/10 rounded-xl max-w-lg mx-auto">
                                    <h3 className="text-lg font-black text-ohs-orange">{certificateModule.title}</h3>
                                    <p className="text-[10px] font-mono text-gray-400 mt-1">ISO 45001 & Section 8 Compliance Verified</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-left text-xs bg-slate-950 p-4 rounded-xl border border-white/5 max-w-lg mx-auto">
                                    <div>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase block">Company / Tenant:</span>
                                        <span className="font-bold text-white">{companyId || 'COMP-001'} (Sovereign Health Ltd)</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase block">Issue Date:</span>
                                        <span className="font-mono font-bold text-emerald-400">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Printer size={16} /> PRINT OFFICIAL CERTIFICATE
                                </button>
                                <button
                                    onClick={() => setCertificateModule(null)}
                                    className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

