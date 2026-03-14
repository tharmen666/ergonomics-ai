import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useMellyStore } from '../../store/mellyStore';
import { GlowButton } from '../../components/ui/GlowButton';

export const SelfAssessmentPage = () => {
    const { setGuidance, setSpeaking, setMood } = useMellyStore();

    useEffect(() => {
        // Melly Intro
        setSpeaking(true);
        setMood('happy');
        setGuidance("Welcome to your Self-Assessment! I'll guide you through a quick check of your workspace setup. Let's start with your chair.");

        const timer = setTimeout(() => {
            setSpeaking(false);
        }, 5000);

        return () => {
            setGuidance(null);
            setSpeaking(false);
            setMood('neutral');
            clearTimeout(timer);
        };
    }, [setGuidance, setSpeaking, setMood]);

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
                            <h3 className="text-2xl font-bold text-white">Step 1: Chair Adjustment</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Stand in front of your chair. Adjust the height so the seat pan is just below your knee caps. When seated, your feet should be flat on the floor, with your knees bent at a 90-degree angle.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <GlowButton onClick={() => setGuidance("Great! Now let's look at your backrest.")}>
                                    Next Step
                                </GlowButton>
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-white/5">
                            <p className="text-gray-500 italic">Interactive Diagram Loading...</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
