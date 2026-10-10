import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Monitor, Layers, Zap, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { siteConfig, valueHighlights } from '../data/studioData';
import { adminCmsApi } from '../lib/cms';

interface HeroSectionProps {
  onStartProject: () => void;
  onViewWork: () => void;
  onFreeDemo: () => void;
}

interface HeroMessageState {
  eyebrow: string;
  headline: string;
  supportingText: string;
  labels: string[];
}

const DEFAULT_HERO_STATES: HeroMessageState[] = [
  {
    eyebrow: 'DIGITAL STUDIO FOR MODERN BRANDS',
    headline: 'We Build.',
    supportingText:
      'Premium websites and smart digital systems that help your business make a lasting impression.',
    labels: ['Business Websites', 'Landing Pages', 'Lead Management'],
  },
  {
    eyebrow: 'CREATIVE CONTENT THAT CONNECTS',
    headline: 'We Create.',
    supportingText:
      'Engaging videos, social media content and brand creatives that make your business stand out.',
    labels: ['Promotional Videos', 'Social Media', 'Brand Creatives'],
  },
  {
    eyebrow: 'STRATEGY FOR BUSINESS GROWTH',
    headline: 'We Grow Brands.',
    supportingText:
      'Targeted advertising and digital strategies that help your business reach more customers.',
    labels: ['Meta & Google Ads', 'Content Strategy', 'Digital Growth'],
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartProject,
  onViewWork,
  onFreeDemo,
}) => {
  const [heroStates, setHeroStates] = useState<HeroMessageState[]>(DEFAULT_HERO_STATES);
  const [heroImage, setHeroImage] = useState<string>(siteConfig.heroImage || '/assets/images/hero.jpg');
  const [ctaLabels, setCtaLabels] = useState({
    primary: 'Start Project',
    secondary: 'View Our Work',
    demo: 'Get Your Free Website Demo',
  });
  const [currentState, setCurrentState] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Load dynamic CMS hero configuration
  useEffect(() => {
    async function loadHeroConfig() {
      try {
        const config = await adminCmsApi.getHeroSettings();
        if (config?.heroStates && Array.isArray(config.heroStates) && config.heroStates.length > 0) {
          setHeroStates(config.heroStates);
        }
        if (config?.heroImage) {
          setHeroImage(config.heroImage);
        }
        if (config?.ctaPrimaryText) {
          setCtaLabels({
            primary: config.ctaPrimaryText,
            secondary: config.ctaSecondaryText || 'View Our Work',
            demo: config.ctaDemoText || 'Get Your Free Website Demo',
          });
        }
      } catch (err) {
        console.warn('Fallback to default hero state:', err);
      }
    }

    loadHeroConfig();

    const handleCmsUpdate = () => loadHeroConfig();
    window.addEventListener('yugark-cms-updated', handleCmsUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleCmsUpdate);
  }, []);

  // IntersectionObserver to pause rotation when section is off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Visibility change to pause rotation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Automatic rotation: 3.8s per slide (smooth reading duration)
  useEffect(() => {
    if (isPaused || !isVisible || heroStates.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % heroStates.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, isVisible, heroStates.length]);

  const activeMsg = heroStates[currentState % heroStates.length] || DEFAULT_HERO_STATES[0];

  return (
    <section
      ref={sectionRef}
      className="relative pt-3 pb-6 sm:pt-6 sm:pb-9 lg:pt-10 lg:pb-14 overflow-hidden bg-[#F8F6F1]"
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background is clean warm ivory; visual composition is fully responsive with zero text overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* MOBILE HERO VIEW (strictly < md screens): Text on LEFT, feathered workspace image on upper RIGHT */}
        <div className="block md:hidden">
          {/* Top Split Row: Left Animated Copy & Right Feathered Visual */}
          <div className="flex items-start justify-between gap-2 xs:gap-3 mb-2.5 xs:mb-3">
            {/* Left: Animated Copy */}
            <div className="flex-1 min-w-0 pr-1 xs:pr-2">
              {/* Eyebrow */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="inline-flex items-center space-x-1.5 text-[8.5px] xs:text-[9.5px] font-semibold tracking-[0.2em] text-[#556358] uppercase">
                  <span className="w-3.5 h-[1.5px] bg-[#556358]" />
                  <span
                    key={`m-eyebrow-${currentState}`}
                    className="transition-all duration-500 ease-out animate-fadeIn"
                  >
                    {activeMsg.eyebrow}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div className="min-h-[52px] xs:min-h-[58px] flex items-center mb-1 xs:mb-1.5 overflow-hidden">
                <h1
                  key={`m-headline-${currentState}`}
                  className="font-serif-title text-[21px] xs:text-[24px] sm:text-[26px] leading-[1.08] text-[#121614] font-medium tracking-tight transition-all duration-700 ease-out"
                  style={{
                    animation: 'heroSlideFade 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  {activeMsg.headline.includes('Grow') ? (
                    <>
                      We{' '}
                      <span className="italic font-normal text-[#2D4536]">
                        Grow Brands.
                      </span>
                    </>
                  ) : (
                    activeMsg.headline
                  )}
                </h1>
              </div>

              {/* Supporting Text */}
              <div className="min-h-[40px] xs:min-h-[44px] flex items-start">
                <p
                  key={`m-support-${currentState}`}
                  className="text-[#555C56] text-[10.5px] xs:text-[11.5px] leading-[1.36] font-normal transition-all duration-600 ease-out line-clamp-3"
                  style={{
                    animation: 'heroFade 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  {activeMsg.supportingText}
                </p>
              </div>
            </div>

            {/* Upper Right: Significantly Enlarged Workspace Image (1.8–2.2x) with Four-Sided Feather Mask */}
            <div className="w-[46%] xs:w-[49%] sm:w-[50%] max-w-[240px] shrink-0 pt-0.5">
              <div
                className="relative w-full aspect-[4/3] xs:aspect-[15/11] overflow-hidden flex items-center justify-center pointer-events-none select-none"
                style={{
                  maskImage: `
                    radial-gradient(ellipse 90% 86% at 50% 50%, black 58%, rgba(0,0,0,0.85) 76%, rgba(0,0,0,0.2) 92%, transparent 100%),
                    linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 4%, black 14%, black 86%, rgba(0,0,0,0.7) 96%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 4%, black 14%, black 86%, rgba(0,0,0,0.7) 96%, transparent 100%)
                  `,
                  WebkitMaskImage: `
                    radial-gradient(ellipse 90% 86% at 50% 50%, black 58%, rgba(0,0,0,0.85) 76%, rgba(0,0,0,0.2) 92%, transparent 100%),
                    linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 4%, black 14%, black 86%, rgba(0,0,0,0.7) 96%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 4%, black 14%, black 86%, rgba(0,0,0,0.7) 96%, transparent 100%)
                  `,
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              >
                <img
                  alt="Yugark Digital Studio workspace showcase"
                  className="w-full h-full object-cover object-center transform scale-115"
                  src={heroImage}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Badges / Labels for Active State */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5 xs:mb-3">
            {activeMsg.labels.map((lbl, idx) => (
              <span
                key={`m-${currentState}-lbl-${idx}`}
                className="inline-flex items-center text-[9.5px] font-medium text-[#2D4536] bg-[#EAE3D6]/70 border border-[#DBD2C3] px-2 py-0.5 rounded-full"
              >
                {lbl}
              </span>
            ))}
          </div>

          {/* Interactive State Indicators (01, 02, 03) */}
          <div
            className="flex items-center gap-2 mb-3 xs:mb-3.5"
            role="tablist"
            aria-label="Hero message state selector"
          >
            {heroStates.map((state, idx) => {
              const isActive = idx === currentState;
              return (
                <button
                  key={`m-tab-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Switch to ${state.headline}`}
                  onClick={() => setCurrentState(idx)}
                  className="group flex items-center gap-1.5 py-1 px-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D4536] rounded"
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'w-7 bg-[#2D4536]'
                        : 'w-2 bg-[#D4CBC0] hover:bg-[#A9A094]'
                    }`}
                  />
                  <span
                    className={`text-[9.5px] font-mono tracking-wider transition-colors duration-300 ${
                      isActive
                        ? 'text-[#1B2E24] font-semibold'
                        : 'text-[#8C968E] group-hover:text-[#4A544C]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 mb-3.5 xs:mb-4">
            <button
              onClick={onStartProject}
              className="min-h-[38px] inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#1A2621] text-white text-[11px] font-medium tracking-wide hover:bg-black transition-all shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            >
              <span>{ctaLabels.primary}</span>
              <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onViewWork}
              className="min-h-[38px] inline-flex items-center justify-center px-3.5 py-2 rounded-full border border-[#D5CDC1] bg-white/80 text-[#121614] text-[11px] font-medium tracking-wide hover:bg-white hover:border-[#121614] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            >
              {ctaLabels.secondary}
            </button>

            <button
              onClick={onFreeDemo}
              className="min-h-[38px] inline-flex items-center justify-center px-3.5 py-2 rounded-full bg-[#E3ECE5] hover:bg-[#D5E3D8] text-[#1B3624] border border-[#B7C9BD] text-[11px] font-semibold tracking-wide transition-all shadow-2xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            >
              <Sparkles className="w-3 h-3 mr-1 text-[#2D4536] transition-transform group-hover:rotate-12" />
              <span>{ctaLabels.demo}</span>
            </button>
          </div>

          {/* 4 Value Highlights for Mobile */}
          <div className="pt-3 border-t border-[#E8E1D5] grid grid-cols-2 gap-2">
            {valueHighlights.map((badge) => {
              let Icon = Monitor;
              if (badge.iconName === 'layers') Icon = Layers;
              if (badge.iconName === 'zap') Icon = Zap;
              if (badge.iconName === 'bar-chart') Icon = TrendingUp;

              return (
                <div key={`m-${badge.id}`} className="flex items-center gap-1.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#2D4536] shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="leading-tight min-w-0 flex-1">
                    <p className="font-bold uppercase tracking-wider text-[#121614] text-[8.5px] whitespace-normal">
                      {badge.title}
                    </p>
                    <p className="text-[#687069] text-[7.5px] whitespace-normal">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP & TABLET HERO VIEW (md: and above) — COMPLETELY PRESERVED */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left: Dynamic Animated Copy with Fixed Stable Container Heights */}
          <div className="md:col-span-6 lg:col-span-5 z-10">
            {/* Eyebrow with Animated Pill Indicator */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#556358] uppercase">
                <span className="w-3.5 sm:w-5 h-[1.5px] bg-[#556358]" />
                <span
                  key={`eyebrow-${currentState}`}
                  className="transition-all duration-500 ease-out animate-fadeIn"
                >
                  {activeMsg.eyebrow}
                </span>
              </div>
            </div>

            {/* Main Headline: Exactly ONE headline visible at a time with smooth reveal */}
            <div className="min-h-[52px] sm:min-h-[64px] lg:min-h-[76px] xl:min-h-[84px] flex items-center mb-2 sm:mb-3 overflow-hidden">
              <h1
                key={`headline-${currentState}`}
                className="font-serif-title text-[32px] sm:text-[44px] md:text-[42px] lg:text-[54px] xl:text-[60px] leading-[1.05] text-[#121614] font-medium tracking-tight transition-all duration-700 ease-out transform translate-y-0 opacity-100"
                style={{
                  animation: 'heroSlideFade 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                {activeMsg.headline.includes('Grow') ? (
                  <>
                    We{' '}
                    <span className="italic font-normal text-[#2D4536]">
                      Grow Brands.
                    </span>
                  </>
                ) : (
                  activeMsg.headline
                )}
              </h1>
            </div>

            {/* Supporting Text: Stable min-height to prevent layout jumping */}
            <div className="min-h-[46px] sm:min-h-[52px] lg:min-h-[56px] flex items-start mb-3 sm:mb-4">
              <p
                key={`support-${currentState}`}
                className="text-[#555C56] text-[12.5px] sm:text-[14px] lg:text-[15px] leading-relaxed max-w-[290px] xs:max-w-xs sm:max-w-md lg:max-w-lg font-normal transition-all duration-600 ease-out"
                style={{
                  animation: 'heroFade 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                {activeMsg.supportingText}
              </p>
            </div>

            {/* Small Supporting Labels / Badges for active state */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {activeMsg.labels.map((lbl, idx) => (
                <span
                  key={`${currentState}-lbl-${idx}`}
                  className="inline-flex items-center text-[10px] sm:text-[11px] font-medium text-[#2D4536] bg-[#EAE3D6]/70 border border-[#DBD2C3] px-2.5 py-0.5 rounded-full backdrop-blur-xs transition-all duration-500"
                >
                  {lbl}
                </span>
              ))}
            </div>

            {/* Interactive State Indicators / Progress Controls */}
            <div
              className="flex items-center gap-2 mb-4 sm:mb-5"
              role="tablist"
              aria-label="Hero message state selector"
            >
              {heroStates.map((state, idx) => {
                const isActive = idx === currentState;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Switch to ${state.headline}`}
                    onClick={() => setCurrentState(idx)}
                    className="group flex items-center gap-1.5 py-1 px-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D4536] rounded"
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'w-7 sm:w-9 bg-[#2D4536]'
                          : 'w-2 sm:w-2.5 bg-[#D4CBC0] hover:bg-[#A9A094]'
                      }`}
                    />
                    <span
                      className={`text-[9.5px] font-mono tracking-wider transition-colors duration-300 ${
                        isActive
                          ? 'text-[#1B2E24] font-semibold'
                          : 'text-[#8C968E] group-hover:text-[#4A544C]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Triple Call to Actions: Start Project, View Our Work, and Get Your Free Website Demo */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5 sm:pt-1">
              <button
                onClick={onStartProject}
                className="min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#1A2621] text-white text-[11px] sm:text-[12.5px] font-medium tracking-wide hover:bg-black transition-all shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <span>{ctaLabels.primary}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewWork}
                className="min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D5CDC1] bg-white/80 text-[#121614] text-[11px] sm:text-[12.5px] font-medium tracking-wide hover:bg-white hover:border-[#121614] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                {ctaLabels.secondary}
              </button>

              <button
                onClick={onFreeDemo}
                className="min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-full bg-[#E3ECE5] hover:bg-[#D5E3D8] text-[#1B3624] border border-[#B7C9BD] text-[11px] sm:text-[12.5px] font-semibold tracking-wide transition-all shadow-2xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-[#2D4536] transition-transform group-hover:rotate-12" />
                <span>{ctaLabels.demo}</span>
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

          {/* Desktop & Tablet Showcase Visual: Dominant right workspace image with seamless mask */}
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
                  src={heroImage}
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
