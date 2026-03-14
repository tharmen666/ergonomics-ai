import { GlassCard } from '../../components/ui/GlassCard';
import { ActivityChart, ComplianceRing } from './Charts';
import { Users, AlertCircle, FileText } from 'lucide-react';
import { DailySafetyChecklist } from './DailySafetyChecklist';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export const DashboardPage = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
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

                    {/* Recent Activity List */}
                    <GlassCard>
                        <h3 className="text-lg font-semibold mb-4">Live Feed</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">JD</div>
                                        <div>
                                            <p className="text-sm font-medium">John Doe completed "Neck Stretches"</p>
                                            <p className="text-xs text-gray-500">2 mins ago</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-ohs-green">+50 XP</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
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
