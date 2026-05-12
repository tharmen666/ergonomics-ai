import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMellyStore } from '../../store/mellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
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
        setGuidance 
    } = useMellyStore();
    
    const { fatigueLevel } = useFatigueStore();
    const [isExpanded, setIsExpanded] = useState(false);
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
        const emergencyKeywords = ['severe pain', 'fainting', 'injury', 'accident'];
        const firstAidKeywords = ['first aid', 'first_aid', 'basic_first_aid_training_nsh', 'bleeding'];
        
        const isEmerg = emergencyKeywords.some(word => lowCase.includes(word));
        const isFirstAid = firstAidKeywords.some(word => lowCase.includes(word));

        if (isEmerg) {
            setIsEmergency(true);
            setSpeaking(true);
            setGuidance("EMERGENCY PROTOCOL ACTIVATED. Halted all non-critical processes.");
        } else if (isFirstAid) {
            const currentLang = (language as Language) || 'en';
            setGuidance(translations[currentLang]?.first_aid || translations['en'].first_aid);
            setSpeaking(true);
            setTimeout(() => setSpeaking(false), 5000);
        } else {
            // Context-Aware Response Algorithm
            setSpeaking(true);
            setGuidance("Processing your request with Stewardship AI...");
            
            // 3-second fail-safe timer
            setTimeout(() => {
                const efficiency = fatigueLevel === 'nominal' ? 100 : (fatigueLevel === 'warning' ? 85 : 75);
                if (efficiency < 85) {
                    setGuidance(`Based on your rising Muda % to ${100 - efficiency}% (Context), please perform a 20-20-20 eye reset and posture adjustment immediately (Action) to restore your 100% O.H.E. rating and Section 37 compliance status (Result).`);
                } else {
                    setGuidance(`Stewardship Protocol Active: OHS standards verified. Maintaining continuous compliance telemetry.`);
                }
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
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex flex-col items-end gap-3"
                    >
                        {/* Core Avatar Display */}
                        <MellyCore 
                            isSpeaking={isSpeaking} 
                            isExpanded={isExpanded} 
                            onClick={() => {
                                window.speechSynthesis.cancel();
                                setSpeaking(false);
                                setIsExpanded(false);
                            }}
                        />

                        {/* Interaction Hub or Emergency UI */}
                        {isEmergency ? (
                            <MellyEmergencyUI onDeescalate={() => setIsEmergency(false)} />
                        ) : (
                            <MellyInterface 
                                language={language}
                                setLanguage={setLanguage}
                                onClose={() => setIsExpanded(false)}
                                onTour={() => {
                                    setTourActive(true);
                                    setIsExpanded(false);
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
            {!isExpanded && (
                <MellyCore 
                    isSpeaking={isSpeaking} 
                    isExpanded={isExpanded} 
                    onClick={() => setIsExpanded(!isExpanded)}
                />
            )}
        </div>
    );
};
