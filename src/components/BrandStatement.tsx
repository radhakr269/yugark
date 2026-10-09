import React from 'react';
import { ArrowRight } from 'lucide-react';
import { brandStatement } from '../data/studioData';

interface BrandStatementProps {
  onLearnApproach: () => void;
}

export const BrandStatement: React.FC<BrandStatementProps> = ({ onLearnApproach }) => {
  return (
    <section
      id="about"
      className="hidden lg:block relative text-white py-16 lg:py-20 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgb(11, 34, 25) 0%, rgb(15, 46, 34) 55%, rgb(11, 30, 22) 100%)',
      }}
    >
      {/* Subtle understated atmospheric background with quiet dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(45, 69, 54, 0.45) 0%, rgba(15, 26, 20, 0.95) 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(#8AA795 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#A5C2B1] uppercase">
              {brandStatement.kicker}
            </p>
            <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#FAF9F5] leading-snug">
              {brandStatement.headline}
            </h2>
          </div>
          <div className="max-w-md space-y-4 sm:space-y-5 lg:text-left">
            <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#CBD8D0] font-light">
              {brandStatement.description}
            </p>
            <div>
              <button
                onClick={onLearnApproach}
                className="min-h-[44px] inline-flex items-center px-6 py-2.5 rounded-full border border-[#8AA795] text-white text-xs tracking-wider uppercase font-medium hover:bg-white hover:text-[#1B2E24] transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{brandStatement.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
