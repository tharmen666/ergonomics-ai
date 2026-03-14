import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { useMellyStore } from '../../store/mellyStore';

interface ChecklistItem {
    id: string;
    label: string;
    checked: boolean;
}

export const DailySafetyChecklist = () => {
    const { setSpeaking, setMood } = useMellyStore();
    const [items, setItems] = useState<ChecklistItem[]>([
        { id: 'monitor', label: 'Monitor at eye level?', checked: false },
        { id: 'chair', label: 'Chair supporting lower back?', checked: false },
        { id: 'feet', label: 'Feet flat on floor?', checked: false },
    ]);

    const allChecked = items.every(item => item.checked);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    useEffect(() => {
        if (allChecked) {
            setSpeaking(true);
            setMood('happy');
            // Reset speaking after a delay
            setTimeout(() => {
                setSpeaking(false);
                setMood('neutral');
            }, 6000);
        }
    }, [allChecked, setSpeaking, setMood]);

    return (
        <GlassCard className="relative overflow-hidden group">
            {/* Background Glow when complete */}
            <AnimatePresence>
                {allChecked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-ohs-green/5 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Daily Safety Checklist</h3>
                <AnimatePresence>
                    {allChecked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            className="flex items-center gap-2 px-3 py-1 bg-ohs-green/10 border border-ohs-green/20 rounded-full"
                        >
                            <ShieldCheck className="text-ohs-green" size={14} />
                            <span className="text-[10px] font-black text-ohs-green uppercase tracking-widest">Compliance Verified</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${item.checked
                                ? 'bg-ohs-green/10 border-ohs-green/20'
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div className={`transition-colors ${item.checked ? 'text-ohs-green' : 'text-gray-500'}`}>
                            {item.checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </div>
                        <span className={`text-sm font-bold transition-all ${item.checked ? 'text-white' : 'text-gray-400'
                            }`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Status: {allChecked ? 'Fully Compliant' : `${items.filter(i => i.checked).length}/3 Completed`}
                </p>
            </div>

            {/* Melly's message preview (logical) */}
            {allChecked && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-ohs-orange/10 border border-ohs-orange/20 rounded-lg"
                >
                    <p className="text-[11px] font-bold text-ohs-orange leading-tight">
                        "Great job! Your setup is now OHS compliant for the day."
                    </p>
                </motion.div>
            )}
        </GlassCard>
    );
};
