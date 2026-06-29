import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, User, Shield, AlertTriangle } from 'lucide-react';
import { useComplianceStore } from '../../store/complianceStore';

export const HRDashboard = () => {
    const { status, requiresEscalation, logs, resetCompliance } = useComplianceStore();

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                            OHS Compliance & Incident Panel
                        </h2>
                        <p className="text-gray-400 font-medium">
                            Stewardship escalation and legal liability tracking dashboard.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase">System Status:</span>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                            status === 'COMPLIANT' 
                                ? 'bg-ohs-green/20 border border-ohs-green/50 text-ohs-green' 
                                : 'bg-red-500/20 border border-red-500/50 text-red-500 animate-pulse'
                        }`}>
                            {status === 'COMPLIANT' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                            {status}
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle: Compliance Overview & Alert Widget */}
                    <div className="lg:col-span-2 space-y-6">
                        {status === 'BREACH' ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 animate-pulse" />
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-500/20 rounded-2xl text-red-500 animate-bounce">
                                        <AlertTriangle size={32} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                            CRITICAL NON-COMPLIANCE ALERT
                                        </h3>
                                        <p className="text-red-300 text-sm leading-relaxed font-medium">
                                            A severe ergonomic/OHS breach has been triggered by a self-assessment score crossing safety thresholds. Continued unresolved breach risks corporate negligence under Section 37/38 of OHS Act 85.
                                        </p>
                                    </div>
                                </div>

                                {/* Breach logs */}
                                {logs.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-red-500/20 space-y-2">
                                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Breach Details:</h4>
                                        <div className="bg-black/40 p-4 rounded-xl text-xs space-y-1 font-mono text-red-200 border border-red-500/10">
                                            <p>Score: {logs[0].score} (Threshold: {logs[0].threshold})</p>
                                            <p>Triggered At: {new Date(logs[0].timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-start">
                                    <button
                                        onClick={resetCompliance}
                                        className="bg-red-500 hover:bg-red-600 text-white font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider shadow-lg shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
                                    >
                                        RESOLVE INTERVENTION & UPDATE HR RECORDS
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4">
                                <div className="w-16 h-16 bg-ohs-green/20 text-ohs-green rounded-full flex items-center justify-center mx-auto">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white">All Workplace Audits Clear</h3>
                                <p className="text-gray-400 text-sm max-w-md mx-auto">
                                    No active compliance breaches or OHS issues registered. Employees are currently reporting within safe ergonomics baselines.
                                </p>
                            </div>
                        )}

                        {/* Recent compliance logging timeline */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                Historic Compliance Logs
                            </h4>
                            {logs.length === 0 ? (
                                <p className="text-xs text-gray-500 font-medium">No prior compliance logs filed.</p>
                            ) : (
                                <div className="space-y-3">
                                    {logs.map((log, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
                                            <div className="space-y-1">
                                                <p className="font-bold text-white">Ergonomic Breach Event (Score: {log.score})</p>
                                                <p className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                            <span className="text-red-400 font-bold uppercase text-[10px] bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
                                                Audited
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Stewardship Escalation Timeline */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
                                Stewardship Escalation
                            </h4>
                            <p className="text-xs text-gray-400">
                                Cascading chain of command verification.
                            </p>
                        </div>

                        <div className="relative border-l-2 border-white/10 pl-6 ml-4 space-y-8 py-2">
                            {/* Step 1: User */}
                            <div className="relative">
                                <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                                    status === 'BREACH' 
                                        ? 'bg-red-500/20 border-red-500 text-red-400' 
                                        : 'bg-ohs-green/20 border-ohs-green text-ohs-green'
                                }`}>
                                    <User size={12} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-wider">Step 1: Employee Flagged</p>
                                    <p className="text-[11px] text-gray-400">Self-assessment score exceeded threshold.</p>
                                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        status === 'BREACH' ? 'bg-red-500/20 text-red-400' : 'bg-ohs-green/20 text-ohs-green'
                                    }`}>
                                        {status === 'BREACH' ? 'ACTIVE BREACH' : 'COMPLIANT'}
                                    </span>
                                </div>
                            </div>

                            {/* Step 2: Line Manager */}
                            <div className="relative">
                                <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                                    requiresEscalation 
                                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                                        : 'bg-white/10 border-white/10 text-gray-500'
                                }`}>
                                    <Shield size={12} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-wider">Step 2: Line Manager Escalation</p>
                                    <p className="text-[11px] text-gray-400">Notification sent to immediate supervisor for correction.</p>
                                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        requiresEscalation ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {requiresEscalation ? 'PENDING ACTION' : 'IDLE'}
                                    </span>
                                </div>
                            </div>

                            {/* Step 3: HR Head */}
                            <div className="relative">
                                <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                                    requiresEscalation 
                                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                                        : 'bg-white/10 border-white/10 text-gray-500'
                                }`}>
                                    <Shield size={12} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-wider">Step 3: HR Head Escalation</p>
                                    <p className="text-[11px] text-gray-400">Formal notification filed to HR head directory.</p>
                                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        requiresEscalation ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {requiresEscalation ? 'PENDING AUDIT' : 'IDLE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
