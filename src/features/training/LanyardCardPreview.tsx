import { useState } from 'react';

// Custom Hex Palette extracted directly from logo.png for OHS Haven branding
const brandPalettes: Record<string, { primary: string, text: string, accent: string }> = {
  ohsHaven: { primary: "bg-[#032B53]", text: "text-[#F09A1A]", accent: "border-[#048F40]" },
  astronEnergy: { primary: "bg-[#0A2540]", text: "text-[#FF6B00]", accent: "border-[#00D4B2]" },
  engen: { primary: "bg-[#002F6C]", text: "text-[#FFD100]", accent: "border-[#00A896]" },
  total: { primary: "bg-[#002A54]", text: "text-[#FF3B30]", accent: "border-[#FFCC00]" }
};

export const LanyardCardPreview = () => {
  const [selectedBrand, setSelectedBrand] = useState('ohsHaven');
  const [currentSide, setCurrentSide] = useState('en'); // 'en' for Front, 'zu' for Back

  const activeColors = brandPalettes[selectedBrand];

  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl max-w-2xl mx-auto font-sans shadow-2xl text-white">
      {/* Brand & Side Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-900 pb-4">
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Select Brand Palette</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(brandPalettes).map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1 text-xs font-bold rounded capitalize border transition-all ${selectedBrand === brand ? 'bg-slate-800 border-amber-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}
              >
                {brand.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Flip Card Side</label>
          <div className="bg-slate-900 p-0.5 rounded border border-slate-800 flex">
            <button onClick={() => setCurrentSide('en')} className={`px-4 py-1 text-xs font-bold rounded ${currentSide === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>🇬🇧 FRONT (EN)</button>
            <button onClick={() => setCurrentSide('zu')} className={`px-4 py-1 text-xs font-bold rounded ${currentSide === 'zu' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>🇿🇦 BACK (ZU)</button>
          </div>
        </div>
      </div>

      {/* Interactive Physical Lanyard Mockup Card */}
      <div className={`w-full max-w-sm mx-auto aspect-[2.5/4] ${activeColors.primary} border-4 ${activeColors.accent} rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden`}>
        {/* Top Lanyard Clip Punch-Hole Slot */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-slate-950 rounded-full border border-slate-800"></div>
        
        {/* Card Header */}
        <div className="mt-4 text-center">
          <h4 className={`text-xs font-mono tracking-widest font-black uppercase ${activeColors.text}`}>SOP COMPLIANCE LANYARD</h4>
          <div className="h-0.5 bg-slate-100/10 w-3/4 mx-auto mt-1"></div>
        </div>

        {/* Dynamic Content Frame */}
        <div className="my-auto text-center px-2">
          {currentSide === 'en' ? (
            <div>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] font-mono font-bold uppercase">SOP-SPILL-02</span>
              <h3 className="text-base font-black tracking-tight text-white mt-2 mb-3">HAZMAT SPILL CONTAINMENT</h3>
              <p className="text-xs text-slate-200 leading-relaxed text-justify font-normal">
                "Iris here! 1. Halt all refueling operations immediately. 2. Eliminate all potential ignition sources. 3. Deploy absorbent spill granules directly onto parameters to stop spread. 4. Sweep up using non-sparking tools."
              </p>
            </div>
          ) : (
            <div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono font-bold uppercase">SOP-SPILL-02</span>
              <h3 className="text-base font-black tracking-tight text-white mt-2 mb-3">UKULAWULWA KUKAPHETHILOLI</h3>
              <p className="text-xs text-slate-200 leading-relaxed text-justify font-normal">
                "Ngu-Iris lo! 1. Misa ukuthela uphethiloli ngokushesha. 2. Susa yonke into engadala umlilo. 3. Faka ama-absorbent spill granules emaphethelweni kaphethiloli ochithekile ukuze ungagcwali indawo."
              </p>
            </div>
          )}
        </div>

        {/* Card Footer Badge */}
        <div className="text-center border-t border-slate-100/10 pt-3">
          <p className="text-[10px] font-mono text-slate-300 tracking-wider">PROTECTED BY OHS HAVEN LMS</p>
          <p className="text-[8px] font-mono text-slate-500 mt-0.5">SA OHS ACT ACT 85 OF 1993 COMPLIANT</p>
        </div>
      </div>
    </div>
  );
}
