import { motion } from 'framer-motion';
import { SelfAssessment } from '../training/SelfAssessment';

export const SelfAssessmentPage = () => {
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
                        Optimize your workspace in 5 minutes. Follow Nelly's instructions for a healthier workday.
                    </p>
                </div>

                <SelfAssessment />
            </motion.div>
        </div>
    );
};
