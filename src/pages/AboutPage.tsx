import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Compass,
  CheckCircle,
  Eye,
  Award,
} from 'lucide-react';
import { siteConfig } from '../data/studioData';
import { SEOHead } from '../components/SEOHead';
import { InnerPageNav } from '../components/InnerPageNav';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Eye,
      title: 'Design Distinction',
      description:
        'We reject generic templates and cookie-cutter themes. Every typography pairing, spatial margin, and subtle feather mask is engineered to reflect timeless luxury and modern authority.',
    },
    {
      icon: Zap,
      title: 'Technical Discipline',
      description:
        'Sub-second load speeds, clean typed architectures (React, TypeScript, Tailwind), and zero layout shifts. We build interfaces that are technically bulletproof and accessible to all.',
    },
    {
      icon: Compass,
      title: 'Commercial Purpose',
      description:
        'Design without conversion intent is merely decoration. Every user journey, layout hierarchy, and micro-interaction is calculated to turn visitors into qualified brand inquiries.',
    },
    {
      icon: ShieldCheck,
      title: 'Absolute Ownership',
      description:
        'Zero vendor lock-in. When our work is delivered, your team retains 100% intellectual property, full Git source repositories, and master design system files.',
    },
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Discovery & Strategic Scoping',
      description:
        'We begin by analyzing your competitive landscape, target audience motivations, and information architecture before touching a line of code or design file.',
    },
    {
      number: '02',
      title: 'Design System & Prototyping',
      description:
        'Establishing tailored color tokens, typography scales, and responsive components. You experience the exact tactile behavior of your site prior to full engineering.',
    },
    {
      number: '03',
      title: 'Full-Stack Engineering',
      description:
        'Writing clean, typed React/TypeScript code with Vite tooling and Tailwind CSS styling, optimized for Google Core Web Vitals and mobile responsiveness.',
    },
    {
      number: '04',
      title: 'Production Launch & Stewardship',
      description:
        'Exhaustive cross-device QA, staging sign-off, live domain deployment, and dedicated post-launch support to ensure smooth operations.',
    },
  ];

  return (
    <div className="bg-[#F8F6F1] py-8 sm:py-12 lg:py-16">
      <SEOHead
        title="About Our Studio & Architectural Philosophy"
        description="Learn about Yugark Digital Studio's mission, craftsmanship principles, technical standards, and disciplined collaboration workflow."
        canonicalPath="/about"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <InnerPageNav currentPageTitle="About Yugark" />

        {/* Page Hero */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Studio Introduction
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-3 sm:mb-4">
            A Digital Studio for What's Next.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            Yugark Digital Studio is an independent digital practice focused on high-performance websites,
            distinctive brand identities, and commercial growth. We merge editorial refinement with rigorous
            engineering to help modern companies look better, connect deeper, and grow further.
          </p>
        </div>

        {/* Hero Visual Banner / Studio Statement Section */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#1B2E24] text-[#FAF8F5] p-6 sm:p-10 lg:p-12 mb-10 sm:mb-16 overflow-hidden shadow-xl border border-[#2D4536]">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono text-[#A5C2B1] uppercase tracking-widest block mb-3">
              CREATIVE. STRATEGIC. RESULT-DRIVEN.
            </span>
            <h2 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight">
              We believe great digital presence is built on restraint, speed, and uncompromising taste.
            </h2>
            <p className="text-xs sm:text-base text-[#CAD6CE] leading-relaxed mb-8">
              In a landscape saturated with disposable templates and noisy gimmicks, enduring brands win
              through clarity. We construct calm, authoritative interfaces that command attention and stand
              the test of time.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
              >
                <span>Initiate Studio Partnership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full border border-[#314B3B] text-[#FAF8F5] text-xs font-medium hover:bg-[#233B2E] transition-colors"
              >
                <span>View Our Capabilities</span>
              </Link>
            </div>
          </div>

          {/* Atmospheric background glow */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2D4536]/40 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Four Craftsmanship Pillars */}
        <div className="mb-16 sm:mb-24">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — The Yugark Standard
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614]">
              Our Four Guiding Disciplines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E6DFD3] hover:border-[#2D4536]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-title text-lg font-medium text-[#121614] mb-2">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5C665E] leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Studio Collaboration Workflow */}
        <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-8 sm:p-12 lg:p-16 mb-16 sm:mb-24">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
              — Predictable Execution
            </p>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-[#121614]">
              How We Collaborate
            </h2>
            <p className="text-xs sm:text-sm text-[#616B63] mt-2">
              Every phase has defined deliverables, mutual review checkpoints, and clear milestone dates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {workflowSteps.map((step) => (
              <div key={step.number} className="border-t-2 border-[#2D4536]/20 pt-4">
                <span className="text-xs font-mono font-bold text-[#2D4536] block mb-2">
                  Phase {step.number}
                </span>
                <h3 className="font-serif-title text-lg text-[#121614] mb-2 font-medium">
                  {step.title}
                </h3>
                <p className="text-xs text-[#5D675F] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Banner */}
        <div className="bg-[#121B16] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-white mb-3">
            Let’s Build Something Enduring Together.
          </h2>
          <p className="text-xs sm:text-sm text-[#CAD6CE] max-w-lg mx-auto mb-6">
            Direct communication, senior attention on every project, and zero agency fluff.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
          >
            <span>Start a Project Brief</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
