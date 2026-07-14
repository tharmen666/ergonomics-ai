import { useState, useEffect } from 'react';
import { useNellyStore } from '../../store/nellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useAgentLog } from '../../store/agentLogStore';
import { translations, Language } from '../../utils/translations';
import { speak } from '../../utils/speech';
import { Globe, Send, MessageSquare, PlayCircle, ShieldCheck } from 'lucide-react';
import { ReasoningLog } from '../../components/agent/ReasoningLog';

export const NellyCoachPage = () => {
    const { 
        isSpeaking, 
        setSpeaking, 
        language, 
        setLanguage, 
        setGuidance 
    } = useNellyStore();
    const { addLog, logs } = useAgentLog();
    const { fatigueLevel } = useFatigueStore();
    const [userInput, setUserInput] = useState('');

    const activeLang: Language = (language && translations[language]) ? language : 'en';

    const handleSend = () => {
        if (!userInput.trim()) return;

        const lowCase = userInput.toLowerCase();
        addLog('User', userInput);

        const emergencyKeywords = ['severe pain', 'fainting', 'injury', 'accident'];
        const firstAidKeywords = ['first aid', 'first_aid', 'basic_first_aid_training_nsh', 'bleeding'];
        const symptomKeywords = ['tingling', 'numbness', 'pins and needles', 'sharp pain', 'burning'];
        const isNeckPain = lowCase.includes('neck pain') || lowCase.includes('cervical') || lowCase.includes('neck');
        
        const isEmerg = emergencyKeywords.some(word => lowCase.includes(word));
        const isFirstAid = firstAidKeywords.some(word => lowCase.includes(word));
        const isSymptom = symptomKeywords.some(word => lowCase.includes(word));

        if (isEmerg) {
            setSpeaking(true);
            const response = translations[activeLang]?.high_discomfort_disclaimer || translations['en'].high_discomfort_disclaimer;
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, activeLang, () => setSpeaking(false));
        } else if (isFirstAid) {
            const response = translations[activeLang]?.first_aid || translations['en'].first_aid;
            setGuidance(response);
            addLog('Nelly', response);
            setSpeaking(true);
            speak(response, activeLang, () => setSpeaking(false));
        } else if (isNeckPain) {
            setSpeaking(true);
            const response = "WARNING: Cervical load or neck pain detected. I have triggered the Cervical Orthopedic Micro-Circuit. Please perform the Tier 2 micro-stretch intervention immediately to relieve strain.";
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, activeLang, () => setSpeaking(false));
        } else if (isSymptom) {
            setSpeaking(true);
            const response = "WARNING: Nerve compression warning. Prolonged static posture causes spinal and wrist load. Action: Stand up and roll your shoulders now.";
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, activeLang, () => setSpeaking(false));
        } else {
            setSpeaking(true);
            addLog('Nelly', "Analyzing telemetry for ergonomic coaching response...");
            
            setTimeout(() => {
                const response = translations[activeLang]?.nelly_intro || translations['en'].nelly_intro;
                setGuidance(response);
                addLog('Nelly', response);
                speak(response, activeLang, () => setSpeaking(false));
            }, 1000);
        }
        setUserInput('');
    };

    const triggerSafetyTour = () => {
        const response = "Safety Tour initialized: We will verify your workspace angles, screen distance, and perform a quick cervical strain pre-check.";
        addLog('Nelly', response);
        speak(response, activeLang);
    };

    const triggerStewardship = () => {
        const response = translations[activeLang]?.compliance_check || translations['en'].compliance_check;
        addLog('Nelly', response);
        speak(response, activeLang);
    };

    return (
        <div className="space-y-6 pb-20 font-sans">
            <div>
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block mb-1">Digital Companion</span>
                <h1 className="text-3xl font-black text-white tracking-tight">NELLY AI SAFETY COACH</h1>
                <p className="text-xs text-gray-400">Direct interface for ergonomic guidance, pre-qualification checks, and multilingual voice assistance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Chat Area */}
                <div className="lg:col-span-8 flex flex-col bg-black/40 border border-white/5 rounded-3xl p-6 h-[60vh] justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ohs-orange/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    {/* Chat Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black text-white uppercase tracking-wider">Nelly Voice Stream</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-gray-500" />
                            <select
                                aria-label="Select Language"
                                title="Select Language"
                                value={activeLang}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="bg-transparent text-xs font-bold text-gray-400 focus:outline-none cursor-pointer"
                            >
                                <option value="en" className="bg-ohs-navy">English (ZA)</option>
                                <option value="zu" className="bg-ohs-navy">isiZulu</option>
                                <option value="xh" className="bg-ohs-navy">isiXhosa</option>
                                <option value="sw" className="bg-ohs-navy">KiSwahili</option>
                                <option value="zh" className="bg-ohs-navy">Mandarin (ZH)</option>
                                <option value="de" className="bg-ohs-navy">Deutsch</option>
                                <option value="st" className="bg-ohs-navy">Sesotho</option>
                            </select>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        <div className="p-4 bg-ohs-navy/60 border border-white/5 rounded-2xl">
                            <p className="text-xs text-gray-300 leading-relaxed italic">
                                "{translations[activeLang]?.nelly_intro || translations['en'].nelly_intro}"
                            </p>
                        </div>

                        {logs.slice(-10).map((log) => (
                            <div key={log.id} className={`flex gap-3 text-xs items-start ${log.agent === 'User' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-4 rounded-2xl max-w-[80%] ${
                                    log.agent === 'User' 
                                        ? 'bg-ohs-orange text-ohs-navy font-bold' 
                                        : 'bg-white/5 border border-white/5 text-gray-300'
                                }`}>
                                    <span className="block text-[8px] font-black opacity-60 uppercase mb-1">{log.agent}</span>
                                    <p className="leading-relaxed">{log.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls & Input */}
                    <div className="border-t border-white/5 pt-4 z-10">
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={triggerSafetyTour}
                                className="flex-1 flex items-center justify-center gap-2 bg-ohs-orange text-ohs-navy hover:bg-yellow-400 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all"
                            >
                                Safety Tour
                            </button>
                            <button
                                onClick={triggerStewardship}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                            >
                                Pre-Qual Check
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Report symptom or ask for advice (e.g. 'neck pain')..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-ohs-orange/50 text-white"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-ohs-orange hover:bg-yellow-400 text-ohs-navy px-4 rounded-xl flex items-center justify-center transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <ReasoningLog />

                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
                        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={14} className="text-ohs-orange" /> Voice Configuration
                        </h3>
                        <p className="text-[11px] text-gray-400 leading-normal">
                            Nelly is configured with a high-fidelity en-ZA Gauteng English voice model as the default. Multilingual routing is fully active for South African regional languages.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
