import { motion } from 'framer-motion';
import { Flame, Medal, Award, Zap } from 'lucide-react';

export const SafetyStreaks = () => {
    // Hardcoded logic for demo purposes
    const streakDays = 14;
    const isHighPerforming = true;

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 text-ohs-orange/5 blur-xl">
                <Flame size={120} />
            </div>

            <div className="flex items-start justify-between z-10">
                <div>
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Digital Wingman Status</h3>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        SAFETY STREAKS <Medal className="text-ohs-orange" size={24} />
                    </h2>
                </div>
            </div>

            <div className="mt-6 flex items-end gap-4 z-10">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-gradient-to-br from-orange-900/40 to-ohs-orange/20 border border-ohs-orange/30 rounded-xl p-4 flex items-center gap-4"
                >
                    <div className="bg-ohs-orange text-ohs-navy p-3 rounded-xl font-black shadow-[0_0_20px_rgba(249,168,37,0.4)]">
                        <Flame size={28} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-white">{streakDays} <span className="text-lg text-gray-400">Days</span></p>
                        <p className="text-xs font-bold text-ohs-orange uppercase">Active Postural Streak</p>
                    </div>
                </motion.div>
            </div>

            <div className="mt-4 flex gap-2 z-10">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <Award className="text-yellow-400" size={14} />
                    <span className="text-xs font-bold text-gray-300">Stamina Elite Module</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <Zap className="text-cyan-400" size={14} />
                    <span className="text-xs font-bold text-gray-300">Reaction Perfect</span>
                </div>
            </div>

            {isHighPerforming && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-xs text-green-400 font-medium">
                        <strong className="text-green-500 font-bold">Melly says:</strong> You're operating at peak efficiency. Keeping the human in the loop drives high-performance culture.
                    </p>
                </div>
            )}
        </div>
    );
};
