import { useEffect, useState } from 'react';
import { reportsEmergency } from '../../utils/emergencyIntent';
import { AnimatePresence, motion } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useComplianceStore } from '../../store/complianceStore';
import { useAgentLog } from '../../store/agentLogStore';
import { NellyCore } from './NellyCore';
import { NellyInterface } from './NellyInterface';
import { NellyEmergencyUI } from './NellyEmergencyUI';
import { translations, Language, TranslationEntry } from '../../utils/translations';
import { speak } from '../../utils/speech';
import { nellyReply } from './nellyReplies';

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
    
    const [userInput, setUserInput] = useState('');
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
            const intro = translations[language as Language]?.nelly_intro || translations['en'].nelly_intro;
            markIntroduced();
            speak(intro, language);
        }
    }, [isWingmanActive, hasIntroduced, language, markIntroduced]);

    const handleSend = () => {
        if (!userInput.trim()) return;

        const lowCase = userInput.toLowerCase();
        addLog('User', userInput);
        // Whole-word matching, so "contact" does not match "act" and "no neck pain" still matches "neck pain".
        const matchesAny = (words: string[]) => words.some((w) => new RegExp(`\\b${w}\\b`).test(lowCase));
        const firstAidKeywords = ['first aid', 'first_aid', 'basic_first_aid_training_nsh', 'bleeding'];
        const symptomKeywords = ['tingling', 'numbness', 'pins and needles', 'sharp pain', 'burning'];
        
        const isEmerg = reportsEmergency(lowCase);
        const isFirstAid = matchesAny(firstAidKeywords);
        const isSymptom = matchesAny(symptomKeywords);
        const isNeckPain = matchesAny(['neck pain', 'cervical', 'neck']);
        const isLowerBack = matchesAny(['lower back', 'lumbar', 'back pain', 'spine']);
        const isWrist = matchesAny(['wrist', 'carpal', 'hand pain', 'mouse']);
        const isEye = matchesAny(['eye', 'eyes', 'headache', 'screen', 'vision']);
        const isOHSQuery = matchesAny(['ohs', 'iso', 'section 37', 'compliance', 'legal', 'act']);

        if (isEmerg) {
            setIsEmergency(true);
            setSpeaking(true);
            const response = nellyReply('emergency', language);
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('emergency', 'Acute Medical/Injury Emergency Protocol Triggered', 'BREACH');
            speak(response, language);
        } else if (isFirstAid) {
            const currentLang = (language as Language) || 'en';
            const response = (translations[currentLang] as TranslationEntry)?.first_aid || translations['en'].first_aid;
            setGuidance(response);
            addLog('Nelly', response);
            setSpeaking(true);
            speak(response, language);
            setTimeout(() => setSpeaking(false), 5000);
        } else if (isNeckPain) {
            setSpeaking(true);
            const response = nellyReply('neck', language);
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('neck_strain', 'Neck pain reported by user', 'RISK_ALERT');
            speak(response, language);
            
            const { fatigueLevel } = useFatigueStore.getState();
            if (fatigueLevel !== 'high') {
                window.dispatchEvent(new CustomEvent('TRIGGER_INTERVENTION', { detail: 'micro-stretch' }));
            }
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isLowerBack) {
            setSpeaking(true);
            const response = nellyReply('back', language);
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('posture', 'Lower Back / Lumbar Discomfort Reported (L1-L5 Strain Risk)', 'RISK_ALERT');
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isWrist) {
            setSpeaking(true);
            const response = nellyReply('wrist', language);
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('posture', 'Wrist Fatigue & Carpal Compression Risk Reported', 'RISK_ALERT');
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isEye) {
            setSpeaking(true);
            const response = nellyReply('eye', language);
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('break_interval', 'Digital Eye Strain & Visual Fatigue Reported', 'RISK_ALERT');

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('TRIGGER_BBS_INTERVENTION', {
                    detail: {
                        type: 'ocular-cervical-glide',
                        duration: 20,
                        hazard: 'Digital Eye Strain & Ocular Exhaustion',
                        title: '20-Second Ocular & Cervical Glide Reset',
                        instructions: [
                            'Look away from display and focus on an object 20 feet away.',
                            'Blink slowly 5 times to re-lubricate corneal surface.',
                            'Slowly tilt head toward left shoulder for 5s, then right shoulder for 5s.'
                        ]
                    }
                }));
            }

            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isOHSQuery) {
            setSpeaking(true);
            // TODO(legal-verify): removed claim that Section 37 provides automatic liability protection and zero-knowledge claim
            // TODO(privacy): implement encryption + POPIA s26 special-information handling before production
            const response = nellyReply('ohs', language);
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, language);
            setTimeout(() => setSpeaking(false), 9000);
        } else if (isSymptom) {
            setSpeaking(true);
            const response = nellyReply('symptom', language);
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('posture', 'Tingling or numbness reported by user', 'RISK_ALERT');
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else {
            // Context-Aware Response Algorithm
            setSpeaking(true);
            // Nelly does not measure fatigue or posture here, so she says so rather than guessing.
            const response = nellyReply('unknown', language);
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, language);
            setTimeout(() => setSpeaking(false), 5000);
        }
        setUserInput('');
    };

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
