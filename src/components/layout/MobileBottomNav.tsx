import { Home, ClipboardCheck, PlayCircle, BarChart3 } from 'lucide-react';

interface MobileBottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const MobileBottomNav = ({ activeTab, setActiveTab }: MobileBottomNavProps) => {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'assessment', label: 'Assess', icon: ClipboardCheck },
        { id: 'training', label: 'Train', icon: PlayCircle },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-ohs-navy border-t border-white/10 z-50 flex items-center justify-around px-2 backdrop-blur-xl bg-opacity-90">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === item.id ? 'text-ohs-orange' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                    {activeTab === item.id && (
                        <span className="absolute top-0 w-8 h-0.5 bg-ohs-orange rounded-b-full shadow-[0_0_10px_rgba(249,168,37,0.8)]" />
                    )}
                </button>
            ))}
        </div>
    );
};
