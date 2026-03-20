import { motion } from 'framer-motion';
import { useMellyStore } from '../../store/mellyStore';
import { GlowButton } from '../../components/ui/GlowButton';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { speak } from '../../utils/speech';

export const RiskyBehaviorsPage = () => {
    const { setGuidance, setSpeaking, setMood, addRecommendation } = useMellyStore();

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
                                    warning = "Working from bed limits your postural support. As your Digital Wingman, I highly suggest taking a 15-minute Professional Reset. A quick stretch and some water will do wonders for your focus.";
                                    addRecommendation('foundation');
                                } else if (risk.title.includes('Kitchen') || risk.title.includes('Slouching')) {
                                    warning = "I noticed some postural instability. To keep you at peak performance, I recommend taking a quick reset break and adjusting your chair height.";
                                    addRecommendation('foundation');
                                } else if (risk.desc.includes('lifting') || risk.title.includes('Reaching')) {
                                    warning = "Repetitive reaching drains your stamina. Let's optimize your setup so everything is within a relaxed arm's length.";
                                    addRecommendation('industrial');
                                } else if (risk.title.includes('Glare') || risk.title.includes('Light')) {
                                    warning = "Dim lighting can cause serious cognitive fatigue. Taking a 5-minute break to adjust your room lighting will boost your energy instantly.";
                                    addRecommendation('remote');
                                } else {
                                    warning = `I've noted ${risk.title}. Let's work on this together to keep you performing at your absolute best!`;
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
