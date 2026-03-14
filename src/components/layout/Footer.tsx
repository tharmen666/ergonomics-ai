export const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-ohs-dark/80 backdrop-blur-xl text-gray-400 py-12 mt-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-ohs-blue/5 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                        <div className="w-8 h-8 bg-ohs-orange rounded-lg flex items-center justify-center font-black text-ohs-navy text-sm">OHS</div>
                        <p className="font-black text-white text-xl tracking-tight">OHS Haven</p>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Advanced Ergonomic Intelligence System</p>
                </div>

                <div className="flex flex-col items-center md:items-end text-sm">
                    <p className="font-bold text-gray-300 mb-2">Created by <span className="text-ohs-orange font-black px-2 py-0.5 bg-ohs-orange/10 rounded-md">Desigan Tharmen</span></p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-6 mt-2 text-xs font-bold text-gray-500">
                        <a href="mailto:tharmendesigan36@gmail.com" className="hover:text-ohs-orange transition-colors flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-ohs-orange" />
                            tharmendesigan36@gmail.com
                        </a>
                        <a href="tel:+27622655708" className="hover:text-ohs-orange transition-colors flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-ohs-orange" />
                            +27 622 655 708
                        </a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest gap-4">
                <p>© 2026 OHS HAVEN INTELLIGENCE. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-6">
                    <button className="hover:text-white transition-colors">Privacy Protcol</button>
                    <button className="hover:text-white transition-colors">Security Node</button>
                    <button className="hover:text-white transition-colors">Compliance Core</button>
                </div>
            </div>
        </footer>
    );
};
