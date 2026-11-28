import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Globe,
    PlayCircle,
    ShieldCheck,
    Minimize2,
    Volume2,
    VolumeX,
    MessageSquare,
    Activity,
    HeartPulse,
    Sparkles,
    Lock,
    Play,
} from 'lucide-react';
import { ReasoningLog } from '../agent/ReasoningLog';
import { translations, type Language } from '../../utils/translations';
import { VOICEOVER_ACCENT_MAP, speakWithSubtitles, toggleMute, getIsMuted } from '../../utils/speech';

import {
    useNellyStore,
    normalizeNellySidePanelTab,
    type NellySidePanelTab,
} from '../../store/nellyStore';
import { useAgentLog } from '../../store/agentLogStore';
import { useComplianceStore } from '../../store/complianceStore';
import { useTenantStore } from '../../store/tenantStore';
import { getCameraConsentState } from '../../utils/popiaCrypto';
import { GlobalComplianceEngine } from '../../logic/security/semanticFirewall';
import { NELLY_REPLIES, nellyReplyPair, type NellyReplyKey } from './nellyReplies';
import { triage, newTriageSession, type TriageSession } from '../../lib/nellyTriage';
import { reportsEmergency } from '../../utils/emergencyIntent';
import { AITransparencyBadge } from '../compliance/AITransparencyBadge';

interface NellyInterfaceProps {
    language?: Language;
    setLanguage?: (lang: Language) => void;
    onClose?: () => void;
    onTour?: () => void;
    onStewardship?: () => void;
    onEmergency?: () => void;
    userInput?: string;
    setUserInput?: (input: string) => void;
    onSend?: () => void;
    isSpeaking?: boolean;
}

const SIDE_PANEL_TAB_CONFIG: Array<{
    id: NellySidePanelTab;
    label: string;
    icon: React.ElementType;
}> = [
    { id: 'advisor', label: 'Advisor', icon: MessageSquare },
    { id: 'ergonomics', label: 'Exercises', icon: Activity },
    { id: 'first-aid', label: 'First Aid', icon: HeartPulse },
    { id: 'prompts', label: 'Prompts', icon: Sparkles },
    { id: 'voice', label: 'Voice & Lang', icon: Globe },
    { id: 'compliance', label: 'Compliance', icon: Lock },
];

const QUICK_TRIAGE_PROMPTS: Array<{
    key: NellyReplyKey;
    label: string;
    badge: string;
}> = [
    { key: 'neck', label: 'Neck Pain & Cervical Stretch', badge: 'OHS Sec 8' },
    { key: 'back', label: 'Lower Back & Lumbar Support', badge: 'GN R1589' },
    { key: 'wrist', label: 'Wrist & Forearm Strain Control', badge: 'Ergonomics' },
    { key: 'eye', label: 'Digital Eye Strain (20-20-20)', badge: 'VDU Control' },
    { key: 'symptom', label: 'Tingling / Numbness Risk Alert', badge: 'Medical Triage' },
    { key: 'ohs', label: 'OHS Act Sec 8 & 37 Advisory', badge: 'Statutory' },
];

const EXERCISE_KEYS = [
    'monitor-mastery',
    'lumbar-lock',
    '20-20-20',
    'shoulder-rolls',
    'wrist-flexor',
    'lateral-neck',
] as const;

