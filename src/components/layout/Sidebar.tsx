import { Home, Activity, BarChart2, Settings, LifeBuoy, CheckSquare, ShoppingBag, FileText, Users, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: Activity, label: "Training", id: "training" },
    { icon: CheckSquare, label: "Daily Checklist", id: "checklist" },
    { icon: BarChart2, label: "Risk Assessment", id: "risk" },
    { icon: Activity, label: "Self-Assessment", id: "assessment" },
    { icon: AlertCircle, label: "Risky Behaviors", id: "risks" },
    { icon: Users, label: "HR Dashboard", id: "admin" },
    { icon: Users, label: "Our Team", id: "team" },
    { icon: ShoppingBag, label: "Safety Shop", id: "shop" },
    { icon: FileText, label: "Finance & Invoices", id: "finance" },
    { icon: Settings, label: "Settings", id: "settings" },
];

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) => {
    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-ohs-navy/90 backdrop-blur-xl border-r border-white/10 p-6 flex-col z-50 text-white"
        >
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-gradient-to-br from-ohs-orange to-ohs-green rounded-full flex items-center justify-center font-bold text-lg text-ohs-navy">
                    OHS
                </div>
                <span className="font-bold text-xl tracking-wide">OHS Haven</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                            ? "bg-ohs-blue text-white shadow-lg shadow-ohs-blue/20"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <LifeBuoy size={18} className="text-ohs-orange" />
                        <span className="text-sm font-medium">Need Help?</span>
                    </div>
                    <p className="text-xs text-gray-400">Ask Melly for instant assistance.</p>
                </div>
            </div>
        </motion.div>
    );
};
