import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Code, MessageSquare, Send, Zap, Palette, CheckCircle, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedServices } from '../lib/cms';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    async function loadServices() {
      const data = await getPublishedServices();
      setServices(data);
    }
    loadServices();
  }, []);

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-24">
      <SEOHead
        title="Complete Digital Solutions & Services"
        description="Explore Yugark Digital Studio's 5 core disciplines: Website Development, Social Media, Ads, AI Creative, and Branding."
        canonicalPath="/services"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-20">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Studio Capabilities
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4 sm:mb-6">
            Complete Digital Solutions for Modern Brands.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            We operate at the intersection of bespoke design, clean code, and strategic growth.
            From high-converting web architecture to brand identity and performance campaigns,
            every service is built for commercial durability.
          </p>
        </div>

        {/* Services List / Cards */}
        <div className="space-y-8 sm:space-y-12 mb-16 sm:mb-24">
          {services.map((service, index) => {
            let Icon = Code;
            if (service.iconType === 'chat') Icon = MessageSquare;
            if (service.iconType === 'target') Icon = Send;
            if (service.iconType === 'sparkles') Icon = Zap;
            if (service.iconType === 'palette') Icon = Palette;

            return (
              <div
                key={service.id}
                className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-6 sm:p-10 lg:p-12 hover:border-[#2D4536]/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  {/* Left Column: Number & Title */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono font-semibold tracking-wider text-[#7E887E]">
                        0{index + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-medium text-[#121614] mb-3 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4E564F] font-medium mb-4 italic">
                      {service.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-[#6D746D] leading-relaxed mb-6">
                      {service.longDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A2621] text-[#FAF8F5] text-xs font-medium tracking-wider hover:bg-black transition-colors shadow-sm"
                      >
                        <span>Explore Discipline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => navigate(`/contact?service=${service.slug}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
                      >
                        <span>Inquire Directly</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Features & Deliverables */}
                  <div className="lg:col-span-7 bg-[#F4EFE6] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#ECE5D9]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D4536] mb-3">
                          Key Capabilities
                        </h3>
                        <ul className="space-y-2">
                          {service.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start text-xs sm:text-[13px] text-[#3C423E]">
                              <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] mt-0.5 mr-2 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D4536] mb-3">
                          Included Deliverables
                        </h3>
                        <ul className="space-y-2">
                          {service.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start text-xs sm:text-[13px] text-[#3C423E]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2D4536] mt-1.5 mr-2 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E3DACB] flex items-center justify-between text-xs text-[#6A746B]">
                      <span>{service.process.length}-Phase Delivery Workflow</span>
                      <Link
                        to={`/services/${service.slug}`}
                        className="text-[#2D4536] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        View Process & FAQs <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Delivery Process */}
        <div className="bg-[#1B2E24] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-[#FAF8F5] mb-16 sm:mb-24">
          <div className="max-w-3xl mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#A5C2B1] uppercase mb-2">
              — How We Work
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-white leading-tight">
              A Disciplined, Transparent Engagement Workflow.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 01</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Discovery & Scope</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Auditing current brand assets, customer journeys, and information architecture before touching code.
              </p>
            </div>
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 02</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Design Systems</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Establishing editorial typography, color tokens, and interactive mockups tailored to your sector.
              </p>
            </div>
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 03</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Clean Engineering</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Writing type-safe React/TypeScript architecture with sub-second performance and mobile responsiveness.
              </p>
            </div>
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 04</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Handoff & Growth</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Rigorous testing, full IP and repository transfer, live domain launch, and post-launch support.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Consultation CTA */}
        <div className="text-center py-6 sm:py-10">
          <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614] mb-4">
            Need a Tailored Digital Solution?
          </h2>
          <p className="text-sm sm:text-base text-[#616B63] max-w-xl mx-auto mb-6">
            Every engagement begins with a direct conversation about your brand objectives. No sales pressure, just clear architectural advice.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md"
          >
            <span>Start a Project Discussion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
