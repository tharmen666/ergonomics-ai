import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMellyStore } from '../../store/mellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { MellyCore } from './MellyCore';
import { MellyInterface } from './MellyInterface';
import { MellyEmergencyUI } from './MellyEmergencyUI';

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
        const emergencyKeywords = ['severe pain', 'fainting', 'injury', 'accident', 'bleeding'];
        const isEmerg = emergencyKeywords.some(word => lowCase.includes(word));

        if (isEmerg) {
            setIsEmergency(true);
            setSpeaking(true);
            setGuidance("EMERGENCY PROTOCOL ACTIVATED. Halted all non-critical processes.");
        } else {
            // Context-Aware Response Algorithm
            const efficiency = fatigueLevel === 'nominal' ? 100 : (fatigueLevel === 'warning' ? 85 : 75);
            if (efficiency < 85) {
                setGuidance(`Based on your rising Muda % to ${100 - efficiency}% (Context), please perform a 20-20-20 eye reset and posture adjustment immediately (Action) to restore your 100% O.H.E. rating and Section 37 compliance status (Result).`);
            } else {
                setGuidance(`I hear you. Let me check the OHS standards regarding "${userInput}"...`);
            }
            setSpeaking(true);
            setTimeout(() => setSpeaking(false), 3000);
        }
        setUserInput('');
    };

    // Avatar is now always visible by default. Wingman active state can be used for extra features.
    return (
        <div
            className="fixed bottom-24 md:bottom-4 right-4 z-[40] flex flex-col items-end gap-3 pointer-events-none"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => !isSpeaking && setIsExpanded(false)}
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
                    onClick={() => setIsExpanded(true)}
                />
            )}
        </div>
    );
};
