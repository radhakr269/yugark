import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { websiteDemosData as initialDemos } from '../data/studioData';
import { DemoItem } from '../types/content';
import { getFeaturedDemos } from '../lib/cms';
import { CardCarousel } from './CardCarousel';

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
    <section className="py-6 sm:py-10 lg:py-14 bg-[#F8F6F1]" id="demos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: Left title with kicker, Right clean "View All Demos ->" link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-[#E8E2D7] gap-2">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — Website Demos
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
              Explore Website Demos
            </h2>
            <p className="text-xs sm:text-sm text-[#5A635C] mt-1 max-w-xl leading-relaxed">
              See ready-to-customize website designs for different businesses.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onViewAllDemos}
              className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
            >
              <span>View All Demos</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Website Demos Horizontal Carousel */}
        <CardCarousel
          preset="demos"
          ariaLabel="Website Demos Carousel"
          autoScroll={true}
          autoScrollInterval={5000}
          showControls={true}
          showDots={true}
          controlsPosition="bottom"
        >
          {demos.map((demo) => {
            const isPorwal = Boolean(
              (demo.slug && demo.slug.toLowerCase().includes('porwal')) ||
              (demo.title && demo.title.toLowerCase().includes('porwal')) ||
              (demo.title && demo.title.toLowerCase().includes('gautam'))
            );
            const liveUrl = isPorwal ? 'https://dr-gautam-porwal.vercel.app/' : (demo.liveDemoUrl || '#');

            return (
              <div
                key={demo.id}
                className="editorial-card group flex flex-col justify-between h-full bg-[#FAF7F2] rounded-lg sm:rounded-xl p-2 sm:p-2.5 border border-[#ECE5D9] shadow-2xs hover:shadow-md transition-all"
              >
                <div>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden rounded-md sm:rounded-lg bg-[#EBE4D8] aspect-[16/10] mb-1.5 sm:mb-2.5 shadow-2xs group/img"
                    title={`View live website for ${demo.title}`}
                  >
                    <img
                      alt={demo.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      src={demo.image}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-md sm:rounded-lg ring-1 ring-inset ring-black/5" />
                  </a>
                  <div className="px-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif-title text-[11px] sm:text-sm lg:text-[15px] font-semibold text-[#121614] hover:text-[#2D4536] truncate leading-snug flex items-center gap-1 group/title"
                      >
                        <span className="truncate">{demo.title}</span>
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#121614] shrink-0 transition-transform group-hover/title:translate-x-0.5" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-[9px] sm:text-[10px] text-[#717871] truncate">
                        {demo.industry || demo.category}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectDemo(demo);
                        }}
                        className="text-[9.5px] text-[#2D4536] hover:underline font-medium shrink-0 px-1.5 py-0.5 rounded bg-[#EFE9DF]/80 hover:bg-[#EFE9DF] cursor-pointer"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardCarousel>
      </div>
    </section>
  );
};
