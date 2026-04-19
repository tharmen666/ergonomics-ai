import { GlassCard } from '../../components/ui/GlassCard';
import { ActivityChart, ComplianceRing } from './Charts';
import { Users, AlertCircle, FileText } from 'lucide-react';
import { DailySafetyChecklist } from './DailySafetyChecklist';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import { SafetyStreaks } from '../../components/AI-Coach/SafetyStreaks';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { GlowButton } from '../../components/ui/GlowButton';

export const DashboardPage = () => {
    const { cognitiveHandshakePassed, setShowCognitiveHandshake } = useFatigueStore();
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Handshake Prompt */}
                    {!cognitiveHandshakePassed && (
                        <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-black text-white">Daily Cognitive Sync Required</h3>
                                <p className="text-sm text-gray-400">Establish your baseline today to activate Digital Wingman features.</p>
                            </div>
                            <GlowButton onClick={() => setShowCognitiveHandshake(true)} className="whitespace-nowrap">
                                <ShieldCheck size={18} className="mr-2 inline-block -mt-1" />
                                Initiate Handshake
                            </GlowButton>
                        </div>
                    )}

                    {/* Industrial Mode Quick Action */}
                    <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                        <div>
                            <h3 className="text-xl font-black text-red-500">Industrial Logistics Mode</h3>
                            <p className="text-sm text-gray-400">Warehouse and heavy equipment handlers overwatch.</p>
                        </div>
                        <GlowButton onClick={() => useFatigueStore.getState().setFatigueLevel?.('high')} className="whitespace-nowrap bg-red-600 hover:bg-red-700">
                            <AlertCircle size={18} className="mr-2 inline-block -mt-1" />
                            Report High Strain
                        </GlowButton>
                    </div>

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-ohs-blue/20 rounded-xl text-ohs-blue">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Total Employees</p>
                                    <h3 className="text-2xl font-bold">1,248</h3>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Critical Risks</p>
                                    <h3 className="text-2xl font-bold">3</h3>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-ohs-orange/20 rounded-xl text-ohs-orange">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Reports Due</p>
                                        <h3 className="text-2xl font-bold">12</h3>
                                    </div>
                                </div>
                                <ReportGenerator />
                            </div>
                        </GlassCard>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GlassCard>
                            <h3 className="text-lg font-semibold mb-6">Engagement Activity</h3>
                            <ActivityChart />
                        </GlassCard>

                        <GlassCard className="flex flex-col items-center justify-center">
                            <h3 className="text-lg font-semibold mb-6 self-start">Overall Compliance</h3>
                            <ComplianceRing percentage={92} />
                            <p className="mt-6 text-center text-sm text-gray-400">Excellent rating based on completion of daily checklists.</p>
                        </GlassCard>
                    </div>

                    {/* Digital Wingman Streaks */}
                    <div className="h-[250px]">
                        <SafetyStreaks />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <DailySafetyChecklist />
                </div>
            </div>
        </div>
    );
};

const ReportGenerator = () => {
    const [status, setStatus] = useState<'idle' | 'generating' | 'completed'>('idle');

    const handleGenerate = () => {
        setStatus('generating');
        setTimeout(() => {
            setStatus('completed');
            setTimeout(() => setStatus('idle'), 5000);
        }, 3000);
    };

    return (
        <div className="mt-4">
            <button
                onClick={handleGenerate}
                disabled={status !== 'idle'}
                className={`w-full py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-500 relative overflow-hidden ${status === 'idle' ? 'bg-ohs-orange/10 text-ohs-orange hover:bg-ohs-orange hover:text-ohs-navy shadow-lg shadow-ohs-orange/5' :
                    status === 'generating' ? 'bg-white/5 text-gray-500 cursor-wait' :
                        'bg-ohs-green text-ohs-navy shadow-lg shadow-ohs-green/20'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            Generate & Auto-File Report
                        </motion.span>
                    )}
                    {status === 'generating' && (
                        <motion.div
                            key="gen"
                            className="flex items-center justify-center gap-2"
                        >
                            <div className="w-3 h-3 border-2 border-ohs-orange border-t-transparent rounded-full animate-spin" />
                            <span>Compiling OHS File...</span>
                        </motion.div>
                    )}
                    {status === 'completed' && (
                        <motion.div
                            key="done"
                            className="flex items-center justify-center gap-2"
                        >
                            <Check size={14} />
                            <span>Filed in Digital Dossier</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
            {status === 'completed' && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[9px] text-ohs-green font-black uppercase mt-2 text-center tracking-widest"
                >
                    Admin-Zero Process Complete: Board Notified 📧
                </motion.p>
            )}
        </div>
    );
};
