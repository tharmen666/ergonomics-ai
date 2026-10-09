import React, { useState, useRef, useEffect } from 'react';
import { Menu, MoreVertical, ShieldCheck, Sparkles, LogOut, Radio, X } from 'lucide-react';
import { useNellyStore } from '../../store/nellyStore';
import { useTenantStore } from '../../store/tenantStore';

interface NavbarProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
    const { 
        isSidebarCollapsed, 
        setSidebarCollapsed, 
        isWingmanActive, 
        setWingmanActive 
    } = useNellyStore();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Reflects the user's actual consent click (set only by the privacy notice's accept button)
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    useEffect(() => {
        const read = () => {
            try { setPrivacyAccepted(localStorage.getItem('ergo_privacy_consent_verified') === 'true'); } catch { /* storage blocked */ }
        };
        read();
        const id = window.setInterval(read, 2000);
        return () => window.clearInterval(id);
    }, []);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close mobile menu on click outside or escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileMenuOpen]);

    const handleDisconnect = () => {
        setIsMobileMenuOpen(false);
        useTenantStore.getState().logout();
        setActiveTab('tenant-portal');
    };

    return (
        <header 
            className={`sticky top-0 z-40 box-border bg-ohs-navy/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out w-full max-w-full ${
                isSidebarCollapsed ? 'md:ml-0 md:w-full' : 'md:ml-[280px] md:w-[calc(100%-280px)]'
            }`}
        >
            <div className="w-full max-w-full px-3 sm:px-6 md:px-8 py-2 flex items-center justify-between gap-2 relative">
                {/* Left: Branding & Sidebar Toggle */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
                    <button 
                        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-1.5 sm:p-2 min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-ohs-orange shadow-md flex-shrink-0 cursor-pointer"
                        title="Toggle Sidebar"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    
                    <div className="flex flex-col min-w-0 flex-shrink">
                        <h1 className="text-xs sm:text-base md:text-xl font-black text-white tracking-tight uppercase truncate leading-tight">
                            ERGOSAFE <span className="text-ohs-orange">REBORN</span>
                        </h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {/* Real commit injected at build time (vite.config.ts `define`) - no hardcoded badge */}
                            <span className="text-[8px] sm:text-[9px] font-mono text-ohs-orange/90 bg-ohs-orange/10 px-1 py-0.5 rounded border border-ohs-orange/30 truncate">
                                Build: {__APP_BUILD__}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Desktop Actions & Status Tray (>= 768px) */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
                    {/* Privacy Consensus Badge */}
                    <div className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shadow-sm border ${privacyAccepted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${privacyAccepted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span>{privacyAccepted ? 'Privacy Notice Accepted' : 'Privacy Notice Pending'}</span>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-mono text-gray-400 uppercase">Status:</span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wide">NOMINAL</span>
                    </div>

                    {/* Wingman Toggle Button */}
                    <button
                        onClick={() => setWingmanActive(!isWingmanActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl font-bold text-xs transition-all shadow-md leading-none cursor-pointer whitespace-nowrap ${
                            isWingmanActive 
                                ? 'bg-red-500/90 hover:bg-red-600 text-white shadow-red-500/20' 
                                : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        title="Toggle Voice Wingman Assistant"
                    >
                        <Radio size={14} className={isWingmanActive ? "animate-pulse" : ""} />
                        <span>{isWingmanActive ? 'DISABLE WINGMAN' : 'ACTIVATE WINGMAN'}</span>
                    </button>

                    {/* HQ Demo Action Button */}
                    <button
                        onClick={() => setActiveTab('demo')}
                        className="inline-flex items-center gap-1.5 bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-3 py-1.5 min-h-[38px] rounded-xl font-black text-xs transition-all shadow-md whitespace-nowrap leading-none cursor-pointer"
                        title="Launch Interactive Executive Demo"
                    >
                        <Sparkles size={14} />
                        <span>HQ DEMO</span>
                    </button>

                    {/* Disconnect / Logout Button */}
                    <button
                        onClick={handleDisconnect}
                        className="inline-flex items-center gap-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 px-3 py-1.5 min-h-[38px] rounded-xl font-bold text-xs transition-all whitespace-nowrap leading-none cursor-pointer"
                        title="Disconnect current session and return to Auth Portal"
                    >
                        <LogOut size={14} />
                        <span>DISCONNECT</span>
                    </button>
                </div>

                {/* Right: Mobile Compact Controls (< 768px) with Collapsible Tray */}
                <div className="flex md:hidden items-center gap-1.5 flex-shrink-0" ref={menuRef}>
                    {/* Compact Primary Action Button */}
                    <button
                        onClick={() => setActiveTab('demo')}
                        className="bg-ohs-orange hover:bg-ohs-orange/90 text-ohs-navy px-2.5 py-1.5 min-h-[34px] rounded-lg font-black text-[10px] transition-all shadow-sm whitespace-nowrap leading-none cursor-pointer"
                    >
                        HQ DEMO
                    </button>

                    {/* Collapsible Quick Menu Trigger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-1.5 min-h-[34px] min-w-[34px] rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                            isMobileMenuOpen 
                                ? 'bg-ohs-orange text-ohs-navy border-ohs-orange' 
                                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                        }`}
                        title="Quick Actions Menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
                    </button>

                    {/* Collapsible Dropdown Card (Mobile Tray) */}
                    {isMobileMenuOpen && (
                        <div 
                            className="absolute right-2 top-full mt-2 w-72 max-w-[calc(100vw-1rem)] bg-[#001726]/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            {/* Privacy Status */}
                            <div className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-bold ${privacyAccepted ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-amber-500/10 border-amber-500/25 text-amber-400'}`}>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={14} />
                                    <span>{privacyAccepted ? 'Privacy Notice Accepted' : 'Privacy Notice Pending'}</span>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                                <span className="text-gray-400 text-[10px]">System Health:</span>
                                <span className="font-black text-emerald-400 text-[10px] uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    NOMINAL
                                </span>
                            </div>

                            {/* Wingman Assistant Action */}
                            <button
                                onClick={() => {
                                    setWingmanActive(!isWingmanActive);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                                    isWingmanActive 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-white/10 hover:bg-white/15 text-white'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Radio size={14} className={isWingmanActive ? "animate-pulse" : ""} />
                                    <span>Wingman Co-Pilot</span>
                                </span>
                                <span className="text-[10px] uppercase font-mono">
                                    {isWingmanActive ? 'Enabled' : 'Disabled'}
                                </span>
                            </button>

                            {/* Disconnect Action */}
                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span>Disconnect Session</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Click-Away Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default Navbar;
