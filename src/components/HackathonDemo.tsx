import { motion } from 'framer-motion';

export const HackathonDemo = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-full mx-auto my-8"
        >
            <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(249,168,37,0.2)] border-2 border-ohs-orange/40 bg-black aspect-video">
                <video
                    className="w-full h-full object-contain"
                    src="/assets/recording.mp4"
                    controls
                    preload="auto"
                    poster="/assets/nelly-new-avatar.png"
                    title="ErgoSafe Reborn Hackathon Demo"
                ></video>
            </div>
        </motion.div>
    );
};
