import { motion } from 'framer-motion';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';

interface MellyCoreProps {
    isSpeaking: boolean;
    isExpanded: boolean;
    onClick: () => void;
}

export const MellyCore = ({ isSpeaking, isExpanded, onClick }: MellyCoreProps) => {
    const { fatigueLevel } = useFatigueStore();

    return (
        <motion.div
            className={`relative group w-20 h-20 md:w-40 md:h-40 rounded-full border-4 border-ohs-orange/30 p-1 bg-ohs-navy shadow-2xl overflow-hidden cursor-pointer pointer-events-auto`}
            layoutId="melly-core"
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            aria-label="Melly AI Avatar"
            title="Melly AI Avatar"
        >
            <div className={`w-full h-full rounded-full overflow-hidden relative border-[3px] flex items-center justify-center transition-colors duration-500 ${
                fatigueLevel === 'nominal' ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-black' : 
                fatigueLevel === 'warning' ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-black' : 
                'border-red-500 bg-gradient-to-br from-red-500/20 to-black'
            }`}>
                <img 
                    src="/assets/melly-new-avatar.png" 
                    className="w-full h-full object-cover" 
                    alt="Melly Avatar" 
                />
                
                {/* Speaking Animation Overlay */}
                {isSpeaking && (
                    <div className="absolute inset-0 bg-ohs-orange/20 flex items-center justify-center animate-pulse">
                        <div className="flex gap-1 absolute bottom-4">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.05 }}
                                    className="w-1 bg-white rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Status Pulse for High/Warning Fatigue */}
                {fatigueLevel !== 'nominal' && (
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`absolute inset-0 z-0 ${fatigueLevel === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}
                    />
                )}
            </div>
        </motion.div>
    );
};
