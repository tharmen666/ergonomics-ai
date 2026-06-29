import { useState } from 'react';
import { GlowButton } from '../../components/ui/GlowButton';
import { useNellyStore } from '../../store/nellyStore';

interface Question {
    id: number;
    text: string;
    options: { label: string; score: number }[];
}

const ASSESSMENT_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "How is your posture currently while working?",
        options: [
            { label: "Upright, back supported, shoulders relaxed", score: 0 },
            { label: "Slight slouching or forward head tilt", score: 5 },
            { label: "Severely hunched or working from bed/couch", score: 10 }
        ]
    },
    {
        id: 2,
        text: "What is your current screen level height?",
        options: [
            { label: "At eye level, directly in front", score: 0 },
            { label: "Slightly low, looking downwards", score: 5 },
            { label: "Significantly low, causing neck bend", score: 10 }
        ]
    },
    {
        id: 3,
        text: "Are you experiencing any physical discomfort today?",
        options: [
            { label: "None / normal fatigue", score: 0 },
            { label: "Mild tension or stiffness", score: 5 },
            { label: "Severe back, neck, or wrist pain", score: 10 }
        ]
    }
];

const UNSAFE_THRESHOLD = 15;

export const SelfAssessment = ({ onComplete }: { onComplete?: (score: number) => void }) => {
    const { setGuidance } = useNellyStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    const handleSelectOption = (score: number) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentStep] = score;
        setAnswers(updatedAnswers);
    };

    const handleNext = () => {
        if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            const totalScore = answers.reduce((sum, s) => sum + s, 0);
            setIsFinished(true);

            if (onComplete) {
                onComplete(totalScore);
            }

            if (totalScore >= UNSAFE_THRESHOLD) {
                const event = new CustomEvent('NON_COMPLIANCE_TRIGGER', {
                    detail: {
                        score: totalScore,
                        threshold: UNSAFE_THRESHOLD,
                        timestamp: new Date().toISOString()
                    }
                });
                window.dispatchEvent(event);
                setGuidance("High discomfort/improper ergonomics detected. Non-compliance event triggered!");
            } else {
                setGuidance("Great job! Your ergonomic self-assessment indicates safe operational posture.");
            }
        }
    };

    const totalScore = answers.reduce((sum, s) => sum + s, 0);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-2xl mx-auto">
            {!isFinished ? (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">
                        Question {currentStep + 1} of {ASSESSMENT_QUESTIONS.length}
                    </h3>
                    <p className="text-gray-300 text-lg">
                        {ASSESSMENT_QUESTIONS[currentStep].text}
                    </p>
                    <div className="grid gap-4">
                        {ASSESSMENT_QUESTIONS[currentStep].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectOption(opt.score)}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    answers[currentStep] === opt.score
                                        ? "bg-ohs-blue border-ohs-orange shadow-[0_0_10px_rgba(249,168,37,0.3)]"
                                        : "bg-white/5 border-white/5 hover:bg-white/10"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-end">
                        <GlowButton disabled={answers[currentStep] === undefined} onClick={handleNext}>
                            {currentStep === ASSESSMENT_QUESTIONS.length - 1 ? "Complete" : "Next"}
                        </GlowButton>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 space-y-6">
                    <h3 className="text-3xl font-black text-white">Assessment Completed</h3>
                    <p className="text-gray-400 text-lg">
                        Your total ergonomic risk score is:{" "}
                        <span className={`font-bold ${totalScore >= UNSAFE_THRESHOLD ? "text-red-500" : "text-ohs-green"}`}>
                            {totalScore}
                        </span>
                    </p>
                    {totalScore >= UNSAFE_THRESHOLD ? (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm font-semibold max-w-md mx-auto">
                            WARNING: Your score exceeds the safe operational threshold of {UNSAFE_THRESHOLD}. Non-compliance flag generated.
                        </div>
                    ) : (
                        <div className="bg-ohs-green/10 border border-ohs-green/30 p-4 rounded-xl text-ohs-green text-sm font-semibold max-w-md mx-auto">
                            Your setup is within safe ergonomic standards. Keep up the safety streak!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
