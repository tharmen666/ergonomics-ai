import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, FileCheck, Brain, TrendingUp, CheckCircle2, 
  AlertTriangle, Timer, HardHat, Gauge, Target, ShieldCheck, Scale, Award
} from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useNellyStore } from '../../store/nellyStore';
import { useComplianceStore } from '../../store/complianceStore';
import { speak } from '../../utils/speech';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';

export const GEARDashboardPage: React.FC = () => {
    const { 
        fatigueLevel, 
        supervisorOverride
    } = useFatigueStore();
    const { productiveStreak, language } = useNellyStore();

    // Micro-Challenge States
    const [activeChallenge, setActiveChallenge] = useState<'equipment-check' | 'vdu-stretch' | null>(null);
    const [equipmentChecked, setEquipmentChecked] = useState<{ [key: string]: boolean }>({
        workstationAdjusted: false,
        lumbarSupportEngaged: false,
        vduEyeLevelVerified: false
    });

    const [industryMode, setIndustryMode] = useState<'retail' | 'petroleum' | 'corporate'>('corporate');

    const governance = 100;
    let efficiency = 100;
    if (fatigueLevel === 'warning') efficiency = 85;
    if (fatigueLevel === 'high') efficiency = 75;

    const accountability = 100;
    const resilience = productiveStreak > 120 ? 100 : Math.min(100, Math.floor((productiveStreak / 120) * 100));

    // Equipment & Workstation Pre-Check Handler
    const handleToggleEquipment = (key: string) => {
        setEquipmentChecked((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const completeEquipmentCheck = () => {
        const text = "Ergonomic Workstation Verification complete: Lumbar alignment, screen distance, and posture verified under GN R1589.";
        speak(text, language);

        useComplianceStore.getState().logVerifiedBBSIntervention(
            'GN R1589 Workstation Alignment Challenge (15s)',
            'Statutory Posture & VDU Setup Verification',
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
            desc: 'GN R1589 & Section 16.2 Appointee Oversight',
            details: 'ErgoSafe Reborn aligns workstation operations with the South African Ergonomics Regulations 2019 (GN R1589) and OHS Act 85 of 1993 Section 8.'
        },
        {
            id: 'E',
            title: 'Ergonomic Efficiency',
            value: efficiency,
            icon: Zap,
            color: 'text-ohs-orange',
            bgColor: 'bg-ohs-orange/10',
            borderColor: 'border-ohs-orange/20',
            desc: 'Biomechanical Screening & Posture Flow',
            details: 'Real-time biomechanical indicators (REBA, RULA, ROSA) ensure minimal musculoskeletal disorder (MSD) risk during continuous duty.'
        },
        {
            id: 'A',
            title: 'Accountability',
            value: accountability,
            icon: FileCheck,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            desc: 'Competent Person Countersignature Standard',
            details: 'All screening calculations and risk categorizations require non-null verification by an appointed SHE Representative or Section 16.2 manager.'
        },
        {
            id: 'R',
            title: 'Resilience',
            value: resilience,
            icon: Brain,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            desc: 'BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks',
            details: 'Proactive fatigue interception and micro-break compliance maintaining sustained alertness and cognitive acuity.'
        }
    ];

    return (
        <div className="space-y-6 pb-20 w-full max-w-full overflow-x-hidden font-sans box-border">
            {/* Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-ohs-navy via-slate-900 to-slate-950 border border-white/10 p-6 rounded-3xl relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange bg-ohs-orange/10 px-2.5 py-1 rounded-full border border-ohs-orange/20">
                                Statutory GEAR Architecture
                            </span>
                            <span className="text-xs text-gray-400">GN R1589 Compliance Engine</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Governance, Ergonomics, Accountability & Resilience
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                            Continuous statutory compliance monitoring ensuring proactive risk mitigation across Retail Cash & Carry, Petroleum Forecourts, and Corporate VDU Workspaces.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => supervisorOverride()}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                        >
                            <ShieldCheck size={16} /> Competent Reset
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Statutory Disclaimer Banner */}
            <StatutoryDisclaimerBanner />

            {/* Industry Selector */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Select Regulated Workspace Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        onClick={() => setIndustryMode('retail')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            industryMode === 'retail'
                                ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <Scale className="text-amber-400 shrink-0" size={22} />
                        <div>
                            <h4 className="text-xs font-black uppercase">Retail & Cash & Carry</h4>
                            <p className="text-[10px] text-gray-400">Butchery, Bakery Deli, Tills & Receiving</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setIndustryMode('petroleum')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            industryMode === 'petroleum'
                                ? 'bg-teal-500/20 border-teal-500 text-white shadow-lg'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <HardHat className="text-teal-400 shrink-0" size={22} />
                        <div>
                            <h4 className="text-xs font-black uppercase">Petroleum Forecourt</h4>
                            <p className="text-[10px] text-gray-400">SANS 10089 Nozzle, Dipsticks & Safe Drops</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setIndustryMode('corporate')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            industryMode === 'corporate'
                                ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <Gauge className="text-cyan-400 shrink-0" size={22} />
                        <div>
                            <h4 className="text-xs font-black uppercase">Corporate & Call Centre</h4>
                            <p className="text-[10px] text-gray-400">ROSA VDU screens, Cervical/Lumbar posture</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Quick 15s Statutory Alignment Micro-Challenge */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <span className="text-[9px] font-black text-ohs-orange uppercase tracking-widest block">Statutory Shift Verification</span>
                        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                            <Timer size={18} className="text-ohs-orange" /> Workstation Alignment Verification (15s)
                        </h3>
                    </div>
                    <button
                        onClick={() => setActiveChallenge(activeChallenge ? null : 'equipment-check')}
                        className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 rounded-xl font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                    >
                        <HardHat size={16} /> {activeChallenge ? 'Close Check' : 'Launch 15s Alignment'}
                    </button>
                </div>

                {activeChallenge === 'equipment-check' && (
                    <div className="bg-black/60 border border-teal-500/40 p-4 sm:p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-teal-300">Workstation Biomechanical Alignment Checklist</span>
                            <button onClick={() => setActiveChallenge(null)} className="text-gray-400 hover:text-white text-xs">Close</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { key: 'workstationAdjusted', label: 'Desk / Counter Height & Neutral Reach Zones Set' },
                                { key: 'lumbarSupportEngaged', label: 'Lumbar & Cervical Support Fully Engaged' },
                                { key: 'vduEyeLevelVerified', label: 'Monitor Top at Eye Level (50-70cm distance)' }
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
                            SUBMIT & VERIFY WORKSTATION COMPLIANCE
                        </button>
                    </div>
                )}
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-full min-w-0">
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
                                    <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 tracking-tight truncate">{pillar.title}</h3>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-xl sm:text-2xl font-mono font-black text-slate-100">{pillar.value}%</span>
                                <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">Rating</span>
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
                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest block truncate">{pillar.desc}</span>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed">{pillar.details}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Audit Log */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-4 sm:p-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-ohs-orange" /> Statutory Telemetry & Audit Stream
                </h3>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400 truncate max-w-[240px] sm:max-w-none">[08:42:15] POPI Privacy Protocol Handshake Active</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] shrink-0">LOCAL</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400 truncate max-w-[240px] sm:max-w-none">[08:42:18] GN R1589 Cognitive Handshake Verified (650ms)</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] shrink-0">PASSED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-400 truncate max-w-[240px] sm:max-w-none">[08:42:20] BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks: Active</span>
                        <span className="text-ohs-orange font-bold uppercase tracking-wider text-[9px] shrink-0">COMPLIANT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GEARDashboardPage;
