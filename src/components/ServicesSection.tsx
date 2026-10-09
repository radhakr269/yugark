import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, MessageSquare, Send, Zap, Palette, CheckCircle2, TrendingUp, Sparkles, Layers, Sliders } from 'lucide-react';
import { servicesData as initialServices } from '../data/studioData';
import { ServiceItem } from '../types/content';
import { getPublishedServices } from '../lib/cms';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

const serviceMeta: Record<
  string,
  {
    step: string;
    badge: string;
    highlights: string[];
    visualType: 'image' | 'ads_ui' | 'ai_ui' | 'branding_ui';
    imageSrc?: string;
    imageAlt?: string;
  }
> = {
  'website-development': {
    step: '01',
    badge: 'Digital Flagships',
    highlights: ['Custom React & Vite Architecture', 'Sub-Second Core Web Vitals'],
    visualType: 'image',
    imageSrc: '/assets/images/website devlopment.jpg',
    imageAlt: 'Modern multi-device website interface on desktop and mobile',
  },
  'social-media': {
    step: '02',
    badge: 'Authority & Reach',
    highlights: ['Monthly Editorial Roadmaps', 'High-Fidelity Visual Assets'],
    visualType: 'image',
    imageSrc: '/assets/images/content-and-social-media.jpg',
    imageAlt: 'Editorial social media content and brand visuals showcase',
  },
  'ads': {
    step: '03',
    badge: 'Conversion Engine',
    highlights: ['Meta & Google Campaign Testing', 'Attribution & ROAS Auditing'],
    visualType: 'ads_ui',
  },
  'ai-creative': {
    step: '04',
    badge: 'Speed Advantage',
    highlights: ['Brand-Trained Prompt Pipelines', 'Rapid Concept Visualization'],
    visualType: 'ai_ui',
  },
  'branding': {
    step: '05',
    badge: 'Identity System',
    highlights: ['Refined Typography & Color Tokens', 'Cohesive Digital Guidelines'],
    visualType: 'branding_ui',
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);

  useEffect(() => {
    async function load() {
      const data = await getPublishedServices();
      if (data && data.length > 0) {
        setServices(data);
      }
    }
    load();

    const handleUpdate = () => load();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-[#F4EFE6] border-y border-[#ECE5D9]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 sm:mb-7 pb-2 border-b border-[#E4DDD1]">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — Our Disciplines
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[40px] font-medium text-[#121614] leading-tight">
              Complete Digital Solutions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#677067] max-w-md mt-1.5 sm:mt-0 leading-relaxed">
            Five tailored creative and technical disciplines engineered to elevate brand reputation and convert visitors.
          </p>
        </div>

        {/* Dynamic Services Grid with Premium Visuals & 3D Micro-Interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5 [perspective:1200px]">
          {services.map((service) => {
            let Icon = Code;
            if (service.iconType === 'chat') Icon = MessageSquare;
            if (service.iconType === 'target') Icon = Send;
            if (service.iconType === 'sparkles') Icon = Zap;
            if (service.iconType === 'palette') Icon = Palette;

            const meta = serviceMeta[service.slug] || {
              step: '01',
              badge: 'Specialized Discipline',
              highlights: service.features?.slice(0, 2) || ['Bespoke Execution', 'Performance Optimization'],
              visualType: 'image' as const,
              imageSrc: '/assets/images/website devlopment.jpg',
              imageAlt: service.title,
            };

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-[#FAF7F2] rounded-2xl border border-[#E6DFD3] flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_35px_-12px_rgba(25,40,30,0.22)] hover:border-[#2D4536]/80 hover:ring-1 hover:ring-[#2D4536]/20 [transform-style:preserve-3d] hover:[transform:perspective(900px)_rotateX(2deg)_translateY(-6px)]"
              >
                <div>
                  {/* Service Visual Presentation Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE5D9] border-b border-[#E6DFD3]">
                    {/* 1. Website Development: Multi-device interface */}
                    {meta.visualType === 'image' && meta.imageSrc && (
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          src={meta.imageSrc}
                          alt={meta.imageAlt || service.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      </div>
                    )}

                    {/* 2. Ads: Advertising Campaign & Performance Visual */}
                    {meta.visualType === 'ads_ui' && (
                      <div className="w-full h-full bg-[#1A2621] p-3 text-white flex flex-col justify-between relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-102">
                        {/* Subtle background graph grid */}
                        <div
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{
                            backgroundImage: 'radial-gradient(#8EA396 1px, transparent 1px)',
                            backgroundSize: '12px 12px',
                          }}
                        />

                        {/* Top metric badge & platform tags */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#2D4536] border border-[#3E5C49] text-[8.5px] font-mono text-[#D7E8DC] font-semibold">
                            <TrendingUp className="w-2.5 h-2.5 text-[#5AE48B]" />
                            <span>ROAS 4.8x</span>
                          </span>
                          <span className="text-[8px] font-mono tracking-wider text-[#A2B5A8] uppercase">
                            Meta & Google
                          </span>
                        </div>

                        {/* Performance bar chart preview */}
                        <div className="relative z-10 space-y-1 my-auto">
                          <div className="flex items-center justify-between text-[8px] text-[#CAD6CE]">
                            <span>Campaign Reach</span>
                            <span className="font-mono text-[#5AE48B] font-bold">+164%</span>
                          </div>
                          <div className="w-full h-2 bg-[#121A16] rounded-full overflow-hidden p-0.5 border border-[#2A3C31]">
                            <div className="h-full bg-gradient-to-r from-[#2D4536] via-[#487358] to-[#5AE48B] rounded-full w-[82%]" />
                          </div>
                          <div className="flex justify-between items-center text-[7.5px] font-mono text-[#8C9C90] pt-0.5">
                            <span>Imp: 240k</span>
                            <span>CTR: 3.4%</span>
                            <span>CPA: -28%</span>
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between text-[7.5px] font-mono text-[#86998C] border-t border-[#2A3E31] pt-1">
                          <span>Targeting Matrix</span>
                          <span className="text-[#CAD6CE]">Active</span>
                        </div>
                      </div>
                    )}

                    {/* 3. AI Creative: Premium AI-powered creative composition */}
                    {meta.visualType === 'ai_ui' && (
                      <div className="w-full h-full bg-[#18211D] p-3 text-white flex flex-col justify-between relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-102">
                        {/* Glow halo */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-[#2D4536] blur-xl opacity-60" />
                        <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-[#9B8053] blur-xl opacity-30" />

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#27382F] border border-[#3A5245] text-[8.5px] font-mono text-[#E4F0E8] font-semibold">
                            <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
                            <span>Generative Node</span>
                          </span>
                          <span className="text-[8px] font-mono text-[#A2B3A7]">Diffusion v2</span>
                        </div>

                        {/* Visual Creative Layers Node Box */}
                        <div className="relative z-10 bg-[#121915]/80 backdrop-blur-xs border border-[#2B3F34] rounded-lg p-1.5 space-y-1 my-auto shadow-inner">
                          <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-[#D7E4DC]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5AE48B] animate-pulse" />
                            <span className="truncate">prompt: luxury-editorial-render</span>
                          </div>
                          <div className="h-4 rounded bg-gradient-to-r from-[#21372B] via-[#4F6C5A] to-[#A88C5E] opacity-90 flex items-center px-1.5 text-[7px] font-mono text-white justify-between">
                            <span>Latent Space</span>
                            <span>4K Render</span>
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between text-[7.5px] font-mono text-[#86998C] border-t border-[#2A3E31] pt-1">
                          <span>Brand-Trained Lora</span>
                          <span className="text-[#C9A96E]">Loss: 0.012</span>
                        </div>
                      </div>
                    )}

                    {/* 4. Branding: Identity, logo and brand system presentation */}
                    {meta.visualType === 'branding_ui' && (
                      <div className="w-full h-full bg-[#F3ECE0] p-3 text-[#121614] flex flex-col justify-between relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-102">
                        {/* Header with step */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#E4DACB] border border-[#D5C9B7] text-[8.5px] font-mono text-[#38483D] font-bold uppercase">
                            <Palette className="w-2.5 h-2.5 text-[#2D4536]" />
                            <span>Design Tokens</span>
                          </span>
                          <span className="text-[8px] font-mono text-[#6E7C72]">Identity v2</span>
                        </div>

                        {/* Typography & Geometry Specimen */}
                        <div className="relative z-10 flex items-center justify-between my-auto bg-white/70 backdrop-blur-xs p-1.5 rounded-lg border border-[#DDD3C2]">
                          <div className="leading-tight">
                            <span className="font-serif-title text-xl font-bold text-[#1A2621]">
                              Aa
                            </span>
                            <span className="block text-[7.5px] font-mono text-[#5C6B60] uppercase">
                              Garamond / Serif
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#1A2621] border border-black/10 shadow-2xs" title="#1A2621 Deep Forest" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#2D4536] border border-black/10 shadow-2xs" title="#2D4536 Pine" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#C5A880] border border-black/10 shadow-2xs" title="#C5A880 Bronze" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border border-[#D5C9B7] shadow-2xs" title="#FAF7F2 Warm Ivory" />
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between text-[7.5px] font-mono text-[#5E6D62] border-t border-[#DDD3C2] pt-1">
                          <span>Vector Guidelines</span>
                          <span className="font-semibold text-[#1A2621]">100% Scalable</span>
                        </div>
                      </div>
                    )}

                    {/* Step tag pinned to top-right of visual */}
                    <div className="absolute top-2 right-2 z-20">
                      <span className="inline-block px-1.5 py-0.5 rounded-md bg-[#121614]/85 text-white backdrop-blur-xs font-mono text-[9px] font-bold tracking-wider">
                        {meta.step}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-4.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-[#EBE4D8] text-[#4F5B51]">
                          {meta.badge}
                        </span>
                      </div>

                      <h3 className="font-serif-title text-base sm:text-lg font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors leading-snug mb-1.5">
                        {service.lines ? service.lines.join(' ') : service.title}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-[#636C64] leading-relaxed mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Visual Bullet Points */}
                      <ul className="space-y-1 mb-2 pt-1 border-t border-[#ECE5D9]/70">
                        {meta.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[10px] text-[#4E564F]">
                            <CheckCircle2 className="w-3 h-3 text-[#2D4536] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Learn More Action Button */}
                    <div className="pt-2.5 mt-2 border-t border-[#ECE5D9] flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#2D4536] group-hover:text-black uppercase">
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
