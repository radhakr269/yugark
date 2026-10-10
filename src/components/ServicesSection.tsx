import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { servicesData as initialServices } from '../data/studioData';
import { ServiceItem } from '../types/content';
import { getPublishedServices } from '../lib/cms';
import { CardCarousel } from './CardCarousel';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onViewAllServices?: () => void;
}

const serviceMeta: Record<
  string,
  {
    step: string;
    badge: string;
    ctaText: string;
    highlights: string[];
    visualType?: 'image';
    imageSrc?: string;
    imageAlt?: string;
  }
> = {
  'website-development': {
    step: '01',
    badge: 'Core Architecture',
    ctaText: 'Explore Service',
    highlights: ['Next-Gen Responsive Architecture', 'Sub-Second Page Performance'],
    visualType: 'image',
    imageSrc: '/assets/images/website devlopment.jpg',
    imageAlt: 'Custom website development and user experience engineering',
  },
  'social-media-management': {
    step: '02',
    badge: 'Content Strategy',
    ctaText: 'Explore Retainers',
    highlights: ['Narrative Brand Grid Layouts', 'Engagement & Audience Systems'],
    visualType: 'image',
    imageSrc: '/assets/images/content-and-social-media.jpg',
    imageAlt: 'Social media management and visual storytelling',
  },
  'social-media-advertising': {
    step: '03',
    badge: 'Paid Acquisition',
    ctaText: 'Explore Campaigns',
    highlights: ['Precision Meta & Google Targeting', 'High ROAS Conversion Funnels'],
    visualType: 'image',
    imageSrc: '/assets/images/business-pro.jpg',
    imageAlt: 'Targeted advertising and customer acquisition',
  },
  'ai-content-video': {
    step: '04',
    badge: 'Creative Engine',
    ctaText: 'Explore Creative',
    highlights: ['Studio-Grade Motion Graphics', 'Short-Form Reels & Story Scripts'],
    visualType: 'image',
    imageSrc: '/assets/images/Sole beauty.jpg',
    imageAlt: 'AI content creation and high-end promotional video',
  },
  'digital-growth-strategy': {
    step: '05',
    badge: 'Strategic Direction',
    ctaText: 'Explore Strategy',
    highlights: ['360° Digital Footprint Audit', 'Multi-Channel Acquisition Roadmaps'],
    visualType: 'image',
    imageSrc: '/assets/images/aurora-living.jpg',
    imageAlt: 'Digital growth strategy and brand architecture',
  },
  'branding': {
    step: '05',
    badge: 'Identity System',
    ctaText: 'Explore Strategy',
    highlights: ['Refined Typography & Color Tokens', 'Cohesive Digital Guidelines'],
    visualType: 'image',
    imageSrc: '/assets/images/aurora-living.jpg',
    imageAlt: 'Digital growth strategy and brand architecture',
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, onViewAllServices }) => {
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-7 pb-2 border-b border-[#E4DDD1] gap-2">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — Our Disciplines
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[40px] font-medium text-[#121614] leading-tight">
              Our Services
            </h2>
            <p className="text-xs sm:text-sm text-[#677067] max-w-xl mt-1 leading-relaxed">
              From websites and creative content to online advertising, discover solutions for your business.
            </p>
          </div>
          {onViewAllServices && (
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={onViewAllServices}
                className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
              >
                <span>Explore All Services</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Services Carousel: up to 5 compact cards on desktop, peek on mobile & tablet */}
        <CardCarousel
          preset="services"
          ariaLabel="Our Studio Services"
          autoScroll={true}
          autoScrollInterval={5500}
          showControls={true}
          showDots={true}
          controlsPosition="bottom"
        >
          {services.map((service) => {
            const meta = serviceMeta[service.slug] || {
              step: '01',
              badge: 'Specialized Discipline',
              ctaText: 'Learn More',
              highlights: service.features?.slice(0, 2) || ['Bespoke Execution', 'Performance Optimization'],
              visualType: 'image' as const,
              imageSrc: '/assets/images/website devlopment.jpg',
              imageAlt: service.title,
            };

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-[#FAF7F2] rounded-xl sm:rounded-2xl border border-[#E6DFD3] flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_30px_-10px_rgba(25,40,30,0.18)] hover:border-[#2D4536]/70 h-full"
              >
                <div>
                  {/* Service Visual Header: Real photographic assets with step badge */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE5D9] border-b border-[#E6DFD3]">
                    {meta.imageSrc ? (
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          src={meta.imageSrc}
                          alt={meta.imageAlt || service.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[#1A2621] p-3 text-white flex flex-col justify-between">
                        <span className="text-xs font-mono">{meta.badge}</span>
                      </div>
                    )}

                    {/* Pinned Step Indicator */}
                    <div className="absolute top-2 right-2 z-20">
                      <span className="inline-block px-1.5 py-0.5 rounded-md bg-[#121614]/85 text-white backdrop-blur-xs font-mono text-[9px] font-bold tracking-wider">
                        {meta.step}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Compact, readable, professional hierarchy */}
                  <div className="p-3 sm:p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider bg-[#EBE4D8] text-[#4F5B51]">
                          {meta.badge}
                        </span>
                      </div>

                      <h3 className="font-serif-title text-[14px] sm:text-[15px] font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors leading-snug mb-1">
                        {service.lines ? service.lines.join(' ') : service.title}
                      </h3>

                      <p className="text-[10.5px] text-[#636C64] leading-relaxed mb-2 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Visual Bullet Points */}
                      <ul className="space-y-1 mb-2 pt-1 border-t border-[#ECE5D9]/70">
                        {meta.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[9px] sm:text-[9.5px] text-[#4E564F]">
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#2D4536] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Link */}
                    <div className="pt-2 mt-1 border-t border-[#ECE5D9] flex items-center justify-between text-[9.5px] sm:text-[10px] font-semibold tracking-wider text-[#2D4536] group-hover:text-black uppercase">
                      <span>{meta.ctaText || 'Learn More'}</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
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
