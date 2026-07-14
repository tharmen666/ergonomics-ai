import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { IncidentLogger } from './IncidentLogger';
import { useComplianceStore } from '../../store/complianceStore';

const questions = [
    {
        id: 1,
        question: "Chair Alignment & Support",
        options: [
            "Optimal (Feet flat, knees at 90°, back supported)",
            "Suboptimal (Feet dangling or poor back contact)",
            "Unsafe (Deep slouching, couch working, or bed workspace)"
        ]
    },
    {
        id: 2,
        question: "Monitor Height & Distance",
        options: [
            "Optimal (Top of screen at eye level, arm's length away)",
            "Suboptimal (Slight neck tilt or screen is too close/far)",
            "Unsafe (Hunched forward, high looking tilt, severe neck strain)"
        ]
    },
    {
        id: 3,
        question: "Input Device Proximity",
        options: [
            "Optimal (Keyboard & mouse close, wrists straight, relaxed shoulders)",
            "Suboptimal (Reaching slightly forward, resting wrists on hard edges)",
            "Unsafe (Severe overreaching, shoulder shrugging, high typing surface)"
        ]
    },
    {
        id: 4,
        question: "Environmental Glare & Hydration",
        options: [
            "Optimal (Sufficient ambient light, no glare, water bottle nearby)",
            "Suboptimal (Mild screen glare, occasional rest/water intake)",
            "Unsafe (Severe window glare / reflections, low lighting, dehydration)"
        ]
    }
];

export const RiskPage = () => {
    const { triggerBreach } = useComplianceStore();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [completed, setCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const handleSelect = (option: string) => {
        const newAnswers = [...answers];
        newAnswers[step] = option;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Calculate final risk score
            const scores: number[] = answers.map(ans => {
                if (ans.startsWith("Optimal") || ans.startsWith("Fully Aligned") || ans.startsWith("Excellent")) return 0;
                if (ans.startsWith("Suboptimal") || ans.startsWith("Moderate")) return 5;
                return 10;
            });
            const totalScore = scores.reduce((sum, s) => sum + s, 0);
            setFinalScore(totalScore);

            if (totalScore >= 15) {
                // Trigger compliance breach
                triggerBreach(
                    totalScore,
                    15,
                    new Date().toISOString(),
                    `Manual Risk Assessment: Unsafe ergonomic setup flagged (Score: ${totalScore}).`
                );
            }
            setCompleted(true);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <ShieldCheck className="text-ohs-orange" size={40} />
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Risk & Incident Management</h2>
                    <p className="text-gray-400 font-medium">Log incidents via LPS or file a manual Risk Assessment.</p>
                </div>
            </div>

            {/* LPS Incident Logger Section */}
            <IncidentLogger />

            <div className="border-t border-white/10 pt-12">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-8">Manual Risk Assessment</h3>
                
                {completed ? (
                    <GlassCard className="max-w-xl mx-auto text-center py-10 space-y-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                            finalScore >= 15 ? 'bg-red-500/20 text-red-500' : 'bg-ohs-green/20 text-ohs-green'
                        }`}>
                            {finalScore >= 15 ? <ShieldAlert size={40} /> : <CheckCircle size={40} />}
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Assessment Filed</h2>
                            <p className="text-gray-400 text-sm font-medium">
                                Reference ID: RA-{Math.floor(1000 + Math.random() * 9000)}<br />
                                Calculated Ergonomic Risk Score: <span className={finalScore >= 15 ? 'text-red-500 font-black' : 'text-ohs-green font-black'}>{finalScore}</span>
                            </p>
                        </div>

                        {finalScore >= 15 ? (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-300 font-medium max-w-md mx-auto">
                                <strong>OHS Breach Registered:</strong> Your answers indicate high-risk ergonomic positioning. A compliance breach has been flagged in your HR records.
                            </div>
                        ) : (
                            <div className="bg-ohs-green/10 border border-ohs-green/20 p-4 rounded-xl text-xs text-ohs-green max-w-md mx-auto">
                                Your workspace alignment is within safe operational guidelines.
                            </div>
                        )}

                        <div className="pt-4">
                            <GlowButton onClick={() => { setStep(0); setCompleted(false); setAnswers([]); setFinalScore(0); }}>
                                File Another
                            </GlowButton>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold">New Risk Assessment</h2>
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
                                        {questions[step].question}
                                    </h3>

                                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                                        {questions[step].options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleSelect(opt)}
                                                className={`p-4 rounded-xl text-left border transition-all ${
                                                    answers[step] === opt
                                                        ? "bg-ohs-blue border-ohs-orange shadow-[0_0_10px_rgba(249,168,37,0.3)]"
                                                        : "bg-white/5 border-white/5 hover:bg-white/10"
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <GlowButton disabled={!answers[step]} onClick={handleNext}>
                                            {step === questions.length - 1 ? "Submit" : "Next"} <ArrowRight size={18} className="inline ml-2" />
                                        </GlowButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};
