import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, MessageSquare, Volume2, Sparkles, Shield, User, Heart, Zap, Globe, 
  Send, RefreshCw, Award, Play, CheckCircle2, AlertTriangle, Lightbulb 
} from 'lucide-react';

type LanguageCode = 'en' | 'zu' | 'af' | 'st';

interface CompanionConfig {
  name: string;
  avatar: string;
  avatarIcon: string;
  tone: 'empathetic' | 'strict' | 'energetic' | 'calm';
  language: LanguageCode;
}

interface Message {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  language: LanguageCode;
  actionRecommendation?: string;
}

const LANGUAGE_LABELS: Record<LanguageCode, { name: string; flag: string; native: string }> = {
  en: { name: 'English', flag: '🇬🇧', native: 'English' },
  zu: { name: 'isiZulu', flag: '🇿🇦', native: 'IsiZulu' },
  af: { name: 'Afrikaans', flag: '🇿🇦', native: 'Afrikaans' },
  st: { name: 'Sesotho', flag: '🇿🇦', native: 'Sesotho' },
};

const AVATAR_OPTIONS = [
  { id: 'knight', name: 'Safety Knight', icon: '🛡️', color: 'from-amber-500 to-orange-600', desc: 'Resilient protective shield' },
  { id: 'wingman', name: 'Digital Wingman', icon: '⚡', color: 'from-cyan-500 to-blue-600', desc: 'Fast tactical OHS helper' },
  { id: 'guardian', name: 'Bio-Guardian', icon: '🌿', color: 'from-emerald-500 to-teal-600', desc: 'Holistic ergonomics coach' },
  { id: 'cyber', name: 'Cyber-Shield', icon: '🔮', color: 'from-purple-500 to-indigo-600', desc: 'Advanced telemetry assistant' },
];

const TONE_OPTIONS = [
  { id: 'empathetic', label: 'Empathetic Coach', icon: '🤝', desc: 'Gentle, supportive, focused on employee wellbeing' },
  { id: 'strict', label: 'Strict OHS Inspector', icon: '⚖️', desc: 'Direct, statutory compliance & Section 37/38 focused' },
  { id: 'energetic', label: 'Energetic Motivator', icon: '🚀', desc: 'Upbeat, gamified, high-energy stretch driver' },
  { id: 'calm', label: 'Calm Mentor', icon: '🧘', desc: 'Mindful, stress-reducing, balanced guidance' },
];

const PROMPT_PRESETS: Record<LanguageCode, string[]> = {
  en: [
    "My lower back and shoulders ache after 3 hours of sitting.",
    "What is the proper screen eye-level ratio under OHS Act?",
    "I feel overwhelmed with fatigue, what should I do?",
    "Can you help me log my daily workstation safety check?"
  ],
  zu: [
    "Ihlombe lami neqolo kubuhlungu emva kokuhlala isikhathi eside.",
    "Ngingayenza njani i-checkup yokuphepha yosuku?",
    "Ngithe ukukhathala kakhulu namhlanje, ngidinga ukwenzani?",
    "Ngiphe izeluleko zokwelula umzimba emahhovisi."
  ],
  af: [
    "My nek en skouers is baie styf na ure se tikwerk.",
    "Wat is die regte manier om my rekenaarskerm op te stel?",
    "Ek voel baie moeg en benodig 'n kort rustyd.",
    "Help my om my daaglikse werksplek-veiligheid in te teken."
  ],
  st: [
    "Mala a ka le mahetla a bohloko ke ho dula fatshe haholo.",
    "Nka lokisa tafole ya ka jwang ho latela melao ya OHS?",
    "Ke utlwa ke kgathetse haholo mosebetsing wa kajeno.",
    "Ke kopa keletso ya ho otlolla mmele ha ke sebetsa."
  ]
};

