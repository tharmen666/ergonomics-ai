import { motion } from 'framer-motion';

// Mock Data
const data = [
    { label: 'Mon', value: 30 },
    { label: 'Tue', value: 45 },
    { label: 'Wed', value: 65 },
    { label: 'Thu', value: 50 },
    { label: 'Fri', value: 85 },
    { label: 'Sat', value: 40 },
    { label: 'Sun', value: 60 },
];

export const ActivityChart = () => {
    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:flex w-full h-48 items-end justify-between gap-2">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${d.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                            className="w-full bg-ohs-blue/50 rounded-t-lg relative overflow-hidden group-hover:bg-ohs-orange transition-colors"
                        >
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
                        </motion.div>
                        <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">{d.label}</span>
                    </div>
                ))}
            </div>

            {/* Mobile View (Vertical Stacking) */}
            <div className="flex md:hidden flex-col w-full gap-4">
                {data.map((d, i) => (
                    <div key={i} className="w-full flex items-center gap-3 group">
                        <span className="w-8 text-xs text-gray-500 font-medium">{d.label}</span>
                        <div className="flex-1 h-6 bg-white/5 rounded-r-lg overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${d.value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                                className="h-full bg-ohs-blue/50 group-hover:bg-ohs-orange transition-colors relative"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-white/20" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const ComplianceRing = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 40; // r=40
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64" cy="64" r="40"
                    stroke="currentColor" strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                />
                <motion.circle
                    cx="64" cy="64" r="40"
                    stroke="currentColor" strokeWidth="8"
                    fill="transparent"
                    className="text-ohs-green"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{percentage}%</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Safe</span>
            </div>
        </div>
    );
};
