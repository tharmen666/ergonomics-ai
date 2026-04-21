import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import { LeanPerformanceRail } from '../../components/AI-Coach/LeanPerformanceRail';

export const ExecutiveBriefing = () => {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 mb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">EXECUTIVE <span className="text-ohs-orange">BRIEFING</span></h2>
                    <p className="text-gray-400 font-medium mt-2">Section 37/38 (OHS Act 85) Live Compliance Telemetry.</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-2xl hidden md:flex items-center gap-4">
                    <ShieldAlert className="text-red-500 animate-pulse" size={24} />
                    <div>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Active Liability Risk</p>
                        <p className="text-sm font-medium text-white">Nominal</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {GlobalComplianceEngine.fetchUnifiedBriefing().map((policy, idx) => (
                    <motion.div
                        key={policy.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-black/40 border border-white/5 p-8 rounded-3xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            {idx % 2 === 0 ? <AlertTriangle className="text-ohs-orange" size={28} /> : <ShieldAlert className="text-red-500" size={28} />}
                            <h3 className="text-xl font-black text-white">{policy.title}</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed font-medium mb-6">
                            {policy.text}
                        </p>
                        <div className={`bg-opacity-10 border p-4 rounded-xl flex items-start gap-4 ${idx % 2 === 0 ? 'bg-ohs-orange border-ohs-orange/30' : 'bg-red-500 border-red-500/30'}`}>
                            <CheckCircle2 className={`${idx % 2 === 0 ? 'text-ohs-orange' : 'text-red-500'} shrink-0 mt-1`} size={20} />
                            <p className={`text-sm font-bold ${idx % 2 === 0 ? 'text-ohs-orange' : 'text-red-500'}`}>
                                Mitigation Strategy: Active Stewardship tracking enforces compliance routing.
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-green-900/20 to-black border border-green-500/30 p-8 rounded-3xl mt-8"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3"><FileText className="text-green-500" size={24} /> Admin-Zero File Status</h3>
                        <p className="text-gray-400 font-medium mt-1">All compliance actions have been automatically assembled into the organizational blockchain ledger.</p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm whitespace-nowrap hidden md:block">
                        NO PENDING OFFENCES
                    </div>
                </div>
            </motion.div>

            {/* v1.4 LPS ROI LAYER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0b0f19] border border-ohs-orange/30 p-8 rounded-3xl mt-8 shadow-[0_0_40px_rgba(249,168,37,0.1)] relative overflow-hidden"
            >
                <TrendingUp className="absolute -right-10 -bottom-10 text-ohs-orange/5" size={150} />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            LPS ROI: <span className="text-ohs-orange">Productivity Recovered</span>
                        </h3>
                        <p className="text-gray-400 font-medium mt-2 leading-relaxed">
                            via Section 37 Compliance. Our continuous Ergo Stability engine is directly tracking and recuperating lost efficiency by aligning OHS legislation directly with overall human effectiveness metrics.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ADK Matrix Layer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/40 border border-white/5 p-8 rounded-3xl mt-8"
            >
                <h3 className="text-xl font-black text-white mb-6">ADK Change Management Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-ohs-orange/20 group-hover:text-ohs-orange/40 transition-colors"><ShieldAlert size={48} /></div>
                        <h4 className="text-ohs-orange font-black mb-2 uppercase tracking-widest text-xs relative z-10">Awareness</h4>
                        <p className="text-sm text-gray-300 font-medium relative z-10 leading-relaxed mb-4">Semantic Firewall Mapping</p>
                        <div className="bg-black/50 p-3 rounded-xl border border-ohs-orange/30">
                            <p className="text-[10px] text-white italic">"Did you know? Under Section 37, 'Reasonable Steps' include the Handshake you just passed."</p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-[#a2ff00]/20 group-hover:text-[#a2ff00]/40 transition-colors"><TrendingUp size={48} /></div>
                        <h4 className="text-[#a2ff00] font-black mb-2 uppercase tracking-widest text-xs relative z-10">Desire</h4>
                        <p className="text-sm text-gray-300 font-medium relative z-10 leading-relaxed mb-4">Kaizen Bonus Gamification</p>
                        <div className="bg-black/50 p-3 rounded-xl border border-[#a2ff00]/30">
                            <p className="text-[10px] text-white italic">"When you hit sub-10% latency, the Cyber-Lime celebration locks your productive streak multiplier."</p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 text-blue-500/20 group-hover:text-blue-500/40 transition-colors"><FileText size={48} /></div>
                        <h4 className="text-blue-500 font-black mb-2 uppercase tracking-widest text-xs relative z-10">Knowledge</h4>
                        <p className="text-sm text-gray-300 font-medium relative z-10 leading-relaxed mb-4">Melly Multilingual ISO Sync</p>
                        <div className="bg-black/50 p-3 rounded-xl border border-blue-500/30">
                            <p className="text-[10px] text-white italic">"Mastery Tip: ISO 45003 maps psychosocial risk—deploy training via isiZulu to cover non-native dynamics."</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <LeanPerformanceRail />
        </div>
    );
};
