import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { websiteDemosData as initialDemos } from '../data/studioData';
import { DemoItem } from '../types/content';
import { getFeaturedDemos } from '../lib/cms';

interface WebsiteDemosProps {
  onSelectDemo: (demo: DemoItem) => void;
  onViewAllDemos: () => void;
  demos?: DemoItem[];
}

export const WebsiteDemos: React.FC<WebsiteDemosProps> = ({
  onSelectDemo,
  onViewAllDemos,
  demos: propDemos,
}) => {
  const [demos, setDemos] = useState<DemoItem[]>(propDemos || initialDemos);

  useEffect(() => {
    if (propDemos) {
      setDemos(propDemos);
      return;
    }

    async function load() {
      const data = await getFeaturedDemos();
      if (data && data.length > 0) {
        setDemos(data);
      }
    }
    load();

    const handleUpdate = () => load();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, [propDemos]);

  return (
    <section className="py-7 sm:py-14 lg:py-20 bg-[#F8F6F1]" id="demos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: Left title with kicker, Right clean "View All Demos ->" link */}
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-[#E8E2D7]">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — Website Demos
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
              Ready-Made Website Demos
            </h2>
          </div>
          <div>
            <button
              onClick={onViewAllDemos}
              className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
            >
              <span>View All Demos</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Demos Grid: Adaptable responsive grid (up to 4 cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {demos.slice(0, 4).map((demo) => (
            <div
              key={demo.id}
              onClick={() => onSelectDemo(demo)}
              className="editorial-card group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-md sm:rounded-xl bg-[#EBE4D8] aspect-[16/10] mb-1 sm:mb-3 shadow-sm">
                  <img
                    alt={demo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={demo.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-md sm:rounded-xl ring-1 ring-inset ring-black/5" />
                </div>
                <div className="px-0.5">
                  <div className="flex items-center justify-between gap-0.5">
                    <h3 className="font-serif-title text-[11px] sm:text-sm lg:text-base font-semibold text-[#121614] truncate">
                      {demo.title}
                    </h3>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#121614] shrink-0" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-[#717871] truncate mt-0.5">
                    {demo.industry || demo.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
