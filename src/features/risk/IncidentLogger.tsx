import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Plus, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLpsStore, LPSCategory } from '../../store/lpsStore';
import { GlassCard } from '../../components/ui/GlassCard';

export const IncidentLogger = () => {
    const { logIncident, incidents, requiresManualReview, assignCorrectiveAction, resolveIncident } = useLpsStore();
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<LPSCategory>('personal_complacency');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;
        logIncident(description, category);
        setDescription('');
        setIsOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
                        <AlertTriangle className="text-ohs-orange" />
                        Human-in-the-Loop RCA
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Record near-losses for H&S Officer Review. No automated disciplinary lockouts.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-ohs-orange text-ohs-navy px-4 py-2 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform shrink-0"
                >
                    <Plus size={16} /> Log Incident
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard className="p-4 border-l-4 border-ohs-orange">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Incidents</p>
                    <p className="text-3xl font-black text-white">{incidents.length}</p>
                </GlassCard>
                <GlassCard className={`p-4 border-l-4 ${requiresManualReview ? 'border-red-500 bg-red-500/5' : 'border-ohs-green'}`}>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">H&S Officer Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        {requiresManualReview ? (
                            <><ShieldAlert className="text-red-500" size={20} /><p className="text-lg font-black uppercase text-red-500">Pending Review</p></>
                        ) : (
                            <><CheckCircle2 className="text-ohs-green" size={20} /><p className="text-lg font-black uppercase text-ohs-green">All Clear</p></>
                        )}
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-3">
                {incidents.map(incident => (
                    <div key={incident.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                                    incident.category === 'personal_complacency' ? 'bg-ohs-orange/20 text-ohs-orange' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {incident.category.replace('_', ' ')}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                                    incident.status === 'pending_review' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                                    incident.status === 'corrective_action_assigned' ? 'bg-ohs-orange/20 text-ohs-orange' : 
                                    'bg-ohs-green/20 text-ohs-green'
                                }`}>
                                    {incident.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <p className="text-white font-medium text-sm">{incident.description}</p>
                            <span className="text-[10px] text-gray-500 font-mono block mt-1">
                                {incident.timestamp.toLocaleString()}
                            </span>
                        </div>
                        
                        {/* H&S Officer Mock Actions */}
                        {incident.status === 'pending_review' && (
                            <div className="flex gap-2 shrink-0">
                                <button 
                                    onClick={() => assignCorrectiveAction(incident.id)}
                                    className="bg-white/10 hover:bg-ohs-orange hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                                >
                                    Assign Training
                                </button>
                                <button 
                                    onClick={() => resolveIncident(incident.id)}
                                    className="bg-white/10 hover:bg-ohs-green hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                        {incident.status === 'corrective_action_assigned' && (
                             <button 
                                 onClick={() => resolveIncident(incident.id)}
                                 className="bg-ohs-orange text-black hover:bg-ohs-green hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                             >
                                 Verify Completion
                             </button>
                        )}
                    </div>
                ))}
                {incidents.length === 0 && (
                    <div className="text-center p-8 bg-white/5 rounded-xl border border-white/5">
                        <ShieldAlert className="mx-auto text-gray-600 mb-2" size={32} />
                        <p className="text-gray-500 font-medium">No incidents logged. Operational standard is clean.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-ohs-navy border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative"
                        >
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                            <h3 className="text-xl font-black text-white mb-6 tracking-tight uppercase">Log LPS Incident</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCategory('personal_complacency')}
                                            className={`p-3 rounded-xl border text-xs font-bold transition-colors ${
                                                category === 'personal_complacency' ? 'bg-ohs-orange text-ohs-navy border-ohs-orange' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            Personal Complacency
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCategory('job_system_factor')}
                                            className={`p-3 rounded-xl border text-xs font-bold transition-colors ${
                                                category === 'job_system_factor' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            Job/System Factor
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Incident Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-ohs-orange transition-colors min-h-[100px]"
                                        placeholder="Describe the near-loss or violation..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-ohs-orange text-ohs-navy py-3 rounded-xl font-black uppercase tracking-widest mt-4 hover:bg-orange-400 transition-colors"
                                >
                                    Log & Flag For Review
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
