import React, { useState, useEffect } from 'react';
import { ArrowRight, Monitor, Layers, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { siteConfig, valueHighlights } from '../data/studioData';
import { adminCmsApi } from '../lib/cms';

interface HeroSectionProps {
  onStartProject: () => void;
  onViewWork: () => void;
  onFreeDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartProject,
  onViewWork,
  onFreeDemo,
}) => {
  const [heroContent, setHeroContent] = useState({
    headlineLine1: siteConfig.headlineLine1,
    headlineLine2: siteConfig.headlineLine2,
    headlineLine3Accent: siteConfig.headlineLine3Accent,
    heroDescription: siteConfig.heroDescription,
  });

  useEffect(() => {
    async function load() {
      const data = await adminCmsApi.getHomepageContent();
      if (data) {
        setHeroContent({
          headlineLine1: data.headlineLine1 || siteConfig.headlineLine1,
          headlineLine2: data.headlineLine2 || siteConfig.headlineLine2,
          headlineLine3Accent: data.headlineLine3Accent || siteConfig.headlineLine3Accent,
          heroDescription: data.heroDescription || siteConfig.heroDescription,
        });
      }
    }
    load();

    const handleUpdate = () => load();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  return (
    <section
      className="relative pt-3 pb-6 sm:pt-6 sm:pb-9 lg:pt-10 lg:pb-14 overflow-hidden bg-[#F8F6F1]"
      id="home"
    >
      {/* 
        Mobile Upper-Right Blended Hero Visual (Enlarged ~20% with seamless feathering)
        Blended into upper-right quadrant with transparent left gradient so copy remains 100% legible.
      */}
      <div className="md:hidden absolute -right-2 top-0 w-[68%] sm:w-[58%] max-w-[360px] h-[270px] sm:h-[320px] pointer-events-none z-0 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            maskImage: `
              radial-gradient(ellipse 92% 88% at 75% 42%, black 45%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.15) 82%, transparent 100%),
              linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 12%, rgba(0,0,0,0.5) 36%, black 65%, black 90%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)
            `,
            WebkitMaskImage: `
              radial-gradient(ellipse 92% 88% at 75% 42%, black 45%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.15) 82%, transparent 100%),
              linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 12%, rgba(0,0,0,0.5) 36%, black 65%, black 90%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <img
            alt="Multi-device mockups"
            aria-hidden="true"
            className="w-full h-full object-cover object-left-top transform scale-115"
            src={siteConfig.heroImage}
            loading="eager"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left: Editorial Copy */}
          <div className="md:col-span-6 lg:col-span-5 space-y-3 sm:space-y-4 lg:space-y-6 z-10">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#556358] uppercase">
              <span className="w-3.5 sm:w-5 h-[1.5px] bg-[#556358]" />
              <span>Digital Studio For Modern Brands</span>
            </div>

            {/* Main Headline: Exact approved copy */}
            <h1 className="font-serif-title text-[30px] sm:text-[38px] md:text-4xl lg:text-[50px] xl:text-[56px] leading-[1.08] text-[#121614] font-medium tracking-tight">
              {heroContent.headlineLine1}
              <br />
              {heroContent.headlineLine2}
              <br />
              <span className="italic font-normal text-[#2D4536]">
                {heroContent.headlineLine3Accent}
              </span>
            </h1>

            {/* Lead Description */}
            <p className="text-[#555C56] text-[12px] sm:text-[13.5px] lg:text-[15px] leading-relaxed max-w-[280px] xs:max-w-xs sm:max-w-md lg:max-w-lg font-normal">
              {heroContent.heroDescription}
            </p>

            {/* Triple Call to Actions: Start Project, View Our Work, and Get Your Free Website Demo */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5 sm:pt-1">
              <button
                onClick={onStartProject}
                className="min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#1A2621] text-white text-[11px] sm:text-[12.5px] font-medium tracking-wide hover:bg-black transition-all shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewWork}
                className="min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D5CDC1] bg-white/80 text-[#121614] text-[11px] sm:text-[12.5px] font-medium tracking-wide hover:bg-white hover:border-[#121614] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                View Our Work
              </button>

              <button
                onClick={onFreeDemo}
                className="min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-full bg-[#E3ECE5] hover:bg-[#D5E3D8] text-[#1B3624] border border-[#B7C9BD] text-[11px] sm:text-[12.5px] font-semibold tracking-wide transition-all shadow-2xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-[#2D4536] transition-transform group-hover:rotate-12" />
                <span>Get Your Free Website Demo</span>
              </button>
            </div>

            {/* 4 Value Highlights: Completely fixed clipping so 'Content That Connects' is never clipped */}
            <div className="pt-3.5 sm:pt-4 lg:pt-6 border-t border-[#E8E1D5] grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3.5">
              {valueHighlights.map((badge) => {
                let Icon = Monitor;
                if (badge.iconName === 'layers') Icon = Layers;
                if (badge.iconName === 'zap') Icon = Zap;
                if (badge.iconName === 'bar-chart') Icon = TrendingUp;

                return (
                  <div key={badge.id} className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 min-w-0">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#2D4536] shrink-0">
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    </div>
                    <div className="leading-tight min-w-0 flex-1">
                      <p className="font-bold uppercase tracking-wider text-[#121614] text-[8.5px] sm:text-[9.5px] lg:text-[10.5px] whitespace-normal">
                        {badge.title}
                      </p>
                      <p className="text-[#687069] text-[7.5px] sm:text-[8.5px] lg:text-[9.5px] whitespace-normal">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop & Tablet Showcase Visual: Significantly enlarged by ~15-25% */}
          <div className="hidden md:block md:col-span-6 lg:col-span-7 relative">
            <div className="relative flex items-center justify-center lg:-mr-6 xl:-mr-10">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  maskImage: `
                    radial-gradient(ellipse 88% 84% at 50% 50%, black 58%, rgba(0,0,0,0.9) 74%, rgba(0,0,0,0.25) 90%, transparent 100%),
                    linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 6%, black 16%, black 88%, rgba(0,0,0,0.7) 96%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 6%, black 90%, transparent 100%)
                  `,
                  WebkitMaskImage: `
                    radial-gradient(ellipse 88% 84% at 50% 50%, black 58%, rgba(0,0,0,0.9) 74%, rgba(0,0,0,0.25) 90%, transparent 100%),
                    linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 6%, black 16%, black 88%, rgba(0,0,0,0.7) 96%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 6%, black 90%, transparent 100%)
                  `,
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              >
                <img
                  alt="Yugark Digital Studio multi-device mockup showcase: monitor, laptop and smartphone"
                  className="w-full h-auto object-cover transform scale-110 lg:scale-120 transition-transform duration-700 hover:scale-[1.22]"
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
