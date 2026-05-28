import { useState } from 'react';
import { FORECOURT_LANYARD_MATRIX } from '../../data/lanyardMatrix';
import { ShieldAlert, Droplets, Smile, MessageCircle, Mic, Globe2, ChevronRight, CheckCircle2, ScanFace } from 'lucide-react';
import { LanyardCardPreview } from './LanyardCardPreview';

export const LanyardMatrixUI = () => {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'zu'>('en');
    const [activeTab, setActiveTab] = useState<'sideA' | 'sideB' | 'faq' | 'mockup'>('sideA');

    const matrix = FORECOURT_LANYARD_MATRIX;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-ohs-navy/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-ohs-orange/20 text-ohs-orange text-xs font-black uppercase tracking-wider rounded-full border border-ohs-orange/30">
                            Physical Asset Integration
                        </span>
                        <span className="text-gray-400 text-sm">v{matrix.version}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">SOP Safety <span className="text-ohs-orange">Lanyards</span></h2>
                    <p className="text-gray-300 font-medium mt-1">
                        {matrix.brandFocus} | Voice of Iris Matrix
                    </p>
                </div>
                
                {/* Language Toggle */}
                <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5">
                    <button 
                        onClick={() => setActiveLanguage('en')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeLanguage === 'en' ? 'bg-ohs-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Globe2 size={16} /> ENG
                    </button>
                    <button 
                        onClick={() => setActiveLanguage('zu')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeLanguage === 'zu' ? 'bg-ohs-green text-ohs-navy shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Globe2 size={16} /> ZUL
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 bg-white/5 p-2 rounded-xl overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('sideA')}
                    className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'sideA' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    <ShieldAlert size={18} /> Side A: Emergency
                </button>
                <button 
                    onClick={() => setActiveTab('sideB')}
                    className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'sideB' ? 'bg-ohs-blue/20 text-ohs-blue border border-ohs-blue/30' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    <Smile size={18} /> Side B: Service
                </button>
                <button 
                    onClick={() => setActiveTab('faq')}
                    className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'faq' ? 'bg-ohs-orange/20 text-ohs-orange border border-ohs-orange/30' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    <MessageCircle size={18} /> Astron FAQ Deck
                </button>
                <button 
                    onClick={() => setActiveTab('mockup')}
                    className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'mockup' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    <ScanFace size={18} /> Physical Mockup
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                
                {/* SIDE A: EMERGENCY */}
                {activeTab === 'sideA' && matrix.sideA_EmergencySOPs.map(track => (
                    <div key={track.id} className="bg-white/5 border border-red-500/20 rounded-2xl overflow-hidden shadow-xl">
                        <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center gap-3">
                            {track.id.includes("EVAC") ? <ShieldAlert className="text-red-400" size={24} /> : <Droplets className="text-orange-400" size={24} />}
                            <h3 className="text-xl font-bold text-white">{track.trackTitle[activeLanguage]}</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4 bg-ohs-blue/10 p-4 rounded-xl border border-ohs-blue/20">
                                <Mic className="text-ohs-blue flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-ohs-blue font-bold uppercase tracking-wider mb-1">Iris Intro</p>
                                    <p className="text-gray-200 text-sm italic">"{track.irisVoiceIntro[activeLanguage]}"</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {track.steps.map(step => (
                                    <div key={step.stepNumber} className="flex items-start gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 font-bold text-sm flex-shrink-0">
                                            {step.stepNumber}
                                        </span>
                                        <p className="text-gray-100 mt-1">{step.instruction[activeLanguage]}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-start gap-4 bg-ohs-green/10 p-4 rounded-xl border border-ohs-green/20">
                                <CheckCircle2 className="text-ohs-green flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-ohs-green font-bold uppercase tracking-wider mb-1">Iris Directive</p>
                                    <p className="text-gray-200 text-sm font-medium">"{track.irisClosingDirective[activeLanguage]}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* SIDE B: SERVICE ROUTINES */}
                {activeTab === 'sideB' && matrix.sideB_ServiceRoutines.map(track => (
                    <div key={track.id} className="bg-white/5 border border-ohs-blue/20 rounded-2xl overflow-hidden shadow-xl">
                        <div className="bg-ohs-blue/10 p-4 border-b border-ohs-blue/20 flex items-center gap-3">
                            <Smile className="text-ohs-blue" size={24} />
                            <h3 className="text-xl font-bold text-white">{track.trackTitle[activeLanguage]}</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4 bg-ohs-blue/10 p-4 rounded-xl border border-ohs-blue/20">
                                <Mic className="text-ohs-blue flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-ohs-blue font-bold uppercase tracking-wider mb-1">Iris Intro</p>
                                    <p className="text-gray-200 text-sm italic">"{track.irisVoiceIntro[activeLanguage]}"</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {track.steps.map(step => (
                                    <div key={step.stepNumber} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-ohs-blue/30 transition-colors">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ohs-blue/20 text-ohs-blue font-bold text-sm flex-shrink-0">
                                            {step.stepNumber}
                                        </span>
                                        <p className="text-gray-100 font-medium">{step.instruction[activeLanguage]}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-start gap-4 bg-ohs-green/10 p-4 rounded-xl border border-ohs-green/20 mt-6">
                                <CheckCircle2 className="text-ohs-green flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-ohs-green font-bold uppercase tracking-wider mb-1">Iris Directive</p>
                                    <p className="text-gray-200 text-sm font-medium">"{track.irisClosingDirective[activeLanguage]}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* FAQ DECK */}
                {activeTab === 'faq' && (
                    <div className="grid grid-cols-1 gap-4">
                        {matrix.astronTransitionDeck.map(card => (
                            <div key={card.cardNumber} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-ohs-orange/30 transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ohs-orange/5 rounded-bl-full -z-10 group-hover:bg-ohs-orange/10 transition-colors" />
                                
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-ohs-orange/20 text-ohs-orange font-black text-lg border border-ohs-orange/30">
                                            Q{card.cardNumber}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h4 className="text-lg md:text-xl font-bold text-white leading-tight">
                                            {card.question[activeLanguage]}
                                        </h4>
                                        <div className="flex gap-3 text-gray-300 bg-black/20 p-4 rounded-xl border border-white/5">
                                            <ChevronRight className="text-ohs-orange flex-shrink-0 mt-0.5" size={18} />
                                            <p className="font-medium text-sm md:text-base leading-relaxed">{card.answer[activeLanguage]}</p>
                                        </div>
                                        <div className="flex items-start gap-3 mt-4 pt-4 border-t border-white/10">
                                            <Mic className="text-ohs-blue flex-shrink-0" size={16} />
                                            <p className="text-sm text-ohs-blue font-medium italic">
                                                <span className="font-bold uppercase text-xs mr-2 border border-ohs-blue/30 px-2 py-0.5 rounded-full">Iris Tip</span>
                                                {card.irisProtocolTip[activeLanguage]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PHYSICAL MOCKUP VIEW */}
                {activeTab === 'mockup' && (
                    <LanyardCardPreview />
                )}
            </div>
        </div>
    );
};
