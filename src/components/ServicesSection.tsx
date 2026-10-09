import React from 'react';
import { ArrowRight, Code, MessageSquare, Send, Zap, Palette } from 'lucide-react';
import { servicesData } from '../data/studioData';
import { ServiceItem } from '../types/content';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
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

        {/* 
          Services Row: In image.png mobile reference, 4 cards are displayed side-by-side:
          Website Development, Social Media, Ads, Branding.
          On desktop: displays all 5 columns.
        */}
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3 lg:gap-5">
          {servicesData.map((service, index) => {
            let Icon = Code;
            if (service.iconType === 'chat') Icon = MessageSquare;
            if (service.iconType === 'target') Icon = Send;
            if (service.iconType === 'sparkles') Icon = Zap;
            if (service.iconType === 'palette') Icon = Palette;

            // In 4-column mobile view matching image.png, AI Creative is visible on larger screens
            const isFifthOnMobile = index === 3; // AI Creative

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className={`bg-[#FAF7F2] p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-2xl border border-[#E6DFD3] flex flex-col justify-between hover:border-[#2D4536]/40 hover:shadow-md transition-all duration-300 cursor-pointer group ${
                  isFifthOnMobile ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div>
                  <div className="w-6 h-6 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mb-1.5 sm:mb-3 lg:mb-5 transition-transform group-hover:scale-105">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <h3 className="font-serif-title text-[9.5px] sm:text-base lg:text-lg font-medium text-[#121614] mb-1 sm:mb-2 leading-tight">
                    {service.lines.map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < service.lines.length - 1 && <br className="hidden sm:inline" />}{' '}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p className="text-[7.5px] sm:text-xs text-[#6D746D] leading-snug sm:leading-relaxed mb-2 sm:mb-3 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="inline-flex items-center text-[7.5px] sm:text-xs font-semibold tracking-wider text-[#2D4536] group-hover:text-black uppercase pt-0.5">
                  <span>Learn More</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
