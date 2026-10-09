import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BottomCTAProps {
  onStartProject: () => void;
  onContactUs: () => void;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({
  onStartProject,
  onContactUs,
}) => {
  return (
    <section
      className="relative text-white py-8 sm:py-12 lg:py-14 overflow-hidden text-center sm:text-left"
      style={{
        background:
          'linear-gradient(135deg, #112119 0%, #1a2e24 50%, #0f1c15 100%)',
      }}
    >
      {/* Atmospheric subtle botanical graphic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(45, 69, 54, 0.45) 0%, rgba(15, 26, 20, 0.95) 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(#8AA795 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8">
        <div>
          <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#A2C1AF] uppercase mb-1 sm:mb-2">
            — Let's Build What's Next
          </p>
          <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#FAF8F5] mb-1.5 sm:mb-3 leading-snug">
            Ready to Grow Your Brand?
          </h2>
          <p className="text-xs sm:text-sm text-[#CAD6CE] font-light max-w-lg leading-relaxed">
            Let's bring your ideas to life with powerful websites, creative content and digital marketing solutions.
          </p>
        </div>

        {/* Side-by-side buttons matching image.png */}
        <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 shrink-0">
          <button
            onClick={onStartProject}
            className="min-h-[38px] sm:min-h-[44px] inline-flex items-center justify-center px-4 sm:px-7 py-2 sm:py-3 rounded-full bg-[#FAF8F5] text-[#1B2E24] text-[11px] sm:text-xs font-bold tracking-wider hover:bg-white transition-all shadow-md group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Start Project</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onContactUs}
            className="min-h-[38px] sm:min-h-[44px] inline-flex items-center justify-center px-4 sm:px-7 py-2 sm:py-3 rounded-full border border-[#8DA998] text-[#FAF8F5] text-[11px] sm:text-xs font-semibold tracking-wider hover:bg-white/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};
