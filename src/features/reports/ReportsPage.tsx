import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { BarChart3, TrendingUp, ShieldAlert, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useComplianceStore } from '../../store/complianceStore';

export const ReportsPage: React.FC = () => {
    const { cases, logs } = useComplianceStore();

    const breachCount = cases.filter(c => c.status === 'BREACH' || c.status === 'RISK_ALERT').length;
    const verifiedBBSCount = cases.filter(c => c.hazardTrigger.includes('Verified BBS')).length;

    return (
        <div className="p-3 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-32 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 sm:gap-4 border-b border-white/10 pb-6"
            >
                <div className="p-2.5 sm:p-3 bg-ohs-orange/20 rounded-2xl text-ohs-orange border border-ohs-orange/30 shrink-0">
                    <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block">Regulatory & Analytics Engine</span>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">Analytics & Regulatory Audit Logs</h1>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Evaluate postural risk trends, BBS hazard logs, and historical OHS Section 37 dossiers.</p>
                </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <GlassCard className="p-4 md:p-6">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Average Posture Score</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">94.8%</p>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                        <TrendingUp size={12} className="text-emerald-400" /> +1.2% this week
                    </span>
                </GlassCard>

                <GlassCard className="p-4 md:p-6">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Verified BBS Interventions</p>
                    <p className="text-2xl sm:text-3xl font-black text-teal-400 mt-1">{verifiedBBSCount}</p>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                        <ShieldCheck size={12} className="text-teal-400" /> Completed & verified
                    </span>
                </GlassCard>

                <GlassCard className="p-4 md:p-6">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active High-Risk Breaches</p>
                    <p className={`text-2xl sm:text-3xl font-black mt-1 ${breachCount > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>{breachCount}</p>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                        <ShieldAlert size={12} className={breachCount > 0 ? 'text-red-400' : 'text-emerald-400'} /> {breachCount > 0 ? 'Action required' : 'Critical standard nominal'}
                    </span>
                </GlassCard>
            </div>

            {/* Live BBS Hazard & Incident Audit Table */}
            <GlassCard className="p-4 md:p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <FileText className="text-ohs-orange" size={20} />
                            Behavior-Based Safety (BBS) & Incident Ledger
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Real-time telemetry stream from 3D spine hazard alerts, Prizm driver fatigue checks, and micro-stretches.</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-max">
                        ZERO-KNOWLEDGE POPIA ENCRYPTED
                    </span>
                </div>

                <div className="space-y-3 font-mono text-xs overflow-x-auto">
                    {cases.length > 0 ? (
                        cases.slice(0, 10).map((c) => (
                            <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${
                                        c.status === 'COMPLIANT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                        c.status === 'RISK_ALERT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                        'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                        [{c.status}]
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-slate-100 font-medium truncate">{c.hazardTrigger}</p>
                                        <p className="text-[10px] text-gray-400">{c.employeeName} • {c.dept}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 shrink-0 self-end sm:self-center">
                                    {new Date(c.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        logs.slice(0, 5).map((l, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                                <span className="text-gray-300 truncate">{l.reason}</span>
                                <span className="text-gray-500 text-[10px]">{new Date(l.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>
        </div>
    );
};
