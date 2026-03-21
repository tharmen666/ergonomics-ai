import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';

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
        </div>
    );
};
