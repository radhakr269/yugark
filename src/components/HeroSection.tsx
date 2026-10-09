import React from 'react';
import { ArrowRight, Monitor, Layers, Zap, TrendingUp } from 'lucide-react';
import { siteConfig, valueHighlights } from '../data/studioData';

interface HeroSectionProps {
  onStartProject: () => void;
  onViewWork: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartProject,
  onViewWork,
}) => {
  return (
    <section
      className="relative pt-6 pb-8 sm:pt-10 sm:pb-12 lg:pt-14 lg:pb-18 xl:pt-16 xl:pb-22 overflow-hidden bg-[#F8F6F1]"
      id="home"
    >
      {/* 
        Mobile Upper-Right Blended Hero Visual (Exact Match to Approved Reference)
        Softly blended into the upper-right quadrant with stronger left-side transparency
        so the text on the left remains 100% legible on warm ivory with no collision.
      */}
      <div className="lg:hidden absolute right-[-8%] sm:right-0 top-0 w-[68%] sm:w-[58%] max-w-[400px] h-[280px] sm:h-[340px] pointer-events-none z-0 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            maskImage: `
              radial-gradient(ellipse 90% 85% at 75% 42%, black 42%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.2) 82%, transparent 100%),
              linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.6) 38%, black 65%, black 88%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 12%, black 85%, transparent 100%)
            `,
            WebkitMaskImage: `
              radial-gradient(ellipse 90% 85% at 75% 42%, black 42%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.2) 82%, transparent 100%),
              linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.6) 38%, black 65%, black 88%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 12%, black 85%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <img
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-left-top transform scale-105"
            src={siteConfig.heroImage}
            loading="eager"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">
          {/* Left: Editorial Copy */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:space-y-7 z-10">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#556358] uppercase">
              <span className="w-3.5 sm:w-5 h-[1.5px] bg-[#556358]" />
              <span>Digital Studio For Modern Brands</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-title text-[32px] sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] leading-[1.08] text-[#121614] font-medium tracking-tight">
              {siteConfig.headlineLine1}
              <br />
              {siteConfig.headlineLine2}
              <br />
              <span className="italic font-normal text-[#2D4536]">
                {siteConfig.headlineLine3Accent}
              </span>
            </h1>

            {/* Lead Description (constrained width on mobile to give room to upper-right visual) */}
            <p className="text-[#555C56] text-[13.5px] sm:text-[15px] lg:text-base leading-relaxed max-w-[270px] sm:max-w-md lg:max-w-lg font-normal">
              {siteConfig.heroDescription}
            </p>

            {/* Dual Call to Actions (Side-by-side on mobile and desktop as in reference) */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onStartProject}
                className="min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-[#1A2621] text-white text-[11px] sm:text-[13px] font-medium tracking-wide hover:bg-black transition-all shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewWork}
                className="min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-[#D5CDC1] bg-white/70 text-[#121614] text-[11px] sm:text-[13px] font-medium tracking-wide hover:bg-white hover:border-[#121614] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                View Our Work
              </button>
            </div>

            {/* 4 Value Highlights: Exact 4-item single row layout as shown in the approved mobile reference */}
            <div className="pt-5 sm:pt-6 lg:pt-8 border-t border-[#E8E1D5] grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
              {valueHighlights.map((badge) => {
                let Icon = Monitor;
                if (badge.iconName === 'layers') Icon = Layers;
                if (badge.iconName === 'zap') Icon = Zap;
                if (badge.iconName === 'bar-chart') Icon = TrendingUp;

                return (
                  <div key={badge.id} className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 min-w-0">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#2D4536] shrink-0">
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    </div>
                    <div className="leading-tight min-w-0">
                      <p className="font-bold uppercase tracking-wider text-[#121614] text-[8px] sm:text-[9.5px] lg:text-[11px] truncate">
                        {badge.title}
                      </p>
                      <p className="text-[#737A74] text-[7.5px] sm:text-[8.5px] lg:text-[10px] truncate">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Showcase Visual (lg:block, hidden on mobile in favor of upper-right blend) */}
          <div className="hidden lg:block lg:col-span-7 relative">
            <div className="relative flex items-center justify-center">
              <div
                className="relative w-full"
                style={{
                  maskImage: `
                    radial-gradient(ellipse 84% 80% at 52% 50%, black 52%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.2) 86%, transparent 100%),
                    linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 20%, black 86%, rgba(0,0,0,0.6) 94%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)
                  `,
                  WebkitMaskImage: `
                    radial-gradient(ellipse 84% 80% at 52% 50%, black 52%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.2) 86%, transparent 100%),
                    linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 20%, black 86%, rgba(0,0,0,0.6) 94%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)
                  `,
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              >
                <img
                  alt="Yugark Digital Studio multi-device mockup showcase"
                  className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-[1.015]"
                  src={siteConfig.heroImage}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
