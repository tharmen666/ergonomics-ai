import { useEffect, useState } from 'react';
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
        const isNeckPain = lowCase.includes('neck pain') || lowCase.includes('cervical') || lowCase.includes('neck');
        const isLowerBack = lowCase.includes('lower back') || lowCase.includes('lumbar') || lowCase.includes('back pain') || lowCase.includes('spine');
        const isWrist = lowCase.includes('wrist') || lowCase.includes('carpal') || lowCase.includes('hand pain') || lowCase.includes('mouse');
        const isEye = lowCase.includes('eye') || lowCase.includes('headache') || lowCase.includes('screen') || lowCase.includes('vision');
        const isOHSQuery = lowCase.includes('ohs') || lowCase.includes('iso') || lowCase.includes('section 37') || lowCase.includes('compliance') || lowCase.includes('legal') || lowCase.includes('act');

        if (isEmerg) {
            setIsEmergency(true);
            setSpeaking(true);
            const response = "EMERGENCY PROTOCOL ACTIVATED. Halted all non-critical processes. Contacting onsite first-aid immediately.";
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
            const response = "WARNING: Cervical load or neck pain detected. Activating the Cervical Orthopedic Micro-Circuit. Please perform a Tier 2 micro-stretch immediately to reduce vertebrae load.";
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('neck_strain', 'Cervical Load & Vertebrae Strain Warning - Tier 2 Micro-Stretch Triggered', 'RISK_ALERT');
            speak(response, language);
            
            const { fatigueLevel } = useFatigueStore.getState();
            if (fatigueLevel !== 'high') {
                window.dispatchEvent(new CustomEvent('TRIGGER_INTERVENTION', { detail: 'micro-stretch' }));
            }
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isLowerBack) {
            setSpeaking(true);
            const response = "ERGONOMIC TRIAGE: Lower back / lumbar strain detected. ACTION: Slide your hips fully backward against the seat backrest, ensure lumbar support cushion engages L1-L5 vertebrae, and plant feet flat on the floor at 90 degrees.";
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('posture', 'Lower Back / Lumbar Discomfort Reported (L1-L5 Strain Risk)', 'RISK_ALERT');
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isWrist) {
            setSpeaking(true);
            const response = "ERGONOMIC TRIAGE: Wrist & forearm fatigue detected. ACTION: Keep forearms parallel to the floor at 90-100 degrees, avoid resting wrists on hard desk edges while typing, and perform 5 wrist extensor stretches.";
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('posture', 'Wrist Fatigue & Carpal Compression Risk Reported', 'RISK_ALERT');
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else if (isEye) {
            setSpeaking(true);
            const response = "ERGONOMIC TRIAGE: Visual fatigue / digital eye strain reported. ACTION: Apply the 20-20-20 rule. Look at an object 20 feet away for 20 seconds. Ensure monitor distance is arm's length (50-70cm) with zero glare.";
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
            const response = "OHS COMPLIANCE ADVISORY: ErgoSafe Reborn enforces South African OHS Act Section 8(1) Duty of Care and Section 37 Liability Protection. Workstation risk assessments, break telemetry, and ISO 45003 psychosocial audits are logged continuously into the zero-knowledge dossier.";
            setGuidance(response);
            addLog('Nelly', response);
            speak(response, language);
            setTimeout(() => setSpeaking(false), 9000);
        } else if (isSymptom) {
            setSpeaking(true);
            const response = "WARNING: Nerve compression detected. Tingling in the extremities is a high-risk indicator for Carpal Tunnel Syndrome or cervical compression. ACTION: Please stand up, perform 5 shoulder rolls, and avoid repetitive clicking for the next 10 minutes. I am logging this as a Section 37 Liability Risk.";
            setGuidance(response);
            addLog('Nelly', response);
            useComplianceStore.getState().logHazardEvent('posture', 'Nerve Compression & Extreme Musculoskeletal Strain Risk (Section 37)', 'BREACH');
            speak(response, language);
            setTimeout(() => setSpeaking(false), 8000);
        } else {
            // Context-Aware Response Algorithm
            setSpeaking(true);
            addLog('Nelly', "Analyzing telemetry for Stewardship AI response...");
            
            setTimeout(() => {
                const efficiency = fatigueLevel === 'nominal' ? 100 : (fatigueLevel === 'warning' ? 85 : 75);
                let response = "";
                if (efficiency < 85) {
                    response = `Based on your rising Muda % to ${100 - efficiency}% (Context), please perform a 20-20-20 eye reset and posture adjustment immediately (Action) to restore your 100% O.H.E. rating and Section 37 compliance status (Result).`;
                    useComplianceStore.getState().logHazardEvent('break_interval', `Break Interval Exceeded: Muda ${100 - efficiency}% digital fatigue alert`, 'RISK_ALERT');
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
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none max-w-[calc(100vw-1.5rem)]">
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
