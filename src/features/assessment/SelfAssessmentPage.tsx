import { motion } from 'framer-motion';
import { SelfAssessment } from '../training/SelfAssessment';
import { SpineViewer } from '../../components/agent/SpineViewer';
import { HomeOfficeSetupGuide } from './HomeOfficeSetupGuide';
import { Activity } from 'lucide-react';

export const SelfAssessmentPage = () => {
    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto pb-32 space-y-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-center md:text-left"
            >
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.3em] block">
                    Daily Ergonomics & Biomechanical Audit
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ohs-orange to-yellow-400">
                    Ergonomic Self-Assessment
                </h1>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
                    Optimize your WFH / desk workspace in 5 minutes with real-time 3D spinal alignment telemetry and visual home office setup guides.
                </p>
            </motion.div>

            {/* Dedicated Home Office Ergonomic Setup Guide */}
            <HomeOfficeSetupGuide />

            {/* 3D Spine Telemetry Canvas */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/40 border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ohs-orange/20 rounded-xl text-ohs-orange border border-ohs-orange/30">
                        <Activity size={22} />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                            Interactive 3D Spinal Alignment Telemetry
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                            Select posture scenarios to test lumbar, thoracic, and cervical C1-C7 load calculations.
                        </p>
                    </div>
                </div>

                <div className="w-full h-[400px] md:h-[450px]">
                    <SpineViewer />
                </div>
            </motion.div>

            {/* Questionnaire Module */}
            <SelfAssessment />
        </div>
    );
};
