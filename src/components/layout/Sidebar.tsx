import { Home, Activity, BarChart2, Settings, LifeBuoy, CheckSquare, ShoppingBag, FileText, Users, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

interface SidebarProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) => {
    return (
        <>
            {/* Global Overlay Backdrop */}
            {!isCollapsed && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            <motion.div
                initial={false}
                animate={{
                    x: isCollapsed ? -300 : 0,
                    transition: { duration: 0.3, ease: "easeInOut" }
                }}
                className={`fixed left-0 top-0 h-screen w-[260px] bg-ohs-navy/95 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col z-[1000] text-white shadow-2xl`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-ohs-orange"
                >
                    <X size={20} />
                </button>

                {/* Desktop Toggle Button - REMOVED since it's now a pure overlay */}

            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-10 overflow-hidden whitespace-nowrap`}>
                <div className="min-w-[40px] h-10 bg-gradient-to-br from-ohs-orange to-ohs-green rounded-full flex items-center justify-center font-bold text-lg text-ohs-navy flex-shrink-0">
                    OHS
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-xl tracking-wide"
                    >
                        ErgoSafe Reborn
                    </motion.span>
                )}
            </div>

            <nav className="flex-1 space-y-2 overflow-hidden">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            setIsCollapsed(true);
                        }}
                        className={`w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all ${activeTab === item.id
                            ? "bg-ohs-blue text-white shadow-lg shadow-ohs-blue/20"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <item.icon size={20} className="flex-shrink-0" />
                        <span className="font-medium whitespace-nowrap">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

                <div className="mt-auto overflow-hidden">
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