export const NellyInterface = ({
    language: propLang,
    setLanguage: propSetLang,
    onClose = () => {},
    onTour = () => {},
    onStewardship,
    onEmergency,
    userInput: propUserInput,
    setUserInput: propSetUserInput,
    onSend,
    isSpeaking: propIsSpeaking,
}: NellyInterfaceProps) => {
    const store = useNellyStore();
    const { addLog } = useAgentLog();
    const { status: complianceStatus, cases } = useComplianceStore();
    const { companyId, companies } = useTenantStore();
    const [localInput, setLocalInput] = useState('');
    const [lastQuickReply, setLastQuickReply] = useState<string | null>(null);
    // Nelly's banter / pain-check state. In memory only: gone on refresh, never saved, never sent.
    const triageRef = useRef<TriageSession>(newTriageSession());

    const language = propLang || store.language || 'en';
    const setLanguage = propSetLang || store.setLanguage;
    const isSpeaking = propIsSpeaking !== undefined ? propIsSpeaking : store.isSpeaking;
    const { markIntroduced, activeSubtitle, activeVoice, activeSidePanelTab, setActiveSidePanelTab } = store;

    const safeTab = normalizeNellySidePanelTab(activeSidePanelTab);
    const activeLang: Language = language && translations[language] ? language : 'en';
    const currentAccent = VOICEOVER_ACCENT_MAP[activeLang] || VOICEOVER_ACCENT_MAP['en'];
    const subtitleDisplay =
        activeSubtitle && activeSubtitle.lang === activeLang
            ? activeSubtitle.text
            : translations[activeLang].nelly_intro;

    const userInput = propUserInput !== undefined ? propUserInput : localInput;
    const setUserInput = propSetUserInput || setLocalInput;

    const activeCompanyName =
        companies.find((c) => c.id === companyId)?.name || 'Sovereign Health Ltd';
    const cameraConsent = getCameraConsentState();
    const openCasesCount = cases.filter((c) => c.escalationState !== 'resolved').length;

    const handleLanguageSelect = (langCode: Language) => {
        setLanguage(langCode);
        const localizedIntro = translations[langCode]?.nelly_intro || translations['en'].nelly_intro;
        const englishIntro = translations['en'].nelly_intro;
        markIntroduced();
        speakWithSubtitles(englishIntro, localizedIntro, langCode);
    };

    const handleQuickPrompt = (key: NellyReplyKey) => {
        const { spokenEnglish, subtitleText } = nellyReplyPair(key, activeLang);
        setLastQuickReply(subtitleText);
        store.setSpeaking(true);
        store.setGuidance(subtitleText);
        addLog('Nelly', subtitleText);
        speakWithSubtitles(spokenEnglish, subtitleText, activeLang, () => store.setSpeaking(false));
    };

    const handleStewardship =
        onStewardship ||
        (() => {
            store.setSpeaking(true);
            const prompt =
                'STEWARDSHIP AUDIT: Are you currently seated at a desk or working from a bed/couch? (Please type your response)';
            store.setGuidance(prompt);
            addLog('Nelly', prompt);
            speakWithSubtitles(prompt, prompt, activeLang, () => store.setSpeaking(false));
        });

    const handleSend =
        onSend ||
        (() => {
            const trimmed = userInput.trim();
            if (!trimmed) return;

            const low = trimmed.toLowerCase();
            if (reportsEmergency(low)) {
                setUserInput('');
                onEmergency?.();
                handleQuickPrompt('emergency');
                return;
            }

            // Banter, pain check and doctor referral. Private to this person: their own words are not logged and nothing is reported.
            const triaged = triage(trimmed, triageRef.current);
            triageRef.current = triaged.session;
            if (triaged.result?.type === 'emergency') {
                setUserInput('');
                onEmergency?.();
                handleQuickPrompt('emergency');
                return;
            }
            if (triaged.result?.type === 'reply') {
                const text = triaged.result.text;
                const spoken = text.replace(/^- /gm, '');
                addLog('Nelly', text);
                setLastQuickReply(text);
                store.setSpeaking(true);
                store.setGuidance(text);
                speakWithSubtitles(spoken, text, 'en', () => store.setSpeaking(false));
                setUserInput('');
                return;
            }

            addLog('User', trimmed);
            let key: NellyReplyKey = 'unknown';
            if (/\b(neck|cervical)\b/.test(low)) key = 'neck';
            else if (/\b(back|lumbar|spine)\b/.test(low)) key = 'back';
            else if (/\b(wrist|carpal|hand|mouse)\b/.test(low)) key = 'wrist';
            else if (/\b(eye|eyes|headache|vision|screen)\b/.test(low)) key = 'eye';
            else if (/\b(tingling|numbness|burning)\b/.test(low)) key = 'symptom';
            else if (/\b(ohs|iso|section 37|compliance|act)\b/.test(low)) key = 'ohs';

            const { spokenEnglish, subtitleText } = nellyReplyPair(key, activeLang);
            setLastQuickReply(subtitleText);
            store.setSpeaking(true);
            store.setGuidance(subtitleText);
            addLog('Nelly', subtitleText);
            speakWithSubtitles(spokenEnglish, subtitleText, activeLang, () => store.setSpeaking(false));
            setUserInput('');
        });

    const renderTabBody = () => {
        switch (safeTab) {
            case 'ergonomics': {
                const localizedEx = translations[activeLang]?.training?.exercises || {};
                const englishEx = translations.en.training.exercises;
                return (
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                Guided Ergonomics &amp; Micro-Drills
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">OHS Act Sec 8</span>
                        </div>
                        {EXERCISE_KEYS.map((key) => {
                            const ex = localizedEx[key] || englishEx[key];
                            const enEx = englishEx[key];
                            if (!ex || !enEx) return null;
                            const spokenCue = `${enEx.title}. ${enEx.step1}. ${enEx.desc}`;
                            const subtitleCue = `${ex.title} — ${ex.step1}. ${ex.desc}`;
                            return (
                                <div
                                    key={key}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-bold text-white leading-tight">{ex.title}</p>
                                        <button
                                            type="button"
                                            onClick={() => speakWithSubtitles(spokenCue, subtitleCue, activeLang)}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold shrink-0 cursor-pointer"
                                        >
                                            <Play size={10} />
                                            Cue
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-amber-300 font-semibold">{ex.step1}</p>
                                    <p className="text-[10px] text-slate-300 leading-snug">{ex.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            case 'first-aid': {
                const localizedEmergency =
                    (NELLY_REPLIES.emergency as Record<string, string>)[activeLang] ||
                    NELLY_REPLIES.emergency.en;
                const localizedFirstAid =
                    translations[activeLang]?.first_aid || translations.en.first_aid;
                const ohsClauses = GlobalComplianceEngine.fetchOHSBriefing(activeLang);

                return (
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-red-300">
                                    Site Emergency Protocol
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleQuickPrompt('emergency')}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/25 hover:bg-red-500/40 border border-red-400/40 text-red-200 text-[10px] font-bold cursor-pointer"
                                >
                                    <Volume2 size={11} />
                                    Speak
                                </button>
                            </div>
                            <p className="text-[11px] text-red-100 leading-snug">{localizedEmergency}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                                    Immediate First Aid Cue
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        speakWithSubtitles(
                                            translations.en.first_aid,
                                            localizedFirstAid,
                                            activeLang
                                        )
                                    }
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[10px] font-bold cursor-pointer"
                                >
                                    <Volume2 size={11} />
                                    Speak
                                </button>
                            </div>
                            <p className="text-xs font-bold text-white">{localizedFirstAid}</p>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 block">
                                South African OHS Act References
                            </span>
                            {ohsClauses.slice(0, 3).map((clause) => (
                                <div
                                    key={clause.id}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
                                >
                                    <p className="text-[11px] font-bold text-white">{clause.title}</p>
                                    <p className="text-[10px] text-slate-300 leading-snug">{clause.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            case 'prompts':
                return (
                    <div className="space-y-2.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange block">
                            Instant OHS &amp; Ergonomic Quick Prompts
                        </span>
                        <div className="space-y-1.5">
                            {QUICK_TRIAGE_PROMPTS.map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => handleQuickPrompt(item.key)}
                                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-ohs-orange/40 flex items-center justify-between gap-2 text-left transition-all cursor-pointer"
                                >
                                    <span className="text-[11px] font-bold text-white leading-tight">
                                        {item.label}
                                    </span>
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-ohs-orange/20 text-ohs-orange border border-ohs-orange/30 shrink-0">
                                        {item.badge}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">
                                Latest Advisor Output ({currentAccent.regionalAccent})
                            </span>
                            <p className="text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {lastQuickReply || subtitleDisplay}
                            </p>
                        </div>
                    </div>
                );

            case 'voice':
                return (
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <img
                                src="/assets/nelly-male-avatar.png"
                                alt="Nelly Male Advisor"
                                className="w-11 h-11 rounded-full object-cover object-top border border-amber-400/60 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-white truncate">
                                    {activeVoice?.name || 'en-ZA-LukeNeural (Demo Voicenote)'}
                                </p>
                                <p className="text-[10px] text-emerald-300 font-mono">
                                    Locale: en-ZA • Rate: 0.96x • Pitch: 1.0
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleLanguageSelect(activeLang)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-black uppercase cursor-pointer"
                            >
                                <Play size={12} />
                                Play en-ZA Intro
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const muted = toggleMute();
                                    store.setSpeaking(!muted);
                                }}
                                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[10px] font-bold cursor-pointer"
                            >
                                {getIsMuted() ? 'Unmute' : 'Mute'}
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                                Synced Multilingual Subtitle Languages
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                {Object.entries(VOICEOVER_ACCENT_MAP).map(([code, cfg]) => {
                                    const isSelected = activeLang === code;
                                    return (
                                        <button
                                            key={code}
                                            type="button"
                                            onClick={() => handleLanguageSelect(code as Language)}
                                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black'
                                                    : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                                            }`}
                                        >
                                            <span className="text-[10px] font-bold block truncate">
                                                {cfg.regionalAccent}
                                            </span>
                                            <span className="text-[9px] opacity-80 block truncate">
                                                {cfg.displayName}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10">
                            <p className="text-[11px] text-white italic leading-snug">
                                "{subtitleDisplay}"
                            </p>
                        </div>
                    </div>
                );

            case 'compliance': {
                const isoClauses = GlobalComplianceEngine.fetchISOBriefing(activeLang);
                return (
                    <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase">
                                <span className="text-emerald-400">Governance Telemetry</span>
                                <span className="text-amber-300">{complianceStatus}</span>
                            </div>
                            <p className="text-[11px] text-slate-200">
                                Tenant: <strong className="text-white">{activeCompanyName}</strong>
                            </p>
                            <p className="text-[11px] text-slate-300">
                                Open Escalation Cases: <strong className="text-white">{openCasesCount}</strong> • POPIA Camera Consent:{' '}
                                <strong className="text-white">
                                    {cameraConsent.accepted ? 'Accepted' : 'Pending / Manual Mode'}
                                </strong>
                            </p>
                        </div>

                        <AITransparencyBadge compact />

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 block">
                                Voluntary ISO &amp; Psychosocial Guidance
                            </span>
                            {isoClauses.slice(2).map((iso) => (
                                <div
                                    key={iso.id}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
                                >
                                    <p className="text-[11px] font-bold text-white">{iso.title}</p>
                                    <p className="text-[10px] text-slate-300 leading-snug">{iso.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            case 'advisor':
            default:
                return (
                    <>
                        {/* EU AI Act Art. 50 Transparency Notice */}
                        <AITransparencyBadge compact />

                        {/* Premium Language Preference Selection Bar */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 bg-slate-950 border border-slate-800 p-1.5 rounded-xl">
                            {Object.entries(VOICEOVER_ACCENT_MAP).map(([code, config]) => {
                                const isSelected = activeLang === code;
                                const langCode = code as Language;
                                return (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() => handleLanguageSelect(langCode)}
                                        className={`flex-1 text-[10px] font-black py-2 px-1 rounded-lg cursor-pointer transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]'
                                                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/50'
                                        }`}
                                    >
                                        {config.regionalAccent}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Live Multilingual Subtitle Bar synced with South African English (en-ZA) Voice */}
                        <div
                            data-testid="nelly-subtitle-bar"
                            className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-bold">
                                <span
                                    data-testid="nelly-voice-badge"
                                    title={activeVoice?.name || 'en-ZA-LukeNeural (Demo Voicenote)'}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300"
                                >
                                    {activeVoice?.engine === 'voicenote' || !activeVoice
                                        ? 'Voice: en-ZA (LukeNeural)'
                                        : `Voice: ${activeVoice.tier === 'en-ZA' ? 'en-ZA' : activeVoice.lang} • 0.96x`}
                                </span>
                                <span
                                    data-testid="nelly-subtitle-lang"
                                    className="inline-flex items-center gap-1 text-amber-300"
                                >
                                    <Globe size={11} />
                                    Subtitles: {currentAccent.displayName} ({currentAccent.regionalAccent})
                                </span>
                            </div>
                            <p
                                data-testid="nelly-subtitle-text"
                                className="text-xs sm:text-sm text-white font-medium italic leading-relaxed break-words whitespace-normal"
                            >
                                "{subtitleDisplay}"
                            </p>
                        </div>

                        {/* Agent Reasoning Log Container */}
                        <div className="w-full max-w-full overflow-hidden rounded-xl">
                            <ReasoningLog />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <button
                                type="button"
                                onClick={onTour}
                                className="flex-1 flex items-center justify-center gap-2 bg-ohs-orange text-ohs-navy hover:bg-yellow-400 py-2.5 min-h-[44px] rounded-xl font-black text-[10px] transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(249,168,37,0.4)] transition-all duration-300 ease-out active:scale-95 whitespace-nowrap cursor-pointer"
                            >
                                <PlayCircle size={14} />
                                SAFETY TOUR
                            </button>
                            <button
                                type="button"
                                onClick={handleStewardship}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-ohs-orange/50 hover:bg-white/10 text-white py-2.5 min-h-[44px] rounded-xl font-bold text-[10px] transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(249,168,37,0.2)] transition-all duration-300 ease-out active:scale-95 whitespace-nowrap cursor-pointer"
                            >
                                <ShieldCheck size={14} className="text-ohs-orange" />
                                STEWARDSHIP
                            </button>
                        </div>

                        {/* Stewardship Model Feedback */}
                        {isSpeaking && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-ohs-orange/10 border border-ohs-orange/20 rounded-xl"
                            >
                                <p className="text-[11px] text-ohs-orange font-bold leading-tight">
                                    {translations[activeLang].stewardship_model}
                                </p>
                            </motion.div>
                        )}
                    </>
                );
        }
    };

    return (
        <motion.div
            data-testid="nelly-side-panel"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[calc(100vw-2rem)] max-w-[360px] sm:max-w-[380px] bg-ohs-navy/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[82dvh] flex flex-col min-h-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
                        <img
                            src="/assets/nelly-male-avatar.png"
                            alt="Nelly AI Advisor"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest">
                        Nelly Intelligence Grid
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            const muted = toggleMute();
                            store.setSpeaking(!muted);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            getIsMuted()
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-ohs-orange/20 text-ohs-orange border-ohs-orange/30 hover:bg-ohs-orange/30'
                        }`}
                        title={getIsMuted() ? 'Unmute Nelly Voice Synthesis' : 'Mute Nelly Voice Synthesis'}
                    >
                        {getIsMuted() ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Minimize"
                        title="Minimize"
                        onClick={onClose}
                        className="text-gray-500 hover:text-white p-1 cursor-pointer"
                    >
                        <Minimize2 size={14} />
                    </button>
                    <button
                        type="button"
                        aria-label="Close"
                        title="Close"
                        onClick={onClose}
                        className="text-gray-500 hover:text-white p-1 cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Side Panel Navigation Tabs */}
            <div
                data-testid="nelly-panel-tabs"
                className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-white/10 shrink-0 scrollbar-none"
            >
                {SIDE_PANEL_TAB_CONFIG.map((tab) => {
                    const isSelected = safeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            data-testid={`nelly-tab-${tab.id}`}
                            onClick={() => setActiveSidePanelTab(tab.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                                isSelected
                                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            <Icon size={11} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Scrollable Body Content */}
            <div
                data-testid="nelly-panel-body"
                className="flex-1 min-h-[240px] overflow-y-auto pr-0.5 space-y-3"
            >
                {renderTabBody()}
            </div>

            {/* User Input Area */}
            <div className="mt-3 flex gap-2 border-t border-white/5 pt-3 shrink-0">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type symptom or query..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-h-[44px] text-[10px] focus:outline-none focus:border-ohs-orange/50 text-white"
                />
                <button
                    type="button"
                    onClick={handleSend}
                    className="bg-ohs-orange text-ohs-navy px-3 py-2 min-h-[44px] rounded-xl font-black text-[10px] cursor-pointer"
                >
                    SEND
                </button>
            </div>
        </motion.div>
    );
};
