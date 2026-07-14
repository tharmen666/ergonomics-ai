import { useEffect } from 'react';
import { Home, Activity, BarChart2, Settings, LifeBuoy, CheckSquare, ShoppingBag, FileText, Users, AlertCircle, X, ShieldAlert, LogOut } from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { useTenantStore } from '../../store/tenantStore';

const navItems = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: Activity, label: "Interactive Ergonomic Training", id: "training" },
    { icon: CheckSquare, label: "Daily Checklist", id: "checklist" },
    { icon: BarChart2, label: "Risk Assessment", id: "risk" },
    { icon: Activity, label: "Self-Risk Assessment", id: "assessment" },
    { icon: AlertCircle, label: "Risky Behaviors", id: "risks" },
    { icon: Users, label: "HR Dashboard", id: "hr" },
    { icon: Users, label: "Our Team", id: "team" },
    { icon: FileText, label: "Invoice Manager", id: "invoices" },
    { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) => {
    const { isWingmanActive, setWingmanActive } = useNellyStore();
    const { companyId, isAdmin, logout, userId, companies } = useTenantStore();
    const companyName = isAdmin ? 'Master Owner Admin' : (companies.find(c => c.id === companyId)?.name || 'Guest Company');

    useEffect(() => {
        if (!isCollapsed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCollapsed]);

    return (
        <>
            {/* Global Overlay Backdrop - Mobile Only */}
            {!isCollapsed && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] md:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            <div
                className={`fixed left-0 top-0 h-[100dvh] w-[260px] bg-ohs-navy/95 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col z-[1000] text-white shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isCollapsed ? '-translate-x-full' : 'translate-x-0'
                }`}
            >
                {/* Close Button - Mobile Only */}
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-ohs-orange md:hidden"
                    aria-label="Close Sidebar"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-10 overflow-hidden whitespace-nowrap">
                    <div className="min-w-[40px] h-10 bg-gradient-to-br from-ohs-orange to-ohs-green rounded-full flex items-center justify-center font-bold text-lg text-ohs-navy flex-shrink-0">
                        OHS
                    </div>
                    <span className="font-bold text-xl tracking-wide">
                        ErgoSafe Reborn
                    </span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
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

                    {isAdmin && (
                        <button
                            onClick={() => {
                                setActiveTab('master-admin');
                                setIsCollapsed(true);
                            }}
                            className={`w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all ${activeTab === 'master-admin'
                                ? "bg-ohs-orange text-ohs-navy font-black shadow-lg"
                                : "text-ohs-orange/80 hover:bg-white/5 hover:text-ohs-orange"
                                }`}
                        >
                            <ShieldAlert size={20} className="flex-shrink-0" />
                            <span className="font-bold whitespace-nowrap">
                                Master Admin Portal
                            </span>
                        </button>
                    )}

                    {/* Mobile-Only OHS Control Station */}
                    <div className="md:hidden mt-6 pt-6 border-t border-white/10 space-y-3">
                        <span className="text-[10px] font-black text-ohs-orange uppercase tracking-widest block mb-1 px-2">OHS Core Status</span>
                        <button
                            onClick={() => {
                                setWingmanActive(!isWingmanActive);
                                setIsCollapsed(true);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs transition-all ${
                                isWingmanActive 
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${isWingmanActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                            {isWingmanActive ? 'DISABLE WINGMAN' : 'ACTIVATE WINGMAN'}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('executive');
                                setIsCollapsed(true);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-ohs-orange/10 border border-ohs-orange/30 text-ohs-orange font-bold text-xs hover:bg-ohs-orange/20 transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-ohs-orange" />
                            EXECUTIVE BRIEFING
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('demo');
                                setIsCollapsed(true);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-ohs-green/10 border border-ohs-green/30 text-ohs-green font-bold text-xs hover:bg-ohs-green/20 transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-ohs-green" />
                            150S HIGH-TECH DEMO
                        </button>
                    </div>
                </nav>

                <div className="mt-auto pt-4 overflow-hidden border-t border-white/5 flex flex-col gap-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Tenant Session</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">{companyName}</p>
                        <p className="text-[10px] text-gray-400">ID: {userId || 'N/A'}</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-red-500/20"
                    >
                        <LogOut size={14} /> DISCONNECT SESSION
                    </button>
                </div>
            </div>
        </>
    );
};
