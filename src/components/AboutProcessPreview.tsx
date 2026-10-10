import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Eye, Zap, ShieldCheck } from 'lucide-react';

export const AboutProcessPreview: React.FC = () => {
  const navigate = useNavigate();

  const processSteps = [
    {
      number: '01',
      title: 'Discussion',
      description: 'Understand your requirements.',
    },
    {
      number: '02',
      title: 'Design',
      description: 'Plan the look and experience.',
    },
    {
      number: '03',
      title: 'Development',
      description: 'Build and refine your project.',
    },
    {
      number: '04',
      title: 'Launch',
      description: 'Review and deliver the final work.',
    },
  ];

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-[#F4EFE6] border-t border-[#ECE5D9]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Row 1: About Yugark Preview */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-end justify-between mb-3 sm:mb-4 pb-2 border-b border-[#E4DDD1]">
            <div>
              <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
                — Studio Story
              </p>
              <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[40px] font-medium text-[#121614] leading-tight">
                About Yugark
              </h2>
            </div>
            <div>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
              >
                <span>Know More About Us</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5A635C] max-w-2xl leading-relaxed">
            Yugark Digital Studio creates websites, content and digital marketing solutions for businesses that want to build a stronger online presence.
          </p>
        </div>

        {/* Row 2: How We Work (4 Compact Process Steps) */}
        <div>
          <div className="mb-4 sm:mb-6">
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5">
              — Structured Delivery
            </p>
            <h3 className="font-serif-title text-lg sm:text-2xl font-medium text-[#121614]">
              How We Work
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="bg-[#FAF7F2] rounded-xl border border-[#E6DFD3] p-3 sm:p-4 flex flex-col justify-between hover:border-[#2D4536]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-[#2D4536] bg-[#E5ECE7] px-1.5 sm:px-2 py-0.5 rounded">
                      {step.number}
                    </span>
                  </div>
                  <h4 className="font-serif-title text-sm sm:text-base font-semibold text-[#121614] mb-0.5 sm:mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#636C64] leading-snug sm:leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
