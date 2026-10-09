import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PricingPackage } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedPricing } from '../lib/cms';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadPricing() {
      const data = await getPublishedPricing();
      setPackages(data);
    }
    loadPricing();

    const handleUpdate = () => loadPricing();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  const pricingFaqs = [
    {
      question: 'How are studio engagements priced?',
      answer:
        'We operate on transparent milestone-based flat project fees. Because every brand presents unique architecture and custom asset requirements, we provide an itemized quote following an initial scope audit — ensuring zero hidden costs or surprise billable hours.',
    },
    {
      question: 'What are the typical payment milestones?',
      answer:
        'Standard engagements are structured into three phases: 40% upon kickoff and architecture approval, 30% upon interactive prototype and design sign-off, and 30% upon final QA, staging sign-off, and production deployment handoff.',
    },
    {
      question: 'Do we own the full source code and intellectual property?',
      answer:
        'Yes. 100% of custom source code, vector Figma design systems, database schemas, and digital production assets are transferred to your company upon project settlement. We do not implement vendor lock-in.',
    },
    {
      question: 'Can we start with a Ready-Made Demo and customize it?',
      answer:
        'Yes. If your timeline demands immediate deployment, selecting a curated studio demo significantly compresses turnaround to 5 to 7 business days, providing a luxury footprint at an accelerated pace.',
    },
    {
      question: 'Do you offer ongoing retainer partnerships?',
      answer:
        'Yes. Following project deployment, clients can transition into monthly studio retainers for continuous feature iterations, campaign asset production, performance tuning, and technical stewardship.',
    },
  ];

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-24">
      <SEOHead
        title="Engagement Packages & Studio Pricing"
        description="Transparent, scope-based studio tiers for founders and modern enterprises. Transparent deliverables and clear timelines."
        canonicalPath="/pricing"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Studio Investment
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            Transparent Packages. Uncompromising Execution.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            We prioritize clear scopes, predictable milestones, and long-term durability.
            Every tier includes dedicated engineering, bespoke art direction, and full source code ownership.
          </p>
        </div>

        {/* Pricing Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16 sm:mb-24">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.popular
                  ? 'bg-[#1B2E24] text-[#FAF8F5] shadow-xl border-2 border-[#2D4536] -translate-y-1'
                  : 'bg-[#FAF7F2] text-[#121614] border border-[#E6DFD3] hover:border-[#2D4536]/40 hover:shadow-lg'
              }`}
            >
              {/* Flagship Tier Badge */}
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C5A880] text-[#121614] text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Flagship Studio Tier</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-medium mb-2">
                    {pkg.name}
                  </h2>
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed ${
                      pkg.popular ? 'text-[#CAD6CE]' : 'text-[#616B63]'
                    }`}
                  >
                    {pkg.tagline}
                  </p>
                </div>

                {/* Investment & Timeline */}
                <div
                  className={`p-4 rounded-xl mb-6 ${
                    pkg.popular ? 'bg-[#233B2E]' : 'bg-[#F4EFE6]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={pkg.popular ? 'text-[#A5C2B1]' : 'text-[#7C887E]'}>
                      Investment Structure:
                    </span>
                    <span className="font-semibold text-xs uppercase tracking-wide">
                      {pkg.investment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center gap-1 ${pkg.popular ? 'text-[#A5C2B1]' : 'text-[#7C887E]'}`}>
                      <Clock className="w-3 h-3" />
                      <span>Timeline:</span>
                    </span>
                    <span className="font-semibold">{pkg.turnaround}</span>
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-6">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${
                      pkg.popular ? 'text-[#A5C2B1]' : 'text-[#2D4536]'
                    }`}
                  >
                    Best Suited For:
                  </span>
                  <p
                    className={`text-xs leading-relaxed ${
                      pkg.popular ? 'text-[#E5ECE7]' : 'text-[#4E564F]'
                    }`}
                  >
                    {pkg.bestFor}
                  </p>
                </div>

                {/* Included Features */}
                <div className="space-y-2.5 mb-8">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider block mb-3 ${
                      pkg.popular ? 'text-[#A5C2B1]' : 'text-[#2D4536]'
                    }`}
                  >
                    Key Architecture & Features:
                  </span>
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-xs sm:text-[13px]">
                      <CheckCircle
                        className={`w-4 h-4 mt-0.5 mr-2.5 shrink-0 ${
                          pkg.popular ? 'text-[#A5C2B1]' : 'text-[#2D4536]'
                        }`}
                      />
                      <span className={pkg.popular ? 'text-[#FAF8F5]' : 'text-[#3C423E]'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-current/10">
                <button
                  onClick={() => navigate(`/contact?package=${pkg.slug}`)}
                  className={`w-full py-3.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    pkg.popular
                      ? 'bg-[#FAF8F5] text-[#121614] hover:bg-white'
                      : 'bg-[#1A2621] text-white hover:bg-black'
                  }`}
                >
                  <span>Request Package Scope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees & Studio Standards */}
        <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-8 sm:p-12 mb-16 sm:mb-24">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — The Yugark Standard
            </p>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614]">
              What Every Studio Client Receives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#ECE5D9]">
              <ShieldCheck className="w-5 h-5 text-[#2D4536] mb-2" />
              <h3 className="font-medium text-sm text-[#121614] mb-1">
                Zero Lock-In Ownership
              </h3>
              <p className="text-xs text-[#5D665F] leading-relaxed">
                You receive 100% of all Git repositories, design files, and credentials without licensing royalties.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#ECE5D9]">
              <Zap className="w-5 h-5 text-[#2D4536] mb-2" />
              <h3 className="font-medium text-sm text-[#121614] mb-1">
                Sub-Second Speed Guarantee
              </h3>
              <p className="text-xs text-[#5D665F] leading-relaxed">
                Interfaces are tuned for Google Core Web Vitals to pass speed audits and maximize organic conversion.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#ECE5D9]">
              <Clock className="w-5 h-5 text-[#2D4536] mb-2" />
              <h3 className="font-medium text-sm text-[#121614] mb-1">
                Dedicated Post-Launch Care
              </h3>
              <p className="text-xs text-[#5D665F] leading-relaxed">
                Every project comes with 2 to 4 weeks of hands-on staging, deployment monitoring, and team onboarding.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — Frequently Answered
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614]">
              Pricing & Engagement Questions
            </h2>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq, index) => {
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

        {/* Bottom CTA */}
        <div className="text-center py-6 sm:py-10">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614] mb-3">
            Have a Specific Scope in Mind?
          </h2>
          <p className="text-xs sm:text-sm text-[#616B63] max-w-md mx-auto mb-6">
            We will review your requirements and provide an itemized proposal within 24 to 48 business hours.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md cursor-pointer"
          >
            <span>Start a Project Discussion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
