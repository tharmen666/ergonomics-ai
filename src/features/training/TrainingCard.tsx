import { motion } from 'framer-motion';

interface TrainingCardProps {
    title: string;
    description: string;
}

export const TrainingCard = ({ title, description }: TrainingCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="relative group h-[450px] w-full bg-ohs-navy rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500"
        >
            {/* Ambient Background with deeper colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#001a2c] via-[#003D5C]/30 to-[#F9A825]/10 group-hover:from-[#002a44] transition-all duration-500" />

            {/* Glass Overlays */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-ohs-orange/20 rounded-full blur-[60px] group-hover:bg-ohs-orange/40 transition-all duration-700" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-ohs-green/10 rounded-full blur-[80px] group-hover:bg-ohs-green/30 transition-all duration-700" />

            {/* Premium 3D Container */}
            <div className="absolute inset-0 flex items-center justify-center p-8 perspective-1000">
                <motion.div
                    initial={{ rotateY: 0 }}
                    whileHover={{
                        rotateY: 15,
                        rotateX: -10,
                        z: 50
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className="relative w-full h-full border border-white/20 rounded-2xl bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-6 group-hover:border-ohs-orange/50 transition-colors"
                >
                    {/* Floating Icon/Letter */}
                    <div
                        style={{ transform: 'translateZ(100px)' }}
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-ohs-orange to-[#FFD54F] flex items-center justify-center shadow-[0_0_30px_rgba(249,168,37,0.4)]"
                    >
                        <span className="text-4xl font-black text-ohs-navy">{title.charAt(0)}</span>
                    </div>

                    <div style={{ transform: 'translateZ(60px)' }} className="text-center px-6">
                        <h3 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">{title}</h3>
                        <div className="h-1 w-12 bg-ohs-orange mx-auto rounded-full mb-4" />
                    </div>
                </motion.div>
            </div>

            {/* Bottom Content Trigger */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-ohs-navy to-transparent z-20">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {description}
                </p>
                <div className="flex items-center gap-3 text-ohs-orange font-black text-sm group-hover:gap-6 transition-all duration-300">
                    <span className="uppercase tracking-tighter">Enter Session</span>
                    <div className="w-8 h-[2px] bg-ohs-orange rounded-full" />
                </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 group-hover:opacity-20 transition-opacity" />
        </motion.div>
    );
};
