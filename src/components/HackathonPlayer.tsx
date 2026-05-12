import { motion } from 'framer-motion';

export const HackathonPlayer = () => {
    const videoId = 'dQw4w9WgXcQ'; // Placeholder Video ID

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-full mx-auto my-8"
        >
            <div className="relative w-full pb-[56.25%] h-0 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(249,168,37,0.15)] border border-ohs-orange/30">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                    title="Hackathon Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </motion.div>
    );
};
