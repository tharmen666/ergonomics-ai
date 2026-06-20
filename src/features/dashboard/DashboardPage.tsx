import { ActivityChart, ComplianceRing } from './Charts';
import { Users, AlertCircle, FileText, Target, Shield, Lock } from 'lucide-react';
import { DailySafetyChecklist } from './DailySafetyChecklist';
import { WorkspaceAudit } from './WorkspaceAudit';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import { SafetyStreaks } from '../../components/AI-Coach/SafetyStreaks';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { SpineViewer } from '../../components/agent/SpineViewer';

export const DashboardPage = () => {
    const { cognitiveHandshakePassed, setShowCognitiveHandshake } = useFatigueStore();
    return (
        <div className="space-y-6 pb-20">
            {/* Executive Stewardship Banner */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-ohs p-6 rounded-[2rem] border-l-8 border-ohs-orange flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-ohs-orange/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={16} className="text-ohs-orange" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ohs-orange">Stewardship Protocol Active</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-white">BOARDROOM TRANSPARENCY HUB</h2>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">Cascading OHS Section 37 Liability from Employee to CEO.</p>
                </div>
                <div className="flex gap-4 relative z-10 justify-start sm:justify-end">
                    <div className="text-left sm:text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase">Board Compliance</p>
                        <p className="text-lg sm:text-xl font-black text-ohs-green">100%</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-left sm:text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase">Risk Mitigation</p>
                        <p className="text-lg sm:text-xl font-black text-ohs-blue">SECURE</p>
                    </div>
                </div>
            </motion.div>

            {/* Privacy First Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-ohs-navy border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-lg relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-ohs-blue/10 to-transparent pointer-events-none" />
                <div className="p-2 bg-ohs-blue/20 rounded-lg relative z-10">
                    <Lock className="text-ohs-blue" size={20} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        Privacy-First Telemetry
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">Zero raw camera data is stored. All skeletal telemetry is processed locally and discarded instantly.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Handshake Prompt */}
                    {!cognitiveHandshakePassed && (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-r from-ohs-orange/20 to-transparent border border-ohs-orange/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tight">Daily Cognitive Sync Required</h3>
                                <p className="text-gray-400 font-medium max-w-md">Establish your baseline today to activate Stewardship Authority features and ensure safe operational standard work rates.</p>
                            </div>
                            <button 
                                onClick={() => setShowCognitiveHandshake(true)} 
                                className="premium-button whitespace-nowrap bg-ohs-orange text-ohs-navy px-8 py-4 rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(249,168,37,0.4)] hover:scale-105 hover:shadow-[0_15px_40px_rgba(249,168,37,0.6)] transition-all duration-300 ease-out active:scale-95"
                            >
                                <ShieldCheck size={20} className="mr-2 inline-block -mt-1" />
                                INITIATE HANDSHAKE
                            </button>
                        </motion.div>
                    )}

                    {/* 3D Spine Viewer - Primary Interactive Element */}
                    <div className="h-[400px]">
                        <SpineViewer />
                    </div>

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-ohs p-6 rounded-[2rem]">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-ohs-blue/10 rounded-2xl text-ohs-blue border border-ohs-blue/20">
                                    <Users size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Workforce</p>
                                    <h3 className="text-3xl font-black text-white">1,248</h3>
                                </div>
                            </div>
                        </div>

                        <div className="glass-ohs p-6 rounded-[2rem]">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                                    <AlertCircle size={28} className="animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Critical Risks</p>
                                    <h3 className="text-3xl font-black text-red-500 text-glow-red">3</h3>
                                </div>
                            </div>
                        </div>

                        <div className="glass-ohs p-6 rounded-[2rem] relative overflow-hidden group flex flex-col justify-between">
                            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                                <Target size={80} />
                            </div>
                            <div className="flex flex-col gap-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-ohs-green/10 rounded-2xl text-ohs-green border border-ohs-green/20">
                                        <Target size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">Baseline Target</p>
                                        <h3 className="text-2xl font-black text-white">35%</h3>
                                    </div>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-ohs-green w-[22%]" />
                                </div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-center">Currently at 22%</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                                <ReportGenerator />
                            </div>
                        </div>
                    </div>

                    <WorkspaceAudit />

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-ohs p-8 rounded-[2.5rem]">
                            <h3 className="text-xl font-black mb-8 tracking-tight text-white flex items-center gap-2">
                                <div className="w-2 h-2 bg-ohs-blue rounded-full" />
                                Engagement Activity
                            </h3>
                            <ActivityChart />
                        </div>

                        <div className="glass-ohs p-8 rounded-[2.5rem] flex flex-col items-center justify-center">
                            <h3 className="text-xl font-black mb-8 self-start tracking-tight text-white flex items-center gap-2">
                                <div className="w-2 h-2 bg-ohs-green rounded-full" />
                                Compliance Velocity
                            </h3>
                            <ComplianceRing percentage={92} />
                            <p className="mt-8 text-center text-sm text-gray-400 font-medium">92% Compliance achieved through Admin-Zero automated workflows.</p>
                        </div>
                    </div>

                    {/* Stewardship Authority Streaks */}
                    <div className="h-[280px]">
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
                            Export Compliance Verification Report
                        </motion.span>
                    )}
                    {status === 'generating' && (
                        <motion.div
                            key="gen"
                            className="flex items-center justify-center gap-2"
                        >
                            <div className="w-3 h-3 border-2 border-ohs-orange border-t-transparent rounded-full animate-spin" />
                            <span>Verifying with Underwriter...</span>
                        </motion.div>
                    )}
                    {status === 'completed' && (
                        <motion.div
                            key="done"
                            className="flex items-center justify-center gap-2"
                        >
                            <Check size={14} />
                            <span>Compliance Verified & Exported</span>
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
                    Insurance Reporting Requirements Met 📋
                </motion.p>
            )}
        </div>
    );
};
