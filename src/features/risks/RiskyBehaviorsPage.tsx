import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useMellyStore } from '../../store/mellyStore';
import { GlowButton } from '../../components/ui/GlowButton';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { speak } from '../../utils/speech';

export const RiskyBehaviorsPage = () => {
    const { setGuidance, setSpeaking, setMood, addRecommendation } = useMellyStore();

    useEffect(() => {
        setSpeaking(true);
        setMood('concerned');
        setGuidance("Let's identify common ergonomic risks. Being aware of these behaviors is the first step to prevention.");

        const timer = setTimeout(() => {
            setSpeaking(false);
            setMood('neutral');
        }, 4000);

        return () => {
            setGuidance(null);
            setSpeaking(false);
            clearTimeout(timer);
        };
    }, [setGuidance, setSpeaking, setMood]);

    const risks = [
        { id: 1, title: 'Slouching / Turtling', desc: 'Leaning forward towards the screen creates neck strain.' },
        { id: 2, title: 'Feet Unsupported', desc: 'Dangling feet cut off circulation and strain the lower back.' },
        { id: 3, title: 'Screen Glare', desc: 'Reflections causing eye strain and awkward postures.' },
        { id: 4, title: 'Repetitive Reaching', desc: 'Mouse or tools placed too far away.' },
        { id: 5, title: 'Working from Bed', desc: 'Soft surfaces lack spinal support, leading to hunching and back pain.' },
        { id: 6, title: 'Kitchen Table Office', desc: 'Dining chairs are rarely height-adjustable, causing wrist and shoulder strain.' },
        { id: 7, title: 'Low Light / Dim Room', desc: 'Insufficient lighting causes eye fatigue and forward leaning.' },
        { id: 8, title: 'Wrong Monitor Height', desc: 'Looking down or up at screens strains the cervical spine.' },
    ];

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div>
                    <h2 className="text-4xl font-bold text-red-500 mb-4 flex items-center gap-3">
                        <AlertTriangle size={40} />
                        Risky Behaviors Identification
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Select any behaviors you currently notice in your routine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {risks.map((risk) => (
                        <motion.div
                            key={risk.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
                            onClick={() => {
                                setSpeaking(true);
                                setMood('concerned');

                                let warning = "";
                                if (risk.title.includes('Bed')) {
                                    warning = "Per OHS Act 85 Sec 8(1), working from bed is critically unstable. I am recommending Stage 1: Ergonomic Foundation immediate review.";
                                    addRecommendation('foundation');
                                } else if (risk.title.includes('Kitchen') || risk.title.includes('Slouching')) {
                                    warning = "Postural instability contradicts OHS Act safety directives. Recommending Stage 1: Ergonomic Foundation.";
                                    addRecommendation('foundation');
                                } else if (risk.desc.includes('lifting') || risk.title.includes('Reaching')) {
                                    warning = "Based on OHS Act manual handling guidelines, I recommend revisiting Stage 2: Industrial Athletics for safe movement mechanics.";
                                    addRecommendation('industrial');
                                } else if (risk.title.includes('Glare') || risk.title.includes('Light')) {
                                    warning = "Visual strain violates OHS environmental regulations. Recommending Stage 3: Remote Pro modules.";
                                    addRecommendation('remote');
                                } else {
                                    warning = `I've noted ${risk.title}. Under OHS Act standards, adding corrective modules to your Continuous Improvement plan.`;
                                    addRecommendation('continuous');
                                }

                                setGuidance(warning);
                                speak(warning); // Enforce voice

                                setTimeout(() => {
                                    setSpeaking(false);
                                    setMood('neutral');
                                }, 6000);
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-ohs-orange transition-colors">{risk.title}</h3>
                                <CheckCircle className="text-gray-600 group-hover:text-green-500 transition-colors" />
                            </div>
                            <p className="text-gray-400">{risk.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-end pt-8 w-full">
                    <GlowButton variant="secondary" className="w-full md:w-auto">Submit Assessment</GlowButton>
                </div>
            </motion.div>
        </div>
    );
};
