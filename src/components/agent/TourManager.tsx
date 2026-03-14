import { useEffect, useState, useRef } from 'react';
import { useMellyStore } from '../../store/mellyStore';
import { speak, stopSpeaking } from '../../utils/speech';

interface TourManagerProps {
    setActiveTab: (tab: string) => void;
}

export const TourManager = ({ setActiveTab }: TourManagerProps) => {
    const { isTourActive, setTourActive, setSpeaking, setMood, setGuidance } = useMellyStore();
    const [step, setStep] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const tourSteps = [
        {
            tab: 'dashboard',
            text: "Welcome to OHS Haven. This is your central command center. Here you can monitor your safety score and quick stats at a glance.",
            mood: 'happy' as const,
        },
        {
            tab: 'assessment',
            text: "Let's check your workspace. My Self-Assessment module uses AI to guide you through ergonomic corrections for your chair and desk.",
            mood: 'neutral' as const,
        },
        {
            tab: 'risks',
            text: "Prevention is key. In the Risky Behaviors section, we identify common hazards like slouching or poor lighting before they cause injury.",
            mood: 'concerned' as const,
        },
        {
            tab: 'training',
            text: "Actionable health. Our 3D Interactive Training modules feature guided exercises to keep you moving and pain-free.",
            mood: 'happy' as const,
        },
        {
            tab: 'admin',
            text: "For management, the HR Dashboard provides real-time compliance tracking and risk analysis across your entire organization.",
            mood: 'neutral' as const,
        },
        {
            tab: 'dashboard',
            text: "That corresponds to a 200% increase in workforce efficiency. Request a full integration today to secure your team's future.",
            mood: 'happy' as const,
        }
    ];

    useEffect(() => {
        if (!isTourActive) {
            setStep(0);
            stopSpeaking();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const runStep = (index: number) => {
            if (index >= tourSteps.length) {
                setTourActive(false);
                setGuidance(null);
                setSpeaking(false);
                return;
            }

            const current = tourSteps[index];

            // 1. Visual State
            setActiveTab(current.tab);
            setMood(current.mood);
            setSpeaking(true);
            setGuidance(current.text);

            // 2. Audio Logic
            /* 
               We use a safety timeout of 15 seconds. 
               If speech finishes earlier, onEnd triggers the next step and clears timeout.
               If speech fails/hangs, timeout forces next step.
            */
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            const nextStep = () => {
                setSpeaking(false);
                // Simple delay between steps for better pacing
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    // Update internal state to trigger next effect or recursive call?
                    // Better to just change the step state to trigger re-render processing?
                    // Actually, the recursively called function in useEffect is dangerous if not careful.
                    // Let's use the setStep state to drive this.
                    setStep(s => s + 1);
                }, 1000);
            };

            // Set safety fallback
            timeoutRef.current = setTimeout(nextStep, 15000);

            speak(current.text, nextStep);
        };

        runStep(step);

        return () => {
            // Cleanup on unmount or step change is tricky with the recursive logic above.
            // Actually, useEffect will re-run when `step` changes.
            // So we just need to ignore the 'runStep' internal definition and rely on effect.
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTourActive, step]);
    // Removed other deps to avoid re-triggering mid-speech if visual props change, 
    // although they shouldn't. The critical driver is `step` and `isTourActive`.

    return null;
};
