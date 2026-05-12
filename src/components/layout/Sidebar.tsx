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
            {/* Mobile Overlay Backdrop */}
            {!isCollapsed && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            <motion.div
                initial={false}
                animate={{
                    width: isCollapsed ? 60 : 260,
                    x: (typeof window !== 'undefined' && window.innerWidth < 768 && isCollapsed) ? -260 : 0,
                    transition: { duration: 0.3, ease: "easeInOut" }
                }}
                className={`fixed left-0 top-0 h-screen bg-ohs-navy/95 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col z-[1000] text-white ${isCollapsed ? 'hidden md:flex' : 'flex'}`}
            >
                {/* Close Button (Mobile Only) */}
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="md:hidden absolute right-4 top-4 p-2 bg-white/5 rounded-lg text-ohs-orange"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-ohs-orange rounded-full items-center justify-center text-ohs-navy hover:scale-110 transition-transform shadow-lg z-[60]"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

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
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-2 py-3 rounded-xl transition-all ${activeTab === item.id
                            ? "bg-ohs-blue text-white shadow-lg shadow-ohs-blue/20"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        title={isCollapsed ? item.label : ""}
                    >
                        <item.icon size={20} className="flex-shrink-0" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-medium whitespace-nowrap"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </button>
                ))}
            </nav>

            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-auto overflow-hidden"
                >
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <LifeBuoy size={18} className="text-ohs-orange" />
                            <span className="text-sm font-medium">Need Help?</span>
                        </div>
                        <p className="text-xs text-gray-400">Ask Melly for instant assistance.</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

