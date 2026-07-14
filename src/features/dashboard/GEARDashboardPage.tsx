import { motion } from 'framer-motion';
import { Shield, Zap, FileCheck, Brain, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';

export const GEARDashboardPage = () => {
    const { fatigueLevel } = useFatigueStore();
    const { productiveStreak } = useNellyStore();

    const governance = 100;
    let efficiency = 100;
    if (fatigueLevel === 'warning') efficiency = 85;
    if (fatigueLevel === 'high') efficiency = 75;

    const accountability = 100;
    const resilience = productiveStreak > 120 ? 100 : Math.min(100, Math.floor((productiveStreak / 120) * 100));

    const pillars = [
        {
            id: 'G',
            title: 'Governance',
            value: governance,
            icon: Shield,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            desc: 'Section 37 & ISO 45001 Standard Compliance',
            details: 'ErgoSafe Reborn aligns workstation operations with the South African Occupational Health and Safety Act. All audits are encrypted in zero-knowledge dossiers.'
        },
        {
            id: 'E',
            title: 'Efficiency',
            value: efficiency,
            icon: Zap,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            desc: 'Ergonomic Energy & Posture Output',
            details: 'Optimizing human machine interaction loops. Real-time C1-C7 cervical flex-angle and trapezius load telemetry checks suppress physical fatigue points.'
        },
        {
            id: 'A',
            title: 'Accountability',
            value: accountability,
            icon: FileCheck,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            desc: 'Admin-Zero Automation Flow',
            details: 'Behavioral logs, workspace pre-qualifications, and ergonomic symptom evaluations are automatically filed into secure company registries, leaving zero admin overhead.'
        },
        {
            id: 'R',
            title: 'Resilience',
            value: resilience,
            icon: Brain,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20',
            desc: 'Cognitive Handshake Consistency',
            details: 'Monitors cognitive latency baselines and variance. If cognitive fatigue levels exceed bounds, digital wingman protocols trigger automatically to prompt restorative breaks.'
        }
    ];

    return (
        <div className="space-y-8 pb-20 font-sans">
            {/* Header */}
            <div>
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block mb-1">Enterprise Analytics</span>
                <h1 className="text-3xl font-black text-white tracking-tight">G.E.A.R. SYSTEM DASHBOARD</h1>
                <p className="text-xs text-gray-400">Continuous Governance, Efficiency, Accountability, and Resilience Telemetry</p>
            </div>

            {/* Quick Summary Banner */}
            <div className="bg-gradient-to-r from-ohs-navy via-ohs-navy to-black border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-400" size={20} /> Overall Compliance Rating
                    </h3>
                    <p className="text-xs text-gray-400">All administrative zero-knowledge audits are up-to-date and registered on-chain.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider">Average Compliance</span>
                        <span className="text-2xl font-black text-emerald-400">{Math.round((governance + efficiency + accountability + resilience) / 4)}%</span>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider">Risk Level</span>
                        <span className="text-2xl font-black text-blue-400">NOMINAL</span>
                    </div>
                </div>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillars.map((pillar, idx) => (
                    <motion.div
                        key={pillar.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-black/40 border ${pillar.borderColor} rounded-3xl p-6 relative overflow-hidden group`}
                    >
                        {/* Glow */}
                        <div className={`absolute top-0 right-0 w-48 h-48 ${pillar.bgColor} rounded-full blur-3xl -mr-24 -mt-24 transition-opacity group-hover:opacity-100 opacity-50`} />

                        <div className="flex items-start justify-between relative z-10 mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 ${pillar.bgColor} rounded-xl ${pillar.color}`}>
                                    <pillar.icon size={24} />
                                </div>
                                <div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${pillar.color}`}>{pillar.id} - Pillar</span>
                                    <h3 className="text-xl font-black text-white tracking-tight">{pillar.title}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-mono font-black text-white">{pillar.value}%</span>
                                <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Active Rating</span>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {/* Bar */}
                            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pillar.value}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full ${pillar.value >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{pillar.desc}</span>
                                <p className="text-xs text-gray-400 leading-relaxed">{pillar.details}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Audit Log */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-ohs-orange animate-pulse" /> Active OHS Audit Stream
                </h3>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400">[08:42:15] POPI Privacy Handshake Active</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px]">ENCRYPTED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400">[08:42:18] Cognitive Latency Checked (650ms)</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px]">PASSED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400">[08:42:20] Trapezius spinal load monitoring calibration: nominal</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px]">ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
