import { motion } from 'framer-motion';
import { useNellyStore } from '../../store/nellyStore';
import { GlowButton } from '../../components/ui/GlowButton';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { speak } from '../../utils/speech';
import { SpineViewer } from '../../components/agent/SpineViewer';

export const RiskyBehaviorsPage = () => {
    const { setGuidance, setSpeaking, setMood, addRecommendation } = useNellyStore();

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
        <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto pb-32 space-y-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div>
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] block mb-1">Biomechanical Hazard Engine</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-500 flex items-center gap-3">
                        <AlertTriangle size={36} className="text-red-500 shrink-0" />
                        Nelly Posture & Hazard Engine
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base font-medium mt-2">
                        Select any posture habits or workplace environments to evaluate cervical load and trigger corrective actions.
                    </p>
                </div>

                {/* 3D Spine Viewer Integration */}
                <div className="bg-black/40 border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-500/20 rounded-xl text-red-400 border border-red-500/30">
                            <Activity size={22} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-white">
                                Live 3D Spine Alignment & Hazard Telemetry
                            </h3>
                            <p className="text-xs text-gray-400 font-medium">
                                Test posture scenarios (Bed, Couch, Tech-Neck, Monitor Mismatch) to trigger real-time hazard log alerts.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-[400px] md:h-[450px]">
                        <SpineViewer />
                    </div>
                </div>

                {/* Behavior Cards */}
                <div className="pt-4">
                    <h3 className="text-lg font-black text-white mb-4">Observed Workplace Habits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {risks.map((risk) => (
                            <motion.div
                                key={risk.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group space-y-2"
                                onClick={() => {
                                    setSpeaking(true);
                                    setMood('concerned');

                                    let warning = "";
                                    if (risk.title.includes('Bed')) {
                                        warning = "Working from bed limits your postural support. As your Stewardship Authority, I highly suggest taking a 15-minute Professional Reset. A quick stretch and some water will do wonders for your focus.";
                                        addRecommendation('foundation');
                                    } else if (risk.title.includes('Kitchen') || risk.title.includes('Slouching')) {
                                        warning = "I noticed some postural instability. To keep you at peak performance, I recommend taking a quick reset break and adjusting your chair height.";
                                        addRecommendation('foundation');
                                    } else if (risk.desc.includes('lifting') || risk.title.includes('Reaching')) {
                                        warning = "Repetitive reaching drains your stamina. Let's optimize your setup so everything is within a relaxed arm's length.";
                                        addRecommendation('foundation');
                                    } else if (risk.title.includes('Glare') || risk.title.includes('Light')) {
                                        warning = "Dim lighting can cause serious cognitive fatigue. Taking a 5-minute break to adjust your room lighting will boost your energy instantly.";
                                        addRecommendation('remote');
                                    } else {
                                        warning = `I've noted ${risk.title}. Let's work on this together to keep you performing at your absolute best!`;
                                        addRecommendation('continuous');
                                    }

                                    setGuidance(warning);
                                    speak(warning);

                                    setTimeout(() => {
                                        setSpeaking(false);
                                        setMood('neutral');
                                    }, 6000);
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="text-base font-bold text-white group-hover:text-ohs-orange transition-colors">{risk.title}</h4>
                                    <CheckCircle className="text-gray-600 group-hover:text-green-500 transition-colors shrink-0" size={18} />
                                </div>
                                <p className="text-xs text-gray-400 font-medium">{risk.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 w-full">
                    <GlowButton variant="secondary" className="w-full md:w-auto">Submit Assessment</GlowButton>
                </div>
            </motion.div>
        </div>
    );
};
