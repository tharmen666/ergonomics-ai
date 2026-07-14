import { motion } from 'framer-motion';
import { Building2, Home, FileCheck, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

export const WorkspaceAudit = () => {
    return (
        <GlassCard className="p-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <FileCheck size={100} />
            </div>
            
            <h3 className="text-xl font-black text-white tracking-tight uppercase mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-ohs-orange rounded-full" />
                Workspace Telemetry & Audit Loop
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Corporate Office */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="text-ohs-blue" size={20} />
                            <span className="font-bold text-white tracking-wide">Corporate HQ</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-ohs-green bg-ohs-green/10 px-2 py-1 rounded-full">
                            Fully Monitored
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Active Desks</span>
                            <span className="font-bold text-white">412 / 500</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Posture Alerts Today</span>
                            <span className="font-bold text-ohs-orange">24</span>
                        </div>
                    </div>
                </div>

                {/* Work From Home */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Home className="text-ohs-orange" size={20} />
                            <span className="font-bold text-white tracking-wide">WFH Remote</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-1 rounded-full animate-pulse">
                            Action Required
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Remote Workers</span>
                            <span className="font-bold text-white">836</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Pending Employer Validations</span>
                            <span className="font-bold text-red-500">112</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3 bg-ohs-orange/10 border border-ohs-orange/20 p-3 rounded-xl">
                    <AlertTriangle className="text-ohs-orange shrink-0 mt-0.5" size={16} />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange block mb-1">
                            Structural Tracking Loop
                        </span>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed">
                            112 WFH setups lack documented employer validation. By OSHA / SA guidelines, unverified remote setups expose the firm to Section 37 liability. Automated Corrective Action routing active.
                        </p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
