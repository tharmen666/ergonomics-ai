import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { BarChart3, Users, AlertCircle, CheckCircle, Download, ShieldAlert, Award, TrendingUp, Lock } from 'lucide-react';
import { getLegalShockContent } from '../../utils/escalationLogic';
import { useFatigueStore } from '../../logic/Fatigue-Check/fatigueStore';

export const HRDashboard = () => {
    const { fatigueLevel } = useFatigueStore();
    const stats = [
        { label: 'Total Employees', value: '124', icon: Users, color: 'text-ohs-blue', bgColor: 'bg-ohs-blue/10' },
        { label: 'Compliance Rate', value: '92%', icon: CheckCircle, color: 'text-ohs-green', bgColor: 'bg-ohs-green/10' },
        { label: 'Open Risks', value: '8', icon: AlertCircle, color: 'text-ohs-orange', bgColor: 'bg-ohs-orange/10' },
        { label: 'Training Hours', value: '342h', icon: BarChart3, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
    ];

    const employees = [
        { name: 'Sarah Jenkins', dept: 'Marketing', score: '98%', status: 'Compliant', trend: 'up' },
        { name: 'Mike Ross', dept: 'Engineering', score: '65%', status: 'Risk Alert', trend: 'down', escalation: 'Supervisor Notified' },
        { name: 'Jessica Pearson', dept: 'Legal', score: '100%', status: 'Compliant', trend: 'stable' },
        { name: 'Harvey Specter', dept: 'Legal', score: '88%', status: 'Pending Review', trend: 'up' },
        { name: 'Louis Litt', dept: 'Finance', score: '42%', status: 'Liability', trend: 'down', escalation: 'CEO ESCALATED' },
    ];

    const supervisors = [
        { name: 'Robert Zane', team: 'Legal', compliance: 95, status: 'Elite' },
        { name: 'Sheila Sazs', team: 'Finance', compliance: 62, status: 'At Risk' },
        { name: 'Gretchen Bodinski', team: 'Operations', compliance: 88, status: 'Steady' },
    ];

    return (
        <div className="space-y-10 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                        Stewardship Intelligence
                        <span className="bg-ohs-orange/20 text-ohs-orange text-[10px] px-2 py-1 rounded-full border border-ohs-orange/30">CEO VIEW</span>
                    </h2>
                    <p className="text-gray-400 font-medium">Monitoring organizational OHS adherence & cascading accountability.</p>
                </div>
                <div className="flex gap-3">
                    {fatigueLevel === 'high' ? (
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-3">
                                <GlowButton variant="secondary" className="px-5 py-2.5 text-sm opacity-50 cursor-not-allowed">
                                    <Lock size={16} className="mr-2" />
                                    DOA Lockout
                                </GlowButton>
                            </div>
                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">Critical Sign-off Disabled</p>
                        </div>
                    ) : (
                        <>
                            <GlowButton variant="secondary" className="px-5 py-2.5 text-sm">
                                Refresh Node
                            </GlowButton>
                            <GlowButton className="px-5 py-2.5 text-sm">
                                <Download size={16} className="mr-2" />
                                Export Audit
                            </GlowButton>
                        </>
                    )}
                </div>
            </div>

            {/* CEO Safety Pulse Dial */}
            <GlassCard className="p-8 border-ohs-orange/30 bg-gradient-to-br from-ohs-navy to-ohs-orange/5">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                            <circle
                                cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray={502.4}
                                strokeDashoffset={502.4 * (1 - 0.92)}
                                className="text-ohs-orange drop-shadow-[0_0_8px_rgba(249,168,37,0.5)]"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-5xl font-black text-white">92</span>
                            <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest">Safety Pulse</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 bg-ohs-orange/10 p-4 rounded-2xl border border-ohs-orange/20">
                            <ShieldAlert className="text-ohs-orange" size={24} />
                            <div>
                                <p className="text-xs font-black text-ohs-orange uppercase tracking-wider">Legal Liability Alert</p>
                                <p className="text-sm text-white/80 font-medium leading-tight">
                                    {getLegalShockContent()}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase">Managed Risk</p>
                                <p className="text-xl font-black text-ohs-green">84%</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase">Audit Readiness</p>
                                <p className="text-xl font-black text-ohs-blue">96%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-7 relative overflow-hidden group hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
                                    <h3 className="text-4xl font-black text-white mt-1">{stat.value}</h3>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Risk Distribution Chart */}
                <GlassCard className="lg:col-span-2 p-8 min-h-[450px] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-white tracking-tight">Safety Compliance Trend</h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-ohs-orange" />
                            <span className="w-3 h-3 rounded-full bg-ohs-blue" />
                            <span className="w-3 h-3 rounded-full bg-ohs-green" />
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 px-4">
                        {[40, 75, 55, 95, 70, 85, 65].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                    className={`w-full rounded-t-2xl relative overflow-hidden ${h > 80 ? 'bg-gradient-to-t from-ohs-green to-green-300' :
                                        h > 60 ? 'bg-gradient-to-t from-ohs-blue to-blue-300' :
                                            'bg-gradient-to-t from-ohs-orange to-orange-300'
                                        } opacity-70 group-hover:opacity-100 transition-all duration-500 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]`}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-ohs-navy font-black text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% COMPLIANCE
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-gray-500 font-bold text-xs mt-8 px-2 border-t border-white/5 pt-6">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>
                </GlassCard>

                {/* Employee Risk Tracking */}
                <GlassCard className="p-0 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-white/10 bg-white/5">
                        <h3 className="text-2xl font-black text-white tracking-tight">Internal Risk Grid</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase mt-1">Live Employee Feed</p>
                    </div>
                    <div className="divide-y divide-white/5 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
                        {employees.map((emp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-gray-500 group-hover:bg-ohs-blue group-hover:text-white transition-all">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-lg tracking-tight">{emp.name}</p>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{emp.dept}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xl font-black ${emp.status === 'Risk Alert' || emp.status === 'Liability' ? 'text-ohs-orange' :
                                        emp.status === 'Pending Review' ? 'text-yellow-400' :
                                            'text-ohs-green'
                                        }`}>{emp.score}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Risk Alert' || emp.status === 'Liability' ? 'bg-ohs-orange' : 'bg-ohs-green'
                                            }`} />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{emp.status}</span>
                                    </div>
                                    {emp.escalation && (
                                        <p className="text-[8px] font-black text-ohs-orange uppercase mt-1 animate-pulse">
                                            {emp.escalation}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-6 bg-ohs-blue/10 border-t border-white/10">
                        <button className="w-full text-center text-ohs-blue font-black text-sm uppercase tracking-widest hover:text-white transition-colors">
                            View Full Directory
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* Supervisor Accountability View */}
            <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Supervisor Accountability</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Chevron Culture Dashboard</p>
                    </div>
                    <Award className="text-ohs-orange" size={32} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supervisors.map((sup, i) => (
                        <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-ohs-orange/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-ohs-navy flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <TrendingUp className={sup.compliance > 90 ? 'text-ohs-green' : 'text-ohs-orange'} size={24} />
                                </div>
                                <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${sup.compliance > 90 ? 'bg-ohs-green/20 text-ohs-green border border-ohs-green/30' :
                                    'bg-ohs-orange/20 text-ohs-orange border border-ohs-orange/30'
                                    }`}>
                                    {sup.status}
                                </div>
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">{sup.name}</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-4">{sup.team} STEWARD</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                                    <span>Team Compliance</span>
                                    <span>{sup.compliance}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${sup.compliance}%` }}
                                        className={`h-full ${sup.compliance > 90 ? 'bg-ohs-green' : 'bg-ohs-orange'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};
