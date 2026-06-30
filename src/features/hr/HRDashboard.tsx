import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    ShieldAlert, 
    ShieldCheck, 
    User, 
    Shield, 
    AlertTriangle, 
    Clock, 
    ChevronRight, 
    X, 
    CheckCircle, 
    UserCheck,
    ArrowRight
} from 'lucide-react';
import { useComplianceStore, EmployeeCase, EscalationState } from '../../store/complianceStore';

export const HRDashboard = () => {
    const { 
        status, 
        requiresEscalation, 
        logs, 
        cases, 
        resolveCase, 
        tickSimulatedTime, 
        resetCompliance 
    } = useComplianceStore();

    const [selectedCase, setSelectedCase] = useState<EmployeeCase | null>(null);

    // Dynamic timer ticker: 1 real second = 1 simulated hour
    useEffect(() => {
        const interval = setInterval(() => {
            tickSimulatedTime();
        }, 1000);
        return () => clearInterval(interval);
    }, [tickSimulatedTime]);

    // Keep selectedCase reference fresh if state updates in store
    const activeCase = selectedCase ? cases.find(c => c.id === selectedCase.id) || null : null;

    // Helper to calculate simulated hours left
    const getCountdown = (ex: EmployeeCase) => {
        if (ex.escalationState === 'resolved') return { value: 0, text: 'Resolved', status: 'resolved' };
        if (ex.escalationState === 'escalated_level_2') return { value: 0, text: 'BREACHED - ESCALATED TO CEO', status: 'breached' };
        
        const now = new Date().getTime();
        const created = new Date(ex.createdAt).getTime();
        const elapsedHours = (now - created) / 1000; // 1s = 1h
        const remaining = Math.max(0, ex.timeframeHours - Math.floor(elapsedHours));
        
        if (remaining <= 0) {
            return { value: 0, text: 'Breached', status: 'breached' };
        }
        return { value: remaining, text: `${remaining}h remaining`, status: 'active' };
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                            OHS Compliance & Escalation Audit Trail
                        </h2>
                        <p className="text-gray-400 font-medium">
                            Monitoring Line Manager resolution windows, statutory duties, and HR escalations.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={resetCompliance}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                        >
                            Reset All Cases
                        </button>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                            status === 'COMPLIANT' 
                                ? 'bg-ohs-green/20 border border-ohs-green/50 text-ohs-green' 
                                : 'bg-red-500/20 border border-red-500/50 text-red-500 animate-pulse'
                        }`}>
                            {status === 'COMPLIANT' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                            System Status: {status}
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: OHS Employee Audit Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-white/10 bg-white/5">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Employee Incident Tracker</h3>
                                <p className="text-gray-400 text-xs mt-1">Select an employee profile to view full OHS escalation audit details.</p>
                            </div>
                            
                            <div className="divide-y divide-white/5">
                                {cases.map((c) => {
                                    const countdown = getCountdown(c);
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => setSelectedCase(c)}
                                            className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-all cursor-pointer group ${
                                                activeCase?.id === c.id ? 'bg-ohs-blue/10 border-l-4 border-ohs-orange' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                                                    c.status === 'BREACH' 
                                                        ? 'bg-red-500/20 text-red-500' 
                                                        : c.status === 'RISK_ALERT' 
                                                            ? 'bg-ohs-orange/20 text-ohs-orange' 
                                                            : 'bg-ohs-green/20 text-ohs-green'
                                                }`}>
                                                    {c.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-white text-lg leading-tight group-hover:text-ohs-orange transition-colors">
                                                            {c.employeeName}
                                                        </h4>
                                                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase font-semibold">{c.dept}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.hazardTrigger}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                <div className="text-right">
                                                    <p className={`text-sm font-black ${
                                                        c.status === 'BREACH' ? 'text-red-500' : c.status === 'RISK_ALERT' ? 'text-ohs-orange' : 'text-ohs-green'
                                                    }`}>
                                                        Score: {c.score}%
                                                    </p>
                                                    <div className="flex items-center gap-1 justify-end mt-0.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            c.escalationState === 'resolved' ? 'bg-ohs-green' : 
                                                            c.escalationState === 'escalated_level_2' ? 'bg-red-500 animate-pulse' : 'bg-ohs-orange'
                                                        }`} />
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                                                            {c.escalationState === 'resolved' ? 'Resolved' : 
                                                             c.escalationState === 'escalated_level_2' ? 'CEO Escalated' : 'With Manager'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="text-gray-500 group-hover:text-white transition-colors" size={20} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Cascade Escalation Visual Chain */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
                                    Stewardship Escalation Path
                                </h4>
                                <p className="text-xs text-gray-400">
                                    Cascading statutory OHS accountability.
                                </p>
                            </div>

                            <div className="relative border-l-2 border-white/10 pl-6 ml-4 space-y-8 py-2">
                                <div className="relative">
                                    <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-black ${
                                        status === 'BREACH' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-ohs-green/20 border-ohs-green text-ohs-green'
                                    }`}>
                                        U
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider">Employee Triggered</p>
                                        <p className="text-[10px] text-gray-400">Telemetry violation or exception submission.</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-black ${
                                        requiresEscalation ? 'bg-ohs-orange/20 border-ohs-orange text-ohs-orange' : 'bg-white/5 border-white/10 text-gray-500'
                                    }`}>
                                        LM
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider">Level 1: Line Manager (LM)</p>
                                        <p className="text-[10px] text-gray-400">Assigned manager must resolve in 24h/72h.</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-black ${
                                        requiresEscalation && cases.some(c => c.escalationState === 'escalated_level_2')
                                            ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' 
                                            : 'bg-white/5 border-white/10 text-gray-500'
                                    }`}>
                                        CEO
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider">Level 2: CEO / HR Head</p>
                                        <p className="text-[10px] text-gray-400">Statutory liability triggered. Administrative lockout active.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Slide-out / Expandable Drawer Panel: Escalation Details */}
            <AnimatePresence>
                {activeCase && (
                    <>
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCase(null)}
                            className="fixed inset-0 bg-black z-40 pointer-events-auto"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-ohs-navy/95 border-l border-white/10 p-8 shadow-2xl z-50 overflow-y-auto pointer-events-auto flex flex-col justify-between"
                        >
                            <div className="space-y-8">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block mb-1">
                                            HR Audit Records
                                        </span>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                            Escalation Details
                                        </h3>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedCase(null)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Employee Profile Info */}
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-12 h-12 bg-ohs-orange/20 text-ohs-orange rounded-xl flex items-center justify-center font-black text-lg">
                                        {activeCase.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{activeCase.employeeName}</h4>
                                        <p className="text-xs text-gray-400">{activeCase.dept} Department</p>
                                    </div>
                                </div>

                                {/* Countdown / Breach State Widget */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Resolution Performance Status</span>
                                    {activeCase.escalationState === 'resolved' ? (
                                        <div className="bg-ohs-green/10 border border-ohs-green/20 p-4 rounded-2xl flex items-center gap-3 text-ohs-green">
                                            <UserCheck size={20} />
                                            <div className="text-xs font-bold">
                                                Intervention Resolved & Compliant
                                            </div>
                                        </div>
                                    ) : activeCase.escalationState === 'escalated_level_2' ? (
                                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 text-red-400 animate-pulse">
                                            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                            <div className="text-xs">
                                                <strong className="block font-black uppercase">Level 1 Window Breached</strong>
                                                Manager failed to respond. Escalated to Executive Head (CEO Liability Triggered).
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-ohs-orange/10 border border-ohs-orange/30 p-4 rounded-2xl flex items-center gap-3 text-ohs-orange">
                                            <Clock size={20} className="animate-spin" />
                                            <div className="text-xs font-bold">
                                                Line Manager Action Pending: {getCountdown(activeCase).text} (Simulated)
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* OHS Audit Timeline */}
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Audit Trail Timeline</span>
                                    
                                    <div className="relative border-l-2 border-white/5 pl-4 ml-2 space-y-6 text-xs">
                                        {/* Hazard Triggered */}
                                        <div className="relative">
                                            <span className="absolute -left-[21px] top-0.5 w-2 h-2 rounded-full bg-ohs-orange" />
                                            <div className="space-y-1">
                                                <p className="font-bold text-white">Hazard Trigger / Incident Logged</p>
                                                <p className="text-gray-400 text-[10px]">{new Date(activeCase.createdAt).toLocaleString()}</p>
                                                <p className="text-gray-400 italic">"{activeCase.hazardTrigger}"</p>
                                            </div>
                                        </div>

                                        {/* Assigned Line Manager */}
                                        <div className="relative">
                                            <span className={`absolute -left-[21px] top-0.5 w-2 h-2 rounded-full ${
                                                activeCase.escalationState !== 'triggered' ? 'bg-ohs-orange' : 'bg-gray-700'
                                            }`} />
                                            <div className="space-y-1">
                                                <p className="font-bold text-white">Escalated to Line Manager</p>
                                                <p className="text-gray-400 text-[10px]">Manager: <span className="text-white font-bold">{activeCase.managerName}</span></p>
                                                <p className="text-gray-400 text-[10px]">Resolution Window: <span className="text-ohs-orange font-bold">{activeCase.timeframeHours} Hours (Simulated Seconds)</span></p>
                                            </div>
                                        </div>

                                        {/* CEO / Executive Head */}
                                        <div className="relative">
                                            <span className={`absolute -left-[21px] top-0.5 w-2 h-2 rounded-full ${
                                                activeCase.escalationState === 'escalated_level_2' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gray-700'
                                            }`} />
                                            <div className="space-y-1">
                                                <p className="font-bold text-white">Level 2 Escalation (CEO & HR head)</p>
                                                <p className="text-gray-400 text-[10px]">
                                                    {activeCase.escalationState === 'escalated_level_2' 
                                                        ? 'Active: Corporate statutory liability triggered.' 
                                                        : 'Status: Standby pending resolution window.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 border-t border-white/10 space-y-3">
                                {activeCase.escalationState !== 'resolved' && (
                                    <button
                                        onClick={() => resolveCase(activeCase.id)}
                                        className="w-full bg-ohs-green text-ohs-navy hover:bg-green-400 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)] active:scale-95 cursor-pointer"
                                    >
                                        RESOLVE INTERVENTION & UPDATE HR RECORDS
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedCase(null)}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Dismiss Panel
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
export default HRDashboard;
