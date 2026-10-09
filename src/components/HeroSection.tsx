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
      className="relative pt-8 pb-12 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16 xl:pt-14 xl:pb-20 overflow-hidden bg-[#F8F6F1]"
      id="home"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">
          {/* Left: Editorial Copy */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 lg:space-y-7 z-10">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#556358] uppercase">
              <span className="w-4 sm:w-5 h-[1.5px] bg-[#556358]" />
              <span>Digital Studio For Modern Brands</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] leading-[1.1] sm:leading-[1.08] text-[#121614] font-medium tracking-tight">
              {siteConfig.headlineLine1}
              <br />
              {siteConfig.headlineLine2}
              <br />
              <span className="italic font-normal text-[#2D4536]">
                {siteConfig.headlineLine3Accent}
              </span>
            </h1>

            {/* Lead Description */}
            <p className="text-[#555C56] text-[14px] sm:text-[15px] lg:text-base leading-relaxed max-w-lg font-normal">
              {siteConfig.heroDescription}
            </p>

            {/* Dual Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 sm:pt-2">
              <button
                onClick={onStartProject}
                className="min-h-[44px] inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#1A2621] text-white text-[13px] font-medium tracking-wide hover:bg-black transition-all shadow-sm hover:shadow-md group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <span>Start Project</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewWork}
                className="min-h-[44px] inline-flex items-center justify-center px-7 py-3 rounded-full border border-[#D5CDC1] bg-white/70 text-[#121614] text-[13px] font-medium tracking-wide hover:bg-white hover:border-[#121614] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                View Our Work
              </button>
            </div>

            {/* Phase 4: Trust / Capability Value Highlights */}
            <div className="pt-6 sm:pt-7 lg:pt-8 border-t border-[#E8E1D5] grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 lg:gap-4">
              {valueHighlights.map((badge) => {
                let Icon = Monitor;
                if (badge.iconName === 'layers') Icon = Layers;
                if (badge.iconName === 'zap') Icon = Zap;
                if (badge.iconName === 'bar-chart') Icon = TrendingUp;

                return (
                  <div key={badge.id} className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#2D4536] shrink-0">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-[10px] sm:text-[11px] leading-tight">
                      <p className="font-bold uppercase tracking-wider text-[#121614]">
                        {badge.title}
                      </p>
                      <p className="text-[#737A74]">{badge.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Studio Visual Showcase with Advanced 4-Edge Soft Feather Mask */}
          <div className="lg:col-span-7 relative mt-6 sm:mt-8 lg:mt-0">
            <div className="relative flex items-center justify-center">
              <div
                className="relative w-full"
                style={{
                  /*
                   * Feather Mask Architecture:
                   * 1. Stronger left transparency (18% fade-in) for seamless blend with copy
                   * 2. Subtle top transparency (8% fade-in)
                   * 3. Smooth bottom-edge feathering (88% to 100%)
                   * 4. Gentle right-edge blending (86% to 100%)
                   * 5. Razor-sharp device clarity in focal center (monitor, laptop, phone)
                   * 6. No hard rectangular card border or heavy shadow
                   */
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
