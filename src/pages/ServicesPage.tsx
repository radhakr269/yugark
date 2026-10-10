import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Code,
  MessageSquare,
  Send,
  Zap,
  Palette,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Tag,
  Video,
  Layers,
  Sparkles,
  Calculator,
  MessageCircle,
} from 'lucide-react';
import { ServiceItem, PricingCalculatorItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedServices, getPricingCalculatorItems, getWebsiteSettings } from '../lib/cms';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { InnerPageNav } from '../components/InnerPageNav';
import { CardCarousel } from '../components/CardCarousel';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [offerings, setOfferings] = useState<PricingCalculatorItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/919125205132');

  useEffect(() => {
    async function loadData() {
      const [srvData, calcData, settings] = await Promise.all([
        getPublishedServices(),
        getPricingCalculatorItems(),
        getWebsiteSettings(),
      ]);
      setServices(srvData);
      setOfferings(calcData);
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
    }
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  const filteredOfferings = offerings.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'website') return item.category === 'website' || item.billingType === 'one-time' && item.id.includes('web');
    if (activeCategory === 'social') return item.category === 'social' || item.id.includes('plan');
    if (activeCategory === 'video') return item.category === 'video' || item.category === 'content' || item.id.includes('video') || item.id.includes('post');
    if (activeCategory === 'ads') return item.category === 'ads' || item.id.includes('ads');
    return true;
  });

  const handleWhatsAppInquiry = (item: PricingCalculatorItem) => {
    const isMonthly = item.billingType === 'monthly';
    const message = `Hi Radha Krishna Sir, I would like to inquire about the "${item.title}" service (${isMonthly ? `₹${item.price.toLocaleString('en-IN')}/mo` : `₹${item.price.toLocaleString('en-IN')}`}).\n\nDelivery/Turnaround: ${item.deliveryTime}\n\nPlease share the next steps and onboarding timeline!`;
    const encoded = encodeURIComponent(message);
    const cleanNumber = whatsappUrl.includes('wa.me')
      ? whatsappUrl.split('wa.me/')[1]?.replace(/[^0-9]/g, '') || '919125205132'
      : '919125205132';
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F8F6F1] py-8 sm:py-12 lg:py-16">
      <SEOHead
        title="Complete Digital Solutions & Services | YUGARK"
        description="Explore Yugark's 5 verified disciplines: Website Development (from ₹9,999), Social Media (from ₹9,999/mo), Paid Ads (from ₹15,000/mo), AI Video Production (from ₹3,000), and Strategy."
        canonicalPath="/services"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <InnerPageNav currentPageTitle="Services & Capabilities" />

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Studio Capabilities
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-3 sm:mb-4">
            Complete Digital Solutions for Modern Brands.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            We operate at the intersection of bespoke design, clean code, and strategic growth.
            From high-converting ~7-day business websites to monthly social media retainers, performance advertising, and promotional video production, every service is built for commercial durability.
          </p>
        </div>

        {/* Services List / Cards */}
        <div className="space-y-6 sm:space-y-8 mb-14 sm:mb-20">
          {services.map((service, index) => {
            let Icon = Code;
            if (service.iconType === 'chat') Icon = MessageSquare;
            if (service.iconType === 'target') Icon = Send;
            if (service.iconType === 'sparkles' || service.iconType === 'video') Icon = Video;
            if (service.iconType === 'palette' || service.iconType === 'compass') Icon = Layers;

            return (
              <div
                key={service.id}
                className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-6 sm:p-10 lg:p-12 hover:border-[#2D4536]/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  {/* Left Column: Number, Title, Pricing */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono font-semibold tracking-wider text-[#7E887E]">
                        0{index + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      {service.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#E5ECE7] text-[#294B37]">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-medium text-[#121614] mb-2 leading-tight">
                      {service.title}
                    </h2>

                    {/* Verified Pricing Highlight */}
                    {service.priceDisplay && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E5ECE7] text-[#1E3B2B] text-xs font-bold mb-3">
                        <Tag className="w-3.5 h-3.5 text-[#2D4536]" />
                        <span>{service.priceDisplay}</span>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-[#4E564F] font-medium mb-3 italic">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors cursor-pointer"
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
                          {service.features.slice(0, 5).map((feature, i) => (
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
                          {service.deliverables.slice(0, 5).map((item, i) => (
                            <li key={i} className="flex items-start text-xs sm:text-[13px] text-[#3C423E]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2D4536] mt-1.5 mr-2 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E3DACB] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6A746B]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#2D4536]" />
                        <span>Timeline: {service.deliveryTime || 'Tailored to scope'}</span>
                      </span>
                      <Link
                        to={`/services/${service.slug}`}
                        className="text-[#2D4536] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        View Full Details & FAQs <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* A La Carte & Individual Production Offerings */}
        <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-6 sm:p-10 mb-16 sm:mb-24">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5ECE7] text-[#294B37] text-[10px] font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Service Catalog &amp; À La Carte Offerings</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614] mb-2">
              Individual Offerings, Turnkey Systems &amp; Retainers
            </h2>
            <p className="text-xs sm:text-sm text-[#5D665F] leading-relaxed">
              Every verified offering from business websites to individual video reels, graphics, social retainers, and paid ads—with transparent pricing, launch savings, and verified delivery timelines.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[#ECE5D9]">
            {[
              { id: 'all', label: `All Verified Solutions (${offerings.length})` },
              { id: 'website', label: 'Websites & Systems' },
              { id: 'social', label: 'Social Media Retainers' },
              { id: 'video', label: 'Video & Graphics' },
              { id: 'ads', label: 'Paid Advertising' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#1B2E24] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#F4EFE6] text-[#556358] hover:bg-[#EAE3D6] hover:text-[#121614]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <CardCarousel
            preset="work"
            ariaLabel="Catalog Offerings and Retainers"
            autoScroll={true}
            autoScrollInterval={6500}
            showControls={true}
            showDots={true}
            controlsPosition="bottom"
          >
            {filteredOfferings.map((item) => {
              const hasDiscount = Boolean(item.originalPrice && item.originalPrice > item.price);
              const savings = hasDiscount ? (item.originalPrice! - item.price) : 0;

              return (
                <div
                  key={item.id}
                  className="bg-[#F4EFE6] rounded-xl p-4 sm:p-5 border border-[#ECE5D9] flex flex-col justify-between hover:border-[#2D4536]/40 transition-all shadow-xs h-full"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#69746A] mb-2">
                      <span className="uppercase tracking-wider font-semibold capitalize text-[#2D4536]">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[#69746A]">
                        <Clock className="w-3 h-3 text-[#2D4536]" />
                        {item.deliveryTime}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif-title font-medium text-base sm:text-lg text-[#121614] leading-snug">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#E5ECE7] text-[#294B37] shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-serif-title text-xl sm:text-2xl font-medium text-[#1B2E24]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-[#69746A]">
                        {item.unit}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-[#8C988F] line-through ml-1">
                          ₹{item.originalPrice?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {hasDiscount && (
                      <div className="text-[10px] font-semibold text-[#2D7347] mb-2.5">
                        Save ₹{savings.toLocaleString('en-IN')} on Launch Offer
                      </div>
                    )}

                    <p className="text-xs text-[#5A635C] leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <ul className="space-y-1 text-xs text-[#445248] mb-4 pt-2.5 border-t border-[#E3DACB]/80">
                      {item.features?.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#E3DACB] space-y-2">
                    <button
                      onClick={() => handleWhatsAppInquiry(item)}
                      className="w-full py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp Query</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/contact?service=${encodeURIComponent(item.title)}`)}
                        className="flex-1 py-1.5 rounded-full border border-[#D5CDC0] text-[#121614] text-[11px] font-medium hover:bg-[#EAE3D6] transition-colors cursor-pointer text-center"
                      >
                        Submit Brief
                      </button>
                      <Link
                        to="/pricing#calculator"
                        className="flex-1 py-1.5 rounded-full border border-[#D5CDC0] text-[#121614] text-[11px] font-medium hover:bg-[#EAE3D6] transition-colors text-center"
                      >
                        Live Estimator
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardCarousel>

          <div className="text-center pt-2">
            <Link
              to="/pricing#calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B2E24] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
            >
              <Calculator className="w-4 h-4" />
              <span>Open Interactive Pricing Calculator &amp; Custom Package Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
              <h3 className="font-serif-title text-lg text-white mb-2">Connect & Intake</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Connect via WhatsApp or inquiry form to share your business goals, target buyers, and required timeline.
              </p>
            </div>
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 02</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Architecture & Scripting</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Establishing responsive wireframes, conversion hooks, and monthly editorial calendars tailored to your niche.
              </p>
            </div>
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 03</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Production & Testing</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Building custom React code, editing short-form video reels with dynamic captions, and setting up tracking pixels.
              </p>
            </div>
            <div className="border-t border-[#314B3B] pt-4">
              <span className="text-xs font-mono text-[#A5C2B1] block mb-2">Phase 04</span>
              <h3 className="font-serif-title text-lg text-white mb-2">Deployment & Compounding</h3>
              <p className="text-xs text-[#CAD6CE] leading-relaxed">
                Publishing your live website with Google SEO indexing, delivering master video archives, and running weekly social content.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-6 sm:py-10">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614] mb-3">
            Ready to Accelerate Your Digital Growth?
          </h2>
          <p className="text-xs sm:text-sm text-[#616B63] max-w-md mx-auto mb-6">
            Explore our transparent pricing packages or connect directly for custom enterprise scopes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md cursor-pointer"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-semibold hover:bg-[#EAE3D6] transition-colors"
            >
              <span>View Packages & Pricing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
