import React from 'react';
import { ArrowRight } from 'lucide-react';
import { websiteDemosData } from '../data/studioData';
import { DemoItem } from '../types/content';

interface WebsiteDemosProps {
  onSelectDemo: (demo: DemoItem) => void;
  onViewAllDemos: () => void;
}

export const WebsiteDemos: React.FC<WebsiteDemosProps> = ({
  onSelectDemo,
  onViewAllDemos,
}) => {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#F8F6F1]" id="demos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-[#E8E2D7]">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              Website Demos
            </p>
            <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-[42px] font-medium text-[#121614]">
              Ready-Made Website Demos
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-4 sm:gap-6">
            <p className="text-xs text-[#70786F] max-w-xs hidden md:block">
              Explore our premium website demos, designed for different industries and business needs.
            </p>
            <button
              onClick={onViewAllDemos}
              className="min-h-[40px] inline-flex items-center px-4 sm:px-5 py-2 rounded-full border border-[#CDC4B6] text-xs font-semibold tracking-wider text-[#121614] hover:border-black transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            >
              <span>View All Demos</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* 4 Demos Grid (Responsive: 1-col on small mobile, 2-col on sm/md, 4-col on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {websiteDemosData.map((demo) => (
            <div
              key={demo.id}
              onClick={() => onSelectDemo(demo)}
              className="editorial-card group cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536] rounded-xl"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl bg-[#EBE4D8] aspect-[16/10] mb-3 sm:mb-4 shadow-sm">
                  <img
                    alt={demo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={demo.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/5" />
                </div>
                <div className="flex items-center justify-between gap-2 px-0.5">
                  <div>
                    <h3 className="font-serif-title text-base sm:text-lg font-semibold text-[#121614]">
                      {demo.title}
                    </h3>
                    <p className="text-[11px] text-[#717871]">
                      {demo.industry}
                    </p>
                  </div>
                  <div className="min-h-[36px] inline-flex items-center text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#D3C9BD] group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                    <span>Live Demo</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
