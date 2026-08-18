import { motion } from 'framer-motion';
import { Download, Film } from 'lucide-react';

export const HackathonDemo = () => {
    const handleDownloadMp4 = () => {
        const link = document.createElement('a');
        link.href = '/assets/ErgoSafe_Reborn_30s_1080p_Narrated_Demo updated.mp4';
        link.download = 'ErgoSafe_Reborn_30s_1080p_Narrated_Demo updated.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-full mx-auto my-8 space-y-4"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ohs-navy/80 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ohs-orange/10 text-ohs-orange rounded-xl border border-ohs-orange/20">
                        <Film size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">ErgoSafe Reborn V3 Official Hackathon Demo</h3>
                        <p className="text-xs text-gray-400 font-medium">90-Second Walkthrough: OHSA 85 Compliance, 3D Posture Engine & MongoDB Ledger</p>
                    </div>
                </div>
                <button
                    onClick={handleDownloadMp4}
                    className="bg-gradient-to-r from-ohs-orange to-yellow-400 text-ohs-navy px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                    <Download size={16} />
                    <span>💾 Download MP4 Demo Video</span>
                </button>
            </div>

            <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(249,168,37,0.2)] border-2 border-ohs-orange/40 bg-black aspect-video">
                <video
                    className="w-full h-full object-contain"
                    src="/assets/ErgoSafe_Reborn_30s_1080p_Narrated_Demo updated.mp4"
                    controls
                    autoPlay
                    muted
                    preload="auto"
                    playsInline
                    poster="/assets/nelly-new-avatar.png"
                    title="ErgoSafe Reborn 30s 1080p Narrated Demo"
                ></video>
            </div>
        </motion.div>
    );
};
