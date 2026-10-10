import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Tag, Clock } from 'lucide-react';
import { PricingPackage } from '../types/content';
import { getPublishedPricing } from '../lib/cms';
import { pricingPackagesData as initialPricing } from '../data/studioData';

export const PricingPreview: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PricingPackage[]>(initialPricing);

  useEffect(() => {
    async function load() {
      const data = await getPublishedPricing();
      if (data && data.length > 0) {
        setPackages(data);
      }
    }
    load();

    const handleUpdate = () => load();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  // Display top 3 flagship packages in the homepage preview
  const previewPackages = packages.slice(0, 3);

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-[#F8F6F1] border-t border-[#ECE5D9]" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-[#E8E2D7]">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — Transparent Investment
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
              Simple Plans. Clear Pricing.
            </h2>
          </div>
          <div>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
            >
              <span>Explore Pricing</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#5A635C] max-w-2xl mb-5 sm:mb-8 leading-relaxed">
          Explore our website, content and marketing packages to find the right option for your business.
        </p>

        {/* 3 Compact Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6">
          {previewPackages.map((pkg) => {
            const isHighlighted = pkg.isPopular;
            return (
              <div
                key={pkg.id}
                onClick={() => navigate('/pricing')}
                className={`rounded-2xl border p-4.5 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-md ${
                  isHighlighted
                    ? 'bg-[#18261F] text-white border-[#2E4237]'
                    : 'bg-[#FAF7F2] text-[#121614] border-[#E6DFD3]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isHighlighted
                          ? 'bg-[#2E4237] text-[#D4E8DC] border border-[#3E584A]'
                          : 'bg-[#EAE3D6] text-[#4F5B51]'
                      }`}
                    >
                      {pkg.badge || 'STUDIO PACKAGE'}
                    </span>
                    {pkg.turnaround && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono ${
                          isHighlighted ? 'text-[#A0B2A6]' : 'text-[#7A867E]'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{pkg.turnaround}</span>
                      </span>
                    )}
                  </div>

                  <h3
                    className={`font-serif-title text-lg sm:text-xl font-medium mb-1.5 ${
                      isHighlighted ? 'text-white' : 'text-[#121614]'
                    }`}
                  >
                    {pkg.name}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                      isHighlighted ? 'text-[#CAD6CE]' : 'text-[#616B63]'
                    }`}
                  >
                    {pkg.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="pt-2 pb-3 border-y border-dashed border-current/20 mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif-title text-2xl sm:text-3xl font-bold">
                        ₹{pkg.launchPrice.toLocaleString('en-IN')}
                      </span>
                      {pkg.regularPrice > pkg.launchPrice && (
                        <span
                          className={`text-xs line-through ${
                            isHighlighted ? 'text-[#8A9C90]' : 'text-[#8C988F]'
                          }`}
                        >
                          ₹{pkg.regularPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono uppercase ${
                          isHighlighted ? 'text-[#9CB3A5]' : 'text-[#6C7870]'
                        }`}
                      >
                        {pkg.billingCycle === 'monthly' ? '/month' : 'one-time'}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-4 text-xs">
                    {pkg.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isHighlighted ? 'text-[#5AE48B]' : 'text-[#2D4536]'
                          }`}
                        />
                        <span
                          className={`line-clamp-1 text-[11px] sm:text-xs ${
                            isHighlighted ? 'text-[#DDE8E0]' : 'text-[#4A544C]'
                          }`}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`pt-2.5 border-t border-current/15 flex items-center justify-between text-xs font-semibold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform ${
                    isHighlighted ? 'text-[#5AE48B]' : 'text-[#2D4536]'
                  }`}
                >
                  <span>Explore Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
