import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, MessageSquare, Send, Zap, Palette } from 'lucide-react';
import { servicesData as initialServices } from '../data/studioData';
import { ServiceItem } from '../types/content';
import { getPublishedServices } from '../lib/cms';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

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
    <section className="py-7 sm:py-14 lg:py-20 bg-[#F4EFE6] border-y border-[#ECE5D9]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4 sm:mb-8 pb-1 border-b border-transparent">
          <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#707B71] uppercase mb-0.5 sm:mb-1">
            — Our Services
          </p>
          <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
            Complete Digital Solutions
          </h2>
        </div>

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-5">
          {services.map((service) => {
            let Icon = Code;
            if (service.iconType === 'chat') Icon = MessageSquare;
            if (service.iconType === 'target') Icon = Send;
            if (service.iconType === 'sparkles') Icon = Zap;
            if (service.iconType === 'palette') Icon = Palette;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-[#FAF7F2] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#E6DFD3] flex flex-col justify-between hover:border-[#2D4536]/40 hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:scale-105">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-serif-title text-sm sm:text-base lg:text-lg font-medium text-[#121614] mb-1 sm:mb-2 leading-tight">
                    {service.lines ? service.lines.join(' ') : service.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6D746D] leading-relaxed mb-3 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="inline-flex items-center text-xs font-semibold tracking-wider text-[#2D4536] group-hover:text-black uppercase pt-1">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
