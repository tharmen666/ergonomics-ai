import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { BarChart3, TrendingUp, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 pb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 border-b border-white/10 pb-6"
            >
                <BarChart3 className="text-ohs-orange" size={40} />
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Analytics & Reports</h2>
                    <p className="text-gray-400 font-medium">Evaluate postural risk trends, compliance velocities, and historical underwriting safety logs.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Average Posture Score</p>
                    <p className="text-3xl font-black text-ohs-green">94.8%</p>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                        <TrendingUp size={12} className="text-ohs-green" /> +1.2% this week
                    </span>
                </GlassCard>

                <GlassCard className="p-6">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Frontline Audits Executed</p>
                    <p className="text-3xl font-black text-ohs-blue">1,482</p>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                        <CheckCircle2 size={12} className="text-ohs-blue" /> 100% POPI compliant
                    </span>
                </GlassCard>

                <GlassCard className="p-6">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Liability Breaches Logged</p>
                    <p className="text-3xl font-black text-red-500">0</p>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                        <ShieldAlert size={12} className="text-ohs-green" /> Critical standard nominal
                    </span>
                </GlassCard>
            </div>

            <GlassCard className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="text-ohs-orange" size={20} />
                    OHS Act Section 37 Compliance Ledger
                </h3>
                <p className="text-xs text-gray-400 mb-6">Autonomous audit records synced directly via local sharded secure nodes.</p>

                <div className="space-y-4 font-mono text-xs">
                    <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div>
                            <span className="text-ohs-orange font-bold">[NOMINAL]</span>
                            <span className="text-white ml-3">Compliance audit verification report generated</span>
                        </div>
                        <span className="text-gray-500">2026-07-08T03:10:00</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div>
                            <span className="text-ohs-orange font-bold">[NOMINAL]</span>
                            <span className="text-white ml-3">Zero-knowledge POPIA handshake verified</span>
                        </div>
                        <span className="text-gray-500">2026-07-07T18:42:15</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div>
                            <span className="text-ohs-green font-bold">[CLEARED]</span>
                            <span className="text-white ml-3">Ergonomic self-assessment completed successfully</span>
                        </div>
                        <span className="text-gray-500">2026-07-07T09:15:30</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