const RESPONSE_KNOWLEDGE: Record<LanguageCode, (topic: string, name: string, tone: string) => string> = {
  en: (topic, name, tone) => {
    if (topic.includes('back') || topic.includes('shoulder') || topic.includes('ache') || topic.includes('nek')) {
      return `${name} (${tone}): I hear you! Continuous static posture increases spinal load by 40%. Let us do a quick 90-second shoulder roll and chin tuck now. Remember OHS Act Section 8 mandates taking ergonomic breaks.`;
    }
    if (topic.includes('fatigue') || topic.includes('tired') || topic.includes('overwhelmed')) {
      return `${name} (${tone}): High cognitive load detected. Please stand up, drink 250ml of water, and perform 5 deep diaphragmatic breaths. I am scheduling a 10-minute dynamic walk break for you.`;
    }
    return `${name} (${tone}): Perfect work routine update! Your workstation is registered under ISO 45001 compliance standards. Keep up the high safety score!`;
  },
  zu: (topic, name, tone) => {
    if (topic.includes('buhlungu') || topic.includes('qolo') || topic.includes('hlombe')) {
      return `${name} (${tone}): Yebo, ngiyezwa! Ukuhlala isikhathi eside kunezela ingcindezi emhlane ngama-40%. Ake senze ukwelula amahlombe nesifuba imasekhondi angu-90 manje ngaphansi kwe-OHS Act Section 8.`;
    }
    if (topic.includes('khathala') || topic.includes('edinga')) {
      return `${name} (${tone}): Uhlelo lwethu lubona ukukhathala kakhulu. Siza uphakame, uphuze amanzi ahlanzekile, uhathe imizuzu engu-5 ukhululeke.`;
    }
    return `${name} (${tone}): Ngiyabonga ngokusho konke ngokuphepha! Isikhungo sakho sokusebenzela siphephile futhi silandela i-ISO 45001.`;
  },
  af: (topic, name, tone) => {
    if (topic.includes('styf') || topic.includes('nek') || topic.includes('skouers')) {
      return `${name} (${tone}): Ek verstaan heeltemal! Langdurige sitting verhoog rugstringspanning met 40%. Kom ons doen nou 'n 90-sekonde skouer-oefening volgens OHS Wet Artikel 8.`;
    }
    if (topic.includes('moeg') || topic.includes('rustyd')) {
      return `${name} (${tone}): Hoë uitputting bespeur. Staan asseblief op, drink 'n glas water, en neem 5 diep asemtrekke. Ek het 'n 10-minute dinamiese pouse geskeduleer.`;
    }
    return `${name} (${tone}): Baie goed gedoen! Jou werksplek voldoen aan alle ISO 45001 en veiligheidstandaarde.`;
  },
  st: (topic, name, tone) => {
    if (topic.includes('bohloko') || topic.includes('mala') || topic.includes('mahetla')) {
      return `${name} (${tone}): Ke a utlwisisa! Ho dula fatshe nako e telele ho eketsa khatello mokokotlong ka 40%. A re etseng boikoetliso ba metsotswana e 90 jwale tlasa OHS Act Section 8.`;
    }
    if (topic.includes('kgathetse') || topic.includes('utlwa')) {
      return `${name} (${tone}): Re lemohile mofufutso le mosebetsi o boima. Kopa ho ema naha, u nwe metsi a phepa, mme u nkeng metsotso e 5 ho iketla.`;
    }
    return `${name} (${tone}): Re leboha tsebiso ena ya polokeho! Setsha sa gago sa mosebetsi se ikobela melao ya ISO 45001.`;
  }
};

