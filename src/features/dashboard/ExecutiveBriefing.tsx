import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    AlertTriangle,
    FileText,
    CheckCircle2,
    TrendingUp,
    Volume2,
    VolumeX,
    Activity,
    Scale,
    Award,
    ShieldCheck,
    Zap,
    Play,
    Timer,
    ClipboardCheck,
    Lock,
    Bot,
    ArrowRight,
} from 'lucide-react';
import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import { useNellyStore } from '../../store/nellyStore';
import { useComplianceStore } from '../../store/complianceStore';
import { speak, stopSpeaking } from '../../utils/speech';

export const REASONABLY_PRACTICABLE_OHS = {
    standardName: "Reasonably Practicable Standard",
    statuteReference: "OHS Act 85 of 1993, Section 8(1) & Section 37/38",
    description: "Section 8 of the Occupational Health and Safety Act 85 of 1993 requires employers to provide and maintain, as far as is reasonably practicable, a safe working environment without risk to the health of employees. A structured ergonomic screening and risk monitoring system assists organizations in identifying and addressing workstation hazards.",
    finesFramework: "Section 38 prescribes statutory penalties for non-compliance with the provisions of the OHS Act and GN R1589 Ergonomics Regulations 2019."
} as const;

export const BCEA_REST_PERIODS_FRAMEWORK = {
    concept: "BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks",
    statutoryBasis: "Basic Conditions of Employment Act (Act 75 of 1997) Section 15 & GN R1589",
    description: "Extended continuous VDU screen-time and postural immobilization pose severe musculoskeletal risks. ErgoSafe enforces structured micro-break intervals to support employee physiological recovery aligned with BCEA Section 15 regulated daily rest periods.",
    complianceCode: "BCEA Sec 15 Daily Rest Period & GN R1589 Regulation 6/7 Ergonomic Controls."
} as const;

interface ExecutiveBriefingProps {
    onNavigate?: (tabId: string) => void;
}

