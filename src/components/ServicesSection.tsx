import React from 'react';
import { ArrowRight, Code, MessageSquare, Send, Zap, Palette } from 'lucide-react';
import { servicesData } from '../data/studioData';
import { ServiceItem } from '../types/content';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section className="py-14 sm:py-18 lg:py-22 bg-[#F4EFE6] border-y border-[#ECE5D9]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#707B71] uppercase mb-1">
              Our Services
            </p>
            <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-[42px] font-medium text-[#121614]">
              Complete Digital Solutions
            </h2>
          </div>
          <p className="text-xs text-[#6F766F] max-w-sm mt-2.5 md:mt-0 leading-relaxed">
            From websites to creative content and performance marketing, we help brands build, create and grow in the digital world.
          </p>
        </div>

        {/* 5 Service Columns: Highly compact on mobile, refined on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {servicesData.map((service) => {
            let Icon = Code;
            if (service.iconType === 'chat') Icon = MessageSquare;
            if (service.iconType === 'target') Icon = Send;
            if (service.iconType === 'sparkles') Icon = Zap;
            if (service.iconType === 'palette') Icon = Palette;

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-[#FAF7F2] p-4.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-[#E6DFD3] flex flex-col justify-between hover:border-[#2D4536]/40 hover:shadow-md transition-all duration-300 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 transition-transform group-hover:scale-105">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-serif-title text-base sm:text-lg font-medium text-[#121614] mb-1.5 sm:mb-2 leading-snug">
                    {service.lines.map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < service.lines.length - 1 && <br className="hidden sm:inline" />}{' '}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p className="text-xs text-[#6D746D] leading-relaxed mb-3 sm:mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="inline-flex items-center text-xs font-semibold tracking-wider text-[#2D4536] group-hover:text-black uppercase pt-1">
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
