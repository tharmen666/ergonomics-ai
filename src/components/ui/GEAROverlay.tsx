import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Zap, FileCheck, Brain } from 'lucide-react';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';
import { useMellyStore } from '../../store/mellyStore';

export const GEAROverlay = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { fatigueLevel } = useFatigueStore();
    const { productiveStreak } = useMellyStore();

    // Map metrics to G.E.A.R
    const governance = 100; // Hardcoded static for Sect 37 simulation

    let efficiency = 100;
    if (fatigueLevel === 'warning') efficiency = 85;
    if (fatigueLevel === 'high') efficiency = 75;

    const accountability = 100; // Sync to Admin-Zero reports
    const resilience = productiveStreak > 120 ? 100 : Math.min(100, Math.floor((productiveStreak / 120) * 100)); // Sample logic

    const pillars = [
        { id: 'G', title: 'Governance', value: governance, icon: Shield, desc: 'Sec 37 & ISO 45001' },
        { id: 'E', title: 'Efficiency', value: efficiency, icon: Zap, desc: 'O.H.E & Muda' },
        { id: 'A', title: 'Accountability', value: accountability, icon: FileCheck, desc: 'Admin-Zero' },
        { id: 'R', title: 'Resilience', value: resilience, icon: Brain, desc: 'Cognitive' }
    ];

    return (
        <div className="fixed top-24 right-4 md:right-8 z-[50]">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-ohs-orange border-2 border-yellow-300 shadow-[0_0_15px_rgba(249,168,37,0.5)] flex items-center justify-center text-ohs-dark"
            >
                <Settings className={`w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20, transformOrigin: 'top right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="absolute top-16 right-0 w-72 bg-ohs-navy/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 pointer-events-auto"
                    >
                        <h3 className="text-ohs-orange font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                            <Settings size={14} /> G.E.A.R System
                        </h3>

                        <div className="space-y-4">
                            {pillars.map((pillar, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <pillar.icon size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{pillar.id}: {pillar.title}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-black">{pillar.value}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pillar.value}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className={`h-full ${pillar.value >= 90 ? 'bg-green-500' : pillar.value > 80 ? 'bg-ohs-orange' : 'bg-red-500'}`}
                                        />
                                    </div>
                                    <p className="text-[8px] text-gray-500 mt-1 uppercase text-right">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
