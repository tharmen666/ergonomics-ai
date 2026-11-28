import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { useAgentLog } from '../../store/agentLogStore';
import { NellyCore } from './NellyCore';
import { NellyInterface } from './NellyInterface';
import { NellyEmergencyUI } from './NellyEmergencyUI';
import { translations, Language } from '../../utils/translations';
import { speakWithSubtitles } from '../../utils/speech';

/**
 * NellyAvatar: The primary entry point for the Nelly AI Coach.
 * Orchestrates the Core Avatar, Interface, and Emergency UI.
 */
export const NellyAvatar = () => {
    const { 
        isWingmanActive, 
        isSpeaking, 
        setSpeaking, 
        setTourActive, 
        language, 
        setLanguage, 
        setGuidance,
        hasIntroduced,
        markIntroduced,
        isNellyExpanded,
        setNellyExpanded 
    } = useNellyStore();
    const { addLog } = useAgentLog();
    const [isEmergency, setIsEmergency] = useState(false);

    // Audio Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Introduce Nelly only after Wingman activation, once per browser session.
    useEffect(() => {
        if (isWingmanActive && !hasIntroduced) {
            const activeLang = (language as Language) || 'en';
            const localizedIntro = translations[activeLang]?.nelly_intro || translations['en'].nelly_intro;
            markIntroduced();
            speakWithSubtitles(translations['en'].nelly_intro, localizedIntro, activeLang);
        }
    }, [isWingmanActive, hasIntroduced, language, markIntroduced]);

    if (!isWingmanActive) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[8000] flex flex-col items-end pointer-events-none max-w-[calc(100vw-2rem)]">
            {/* Reasoning Hub Container */}
            <AnimatePresence mode="wait">
                {isNellyExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="pointer-events-auto z-50 relative"
                    >
                        {isEmergency ? (
                            <NellyEmergencyUI onDeescalate={() => setIsEmergency(false)} />
                        ) : (
                            <NellyInterface 
                                language={language}
                                setLanguage={setLanguage}
                                onClose={() => setNellyExpanded(false)}
                                onTour={() => {
                                    setTourActive(true);
                                    setNellyExpanded(false);
                                }}
                                onEmergency={() => setIsEmergency(true)}
                                onStewardship={() => {
                                    setSpeaking(true);
                                    const activeLang = (language as Language) || 'en';
                                    const response = "STEWARDSHIP AUDIT: Are you currently seated at a desk or working from a bed/couch? (Please type your response)";
                                    setGuidance(response);
                                    addLog('Nelly', response);
                                    speakWithSubtitles(response, response, activeLang);
                                    setTimeout(() => setSpeaking(false), 8000);
                                }}
                                isSpeaking={isSpeaking}
                             />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nelly Avatar - Shifts Up When Hub is Open */}
            <div 
                className={`absolute right-0 transition-all duration-500 ease-in-out z-40 ${
                    isNellyExpanded ? 'bottom-[380px] sm:bottom-[420px] md:bottom-[450px]' : 'bottom-0'
                }`}
            >
                <NellyCore onClick={() => setNellyExpanded(!isNellyExpanded)} isSpeaking={isSpeaking} />
            </div>
        </div>
    );
};
export default NellyAvatar;
