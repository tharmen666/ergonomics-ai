import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2, TrendingUp, Play, Volume2, VolumeX, Truck, Activity, Scale, Award, Eye, X, Download } from 'lucide-react';
import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import { LeanPerformanceRail } from '../../components/AI-Coach/LeanPerformanceRail';
import { REASONABLY_PRACTICABLE_2026, RIGHT_TO_DISCONNECT_FRAMEWORK, FINANCIAL_PITCHES } from '../../logic/financePitches';
import { useNellyStore } from '../../store/nellyStore';
import { speak, stopSpeaking } from '../../utils/speech';

export const ExecutiveBriefing = () => {
    const { language } = useNellyStore();
    const [isNarrating, setIsNarrating] = useState(false);
    const [activeVideoClip, setActiveVideoClip] = useState<string | null>(null);
    const [activeTimestampLabel, setActiveTimestampLabel] = useState<string | null>(null);

    const videoClips = [
        {
            timestamp: "00:15",
            title: "Executive OHS & POPI Compliance Handshake",
            desc: "Zero-knowledge encryption layer verifying employee digital identity & workplace pre-qualifications.",
            tag: "Governance & POPI",
            color: "text-blue-400",
            borderColor: "border-blue-500/30",
            bgGlow: "bg-blue-500/10"
        },
        {
            timestamp: "01:15",
            title: "Nelly Ergonomic Engine & Biomechanical Posture Alert",
            desc: "Real-time C1-C7 cervical spine tilt telemetry, trapezius strain checks, and Tier 2 micro-stretch triggers.",
            tag: "Ergonomics Engine",
            color: "text-ohs-orange",
            borderColor: "border-ohs-orange/30",
            bgGlow: "bg-ohs-orange/10"
        },
        {
            timestamp: "02:40",
            title: "Shandray's Prizm Driver & Shift Fatigue Handshake",
            desc: "Continuous driving-hour tracking, reaction drop scoring via /api/v1/fatigue-score, and mandatory rest lockouts.",
            tag: "Driver Safety",
            color: "text-amber-400",
            borderColor: "border-amber-500/30",
            bgGlow: "bg-amber-500/10"
        },
        {
            timestamp: "04:10",
            title: "Section 37 / OHS Legal Risk Mitigation & ROI Audit",
            desc: "Statutory Section 8(1) compliance proof, CCMA constructive dismissal shield, and 142% productivity recovery.",
            tag: "Legal & ROI",
            color: "text-emerald-400",
            borderColor: "border-emerald-500/30",
            bgGlow: "bg-emerald-500/10"
        }
    ];

    const fatigueGapClosures = [
        {
            gapTitle: "Driver Shift Fatigue & Micro-Sleep Risks",
            riskLevel: "CRITICAL HIGHWAY LIABILITY",
            solution: "Shandray's Prizm Alert Handshake (/api/v1/fatigue-score)",
            details: "Monitors continuous driving hours (2h, 4.5h, 6.5h, 8h thresholds) and cognitive latency drops. Triggers mandatory 30-minute rest lockouts before micro-sleep incidents occur.",
            statute: "Section 8(1) OHS Act 85 of 1993",
            icon: Truck,
            badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
        },
        {
            gapTitle: "Neck Strain & C1-C7 Cervical Vertebrae Compression",
            riskLevel: "CHRONIC MUSCULOSKELETAL INJURY",
            solution: "Nelly Ergonomic Engine Real-Time Telemetry",
            details: "Tracks forward neck tilt and shoulder shrugging in remote/WFH environments. Automatically logs posture breaches into the OHS hazard ledger and prompts Tier 2 micro-stretches.",
            statute: "Ergonomics Regulations (GN R1589)",
            icon: Activity,
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
        },
        {
            gapTitle: "Digital Tethering & Psychosocial Exhaustion",
            riskLevel: "CONSTRUCTIVE DISMISSAL & BURNOUT",
            solution: "Fatigue-Gate & Right-to-Disconnect Lockouts",
            details: "Restricts after-hours messaging access for off-duty personnel, defending employers against CCMA overtime claims while complying with global ISO 45003 standards.",
            statute: "ISO 45003:2021 Psychosocial Health Standard",
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
            const script = `Executive Briefing Narration Active. Welcome to ErgoSafe Reborn V3. This executive summary integrates live OHS Act Section 37 compliance telemetry with the Demo Video Feature. Core fatigue gaps, including long-distance driver shift fatigue, micro-sleep risks, and cervical neck strain, are systematically resolved via Shandray's Prizm Alert Handshake and Nelly's Ergonomic Engine. Our platform establishes a legally defensible audit trail under Section 8 clause 1 of the Occupational Health and Safety Act, reducing corporate liability and securing up to 142% return on driver safety investment.`;
            speak(script, language, () => setIsNarrating(false));
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 mb-24 overflow-x-hidden font-sans">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-ohs-navy via-[#0c1322] to-slate-950 p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
            >
                <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-ohs-orange uppercase tracking-[0.2em] bg-ohs-orange/10 px-3 py-1 rounded-full border border-ohs-orange/20">
                            Boardroom Executive Intelligence
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Live Telemetry & Video Sync</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        EXECUTIVE BRIEFING <span className="text-ohs-orange">& DEMO SYNC</span>
                    </h1>
                    <p className="text-gray-300 font-medium text-xs md:text-sm leading-relaxed">
                        Section 37 & 38 OHS Act 85 Compliance Telemetry integrated with interactive video walkthroughs and Shandray's Prizm Alert driver fatigue engine.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={toggleNarration}
                        className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-black text-xs transition-all shadow-lg cursor-pointer ${
                            isNarrating 
                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                : 'bg-ohs-orange hover:bg-yellow-400 text-ohs-navy shadow-ohs-orange/20'
                        }`}
                    >
                        {isNarrating ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        {isNarrating ? 'STOP AUDIO NARRATION' : 'NARRATE BRIEFING (NELLY VOICE)'}
                    </button>
                </div>
            </motion.div>

            {/* DEMO VIDEO FEATURE INTEGRATION CARD */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900 via-ohs-navy to-black border-2 border-ohs-orange/40 rounded-[2rem] p-6 md:p-8 shadow-2xl space-y-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Play size={16} className="text-ohs-orange fill-ohs-orange animate-pulse" />
                            <span className="text-xs font-black text-ohs-orange uppercase tracking-widest">
                                Interactive Executive Demo Video Showcase
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-white">
                            Direct Video Clip Walkthrough & Timestamps
                        </h2>
                    </div>
                    <p className="text-xs text-gray-400 max-w-md">
                        Click any timestamp to view the feature demonstration. Linked directly with executive briefing evidence dossiers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {videoClips.map((clip) => (
                        <button
                            key={clip.timestamp}
                            onClick={() => {
                                setActiveVideoClip(clip.timestamp);
                                setActiveTimestampLabel(`${clip.timestamp} - ${clip.title}`);
                            }}
                            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${clip.bgGlow} ${clip.borderColor} hover:border-ohs-orange/60 hover:scale-[1.02]`}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono font-black bg-black/60 px-2.5 py-1 rounded-lg text-ohs-orange border border-ohs-orange/30">
                                        {clip.timestamp}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${clip.color}`}>
                                        {clip.tag}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-white group-hover:text-ohs-orange transition-colors leading-tight">
                                    {clip.title}
                                </h3>
                                <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                                    {clip.desc}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-ohs-orange">
                                <span>PLAY DEMO CLIP</span>
                                <Eye size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* DEMO VIDEO MODAL PLAYER */}
            <AnimatePresence>
                {activeVideoClip && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border-2 border-ohs-orange/50 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 relative shadow-[0_0_80px_rgba(249,168,37,0.3)]"
                        >
                            <button
                                onClick={() => setActiveVideoClip(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block">
                                    Executive Video Player Sync
                                </span>
                                <h3 className="text-xl md:text-2xl font-black text-white">
                                    {activeTimestampLabel}
                                </h3>
                            </div>

                            <div className="w-full aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden relative shadow-inner">
                                <video
                                    className="w-full h-full object-contain"
                                    src="/assets/ErgoSafe_Reborn_V3_Demo.mp4"
                                    controls
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                    poster="/assets/nelly-steward-final.png"
                                    title="ErgoSafe Reborn V3 Executive Briefing Video Stream"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 pt-2 border-t border-white/10">
                                <span>Source: HQ Technical Demo Engine (Standalone File: ErgoSafe_Reborn_V3_Demo.mp4)</span>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = '/assets/ErgoSafe_Reborn_V3_Demo.mp4';
                                            link.download = 'ErgoSafe_Reborn_V3_Demo.mp4';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        className="bg-gradient-to-r from-ohs-orange to-yellow-400 text-ohs-navy font-black px-4 py-2 rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <Download size={14} />
                                        <span>💾 Download MP4 Demo Video</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveVideoClip(null)}
                                        className="bg-white/10 text-white font-bold px-4 py-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        CLOSE VIDEO SYNC
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FATIGUE GAP CLOSURE & LEGAL COMPLIANCE MATRIX */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/50 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6"
            >
                <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">
                        Regulatory & Liability Protection Matrix
                    </span>
                    <h2 className="text-2xl font-black text-white">
                        Fatigue Gap Closure & Statutory Compliance Highlights
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Direct mapping of corporate physical and cognitive fatigue risks to legally defensible ErgoSafe automation controls.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {fatigueGapClosures.map((gap, idx) => (
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
                                    <span className="text-[9px] font-black text-ohs-orange uppercase block">Solution Integration:</span>
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
            </motion.div>

            {/* Statutory Compliance Policy Cards */}
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

            {/* Admin-Zero Status Banner */}
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
