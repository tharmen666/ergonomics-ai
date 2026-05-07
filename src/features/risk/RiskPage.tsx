import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const questions = [
    { id: 1, question: "Identify the Hazard", options: ["Ergonomic (Posture)", "Physical (Trip/Slip)", "Psychological (Stress)"] },
    { id: 2, question: "Who might be harmed?", options: ["Office Staff", "Maintenance", "Visitors"] },
    { id: 3, question: "Risk Level (Current Controls)", options: ["Low (Managed)", "Medium (Requires Action)", "High (Immediate Danger)"] },
];

export const RiskPage = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    // SUGAN OPTIMIZATION: Only trigger Cloud LLM (Gemini) if Local Inference detects >15% deviation.
    // TODO: Integrate Sugan's 2-3 FPS Browser Inference link here for local Pose Detection.

    const handleSelect = (option: string) => {
        const newAnswers = [...answers];
        newAnswers[step] = option;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setCompleted(true);
            }, 2000);
        }
    };

    if (completed) {
        return (
            <GlassCard className="max-w-xl mx-auto text-center py-10">
                <div className="w-20 h-20 bg-ohs-green/20 text-ohs-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Assessment Filed</h2>
                <p className="text-gray-400 mb-8">
                    Reference ID: RA-{Math.floor(Math.random() * 10000)}<br />
                    Marcus (AI Risk Analyst) is reviewing your submission.
                </p>
                <GlowButton onClick={() => { setStep(0); setCompleted(false); setAnswers([]); }}>
                    File Another
                </GlowButton>
            </GlassCard>
        );
    }

    const currentQ = questions[step];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold">New Risk Assessment</h2>
                <p className="text-gray-400">Step {step + 1} of {questions.length}</p>
                <div className="w-full bg-white/5 h-2 rounded-full mt-4">
                    <motion.div
                        className="h-full bg-ohs-orange rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <GlassCard className="py-10">
                        <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                            <AlertTriangle className="text-ohs-orange" />
                            {currentQ.question}
                        </h3>

                        <div className="grid gap-4">
                            {currentQ.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(opt)}
                                    className={`p-4 rounded-xl text-left border transition-all ${answers[step] === opt
                                            ? "bg-ohs-blue border-ohs-orange shadow-[0_0_10px_rgba(249,168,37,0.3)]"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <GlowButton disabled={!answers[step] || isSubmitting} onClick={handleNext}>
                                {isSubmitting ? "Submitting..." : step === questions.length - 1 ? "Submit" : "Next"} {!isSubmitting && <ArrowRight size={18} className="inline ml-2" />}
                            </GlowButton>
                        </div>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
