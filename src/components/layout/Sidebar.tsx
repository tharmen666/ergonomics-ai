import { useEffect } from 'react';
import { Home, Activity, BarChart2, Settings, Bot, Monitor, X, ShieldAlert, LogOut } from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { useTenantStore } from '../../store/tenantStore';

const navItems = [
    { icon: Home, label: "Dashboard / Overview (OHS Command Center)", id: "dashboard" },
    { icon: BarChart2, label: "G.E.A.R. Compliance Ledger", id: "gear" },
    { icon: Bot, label: "Nelly AI Assistant & Biomechanical Analysis", id: "nelly" },
    { icon: Monitor, label: "Forecourt Express Kiosk (Touchscreen Terminal)", id: "kiosk" },
    { icon: Activity, label: "Training & Hazard Mitigation", id: "training" },
    { icon: Settings, label: "System Settings & MCP Integration", id: "settings" },
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
        if (!isCollapsed && window.innerWidth < 768) {
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] md:hidden cursor-pointer"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            <div
                className={`fixed left-0 top-0 h-[100dvh] w-[280px] bg-ohs-navy/95 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col z-[1000] text-white shadow-2xl transition-transform duration-300 ease-in-out ${
                    isCollapsed ? '-translate-x-full' : 'translate-x-0'
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="absolute right-4 top-4 p-2.5 min-h-[44px] min-w-[44px] bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-ohs-orange flex items-center justify-center cursor-pointer"
                    aria-label="Close Sidebar"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-8 pr-10 overflow-hidden whitespace-nowrap">
                    <div className="min-w-[40px] h-10 bg-gradient-to-br from-ohs-orange to-ohs-green rounded-full flex items-center justify-center font-bold text-lg text-ohs-navy flex-shrink-0 shadow-md">
                        OHS
                    </div>
                    <span className="font-bold text-lg tracking-wide truncate">
                        ErgoSafe Reborn
                    </span>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
                    <span className="text-[9px] font-black text-ohs-orange uppercase tracking-widest block mb-2 px-2">Core System Modules</span>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsCollapsed(true);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl transition-all text-left cursor-pointer ${activeTab === item.id || (item.id === 'nelly' && activeTab === 'assessment') || (item.id === 'kiosk' && activeTab === 'checklist')
                                ? "bg-ohs-blue text-white shadow-lg shadow-ohs-blue/20 font-bold"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} className="flex-shrink-0 text-ohs-orange" />
                            <span className="text-xs font-semibold leading-tight line-clamp-2">
                                {item.label}
                            </span>
                        </button>
                    ))}

                    {isAdmin && (
                        <div className="pt-2 border-t border-white/10 mt-2">
                            <button
                                onClick={() => {
                                    setActiveTab('master-admin');
                                    setIsCollapsed(true);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl transition-all text-left cursor-pointer ${activeTab === 'master-admin'
                                    ? "bg-ohs-orange text-ohs-navy font-black shadow-lg"
                                    : "text-ohs-orange/80 hover:bg-white/5 hover:text-ohs-orange"
                                    }`}
                            >
                                <ShieldAlert size={20} className="flex-shrink-0" />
                                <span className="text-xs font-bold whitespace-nowrap">
                                    Master Admin Portal
                                </span>
                            </button>
                        </div>
                    )}
                </nav>

                <div className="mt-auto pt-4 overflow-hidden border-t border-white/10 flex flex-col gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Tenant Session</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">{companyName}</p>
                        <p className="text-[10px] text-gray-400">ID: {userId || 'N/A'}</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 min-h-[48px] rounded-xl font-bold text-xs transition-colors cursor-pointer border border-red-500/20"
                    >
                        <LogOut size={16} /> DISCONNECT SESSION
                    </button>
                </div>
            </div>
        </>
    );
};
