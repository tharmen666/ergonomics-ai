import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import { LeanPerformanceRail } from '../../components/AI-Coach/LeanPerformanceRail';
import { HackathonDemo } from '../../components/HackathonDemo';

import { REASONABLY_PRACTICABLE_2026, RIGHT_TO_DISCONNECT_FRAMEWORK, FINANCIAL_PITCHES } from '../../logic/financePitches';
import { useNellyStore } from '../../store/nellyStore';

export const ExecutiveBriefing = () => {
    const { language } = useNellyStore();
    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 mb-24 overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter">BOARDROOM <span className="text-ohs-orange">TRANSPARENCY HUB</span></h2>
                    <p className="text-gray-400 font-medium mt-2 text-xs sm:text-sm md:text-base">Section 37/38 (OHS Act 85) Live Compliance Telemetry powered by <span className="text-ohs-orange font-bold">Google Gemini</span> & <span className="text-blue-400 font-bold">MongoDB MCP Server</span>.</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <ShieldAlert className="text-red-500 animate-pulse shrink-0" size={24} />
                    <div>
                        <p className="text-[10px] sm:text-xs font-bold text-red-500 uppercase tracking-widest">Active Liability Risk</p>
                        <p className="text-xs sm:text-sm font-medium text-white">Nominal</p>
                    </div>
                </div>
            </motion.div>

            <HackathonDemo />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {GlobalComplianceEngine.fetchUnifiedBriefing(language).map((policy, idx) => (
                    <motion.div
                        key={policy.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
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
                transition={{ delay: 0.15, duration: 0.3 }}
                className="bg-gradient-to-r from-green-900/20 to-black border border-green-500/30 p-8 rounded-3xl mt-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3"><FileText className="text-green-500" size={24} /> Admin-Zero File Status (MongoDB MCP)</h3>
                        <p className="text-gray-400 font-medium mt-1">All compliance actions have been automatically queried and assembled by Google Cloud Agent Builder into the MongoDB compliance ledger.</p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm whitespace-nowrap block text-center sm:text-left w-full sm:w-auto">
                        NO PENDING OFFENCES
                    </div>
                </div>
            </motion.div>

            {/* LPS ROI Layer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
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
                transition={{ delay: 0.25, duration: 0.3 }}
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
                        <p className="text-sm text-gray-300 font-medium relative z-10 leading-relaxed mb-4">Nelly Multilingual ISO Sync</p>
                        <div className="bg-black/50 p-3 rounded-xl border border-blue-500/30">
                            <p className="text-[10px] text-white italic">"Mastery Tip: ISO 45003 maps psychosocial risk—deploy training via isiZulu to cover non-native dynamics."</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 2026 SOVEREIGN FINANCIAL OUTREACH MATRIX */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="bg-gradient-to-br from-ohs-navy via-[#0c1322] to-black border border-ohs-orange/40 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(249,168,37,0.05)] mt-8"
            >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-white/10">
                    <div>
                        <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block mb-1">
                            Sovereign Commercial Matrix 2026
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            FINANCIAL PITCH SENTINEL
                        </h3>
                        <p className="text-gray-400 font-medium text-sm mt-1">
                            Operationalizing the home office 'Duty of Care' & 'Right to Disconnect' standards for Tier-1 Banking & Insurance.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                        <div className="px-4 py-2 bg-ohs-orange/10 border border-ohs-orange/30 rounded-xl text-ohs-orange text-xs font-black uppercase">
                            Reasonably Practicable Standard Active
                        </div>
                        <div className="px-4 py-2 bg-ohs-blue/10 border border-ohs-blue/30 rounded-xl text-ohs-blue text-xs font-black uppercase">
                            Right to Disconnect Shield Active
                        </div>
                    </div>
                </div>

                {/* Statutory Background Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 bg-ohs-orange/10 border-b border-l border-white/10 text-ohs-orange font-black text-[9px] uppercase tracking-wider rounded-bl-xl">
                            {REASONABLY_PRACTICABLE_2026.statuteReference}
                        </div>
                        <h4 className="text-lg font-black text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-ohs-orange" />
                            {REASONABLY_PRACTICABLE_2026.standardName}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium mb-4">
                            {REASONABLY_PRACTICABLE_2026.description}
                        </p>
                        <p className="text-xs text-red-400/90 font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                            {REASONABLY_PRACTICABLE_2026.finesFramework}
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 bg-ohs-blue/10 border-b border-l border-white/10 text-ohs-blue font-black text-[9px] uppercase tracking-wider rounded-bl-xl">
                            {RIGHT_TO_DISCONNECT_FRAMEWORK.ccmaRisk}
                        </div>
                        <h4 className="text-lg font-black text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-ohs-blue" />
                            {RIGHT_TO_DISCONNECT_FRAMEWORK.concept}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium mb-4">
                            {RIGHT_TO_DISCONNECT_FRAMEWORK.description}
                        </p>
                        <p className="text-xs text-ohs-green font-bold bg-ohs-green/10 border border-ohs-green/20 p-3 rounded-xl">
                            Compliance Vector: {RIGHT_TO_DISCONNECT_FRAMEWORK.complianceCode}
                        </p>
                    </div>
                </div>

                {/* Pitch Interactive Deck */}
                <h4 className="text-sm font-black text-ohs-orange uppercase tracking-wider mb-4 px-1">Tailored Financial Outreach Decks</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(FINANCIAL_PITCHES).map(([key, pitch]) => (
                        <div key={key} className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between hover:border-ohs-orange/40 transition-all duration-300 group">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <h5 className="text-xl font-black text-white tracking-tight">{pitch.client}</h5>
                                    <span className="text-[10px] font-black text-gray-400 border border-white/15 px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5">
                                        Active Pitch
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Target: <span className="text-white normal-case font-medium">{pitch.targetAudience}</span></p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Duty of Care: <span className="text-gray-300 normal-case font-medium">{pitch.dutyOfCareFocus}</span></p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Disconnect Strategy: <span className="text-gray-300 normal-case font-medium">{pitch.disconnectStrategy}</span></p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Proposition: <span className="text-ohs-orange normal-case font-medium">{pitch.valueProposition}</span></p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    <span className="text-[10px] font-black text-ohs-orange uppercase block mb-1">Outreach Subject Line:</span>
                                    <p className="text-xs font-bold text-white italic">"{pitch.outreachSubject}"</p>
                                </div>
                                <details className="group/details">
                                    <summary className="text-xs font-black text-ohs-blue hover:text-white transition-colors cursor-pointer list-none flex items-center justify-between">
                                        <span>VIEW SOVEREIGN EMAIL DRAFT</span>
                                        <span className="transform group-open/details:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="mt-4 p-4 bg-black/80 border border-white/5 rounded-xl font-mono text-[10px] text-gray-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line select-all scrollbar-thin">
                                        {pitch.emailDraft}
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <LeanPerformanceRail />
        </div>
    );
};

