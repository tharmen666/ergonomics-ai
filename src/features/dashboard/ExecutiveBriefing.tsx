import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

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
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 border border-white/5 p-8 rounded-3xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <AlertTriangle className="text-ohs-orange" size={32} />
                        <h3 className="text-2xl font-black text-white">Section 37: Acts or Omissions</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed font-medium mb-6">
                        Under Section 37, employers are vicariously liable for the actions of their employees regarding health and safety. The continuous monitoring of remote ergonomic compliance via the Stewardship Engine provides a demonstrable legal defense against claims of negligence.
                    </p>
                    <div className="bg-ohs-orange/10 border border-ohs-orange/30 p-4 rounded-xl flex items-start gap-4">
                        <CheckCircle2 className="text-ohs-orange shrink-0 mt-1" size={20} />
                        <p className="text-sm text-ohs-orange font-bold">Mitigation Strategy: Automatic Behavioral Audit Logs capture employee acceptance and adherence to cognitive standards.</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/40 border border-white/5 p-8 rounded-3xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <ShieldAlert className="text-red-500" size={32} />
                        <h3 className="text-xl md:text-2xl font-black text-white">Section 38: Offences & Penalties</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed font-medium mb-6">
                        Non-compliance carries severe penalties including fines of R100,000 or up to 2 years imprisonment. DOA Lockouts ensure that fatigued or non-compliant personnel cannot authorize high-risk sign-offs, significantly restricting liability exposure.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-4">
                        <CheckCircle2 className="text-red-500 shrink-0 mt-1" size={20} />
                        <p className="text-sm text-red-500 font-bold">Mitigation Strategy: DOA Lockouts enforced. Real-time cognitive tracking blocks critical failures.</p>
                    </div>
                </motion.div>
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
