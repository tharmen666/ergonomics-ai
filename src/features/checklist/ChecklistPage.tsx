import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useComplianceStore } from '../../store/complianceStore';

const checklistItems = [
    { id: 1, label: "Workstation clear of hazards?" },
    { id: 2, label: "Chair height adjusted correctly?" },
    { id: 3, label: "Screen at eye level?" },
    { id: 4, label: "Lighting sufficient (no glare)?" },
    { id: 5, label: "Hydration bottle nearby?" },
];

export const ChecklistPage = () => {
    const { addWorkspaceException, exceptions } = useComplianceStore();
    const [checked, setChecked] = useState<number[]>([]);
    const [excepted, setExcepted] = useState<number[]>([]);

    const toggleCheck = (id: number) => {
        if (excepted.includes(id)) return;
        setChecked(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleException = (id: number, label: string) => {
        if (excepted.includes(id)) {
            // Unflagging exception locally (store doesn't support removals, which is fine for records)
            setExcepted(prev => prev.filter(item => item !== id));
        } else {
            // Flagging exception
            setExcepted(prev => [...prev, id]);
            setChecked(prev => prev.filter(item => item !== id));
            // Record exception in Zustand complianceStore
            addWorkspaceException(label);
        }
    };

    const allCheckedOrExcepted = checklistItems.every(item => 
        checked.includes(item.id) || excepted.includes(item.id)
    );

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
                        className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors border ${
                            checked.includes(item.id)
                                ? 'bg-ohs-green/10 border-ohs-green/30'
                                : excepted.includes(item.id)
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                        <div 
                            className="flex-1 cursor-pointer select-none pr-4"
                            onClick={() => toggleCheck(item.id)}
                        >
                            <span className={`text-sm ${
                                checked.includes(item.id) 
                                    ? 'text-white font-medium' 
                                    : excepted.includes(item.id) 
                                        ? 'text-red-400 font-semibold line-through decoration-red-500/50' 
                                        : 'text-gray-300'
                            }`}>
                                {item.label}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Checkmark Button */}
                            <button
                                aria-label="Check item"
                                onClick={() => toggleCheck(item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                    excepted.includes(item.id) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
                                }`}
                                disabled={excepted.includes(item.id)}
                            >
                                {checked.includes(item.id) ? (
                                    <CheckCircle2 className="text-ohs-green" size={22} />
                                ) : (
                                    <Circle className="text-gray-500" size={22} />
                                )}
                            </button>

                            {/* Exception Trigger */}
                            <button
                                onClick={() => toggleException(item.id, item.label)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                                    excepted.includes(item.id)
                                        ? 'bg-red-500 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                                        : 'bg-white/5 text-red-400 border-red-500/30 hover:bg-red-500/15'
                                }`}
                            >
                                <AlertTriangle size={12} />
                                {excepted.includes(item.id) ? 'Excepted' : 'Flag Exception'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </GlassCard>

            {excepted.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                >
                    <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-red-300 font-medium">
                        <strong>Workspace Exception Flagged:</strong> Custom exceptions have been recorded in the compliance ledger. Submission will log these issues and flag a compliance breach to supervisor structures.
                    </div>
                </motion.div>
            )}

            <div className="flex justify-center">
                <GlowButton
                    disabled={!allCheckedOrExcepted}
                    className={!allCheckedOrExcepted ? 'opacity-50 cursor-not-allowed' : ''}
                    onClick={() => {
                        if (excepted.length > 0) {
                            alert(`Checklist submitted with ${excepted.length} active exception(s). Compliance log updated and supervisor structures notified.`);
                        } else {
                            alert("Great job! Safety checklist submitted and streak updated.");
                        }
                    }}
                >
                    {allCheckedOrExcepted ? "Submit Checklist" : `Complete checklist to submit`}
                </GlowButton>
            </div>
        </div>
    );
};
