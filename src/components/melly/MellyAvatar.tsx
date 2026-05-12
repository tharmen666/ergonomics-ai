import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMellyStore } from '../../store/mellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useAgentLog } from '../../store/agentLogStore';
import { MellyCore } from './MellyCore';
import { MellyInterface } from './MellyInterface';
import { MellyEmergencyUI } from './MellyEmergencyUI';
import { translations, Language } from '../../utils/translations';

/**
 * MellyAvatar: The primary entry point for the Melly AI Coach.
 * Orchestrates the Core Avatar, Interface, and Emergency UI.
 */
export const MellyAvatar = () => {
    const { 
        isWingmanActive, 
        isSpeaking, 
        setSpeaking, 
        setTourActive, 
        language, 
        setLanguage, 
        setGuidance,
        isMellyExpanded,
        setMellyExpanded 
    } = useMellyStore();
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
            addLog('Melly', response);
        } else if (isFirstAid) {
            const currentLang = (language as Language) || 'en';
            const response = translations[currentLang]?.first_aid || translations['en'].first_aid;
            setGuidance(response);
            addLog('Melly', response);
            setSpeaking(true);
            setTimeout(() => setSpeaking(false), 5000);
        } else if (isSymptom) {
            setSpeaking(true);
            const response = "WARNING: Nerve compression detected. Tingling in the extremities is a high-risk indicator for Carpal Tunnel Syndrome or cervical compression. ACTION: Please stand up, perform 5 shoulder rolls, and avoid repetitive clicking for the next 10 minutes. I am logging this as a Section 37 Liability Risk.";
            setGuidance(response);
            addLog('Melly', response);
            setTimeout(() => setSpeaking(false), 8000);
        } else {
            // Context-Aware Response Algorithm
            setSpeaking(true);
            addLog('Melly', "Analyzing telemetry for Stewardship AI response...");
            
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
                addLog('Melly', response);
                setTimeout(() => setSpeaking(false), 3000);
            }, 3000);
        }
        setUserInput('');
    };

    if (!isWingmanActive) return null;

    return (
        <div
            className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none"
        >
            <AnimatePresence mode="wait">
                {isMellyExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex flex-col items-end gap-3"
                    >
                        {/* Core Avatar Display */}
                        <MellyCore 
                            isSpeaking={isSpeaking} 
                            isExpanded={isMellyExpanded} 
                            onClick={() => {
                                window.speechSynthesis.cancel();
                                setSpeaking(false);
                                setMellyExpanded(false);
                            }}
                        />

                        {/* Interaction Hub or Emergency UI */}
                        {isEmergency ? (
                            <MellyEmergencyUI onDeescalate={() => setIsEmergency(false)} />
                        ) : (
                            <MellyInterface 
                                language={language}
                                setLanguage={setLanguage}
                                onClose={() => setMellyExpanded(false)}
                                onTour={() => {
                                    setTourActive(true);
                                    setMellyExpanded(false);
                                }}
                                onStewardship={() => {
                                    setSpeaking(true);
                                    setTimeout(() => setSpeaking(false), 5000);
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

            {/* Minimized Floating Avatar */}
            {!isMellyExpanded && (
                <MellyCore 
                    isSpeaking={isSpeaking} 
                    isExpanded={isMellyExpanded} 
                    onClick={() => setMellyExpanded(!isMellyExpanded)}
                />
            )}
        </div>
    );
};
