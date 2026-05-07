import { motion } from 'framer-motion';

interface MellyEmergencyUIProps {
    onDeescalate: () => void;
}

export const MellyEmergencyUI = ({ onDeescalate }: MellyEmergencyUIProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-red-600/90 border-2 border-white rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] pointer-events-auto"
        >
            <h4 className="text-white font-black uppercase text-xs mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                Critical Escalation Active
            </h4>
            <p className="text-[10px] text-white font-bold mb-3 leading-tight">
                High-risk event detected. Immediate evacuation or medical assistance required.
            </p>
            <div className="bg-white/10 p-2 rounded-lg border border-white/20 mb-3">
                <p className="text-[9px] text-white opacity-80 uppercase font-black">Assembly Point</p>
                <p className="text-[11px] text-white font-bold">Main Gate - Sector A</p>
            </div>
            <a
                href="tel:+27622655708"
                className="w-full flex items-center justify-center gap-2 bg-white text-red-600 py-3 rounded-xl font-black text-sm hover:bg-gray-100 transition-all"
            >
                CALL EMERGENCY: +27 62 265 5708
            </a>
            <button
                onClick={onDeescalate}
                className="w-full text-[9px] text-white/60 font-black uppercase mt-2 hover:text-white"
            >
                De-escalate
            </button>
        </motion.div>
    );
};
