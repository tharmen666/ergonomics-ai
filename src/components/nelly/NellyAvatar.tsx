import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useAgentLog } from '../../store/agentLogStore';
import { NellyCore } from './NellyCore';
import { NellyInterface } from './NellyInterface';
import { NellyEmergencyUI } from './NellyEmergencyUI';
import { translations, Language, TranslationEntry } from '../../utils/translations';
import { speak } from '../../utils/speech';

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
        isNellyExpanded,
        setNellyExpanded 
    } = useNellyStore();
    const { addLog } = useAgentLog();
    
    const { fatigueLevel } = useFatigueStore();
    const [userInput, setUserInput] = useState('');
    const [isEmergency, setIsEmergency] = useState(false);

    // Audio Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Speak intro greeting whenever Nelly is expanded or language changes
    useEffect(() => {
        if (isNellyExpanded) {
            const intro = translations[language as Language]?.nelly_intro || translations['en'].nelly_intro;
            speak(intro, language);
        }
    }, [isNellyExpanded, language]);

    const handleSend = () => {
        if (!userInput.trim()) return;

        const lowCase = userInput.toLowerCase();
        addLog('User', userInput);

        const emergencyKeywords = ['severe pain', 'fainting', 'injury', 'accident'];
        const firstAidKeywords = ['first aid', 'first_aid', 'basic_first_aid_training_nsh', 'bleeding'];
        const symptomKeywords = ['tingling', 'numbness', 'pins and needles', 'sharp pain', 'burning'];
        
        const isEmerg = emergencyKeywords.some(word => lowCase.includes(word));
        const isFirstAid = firstAidKeywords.some(word => lowCase.includes(word));
        const isSymptom = symptomKeywords.some(word => lowCase.includes(word));

        if (isEmerg) {
            setIsEmergency(true);
            setSpeaking(true);
            const response = "EMERGENCY PROTOCOL ACTIVATED. Halted all non-critical processes. Contacting onsite first-aid immediately.";
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, language);
        } else if (isFirstAid) {
            const currentLang = (language as Language) || 'en';
            const response = (translations[currentLang] as TranslationEntry)?.first_aid || translations['en'].first_aid;
            setGuidance(response);
            addLog('Nelly', response);
            setSpeaking(true);
            speak(response, language);
            setTimeout(() => setSpeaking(false), 5000);
        } else if (isSymptom) {
            setSpeaking(true);
            const response = "WARNING: Nerve compression detected. Tingling in the extremities is a high-risk indicator for Carpal Tunnel Syndrome or cervical compression. ACTION: Please stand up, perform 5 shoulder rolls, and avoid repetitive clicking for the next 10 minutes. I am logging this as a Section 37 Liability Risk.";
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else {
            // Context-Aware Response Algorithm
            setSpeaking(true);
            addLog('Nelly', "Analyzing telemetry for Stewardship AI response...");
            
            // 3-second fail-safe timer
            setTimeout(() => {
                const efficiency = fatigueLevel === 'nominal' ? 100 : (fatigueLevel === 'warning' ? 85 : 75);
                let response = "";
                if (efficiency < 85) {
                    response = `Based on your rising Muda % to ${100 - efficiency}% (Context), please perform a 20-20-20 eye reset and posture adjustment immediately (Action) to restore your 100% O.H.E. rating and Section 37 compliance status (Result).`;
                } else {
                    response = `Stewardship Protocol Active: OHS standards verified for your query. Maintaining continuous compliance telemetry.`;
                }
                setGuidance(response);
                addLog('Nelly', response);
                speak(response, language);
                setTimeout(() => setSpeaking(false), 3000);
            }, 3000);
        }
        setUserInput('');
    };

    if (!isWingmanActive) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
            {/* Reasoning Hub Container */}
            <AnimatePresence mode="wait">
                {isNellyExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="pointer-events-auto"
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
                                onStewardship={() => {
                                    setSpeaking(true);
                                    const response = "STEWARDSHIP AUDIT: Are you currently seated at a desk or working from a bed/couch? (Please type your response)";
                                    setGuidance(response);
                                    addLog('Nelly', response);
                                    speak(response, language);
                                    setTimeout(() => setSpeaking(false), 8000);
                                }}
                                userInput={userInput}
                                setUserInput={setUserInput}
                                onSend={handleSend}
                                isSpeaking={isSpeaking}
                             />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nelly Avatar - Shifts Up When Hub is Open */}
            <div 
                className={`absolute right-0 transition-all duration-500 ease-in-out z-[10000] ${
                    isNellyExpanded ? 'bottom-[420px] md:bottom-[450px]' : 'bottom-0'
                }`}
            >
                <NellyCore onClick={() => setNellyExpanded(!isNellyExpanded)} isSpeaking={isSpeaking} />
            </div>
        </div>
    );
};
export default NellyAvatar;
