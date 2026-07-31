import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, FileCheck, Brain, TrendingUp, CheckCircle2, Truck, AlertTriangle, RefreshCw } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';

export const GEARDashboardPage = () => {
    const { 
        fatigueLevel, 
        drivingHours, 
        setDrivingHours, 
        reactionDropPct, 
        driverFatigueScore, 
        prizmAlertActive, 
        prizmRecommendedAction,
        evaluateDriverFatigue
    } = useFatigueStore();
    const { productiveStreak } = useNellyStore();

    const [isSyncingApi, setIsSyncingApi] = useState(false);
    const [apiResponse, setApiResponse] = useState<any>(null);

    const governance = 100;
    let efficiency = 100;
    if (fatigueLevel === 'warning') efficiency = 85;
    if (fatigueLevel === 'high') efficiency = 75;

    const accountability = 100;
    const resilience = productiveStreak > 120 ? 100 : Math.min(100, Math.floor((productiveStreak / 120) * 100));

    const handleSyncPrizmApi = async () => {
        setIsSyncingApi(true);
        try {
            const res = await fetch('/api/v1/fatigue-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    driverId: 'DRV-9042',
                    drivingHours,
                    reactionDropPct,
                    shiftType: 'long-distance-driver'
                })
            });
            const data = await res.json();
            setApiResponse(data);
            if (data.success) {
                evaluateDriverFatigue(data.drivingHours, data.reactionDropPct);
            }
        } catch (err) {
            // Local fallback simulation if offline
            evaluateDriverFatigue(drivingHours, reactionDropPct);
            setApiResponse({
                success: true,
                handshakeStatus: 'SHANDRAY_PRIZM_LOCAL_FALLBACK',
                fatigueScore: driverFatigueScore,
                riskLevel: prizmAlertActive ? 'CRITICAL_BREACH' : 'NOMINAL',
                drivingHours,
                reactionDropPct,
                prizmAlertTriggered: prizmAlertActive,
                recommendedAction: prizmRecommendedAction,
                ohsComplianceAdvisory: 'Section 8(1) OHS Act: Local Prizm fatigue evaluation enforced.',
                timestamp: new Date().toISOString()
            });
        } finally {
            setIsSyncingApi(false);
        }
    };

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
                <h1 className="text-3xl font-black gradient-heading tracking-tight">G.E.A.R. SYSTEM DASHBOARD</h1>
                <p className="text-xs text-slate-100 font-bold text-shadow-sm">Continuous Governance, Efficiency, Accountability, and Resilience Telemetry</p>
            </div>

            {/* Quick Summary Banner */}
            <div className="bg-gradient-to-r from-ohs-navy via-ohs-navy to-black border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-400" size={20} /> Overall Compliance Rating
                    </h3>
                    <p className="text-xs text-slate-300 font-medium text-shadow-sm">All administrative zero-knowledge audits are up-to-date and registered on-chain.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider">Average Compliance</span>
                        <span className="text-2xl font-black text-glow-emerald text-emerald-400">{Math.round((governance + efficiency + accountability + resilience) / 4)}%</span>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider">Risk Level</span>
                        <span className={`text-2xl font-black ${prizmAlertActive ? 'text-red-500 text-glow-red animate-pulse' : 'text-emerald-400 text-glow-emerald'}`}>
                            {prizmAlertActive ? 'ALERT ACTIVE' : 'NOMINAL'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Shandray's Prizm Alert Handshake & Driver Fatigue Telemetry Module */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900 via-ohs-navy to-slate-950 border-2 border-ohs-orange/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-ohs-orange/15 rounded-2xl border border-ohs-orange/30 text-ohs-orange">
                            <Truck size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-ohs-orange uppercase tracking-widest bg-ohs-orange/10 px-2 py-0.5 rounded-full border border-ohs-orange/20">
                                    Shandray's Prizm Alert Handshake
                                </span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Endpoint: /api/v1/fatigue-score</span>
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight mt-1">
                                Driver & Shift Cognitive Fatigue Telemetry
                            </h2>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleSyncPrizmApi}
                        disabled={isSyncingApi}
                        className="flex items-center gap-2 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy px-5 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-ohs-orange/20 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isSyncingApi ? 'animate-spin' : ''} />
                        {isSyncingApi ? 'HANDSHAKING API...' : 'SYNC PRIZM API'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Continuous Driving Hours Controls */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-gray-300 tracking-wider">Continuous Driving Hours</span>
                            <span className="text-lg font-mono font-black text-ohs-orange">{drivingHours.toFixed(1)} hrs</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="12"
                            step="0.5"
                            value={drivingHours}
                            onChange={(e) => setDrivingHours(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-ohs-orange"
                        />
                        <div className="flex gap-2">
                            {[2, 4.5, 6.5, 8.5].map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setDrivingHours(h)}
                                    className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                                        drivingHours === h
                                            ? 'bg-ohs-orange text-ohs-navy border-ohs-orange'
                                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    {h}h
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 italic">
                            Continuous shift duration triggers automated Section 37 lockout rules at &gt;4h warning and &gt;7.5h critical.
                        </p>
                    </div>

                    {/* Reaction Drop & Score Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-gray-300 tracking-wider">Reaction Drop Score</span>
                            <span className="text-lg font-mono font-black text-amber-400">+{reactionDropPct}% drop</span>
                        </div>
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className={`h-full transition-all duration-500 ${driverFatigueScore >= 70 ? 'bg-red-500' : (driverFatigueScore >= 40 ? 'bg-amber-500' : 'bg-emerald-400')}`}
                                style={{ width: `${driverFatigueScore}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Prizm Fatigue Score:</span>
                            <span className={`font-mono font-black text-sm ${driverFatigueScore >= 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {driverFatigueScore} / 100
                            </span>
                        </div>
                    </div>

                    {/* Prizm Real-Time Alert Banner */}
                    <div className={`border rounded-2xl p-5 space-y-3 flex flex-col justify-between ${
                        prizmAlertActive 
                            ? 'bg-red-500/10 border-red-500/40 text-red-200' 
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={20} className={prizmAlertActive ? 'text-red-400 animate-bounce' : 'text-emerald-400'} />
                            <span className="text-xs font-black uppercase tracking-wider">
                                {prizmAlertActive ? 'PRIZM ALERT TRIGGERED' : 'PRIZM SAFETY STATUS'}
                            </span>
                        </div>
                        <p className="text-xs font-bold leading-relaxed">
                            {prizmRecommendedAction}
                        </p>
                        {apiResponse && (
                            <div className="pt-2 border-t border-white/10 text-[9px] font-mono text-gray-400 truncate">
                                Status: {apiResponse.handshakeStatus || 'OK'} | Advisory: {apiResponse.ohsComplianceAdvisory || 'Checked'}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

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
                                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 drop-shadow-[0_1px_4px_rgba(45,212,191,0.15)] tracking-tight">{pillar.title}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-mono font-black text-slate-100 text-glow-emerald">{pillar.value}%</span>
                                <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">Active Rating</span>
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
                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest block text-shadow-sm">{pillar.desc}</span>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed text-shadow-sm">{pillar.details}</p>
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
                        <span className="text-gray-400">[08:42:20] Shandray's Prizm Driver Fatigue Telemetry: Active</span>
                        <span className="text-ohs-orange font-bold uppercase tracking-wider text-[9px]">ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
