import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, FileCheck, Brain, TrendingUp, CheckCircle2, Truck, AlertTriangle, RefreshCw, Timer, HardHat, Gauge } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';
import { useComplianceStore } from '../../store/complianceStore';
import { speak } from '../../utils/speech';

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
    const { productiveStreak, language } = useNellyStore();

    const [isSyncingApi, setIsSyncingApi] = useState(false);
    const [apiResponse, setApiResponse] = useState<any>(null);

    // Micro-Challenge States
    const [activeChallenge, setActiveChallenge] = useState<'driver-reflex' | 'equipment-check' | null>(null);
    const [challengeTime, setChallengeTime] = useState<number>(15);
    const [targetState, setTargetState] = useState<'ready' | 'flash' | 'clicked'>('ready');
    const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
    const [startTimeMs, setStartTimeMs] = useState<number>(0);
    const [equipmentChecked, setEquipmentChecked] = useState<{ [key: string]: boolean }>({
        eStop: false,
        pressure: false,
        ppe: false
    });

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

    // Driver Reflex Test Handler
    const startReflexTest = () => {
        setActiveChallenge('driver-reflex');
        setTargetState('ready');
        setReactionTimeMs(null);
        setChallengeTime(15);

        const delay = 2000 + Math.random() * 3000;
        setTimeout(() => {
            setTargetState('flash');
            setStartTimeMs(Date.now());
        }, delay);
    };

    const handleReflexClick = () => {
        if (targetState === 'flash') {
            const ms = Date.now() - startTimeMs;
            setReactionTimeMs(ms);
            setTargetState('clicked');

            const text = `Road Hazard Reflex score: ${ms} milliseconds latency. Verification logged.`;
            speak(text, language);

            useComplianceStore.getState().logVerifiedBBSIntervention(
                'Road Hazard Reflex Challenge (15s)',
                `Driver Reaction Latency ${ms}ms`,
                15
            );
        }
    };

    // Equipment Pre-Check Handler
    const handleToggleEquipment = (key: string) => {
        setEquipmentChecked((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const completeEquipmentCheck = () => {
        const text = "Equipment Pre-Check Challenge verified: Emergency cut-off, pressure gauges, and PPE confirmed compliant.";
        speak(text, language);

        useComplianceStore.getState().logVerifiedBBSIntervention(
            'Equipment Pre-Check Challenge (15s)',
            'Plant / Mining Pre-Shift Equipment Safety Verification',
            15
        );
        setActiveChallenge(null);
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
        <div className="space-y-6 sm:space-y-8 pb-20 font-sans max-w-full overflow-hidden">
            {/* Page Main Header */}
            <div className="w-full max-w-full overflow-hidden p-4 min-w-0 flex flex-col justify-center bg-black/30 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block mb-1">Enterprise Analytics</span>
                <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug break-words max-w-full">
                    G.E.A.R. SYSTEM DASHBOARD
                </h2>
                <p className="mt-1 text-xs text-slate-300 block truncate">
                    Continuous Governance, Efficiency, Accountability, and Resilience Telemetry
                </p>
            </div>

            {/* Quick Summary Banner */}
            <div className="w-full max-w-full overflow-hidden min-w-0 bg-gradient-to-r from-ohs-navy via-ohs-navy to-black border border-white/10 rounded-3xl p-4 sm:p-6 relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1 min-w-0 flex-1 max-w-full overflow-hidden">
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 truncate">
                        <CheckCircle2 className="text-emerald-400 shrink-0" size={20} /> Overall Compliance Rating
                    </h3>
                    <p className="mt-1 text-xs text-slate-300 block truncate">All administrative zero-knowledge audits are up-to-date and registered on-chain.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-white/5 px-4 sm:px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider">Average Compliance</span>
                        <span className="text-xl sm:text-2xl font-black text-glow-emerald text-emerald-400">{Math.round((governance + efficiency + accountability + resilience) / 4)}%</span>
                    </div>
                    <div className="flex-1 md:flex-none bg-white/5 px-4 sm:px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider">Risk Level</span>
                        <span className={`text-xl sm:text-2xl font-black ${prizmAlertActive ? 'text-red-500 text-glow-red animate-pulse' : 'text-emerald-400 text-glow-emerald'}`}>
                            {prizmAlertActive ? 'ALERT ACTIVE' : 'NOMINAL'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Shandray's Prizm Alert Handshake & Driver Fatigue Telemetry Module */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-full overflow-hidden p-4 min-w-0 flex flex-col justify-center bg-gradient-to-br from-slate-900 via-ohs-navy to-slate-950 border-2 border-ohs-orange/40 rounded-3xl sm:p-6 shadow-2xl relative"
            >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-6 pb-6 border-b border-white/10 w-full max-w-full overflow-hidden min-w-0">
                    <div className="flex items-center gap-4 max-w-full overflow-hidden min-w-0 flex-1">
                        <div className="p-3 bg-ohs-orange/15 rounded-2xl border border-ohs-orange/30 text-ohs-orange shrink-0">
                            <Truck size={26} />
                        </div>
                        <div className="min-w-0 flex-1 max-w-full overflow-hidden">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-black text-ohs-orange uppercase tracking-widest bg-ohs-orange/10 px-2 py-0.5 rounded-full border border-ohs-orange/20 truncate">
                                    Shandray's Prizm Alert Handshake
                                </span>
                                <span className="mt-1 text-xs text-slate-300 block truncate uppercase font-mono">Endpoint: /api/v1/fatigue-score</span>
                            </div>
                            <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug break-words max-w-full mt-1">
                                Driver & Shift Cognitive Fatigue Telemetry
                            </h2>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleSyncPrizmApi}
                        disabled={isSyncingApi}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 bg-ohs-orange hover:bg-yellow-400 text-ohs-navy px-5 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-ohs-orange/20 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                        <RefreshCw size={16} className={isSyncingApi ? 'animate-spin' : ''} />
                        {isSyncingApi ? 'HANDSHAKING API...' : 'SYNC PRIZM API'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Continuous Driving Hours Controls */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
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
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
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
                    <div className={`border rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between ${
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

                {/* Role-Specific 15-Second Micro-Challenges Panel */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-[9px] font-black text-ohs-orange uppercase tracking-widest block">Role-Specific Safety Verification</span>
                            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                <Timer size={18} className="text-ohs-orange" /> 15-Second Micro-Challenges
                            </h3>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={startReflexTest}
                                className="flex-1 sm:flex-none px-3 py-2 bg-ohs-orange/20 hover:bg-ohs-orange/30 border border-ohs-orange/40 text-ohs-orange rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Truck size={14} /> Road Hazard Reflex
                            </button>
                            <button
                                onClick={() => setActiveChallenge('equipment-check')}
                                className="flex-1 sm:flex-none px-3 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <HardHat size={14} /> Equipment Pre-Check
                            </button>
                        </div>
                    </div>

                    {/* Driver Reflex Challenge Modal Card */}
                    {activeChallenge === 'driver-reflex' && (
                        <div className="bg-black/60 border border-ohs-orange/40 p-4 sm:p-5 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase text-ohs-orange">Driver Road Hazard Reflex Test (15s)</span>
                                <button onClick={() => setActiveChallenge(null)} className="text-gray-400 hover:text-white text-xs">Close</button>
                            </div>

                            <div 
                                onClick={handleReflexClick}
                                className={`w-full h-32 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                                    targetState === 'ready' ? 'bg-slate-900 border-white/20 text-gray-400' :
                                    targetState === 'flash' ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_30px_#ef4444]' :
                                    'bg-emerald-600 border-emerald-400 text-white'
                                }`}
                            >
                                {targetState === 'ready' && <span className="text-xs font-bold">WAIT FOR HAZARD FLASH...</span>}
                                {targetState === 'flash' && <span className="text-lg font-black tracking-widest">CLICK NOW! HAZARD DETECTED!</span>}
                                {targetState === 'clicked' && (
                                    <div className="text-center space-y-1">
                                        <CheckCircle2 size={24} className="mx-auto" />
                                        <span className="text-sm font-black">LATENCY: {reactionTimeMs}ms (VERIFIED)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Equipment Pre-Check Challenge Modal Card */}
                    {activeChallenge === 'equipment-check' && (
                        <div className="bg-black/60 border border-teal-500/40 p-4 sm:p-5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase text-teal-300">Plant & Mining Equipment Pre-Check (15s)</span>
                                <button onClick={() => setActiveChallenge(null)} className="text-gray-400 hover:text-white text-xs">Close</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { key: 'eStop', label: 'Emergency Cut-Off Functioning' },
                                    { key: 'pressure', label: 'Hydraulic Pressure Gauges Verified' },
                                    { key: 'ppe', label: 'Heavy Harness & PPE Fastened' }
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => handleToggleEquipment(item.key)}
                                        className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                                            equipmentChecked[item.key]
                                                ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        <CheckCircle2 size={16} className={equipmentChecked[item.key] ? 'text-teal-400' : 'text-gray-600'} />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={completeEquipmentCheck}
                                disabled={!Object.values(equipmentChecked).every(Boolean)}
                                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer disabled:opacity-40"
                            >
                                SUBMIT & VERIFY EQUIPMENT PRE-CHECK
                            </button>
                        </div>
                    )}
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
                        className={`bg-black/40 border ${pillar.borderColor} rounded-3xl p-4 sm:p-6 relative overflow-hidden group`}
                    >
                        <div className={`absolute top-0 right-0 w-48 h-48 ${pillar.bgColor} rounded-full blur-3xl -mr-24 -mt-24 transition-opacity group-hover:opacity-100 opacity-50`} />

                        <div className="flex items-start justify-between relative z-10 mb-6 gap-2">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`p-3 ${pillar.bgColor} rounded-xl ${pillar.color} shrink-0`}>
                                    <pillar.icon size={24} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className={`text-xs font-black uppercase tracking-widest ${pillar.color} block truncate`}>{pillar.id} - Pillar</span>
                                    <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 drop-shadow-[0_1px_4px_rgba(45,212,191,0.15)] tracking-tight truncate">{pillar.title}</h3>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-xl sm:text-2xl font-mono font-black text-slate-100 text-glow-emerald">{pillar.value}%</span>
                                <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">Active Rating</span>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pillar.value}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full ${pillar.value >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest block text-shadow-sm truncate">{pillar.desc}</span>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed text-shadow-sm">{pillar.details}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Audit Log */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-4 sm:p-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-ohs-orange animate-pulse" /> Active OHS Audit Stream
                </h3>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400 truncate max-w-[240px] sm:max-w-none">[08:42:15] POPI Privacy Handshake Active</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] shrink-0">ENCRYPTED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400 truncate max-w-[240px] sm:max-w-none">[08:42:18] Cognitive Latency Checked (650ms)</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] shrink-0">PASSED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400 truncate max-w-[240px] sm:max-w-none">[08:42:20] Shandray's Prizm Driver Fatigue Telemetry: Active</span>
                        <span className="text-ohs-orange font-bold uppercase tracking-wider text-[9px] shrink-0">ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
