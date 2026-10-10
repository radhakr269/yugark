import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Code,
  MessageSquare,
  Send,
  Zap,
  Palette,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { ServiceItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getServiceBySlug, getWebsiteSettings } from '../lib/cms';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { InnerPageNav } from '../components/InnerPageNav';
import { siteConfig } from '../data/studioData';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [whatsappUrl, setWhatsappUrl] = useState(siteConfig.whatsappUrl);

  useEffect(() => {
    async function loadService() {
      if (slug) {
        const item = await getServiceBySlug(slug);
        setService(item);
      }
      setLoading(false);
    }
    async function loadSettings() {
      const settings = await getWebsiteSettings();
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
    }
    loadService();
    loadSettings();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F6F1] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2D4536] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#7C887E]">Loading Service Capability...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[70vh] bg-[#F8F6F1] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <h1 className="font-serif-title text-3xl font-medium text-[#121614] mb-3">
            Service Not Found
          </h1>
          <p className="text-sm text-[#6A746B] mb-6">
            The studio capability you are looking for is unavailable or has been relocated.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Services</span>
          </Link>
        </div>
      </div>
    );
  }

  let Icon = Code;
  if (service.iconType === 'chat') Icon = MessageSquare;
  if (service.iconType === 'target') Icon = Send;
  if (service.iconType === 'sparkles') Icon = Zap;
  if (service.iconType === 'palette') Icon = Palette;

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-20">
      <SEOHead
        title={`${service.title} — Digital Studio Solutions`}
        description={service.longDescription || service.description}
        canonicalPath={`/services/${service.slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <InnerPageNav currentPageTitle={service.title} />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-[#7C887E] mb-8">
          <Link to="/" className="hover:text-[#121614] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/services" className="hover:text-[#121614] transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-[#121614] font-semibold">{service.title}</span>
        </nav>

        {/* Hero Section of Service Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 sm:mb-24">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5ECE7] text-[#294B37] text-[11px] font-semibold tracking-wider uppercase mb-4">
              <Icon className="w-3.5 h-3.5" />
              <span>Studio Discipline</span>
            </div>

            <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
              {service.title}
            </h1>

            <p className="text-base sm:text-xl text-[#394B3D] font-medium leading-snug mb-6">
              {service.tagline}
            </p>

            <p className="text-sm sm:text-base text-[#5A635C] leading-relaxed mb-8">
              {service.longDescription}
            </p>

            {service.priceDisplay && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#E5ECE7] text-[#1B3828] text-xs font-bold mb-6">
                <span>{service.priceDisplay}</span>
                {service.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#1B2E24] text-white">
                    {service.badge}
                  </span>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(`/contact?service=${service.slug}`)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md"
              >
                <span>Inquire About This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Services</span>
              </Link>
            </div>
          </div>

          {/* Quick Snapshot / Deliverables Sidebar */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif-title text-xl font-medium text-[#121614] mb-4 pb-3 border-b border-[#ECE5D9] flex items-center justify-between">
              <span>Included Deliverables</span>
              <Sparkles className="w-4 h-4 text-[#2D4536]" />
            </h3>

            <ul className="space-y-3 mb-6">
              {service.deliverables.map((item, index) => (
                <li key={index} className="flex items-start text-xs sm:text-sm text-[#3C423E]">
                  <CheckCircle className="w-4 h-4 text-[#2D4536] mt-0.5 mr-2.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#ECE5D9] bg-[#F4EFE6] -mx-6 -mb-6 p-6 rounded-b-2xl sm:rounded-b-3xl">
              <div className="flex items-center justify-between text-xs text-[#5D6B60] mb-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2D4536]" />
                  <span>Turnaround Time:</span>
                </span>
                <span className="font-semibold text-[#121614]">{service.deliveryTime || 'Typically ~7–14 Days'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#5D6B60]">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2D4536]" />
                  <span>Asset Ownership:</span>
                </span>
                <span className="font-semibold text-[#121614]">100% Client Intellectual Property</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown Grid */}
        <div className="mb-16 sm:mb-24">
          <div className="mb-8">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — Detailed Scope
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614]">
              Capabilities Engineered for Commercial Impact.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {service.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#E6DFD3] hover:border-[#2D4536]/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mb-3 font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <h3 className="font-medium text-sm sm:text-base text-[#121614] mb-1">
                  {feature}
                </h3>
                <p className="text-xs text-[#6A746B] leading-relaxed">
                  Tailored specifically to maintain brand clarity, user trust, and high execution standards.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Process Section */}
        <div className="bg-[#1B2E24] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 mb-16 sm:mb-24">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#A5C2B1] uppercase mb-2">
              — The Engagement Journey
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-white leading-tight">
              Our 4-Phase Delivery Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {service.process.map((step) => (
              <div key={step.step} className="border-t border-[#314B3B] pt-4">
                <span className="text-xs font-mono font-semibold text-[#A5C2B1] block mb-2">
                  Step {step.step}
                </span>
                <h3 className="font-serif-title text-lg text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#CAD6CE] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — Frequently Answered
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614]">
              Common Questions on {service.title}
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#FAF7F2] rounded-xl sm:rounded-2xl border border-[#E6DFD3] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-medium text-xs sm:text-sm text-[#121614] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#2D4536] shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7C887E] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-[13px] text-[#5A635C] leading-relaxed border-t border-[#ECE5D9]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Bottom Call to Action */}
        <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614] mb-3">
            Ready to Begin with {service.title}?
          </h2>
          <p className="text-xs sm:text-base text-[#616B63] max-w-lg mx-auto mb-6">
            Share your project parameters with us. We will review your requirements and outline a tailored roadmap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/contact?service=${service.slug}`)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md"
            >
              <span>Submit Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`${whatsappUrl.includes('?') ? whatsappUrl.split('?')[0] : whatsappUrl}?text=${encodeURIComponent(`Hello Yugark Studio, I have an inquiry regarding ${service.title}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp Query</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
