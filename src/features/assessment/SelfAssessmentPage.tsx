import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMellyStore } from '../../store/mellyStore';
import { GlowButton } from '../../components/ui/GlowButton';

export const SelfAssessmentPage = () => {
    const { setGuidance } = useMellyStore();
    const [step, setStep] = useState(1);

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ohs-orange to-yellow-400 mb-4">
                        Ergonomic Self-Assessment
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Optimize your workspace in 5 minutes. Follow Melly's instructions for a healthier workday.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-2xl font-bold text-white">
                                {step === 1 && "Step 1: Chair Adjustment"}
                                {step === 2 && "Step 2: Monitor Height"}
                                {step === 3 && "Step 3: Keyboard & Mouse"}
                            </h3>
                            <p className="text-gray-300 leading-relaxed min-h-[100px]">
                                {step === 1 && "Stand in front of your chair. Adjust the height so the seat pan is just below your knee caps. When seated, your feet should be flat on the floor, with your knees bent at a 90-degree angle."}
                                {step === 2 && "Position your monitor directly in front of you, an arm's length away. The top of the screen should be at or slightly below eye level so you aren't tilting your head up or down."}
                                {step === 3 && "Place your keyboard and mouse close together. Your elbows should be at your sides and bent at about 90 degrees. Keep your wrists straight and avoid resting them on hard edges."}
                            </p>
                            <div className="flex gap-4 pt-4">
                                {step < 3 ? (
                                    <GlowButton onClick={() => {
                                        setStep(step + 1);
                                        if (step === 1) setGuidance("Great! Let's check your monitor position now.");
                                        if (step === 2) setGuidance("Almost done! Let's look at your keyboard and mouse setup.");
                                    }}>
                                        Next Step
                                    </GlowButton>
                                ) : (
                                    <GlowButton onClick={() => {
                                        setGuidance("Excellent! Your workspace is fully optimized for maximum comfort and safety.");
                                        setStep(1);
                                    }}>
                                        Complete Assessment
                                    </GlowButton>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                            {/* Simple CSS-based illustrations instead of a loading state */}
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center text-ohs-orange/50"
                            >
                                {step === 1 && <div className="w-24 h-32 border-4 border-ohs-orange rounded-xl border-b-0 relative after:absolute after:top-1/2 after:w-full after:h-4 after:bg-ohs-orange" />}
                                {step === 2 && <div className="w-40 h-24 border-4 border-ohs-orange rounded-xl relative before:absolute before:-bottom-8 before:w-8 before:h-8 before:bg-ohs-orange before:left-1/2 before:-translate-x-1/2" />}
                                {step === 3 && <div className="w-48 h-12 border-4 border-ohs-orange rounded-xl grid grid-cols-4 gap-1 p-1 opacity-80" />}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
