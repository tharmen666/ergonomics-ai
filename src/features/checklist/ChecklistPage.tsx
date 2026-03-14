import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const checklistItems = [
    { id: 1, label: "Workstation clear of hazards?" },
    { id: 2, label: "Chair height adjusted correctly?" },
    { id: 3, label: "Screen at eye level?" },
    { id: 4, label: "Lighting sufficient (no glare)?" },
    { id: 5, label: "Hydration bottle nearby?" },
];

export const ChecklistPage = () => {
    const [checked, setChecked] = useState<number[]>([]);

    const toggleCheck = (id: number) => {
        setChecked(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const allChecked = checked.length === checklistItems.length;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Daily Safety Check</h2>
                <p className="text-gray-400">Complete this before starting your shift.</p>
            </div>

            <GlassCard className="space-y-4">
                {checklistItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${checked.includes(item.id) ? 'bg-ohs-green/10 border border-ohs-green/20' : 'bg-white/5 border border-transparent hover:bg-white/10'
                            }`}
                        onClick={() => toggleCheck(item.id)}
                    >
                        <span className={checked.includes(item.id) ? 'text-white font-medium' : 'text-gray-300'}>
                            {item.label}
                        </span>
                        {checked.includes(item.id) ? (
                            <CheckCircle2 className="text-ohs-green" />
                        ) : (
                            <Circle className="text-gray-500" />
                        )}
                    </motion.div>
                ))}
            </GlassCard>

            <div className="flex justify-center">
                <GlowButton
                    disabled={!allChecked}
                    className={!allChecked ? 'opacity-50 cursor-not-allowed' : ''}
                    onClick={() => alert("Great job! Safety streak updated.")}
                >
                    {allChecked ? "Submit Checklist" : `Complete ${checklistItems.length - checked.length} more`}
                </GlowButton>
            </div>
        </div>
    );
};
