import React, { useState, useEffect, useMemo } from 'react';
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
  Calculator,
  MessageCircle,
  Layers,
  Video,
  Globe,
  Share2,
  TrendingUp,
  Tag,
  Check,
} from 'lucide-react';
import { PricingPackage, PricingCalculatorItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedPricing, getPricingCalculatorItems, getWebsiteSettings } from '../lib/cms';
import { InnerPageNav } from '../components/InnerPageNav';
import { CardCarousel } from '../components/CardCarousel';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [calculatorItems, setCalculatorItems] = useState<PricingCalculatorItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(['calc-frontend-web']);
  const [durationTerm, setDurationTerm] = useState<'one-time' | '1month' | '6months' | '1year'>('one-time');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/919125272460');

  useEffect(() => {
    async function loadData() {
      const [pricingData, calcData, settings] = await Promise.all([
        getPublishedPricing(),
        getPricingCalculatorItems(),
        getWebsiteSettings(),
      ]);
      setPackages(pricingData);
      setCalculatorItems(calcData);
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
    }
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  // Duration discount rates (Source of truth: https://www.yugark.in/)
  const durationOptions = [
    { id: 'one-time', label: 'ONE-TIME', discountPct: 0, subLabel: 'Standard one-time pricing' },
    { id: '1month', label: '1 MONTH', discountPct: 10, subLabel: '10% commitment discount' },
    { id: '6months', label: '6 MONTHS', discountPct: 15, subLabel: '15% duration discount' },
    { id: '1year', label: '1 YEAR', discountPct: 25, subLabel: '25% duration discount' },
  ];

  const currentDuration = durationOptions.find((d) => d.id === durationTerm) || durationOptions[0];

  // Calculate pricing estimator totals
  const calculation = useMemo(() => {
    const selectedItems = calculatorItems.filter((item) => selectedItemIds.includes(item.id));
    const termMonths = durationTerm === '1year' ? 12 : durationTerm === '6months' ? 6 : 1;

    let subtotal = 0;
    const itemBreakdown = selectedItems.map((item) => {
      const isMonthly = item.billingType === 'monthly';
      const monthsMultiplier = isMonthly && durationTerm !== 'one-time' ? termMonths : 1;
      const itemTotal = item.price * monthsMultiplier;
      subtotal += itemTotal;
      return {
        ...item,
        monthsMultiplier,
        itemTotal,
      };
    });

    const discountPct = currentDuration.discountPct;
    const discountAmount = discountPct > 0 ? Math.round(subtotal * (discountPct / 100)) : 0;
    const finalAmount = Math.max(0, subtotal - discountAmount);

    return {
      selectedItems: itemBreakdown,
      subtotal,
      discountPct,
      discountAmount,
      finalAmount,
    };
  }, [calculatorItems, selectedItemIds, durationTerm, currentDuration]);

  const toggleCalculatorItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleWhatsAppBooking = () => {
    const itemsList = calculation.selectedItems
      .map(
        (it) =>
          `• ${it.title}: ₹${it.price.toLocaleString('en-IN')}${it.billingType === 'monthly' ? '/mo' : ' (One-Time)'}`
      )
      .join('\n');

    const durationLine =
      durationTerm === 'one-time'
        ? '• Term: ONE-TIME (No duration discount)'
        : `• Term: ${currentDuration.label} (${currentDuration.discountPct}% Discount)`;

    const discountLine =
      calculation.discountAmount > 0
        ? `\n• Discount Savings: -₹${calculation.discountAmount.toLocaleString('en-IN')}`
        : '';

    const message = `Hi Radha Krishna Sir, I would like to book a custom package on YUGARK:\n\n${itemsList}\n${durationLine}\n• Subtotal: ₹${calculation.subtotal.toLocaleString('en-IN')}${discountLine}\n• Final Estimated Total: ₹${calculation.finalAmount.toLocaleString('en-IN')}\n\nPlease let me know the next steps!`;

    const encoded = encodeURIComponent(message);
    const cleanNumber = whatsappUrl.includes('wa.me')
      ? whatsappUrl.split('wa.me/')[1]?.replace(/[^0-9]/g, '') || '919125272460'
      : '919125272460';

    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleContactFormRedirect = () => {
    const selectedTitles = calculation.selectedItems.map((i) => i.title).join(', ');
    navigate(
      `/contact?package=${encodeURIComponent(selectedTitles || 'Custom Package')}&term=${durationTerm}&amount=${calculation.finalAmount}`
    );
  };

  const pricingFaqs = [
    {
      question: 'How does the commitment duration discount work?',
      answer:
        'When you select 1 Month (10% OFF), 6 Months (15% OFF), or 1 Year (25% OFF) alongside a monthly plan (Starter, Growth, or Pro), your recurring plan is calculated for that duration (e.g., 6 or 12 months) and the discount is applied across your entire custom package in real-time.',
    },
    {
      question: 'What if I only want a website without a monthly retainer?',
      answer:
        'Simply leave the duration on "ONE-TIME". You can select either the Business Website (₹9,999 Launch Offer) or Website + Lead Management Dashboard (₹14,999 Launch Offer) and proceed directly with zero recurring commitment.',
    },
    {
      question: 'Can I combine a website with social media management or paid ads?',
      answer:
        'Yes! You can bundle any website solution with any social media plan (Starter, Growth, Pro) or Ads management. All selected services will be consolidated into a transparent itemized quote with unified delivery.',
    },
    {
      question: 'How does the Paid Advertising management fee work?',
      answer:
        'The ₹15,000/month management fee covers campaign architecture, audience targeting, ad copy creation, daily monitoring, and continuous optimization across Meta and Google. Ad spend budget is separate and paid directly to Meta or Google through your own ad account.',
    },
    {
      question: 'What happens when I click "Proceed with Selected Package"?',
      answer:
        'Your exact package selection, commitment term, subtotal, discount, and calculated total are automatically carried into the Contact Form or WhatsApp so you never have to re-enter your details. Founder & MD Mr. Radha Krishna will review your project personally.',
    },
    {
      question: 'What payment methods do you accept in India?',
      answer:
        'We accept all major Indian payment channels: UPI (Google Pay, PhonePe, Paytm, BHIM), IMPS/NEFT Net Banking, and Debit/Credit cards with formal invoices.',
    },
  ];

  return (
    <div className="bg-[#F8F6F1] py-8 sm:py-12 lg:py-16">
      <SEOHead
        title="Transparent Pricing & Custom Package Calculator | YUGARK"
        description="Verified pricing for Business Websites at ₹9,999, Website + Dashboard at ₹14,999, Social Media Plans from ₹9,999/mo, and interactive custom package builder."
        canonicalPath="/pricing"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <InnerPageNav currentPageTitle="Studio Investment & Packages" />

        {/* Page Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5ECE7] text-[#294B37] text-[11px] font-semibold tracking-wider uppercase mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Official Launch Pricing & Packages</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            Transparent Packages. Uncompromising Execution.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            Direct pricing with zero hidden fees. From turnkey ~7-day business websites to monthly social media growth plans and performance advertising, every solution is engineered for measurable client acquisition.
          </p>
        </div>

        {/* 4 Flagship Verified Packages */}
        <div className="mb-14 sm:mb-20">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#ECE5D9]">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase">
                — Core Offerings
              </p>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614]">
                Flagship Studio Packages
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-[#2D4536] bg-[#E5ECE7] px-3 py-1 rounded-full">
              Verified Launch Discounts Active
            </span>
          </div>

          <CardCarousel
            preset="pricing"
            ariaLabel="Flagship Studio Packages"
            autoScroll={true}
            autoScrollInterval={6000}
            showControls={true}
            showDots={true}
            controlsPosition="bottom"
          >
            {packages.map((pkg) => {
              const hasDiscount = Boolean(pkg.regularPrice && pkg.launchPrice && pkg.regularPrice > pkg.launchPrice);
              const savings = hasDiscount ? (pkg.regularPrice! - pkg.launchPrice!) : 0;

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative h-full ${
                    pkg.popular
                      ? 'bg-[#1B2E24] text-[#FAF8F5] shadow-xl border-2 border-[#2D4536]'
                      : 'bg-[#FAF7F2] text-[#121614] border border-[#E6DFD3] hover:border-[#2D4536]/40 hover:shadow-lg'
                  }`}
                >
                  {/* Top Badge */}
                  {pkg.badge && (
                    <div
                      className={`absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                        pkg.popular
                          ? 'bg-[#C5A880] text-[#121614]'
                          : 'bg-[#2D4536] text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{pkg.badge}</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-3 pt-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider mb-1 font-semibold text-[#8E9B90]">
                        {pkg.billingType === 'monthly' ? 'Monthly Retainer' : 'One-Time Delivery'}
                      </div>
                      <h3 className="font-serif-title text-lg sm:text-xl font-medium mb-1.5 leading-snug">
                        {pkg.name}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          pkg.popular ? 'text-[#CAD6CE]' : 'text-[#616B63]'
                        }`}
                      >
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Price Card */}
                    <div
                      className={`p-3 rounded-xl mb-4 ${
                        pkg.popular ? 'bg-[#233B2E]' : 'bg-[#F4EFE6]'
                      }`}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-serif-title text-xl sm:text-2xl font-medium">
                          {pkg.launchPrice ? `₹${pkg.launchPrice.toLocaleString('en-IN')}` : pkg.investment}
                        </span>
                        {pkg.billingType === 'monthly' && (
                          <span className="text-xs opacity-75">/mo</span>
                        )}
                        {hasDiscount && (
                          <span className="text-xs line-through opacity-50 ml-1">
                            ₹{pkg.regularPrice?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {hasDiscount && (
                        <div className="text-[10.5px] font-semibold text-[#30784E] dark:text-[#A5C2B1] flex items-center gap-1">
                          <span>Save ₹{savings.toLocaleString('en-IN')} on Launch Offer</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[10.5px] mt-1.5 opacity-80 pt-1.5 border-t border-current/10">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{pkg.turnaround || pkg.deliveryTime || '~7 Days Delivery'}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-5">
                      <p
                        className={`text-[9.5px] font-bold uppercase tracking-wider mb-1.5 ${
                          pkg.popular ? 'text-[#A5C2B1]' : 'text-[#2D4536]'
                        }`}
                      >
                        Included Features:
                      </p>
                      {pkg.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start text-xs">
                          <CheckCircle
                            className={`w-3.5 h-3.5 mt-0.5 mr-1.5 shrink-0 ${
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

                  {/* Actions */}
                  <div className="pt-3 border-t border-current/10 space-y-2">
                    <button
                      onClick={() => navigate(`/contact?package=${encodeURIComponent(pkg.name)}`)}
                      className={`w-full py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                        pkg.popular
                          ? 'bg-[#FAF8F5] text-[#121614] hover:bg-white'
                          : 'bg-[#1A2621] text-white hover:bg-black'
                      }`}
                    >
                      <span>{pkg.ctaText || `Choose ${pkg.name}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </CardCarousel>
        </div>

        {/* All Verified Offerings & Rates at a Glance */}
        <div className="mb-14 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b border-[#ECE5D9]">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase">
                — Full Spectrum
              </p>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614]">
                All Verified Offerings &amp; Unit Rates
              </h2>
            </div>
            <p className="text-xs text-[#627066] max-w-md">
              Compare all 10 verified services, from individual posts and reels to full-scale web platforms and monthly performance retainers.
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-5 sm:p-8 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="border-b border-[#ECE5D9] text-[11px] font-mono uppercase text-[#738277]">
                <tr>
                  <th className="pb-3 pr-4">Offering</th>
                  <th className="pb-3 px-4">Billing Frequency</th>
                  <th className="pb-3 px-4">Turnaround Timeline</th>
                  <th className="pb-3 px-4 text-right">Investment Rate</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE5D9]/60">
                {calculatorItems.map((item) => {
                  const hasDiscount = Boolean(item.originalPrice && item.originalPrice > item.price);
                  return (
                    <tr key={item.id} className="hover:bg-[#F4EFE6]/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-[#121614] text-xs sm:text-sm">{item.title}</div>
                        <div className="text-[11px] text-[#5D665F] line-clamp-1">{item.description}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] capitalize text-[#2D4536]">
                        {item.billingType === 'monthly' ? 'Monthly Retainer' : 'One-Time Delivery'}
                      </td>
                      <td className="py-3.5 px-4 text-[#5D665F] text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2D4536]" />
                          {item.deliveryTime}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-serif-title font-medium text-sm sm:text-base text-[#121614]">
                          ₹{item.price.toLocaleString('en-IN')}
                          <span className="text-[10px] text-[#69746A] ml-1 font-sans font-normal">
                            {item.unit}
                          </span>
                        </div>
                        {hasDiscount && (
                          <div className="text-[10px] text-[#7C887E]">
                            <span className="line-through">₹{item.originalPrice?.toLocaleString('en-IN')}</span>
                            <span className="text-[#2D7347] font-semibold ml-1">Launch Offer</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <button
                          onClick={() => {
                            if (!selectedItemIds.includes(item.id)) {
                              setSelectedItemIds((prev) => [...prev, item.id]);
                            }
                            const el = document.getElementById('calculator');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-full border border-[#D5CDC0] text-[#121614] text-[11px] font-medium hover:bg-[#1B2E24] hover:text-white hover:border-[#1B2E24] transition-all cursor-pointer whitespace-nowrap"
                        >
                          Select in Estimator
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Custom Package Builder & Calculator */}
        <div id="calculator" className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-6 sm:p-10 lg:p-12 mb-16 sm:mb-24 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B2E24] text-[#FAF8F5] text-[10px] font-semibold tracking-wider uppercase mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Estimator</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614] mb-2">
              Custom Package Builder & Live Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#5D665F] leading-relaxed">
              Select any combination of verified business websites, monthly social media plans, performance ads, video production, or individual posts. Toggle your commitment term to view real-time duration discounts.
            </p>
          </div>

          {/* Commitment Term Switcher */}
          <div className="bg-[#F4EFE6] rounded-2xl p-4 sm:p-5 mb-8 border border-[#ECE5D9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#121614]">
                Step 1: Select Commitment Term (With Duration Discounts)
              </span>
              <span className="text-[11px] text-[#69746A]">
                Applies across custom monthly retainers
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {durationOptions.map((opt) => {
                const isActive = durationTerm === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDurationTerm(opt.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1B2E24] text-white border-[#1B2E24] shadow-md'
                        : 'bg-white text-[#121614] border-[#E0D7C9] hover:border-[#1B2E24]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{opt.label}</span>
                      {opt.discountPct > 0 && (
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-[#C5A880] text-black' : 'bg-[#E5ECE7] text-[#294B37]'
                          }`}
                        >
                          {opt.discountPct}% OFF
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-tight ${isActive ? 'text-[#CAD6CE]' : 'text-[#69746A]'}`}>
                      {opt.subLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculator Grid & Live Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 10 Items Checkboxes */}
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#121614] mb-3">
                Step 2: Select Offerings to Bundle
              </p>

              {calculatorItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const hasDiscount = Boolean(item.originalPrice && item.originalPrice > item.price);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCalculatorItem(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-white border-[#2D4536] shadow-sm ring-1 ring-[#2D4536]/20'
                        : 'bg-[#FAF7F2] border-[#E6DFD3] hover:border-[#2D4536]/30 hover:bg-white/60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#1B2E24] border-[#1B2E24] text-white'
                          : 'border-[#C8BFB0] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#121614]">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-[#E5ECE7] text-[#294B37]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-serif-title font-medium text-sm sm:text-base text-[#121614]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#69746A] ml-1">
                            {item.unit}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-[#8C968D] line-through ml-1.5">
                              ₹{item.originalPrice?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#5D665F] leading-relaxed mb-1.5">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#7C887E]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2D4536]" />
                          <span>{item.deliveryTime}</span>
                        </span>
                        {item.features && item.features.length > 0 && (
                          <span>• {item.features.slice(0, 3).join(' • ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Floating Calculation Summary Card */}
            <div className="lg:col-span-5 sticky top-28 bg-[#1B2E24] text-[#FAF8F5] rounded-2xl p-6 sm:p-7 shadow-xl border border-[#2D4536]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#314B3B]">
                <h3 className="font-serif-title text-xl font-medium">Package Summary</h3>
                <span className="text-[11px] font-mono text-[#A5C2B1]">
                  {calculation.selectedItems.length} selected
                </span>
              </div>

              {calculation.selectedItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#CAD6CE]">
                  Select one or more services from the list to preview your custom package investment.
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-5 text-xs border-b border-[#314B3B] pb-4">
                    {calculation.selectedItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-[#FAF8F5]">{item.title}</div>
                          <div className="text-[10px] text-[#A5C2B1]">
                            {item.billingType === 'monthly' && item.monthsMultiplier > 1
                              ? `₹${item.price.toLocaleString('en-IN')}/mo × ${item.monthsMultiplier} mos`
                              : item.deliveryTime}
                          </div>
                        </div>
                        <div className="font-mono text-right text-[#FAF8F5]">
                          ₹{item.itemTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6 text-xs text-[#CAD6CE]">
                    <div className="flex items-center justify-between">
                      <span>Term Commitment:</span>
                      <span className="font-semibold text-white uppercase">{currentDuration.label}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Base Subtotal:</span>
                      <span className="font-mono text-white">₹{calculation.subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {calculation.discountAmount > 0 && (
                      <div className="flex items-center justify-between text-[#F0D28F] font-semibold">
                        <span>Duration Discount ({calculation.discountPct}%):</span>
                        <span className="font-mono">-₹{calculation.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="pt-3 mt-3 border-t border-[#314B3B] flex items-baseline justify-between text-white">
                      <div>
                        <div className="text-xs uppercase tracking-wider font-semibold text-[#A5C2B1]">Estimated Total</div>
                        <div className="text-[10px] text-[#CAD6CE]">All Indian taxes & delivery included</div>
                      </div>
                      <div className="font-serif-title text-2xl sm:text-3xl font-medium text-[#FAF8F5]">
                        ₹{calculation.finalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={handleWhatsAppBooking}
                      className="w-full py-3 rounded-full bg-[#25D366] text-black font-semibold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-all cursor-pointer shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>Inquire Directly on WhatsApp</span>
                    </button>

                    <button
                      onClick={handleContactFormRedirect}
                      className="w-full py-3 rounded-full bg-white text-[#121614] font-semibold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-sm"
                    >
                      <span>Proceed with Selected Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
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
                You receive 100% of all Git repositories, design assets, database schemas, and master files without licensing royalties.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#ECE5D9]">
              <Zap className="w-5 h-5 text-[#2D4536] mb-2" />
              <h3 className="font-medium text-sm text-[#121614] mb-1">
                Sub-Second Speed Guarantee
              </h3>
              <p className="text-xs text-[#5D665F] leading-relaxed">
                Every website is tuned for Google Core Web Vitals to pass speed audits and maximize organic client conversions.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#ECE5D9]">
              <Clock className="w-5 h-5 text-[#2D4536] mb-2" />
              <h3 className="font-medium text-sm text-[#121614] mb-1">
                Dedicated Founder Guidance
              </h3>
              <p className="text-xs text-[#5D665F] leading-relaxed">
                Every engagement is personally overseen by Founder & Managing Director Mr. Radha Krishna with direct WhatsApp support.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing FAQs (Verified 6 FAQs) */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — Verified FAQ
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
            Have a Specific Scope or Custom Requirement?
          </h2>
          <p className="text-xs sm:text-sm text-[#616B63] max-w-md mx-auto mb-6">
            We will review your business background and provide an itemized proposal tailored to your goals.
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