export const ExecutiveBriefing = ({ onNavigate }: ExecutiveBriefingProps = {}) => {
    const openStatutoryBreaches = useComplianceStore((s) => s.cases.filter(c => c.status === 'BREACH' && c.escalationState !== 'resolved').length);
    const { language, setIsLiveTelemetryOpen, setWingmanActive, setIsDemoModalOpen } = useNellyStore();
    const [isNarrating, setIsNarrating] = useState(false);
    const [showSupportingMatrix, setShowSupportingMatrix] = useState(false);

    const coreModules = [
        {
            id: 'nelly',
            title: 'Live 3D Posture & Spine Telemetry',
            badge: 'POPIA s18 + Manual Fallback',
            desc: 'Client-side skeletal posture scoring & 3D spine telemetry behind a non-bypassable POPIA consent gate.',
            icon: Bot,
            accent: 'glass-card-emerald border-emerald-400/35 hover:border-emerald-300/70',
            iconColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/40',
            cta: 'Open Posture Engine',
        },
        {
            id: 'training',
            title: 'Interactive 3D Training Videos & Safety Drills',
            badge: 'Multilingual Safety LMS',
            desc: 'Interactive ergonomic training modules, 3D workplace hazard drills, and voiceover-synced certification.',
            icon: Award,
            accent: 'glass-card-amber border-[#D97706]/45 hover:border-amber-400/80',
            iconColor: 'text-amber-300 bg-amber-500/20 border-amber-400/40',
            cta: 'Launch Training',
        },
        {
            id: 'smart-breaks',
            title: 'Guided Stretch Breaks & Micro-Break Timers',
            badge: 'BCEA Sec 15 Recovery',
            desc: 'Automated VDU micro-break intervals and guided mobility decompression routines for desk & call-centre teams.',
            icon: Timer,
            accent: 'glass-card-cyan border-cyan-400/35 hover:border-cyan-300/70',
            iconColor: 'text-cyan-300 bg-cyan-500/20 border-cyan-400/40',
            cta: 'Open Break Engine',
        },
        {
            id: 'statutory-governance',
            title: 'Statutory Ergonomics Module (GN R1589)',
            badge: 'RULA / REBA / NIOSH + SHA-256',
            desc: 'Task-level biomechanical assessments, Hierarchy of Controls gate, Reg 6 2-year clock, and SHA-256 dossiers.',
            icon: ClipboardCheck,
            accent: 'glass-card-emerald border-emerald-400/35 hover:border-emerald-300/70',
            iconColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/40',
            cta: 'Open Statutory Suite',
        },
        {
            id: 'fatigue',
            title: 'Prizm Fatigue & Shift Checks',
            badge: 'Shift Readiness Telemetry',
            desc: 'Objective fatigue risk tracking, shift-readiness screening, and pre-shift safety escalation logs.',
            icon: Activity,
            accent: 'glass-card-cyan border-cyan-400/35 hover:border-cyan-300/70',
            iconColor: 'text-cyan-300 bg-cyan-500/20 border-cyan-400/40',
            cta: 'Open Fatigue Checks',
        },
        {
            id: 'trust-center',
            title: 'Enterprise Trust Center & EU AI Act',
            badge: 'Live CISO Diagnostics',
            desc: 'Run live AES-256-GCM, SHA-256 & POPIA diagnostics, inspect AI Art. 50 governance, and build pilot briefs.',
            icon: Lock,
            accent: 'glass-card-amber border-[#D97706]/45 hover:border-amber-400/80',
            iconColor: 'text-amber-300 bg-amber-500/20 border-amber-400/40',
            cta: 'Open Trust Center',
        },
    ];

    const ergonomicRiskClosures = [
        {
            gapTitle: "Manual Material Handling & Heavy Lifting (>25kg)",
            riskLevel: "CRITICAL MUSCULOSKELETAL LIABILITY",
            solution: "GN R1589 Regulation 6 Screening & NIOSH Lifting Controls",
            details: "Evaluates bulk sack lifting, carcass handling, and receiving unstacking against the 25kg statutory limit. Automatically triggers team-lift mandates and mechanical aid engineering controls.",
            statute: "GN R1589 Reg 6 & OHS Act Sec 8(2)(b)",
            icon: Award,
            badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
        },
        {
            gapTitle: "Neck Strain & C1-C7 Cervical Vertebrae Compression",
            riskLevel: "CHRONIC MUSCULOSKELETAL INJURY",
            solution: "Nelly Biomechanical Telemetry Engine",
            details: "Tracks forward neck tilt, monitor height mismatch, and shoulder shrugging across corporate and industrial workstations. Logs postural anomalies into the statutory ledger.",
            statute: "Ergonomics Regulations (GN R1589)",
            icon: Activity,
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
        },
        {
            gapTitle: "VDU Screen Immobilization & Fatigue",
            riskLevel: "PHYSIOLOGICAL & VISUAL STRAIN",
            solution: "BCEA Section 15 Regulated Rest Periods & VDU Micro-Breaks",
            details: "Enforces timely micro-stretch intervals and postural resets, assisting employers in fulfilling statutory duty of care under OHS Act Section 8 and BCEA Section 15.",
            statute: "BCEA Section 15 & GN R1589 Regulation 7",
            icon: Scale,
            badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        }
    ];

    const toggleNarration = () => {
        if (isNarrating) {
            stopSpeaking();
            setIsNarrating(false);
        } else {
            setIsNarrating(true);
            const script = `Executive Briefing Narration Active. Welcome to ErgoSafe Reborn V3. This executive summary integrates live OHS Act Section 37 compliance telemetry with statutory ergonomic screening under GN R1589 (Ergonomics Regulations 2019). Core ergonomic risk factors, including manual material handling, cervical spine strain, and workstation micro-break compliance, are systematically resolved via Nelly's Biomechanical Engine. Our platform establishes a legally defensible audit trail under Section 8 of the Occupational Health and Safety Act, reducing corporate musculoskeletal liability.`;
            speak(script, language, () => setIsNarrating(false));
        }
    };

    return (
        <div className="p-2 sm:p-5 md:p-6 w-full max-w-7xl mx-auto space-y-5 sm:space-y-6 mb-20 overflow-x-hidden font-sans box-border">
            {/* DOMINANT SAFETY COMMAND CENTRE BANNER */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-3d p-4 sm:p-6 rounded-[1.75rem] border border-emerald-400/30 shadow-[0_24px_60px_-15px_rgba(6,78,59,0.5)] relative overflow-hidden space-y-4 w-full max-w-full"
            >
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
                    <div className="space-y-1.5 max-w-3xl min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] sm:text-[10px] font-black text-[#FCD34D] uppercase tracking-wider bg-[#D97706]/15 px-2.5 py-1 rounded-full border border-[#D97706]/40 whitespace-normal leading-tight max-w-full">
                                🛡️ STATUTORY OHS COMMAND
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-400/30 whitespace-normal leading-tight max-w-full">
                                GN R1589 COMPLIANCE ENGINE
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase break-words leading-tight">
                            STATUTORY SAFETY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-[#F59E0B]">COMMAND CENTRE</span>
                        </h1>
                        <p className="text-slate-300 font-medium text-xs md:text-sm leading-relaxed break-words">
                            Occupational Health and Safety Act (Act 85 of 1993) &amp; Ergonomics Regulations 2019 (GN R1589) digital governance dashboard with Section 16.2 Competent Person oversight.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                            onClick={() => setIsDemoModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl cta-gradient-emerald border-2 border-[#D97706] text-white font-black text-xs transition-all shadow-lg cursor-pointer w-full sm:w-auto"
                        >
                            <Play size={15} className="fill-white text-white shrink-0" />
                            <span>Watch 2-Min Executive Demo</span>
                        </button>
                        <button
                            onClick={toggleNarration}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-black text-xs transition-all shadow-lg cursor-pointer w-full sm:w-auto ${
                                isNarrating 
                                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                    : 'cta-gradient-amber text-slate-950'
                            }`}
                        >
                            {isNarrating ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            {isNarrating ? 'STOP AUDIO NARRATION' : 'NARRATE BRIEFING (NELLY VOICE)'}
                        </button>
                    </div>
                </div>

                {/* Statutory Competent Person Gate Disclaimer Banner */}
                <div className="p-3 sm:p-3.5 bg-[#060d1b]/80 border border-[#D97706]/45 rounded-2xl flex items-start gap-3 shadow-inner relative z-10">
                    <ShieldAlert className="text-[#D97706] shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                        <strong className="text-[#FCD34D] font-black">Statutory Notice:</strong> Digital biomechanical screening under GN R1589 (Ergonomics Regulations 2019). Baseline scores and control hierarchies are screening indicators and must be reviewed and countersigned by an appointed Competent Person / Section 16.2 Appointee.
                    </p>
                </div>
            </motion.div>

            {/* CORE COMMAND MODULES (1-CLICK ACCESS GRID) */}
            <div className="space-y-3" data-testid="core-command-grid">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                        1-Click Core Command Modules
                    </span>
                    <span className="text-[11px] text-slate-400">
                        Direct access to Posture Telemetry, Training, Mobility, GN R1589 Governance, Fatigue &amp; Trust Diagnostics
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 w-full max-w-full min-w-0">
                    {coreModules.map((mod) => {
                        const ModIcon = mod.icon;
                        return (
                            <button
                                key={mod.id}
                                type="button"
                                onClick={() => onNavigate?.(mod.id)}
                                className={`${mod.accent} p-4 rounded-2xl text-left flex flex-col justify-between gap-3 cursor-pointer group hover:-translate-y-0.5 transition-all duration-200`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className={`p-2 rounded-xl border ${mod.iconColor}`}>
                                            <ModIcon size={18} />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                                            {mod.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-black text-white leading-snug group-hover:text-emerald-300 transition-colors">
                                        {mod.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                                        {mod.desc}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-black text-cyan-300">
                                    <span>{mod.cta}</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#D97706]" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* HERO LAUNCH CARD: AI Posture Wingman (Live Edge Telemetry) */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-emerald relative overflow-hidden rounded-[1.75rem] border border-emerald-400/45 p-5 sm:p-6 shadow-[0_20px_55px_-12px_rgba(16,185,129,0.3)]"
            >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                    <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                1-Click Instant Launch
                            </span>
                            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/15 px-2.5 py-1 rounded-full border border-cyan-400/30">
                                MediaPipe Edge AI Vision
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                            AI Posture Wingman (Live Edge Telemetry)
                        </h2>

                        <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
                            POPIA Section 18 Consent-Gated &amp; Zero-Surveillance. Analyzes neck flexion, thoracic slouch, and shoulder tilt locally via your webcam — or operate in voluntary Manual Ergonomic Assessment Mode.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-300 font-mono">
                            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                                ✓ 100% Client-Side Processing
                            </span>
                            <span className="flex items-center gap-1 text-slate-200">
                                ✓ Multilingual Verbal Feedback
                            </span>
                            <span className="flex items-center gap-1 text-slate-200">
                                ✓ GN R1589 Statutory Audit Log
                            </span>
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                        <button
                            onClick={() => {
                                setIsLiveTelemetryOpen(true);
                                setWingmanActive(true);
                            }}
                            className="w-full sm:w-auto px-6 py-3.5 cta-gradient-emerald border border-emerald-300/60 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                            title="Launch AI Posture Wingman in full-screen live monitor"
                        >
                            <Zap className="fill-white text-white animate-pulse" size={18} />
                            <span>⚡ Launch Live AI Monitor</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* COLLAPSIBLE SECTION: ERGONOMIC RISK & COMPLIANCE MATRIX */}
            <div className="glass-card-3d rounded-[1.75rem] p-4 sm:p-6 space-y-4 w-full max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1 truncate">
                            GN R1589 Statutory Framework
                        </span>
                        <h2 className="text-xl font-black text-white break-words">
                            Ergonomic Risk Mitigation & Legal Compliance
                        </h2>
                    </div>
                    <button
                        onClick={() => setShowSupportingMatrix(!showSupportingMatrix)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-ohs-orange px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
                    >
                        <span>{showSupportingMatrix ? 'HIDE COMPLIANCE MATRIX' : 'EXPAND COMPLIANCE MATRIX'}</span>
                    </button>
                </div>

                {showSupportingMatrix && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-4 border-t border-white/10"
                    >
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-white break-words">Ergonomic Risk Mitigation & Control Hierarchy</h3>
                                <p className="text-xs text-gray-400 mt-1 break-words">Systematic elimination, engineering, and administrative controls mapped to South African statutory regulations.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0">
                                {ergonomicRiskClosures.map((gap, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-ohs-orange/40 transition-all duration-300"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="p-3 rounded-xl bg-ohs-orange/10 text-ohs-orange border border-ohs-orange/20">
                                                    <gap.icon size={22} />
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${gap.badgeColor}`}>
                                                    {gap.riskLevel}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-black text-white leading-snug">
                                                {gap.gapTitle}
                                            </h3>
                                            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                                                <span className="text-[9px] font-black text-ohs-orange uppercase block">Statutory Control:</span>
                                                <p className="text-xs font-bold text-white">{gap.solution}</p>
                                            </div>
                                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                {gap.details}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-emerald-400">
                                            <span>Statute: {gap.statute}</span>
                                            <Award size={14} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Statutory Compliance Policy Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full min-w-0">
                            {GlobalComplianceEngine.fetchUnifiedBriefing(language).map((policy, idx) => (
                                <motion.div
                                    key={policy.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 * idx, duration: 0.3 }}
                                    className="bg-black/40 border border-white/5 p-4 sm:p-6 md:p-8 rounded-3xl w-full max-w-full overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        {idx % 2 === 0 ? <AlertTriangle className="text-ohs-orange shrink-0" size={28} /> : <ShieldAlert className="text-red-500 shrink-0" size={28} />}
                                        <h3 className="text-xl font-black text-white break-words">{policy.title}</h3>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed font-medium mb-6 break-words">
                                        {policy.text}
                                    </p>
                                    <div className={`bg-opacity-10 border p-4 rounded-xl flex items-start gap-4 ${idx % 2 === 0 ? 'bg-ohs-orange border-ohs-orange/30' : 'bg-red-500 border-red-500/30'}`}>
                                        <CheckCircle2 className={`${idx % 2 === 0 ? 'text-ohs-orange' : 'text-red-500'} shrink-0 mt-1`} size={20} />
                                        <p className={`text-sm font-bold break-words ${idx % 2 === 0 ? 'text-ohs-orange' : 'text-red-500'}`}>
                                            Mitigation Strategy: Active GN R1589 hazard logging and Section 16.2 review.
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Statutory Compliance Record Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="glass-card-emerald p-4 sm:p-6 md:p-7 rounded-3xl mt-6 w-full max-w-full overflow-hidden"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 break-words"><FileText className="text-emerald-400 shrink-0" size={24} /> Statutory Ledger Status</h3>
                        <p className="text-slate-300 font-medium mt-1 break-words">All ergonomic risk assessments are indexed under Regulation 10(1) with mandatory 40-year retention.</p>
                    </div>
                    <div className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs whitespace-nowrap block text-center sm:text-left w-full sm:w-auto shrink-0 border ${openStatutoryBreaches === 0 ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-red-500/20 border-red-400/40 text-red-300'}`}>
                        {openStatutoryBreaches === 0 ? 'NO OPEN STATUTORY BREACHES' : `${openStatutoryBreaches} OPEN STATUTORY BREACH${openStatutoryBreaches === 1 ? '' : 'ES'}`}
                    </div>
                </div>
            </motion.div>

            {/* Productivity Recovered */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="glass-card-amber p-4 sm:p-6 md:p-7 rounded-3xl mt-6 relative overflow-hidden w-full max-w-full"
            >
                <TrendingUp className="absolute -right-10 -bottom-10 text-amber-400/10" size={150} />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="min-w-0">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 break-words">
                            LPS ROI: <span className="text-[#FCD34D]">Productivity Recovered</span>
                        </h3>
                        <p className="text-slate-300 font-medium mt-2 leading-relaxed break-words">
                            Tracks productive time recovered through ergonomic micro-breaks and verified posture interventions.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* STATUTORY GOVERNANCE & REST PERIOD FRAMEWORK */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="glass-card-3d border border-cyan-400/25 p-4 sm:p-6 md:p-7 rounded-[1.75rem] mt-6 w-full max-w-full overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-white/10">
                    <div className="min-w-0">
                        <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block mb-1 truncate">
                            South African Statutory Architecture
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight break-words">
                            STATUTORY OHS GOVERNANCE STANDARDS
                        </h3>
                        <p className="text-gray-400 font-medium text-sm mt-1 break-words">
                            Ergonomics Regulations 2019 (GN R1589) & Basic Conditions of Employment Act Section 15.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 max-w-full">
                        <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-ohs-orange/10 border border-ohs-orange/30 rounded-xl text-ohs-orange text-[10px] sm:text-xs font-black uppercase whitespace-normal break-words">
                            Section 16.2 Appointee Gate Active
                        </div>
                        <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-ohs-blue/10 border border-ohs-blue/30 rounded-xl text-ohs-blue text-[10px] sm:text-xs font-black uppercase whitespace-normal break-words">
                            BCEA Section 15 Aligned
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 w-full max-w-full min-w-0">
                    <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2 break-words">
                                    <span className="w-2.5 h-2.5 rounded-full bg-ohs-orange shrink-0" />
                                    {REASONABLY_PRACTICABLE_OHS.standardName}
                                </h4>
                                <div className="px-2.5 py-1 bg-ohs-orange/10 border border-ohs-orange/30 text-ohs-orange font-black text-[9px] uppercase tracking-wider rounded-lg w-max max-w-full break-words shrink-0">
                                    {REASONABLY_PRACTICABLE_OHS.statuteReference}
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-medium mb-4 break-words">
                                {REASONABLY_PRACTICABLE_OHS.description}
                            </p>
                        </div>
                        <p className="text-xs text-red-400/90 font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl break-words">
                            {REASONABLY_PRACTICABLE_OHS.finesFramework}
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2 break-words">
                                    <span className="w-2.5 h-2.5 rounded-full bg-ohs-blue shrink-0" />
                                    {BCEA_REST_PERIODS_FRAMEWORK.concept}
                                </h4>
                                <div className="px-2.5 py-1 bg-ohs-blue/10 border border-ohs-blue/30 text-ohs-blue font-black text-[9px] uppercase tracking-wider rounded-lg w-max max-w-full break-words shrink-0">
                                    {BCEA_REST_PERIODS_FRAMEWORK.statutoryBasis}
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-medium mb-4 break-words">
                                {BCEA_REST_PERIODS_FRAMEWORK.description}
                            </p>
                        </div>
                        <p className="text-xs text-ohs-green font-bold bg-ohs-green/10 border border-ohs-green/20 p-3 rounded-xl break-words">
                            Statutory Vector: {BCEA_REST_PERIODS_FRAMEWORK.complianceCode}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ExecutiveBriefing;