export const CompanionHub: React.FC = () => {
  const [config, setConfig] = useState<CompanionConfig>({
    name: 'Nelly',
    avatar: 'knight',
    avatarIcon: '🛡️',
    tone: 'empathetic',
    language: 'en'
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'companion',
      text: "Hello! I am your personal AI Safety Companion. Configure my name, voice tone, avatar, and preferred language above to begin our OHS safety stewardship!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'en'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: config.language
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Generate response based on language & tone
    setTimeout(() => {
      const selectedToneLabel = TONE_OPTIONS.find(t => t.id === config.tone)?.label || 'Empathetic Coach';
      const generator = RESPONSE_KNOWLEDGE[config.language] || RESPONSE_KNOWLEDGE['en'];
      const responseText = generator(query.toLowerCase(), config.name, selectedToneLabel);

      const companionMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: config.language,
        actionRecommendation: "Triggered 3-Min Micro-Stretch Checklist"
      };

      setMessages(prev => [...prev, companionMsg]);
    }, 600);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Attempt language matching
    if (config.language === 'af') utterance.lang = 'af-ZA';
    else if (config.language === 'zu') utterance.lang = 'zu-ZA';
    else if (config.language === 'st') utterance.lang = 'st-ZA';
    else utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const selectedAvatarObj = AVATAR_OPTIONS.find(a => a.id === config.avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ohs-navy via-slate-900 to-ohs-navy p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-ohs-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-ohs-orange/20 border border-ohs-orange/30 rounded-xl text-ohs-orange">
                <Bot size={24} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Ground-Zero <span className="text-ohs-orange">Human Co-Pilot Hub</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Configure your personal AI Safety Companion. Built for zero-prompt, everyday natural speaking styles with multi-lingual support across English, isiZulu, Afrikaans, and Sesotho.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
            <span className="text-2xl">{selectedAvatarObj.icon}</span>
            <div>
              <p className="text-xs font-bold text-white">{config.name}</p>
              <p className="text-[10px] text-ohs-orange font-medium">{LANGUAGE_LABELS[config.language].name} ({config.tone})</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Companion Setup Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity & Avatar Selection */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-ohs-orange" /> Companion Identity
              </h3>
              <span className="text-[10px] font-black bg-ohs-orange/20 text-ohs-orange px-2 py-0.5 rounded-full border border-ohs-orange/30">
                Co-Pilot Setup
              </span>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold mb-1.5 block">Companion Name</label>
              <input
                type="text"
                value={config.name}
                onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-800/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-ohs-orange transition-colors"
                placeholder="e.g. Nelly, Sipho, Boipelo"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold mb-2 block">Avatar Style</label>
              <div className="grid grid-cols-2 gap-2.5">
                {AVATAR_OPTIONS.map(avatar => (
                  <button
                    key={avatar.id}
                    onClick={() => setConfig(prev => ({ ...prev, avatar: avatar.id, avatarIcon: avatar.icon }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      config.avatar === avatar.id
                        ? 'bg-gradient-to-r from-ohs-orange/20 to-amber-500/10 border-ohs-orange shadow-lg shadow-ohs-orange/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{avatar.icon}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{avatar.name}</p>
                      <p className="text-[9px] text-gray-400 truncate">{avatar.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language & Tone Selection */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe size={16} className="text-ohs-orange" /> Language & Tone Engine
            </h3>

            {/* Language Selector */}
            <div>
              <label className="text-xs text-gray-300 font-semibold mb-2 block">Primary Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map(langKey => {
                  const lang = LANGUAGE_LABELS[langKey];
                  return (
                    <button
                      key={langKey}
                      onClick={() => setConfig(prev => ({ ...prev, language: langKey }))}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        config.language === langKey
                          ? 'bg-ohs-blue text-white border-cyan-400 font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-xs text-gray-300 font-semibold mb-2 block">Coaching Tone</label>
              <div className="space-y-2">
                {TONE_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setConfig(prev => ({ ...prev, tone: t.id as any }))}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      config.tone === t.id
                        ? 'bg-white/10 border-ohs-orange text-white font-bold'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <div>
                      <p className="text-xs font-bold">{t.label}</p>
                      <p className="text-[10px] opacity-75">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Natural Conversational Interface */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden min-h-[550px]">
          {/* Interface Header */}
          <div className="bg-slate-950/80 border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAvatarObj.color} flex items-center justify-center text-xl shadow-lg`}>
                {selectedAvatarObj.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {config.name} <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active Steward</span>
                </h4>
                <p className="text-[10px] text-gray-400">Zero-Prompt Natural OHS Dialogue • {LANGUAGE_LABELS[config.language].name}</p>
              </div>
            </div>
            <button
              onClick={() => speakText(messages[messages.length - 1]?.text || "Hello")}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSpeaking ? 'bg-ohs-orange text-ohs-navy border-ohs-orange animate-pulse' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
              title="Listen to last message"
            >
              <Volume2 size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin max-h-[420px]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'companion' && (
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedAvatarObj.color} flex items-center justify-center text-sm shadow-md flex-shrink-0 mt-1`}>
                    {selectedAvatarObj.icon}
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-ohs-blue text-white rounded-br-none shadow-md'
                      : 'bg-white/10 border border-white/10 text-gray-100 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.actionRecommendation && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-ohs-orange font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles size={12} /> {msg.actionRecommendation}
                      </span>
                    </div>
                  )}

                  <span className="block text-[9px] text-right text-gray-400 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Natural Preset Chips */}
          <div className="px-5 py-2.5 bg-slate-950/40 border-t border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {PROMPT_PRESETS[config.language].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="text-[11px] bg-white/5 hover:bg-ohs-orange/20 border border-white/10 hover:border-ohs-orange/40 text-gray-300 hover:text-ohs-orange px-3 py-1.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5 flex-shrink-0"
              >
                <Lightbulb size={12} className="text-ohs-orange" />
                <span>{preset}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Speak to ${config.name} in natural ${LANGUAGE_LABELS[config.language].name}...`}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-ohs-orange transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy p-3 rounded-xl font-bold transition-all shadow-lg cursor-pointer flex-shrink-0"
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionHub;
