import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { siteConfig } from '../data/studioData';
import { SEOHead } from '../components/SEOHead';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-24">
      <SEOHead
        title="Privacy Policy & Data Stewardship"
        description="Official privacy policy and client data confidentiality commitment of Yugark Digital Studio."
        canonicalPath="/privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-[#7C887E] mb-8">
          <Link to="/" className="hover:text-[#121614] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#121614] font-semibold">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <header className="mb-10 sm:mb-14 pb-8 border-b border-[#E8E2D7]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5ECE7] text-[#294B37] text-[11px] font-semibold tracking-wider uppercase mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Studio Governance</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-5xl font-medium text-[#121614] leading-tight mb-4">
            Privacy Policy & Data Stewardship
          </h1>
          <p className="text-xs sm:text-sm text-[#6C776E]">
            Last Updated & Ratified: February 2026 • Effective Globally
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 sm:space-y-12 text-[#3C463F] leading-relaxed text-xs sm:text-sm">
          {/* Section 1 */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3]">
            <h2 className="font-serif-title text-xl font-medium text-[#121614] mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#2D4536]" />
              <span>01. Commitment to Client Confidentiality</span>
            </h2>
            <p className="mb-3 text-[#535D55]">
              Yugark Digital Studio ("we", "our", or "the Studio") operates as a boutique creative and technical consultancy.
              We treat all client communications, preliminary project concepts, business metrics, and codebases
              with strict fiduciary confidentiality.
            </p>
            <p className="text-[#535D55]">
              We do not sell, rent, monetize, or distribute client contact details, project briefs, or business intelligence
              to third-party advertising brokers or data harvesting syndicates.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3]">
            <h2 className="font-serif-title text-xl font-medium text-[#121614] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2D4536]" />
              <span>02. Information We Collect</span>
            </h2>
            <p className="mb-3 text-[#535D55]">
              When you submit a project inquiry or communicate with our studio directors, we collect only the necessary
              information required to formulate an accurate proposal and execute the engagement:
            </p>
            <ul className="space-y-2 mb-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] mt-0.5 shrink-0" />
                <span>Contact parameters: Full name, business email address, phone/WhatsApp number.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] mt-0.5 shrink-0" />
                <span>Project parameters: Required services, project timeline, scope descriptions, and brand assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] mt-0.5 shrink-0" />
                <span>Technical telemetry: Anonymous, aggregate visit metrics to optimize site rendering performance and Core Web Vitals.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3]">
            <h2 className="font-serif-title text-xl font-medium text-[#121614] mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2D4536]" />
              <span>03. Source Code & Intellectual Property Transfer</span>
            </h2>
            <p className="mb-3 text-[#535D55]">
              Unlike software-as-a-service providers that retain proprietary lock-in over your web assets, Yugark Digital Studio
              transfers full intellectual property rights, Git source code repositories, and bespoke design files
              directly to client ownership upon final milestone settlement.
            </p>
            <p className="text-[#535D55]">
              Any pre-existing reusable open-source component frameworks (such as React, Tailwind CSS, or Vite)
              remain governed under their respective permissive open-source licenses (MIT/Apache 2.0).
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3]">
            <h2 className="font-serif-title text-xl font-medium text-[#121614] mb-3">
              04. Cookies & Analytics
            </h2>
            <p className="text-[#535D55]">
              Our public website uses minimal, essential performance tracking to ensure rapid page delivery.
              We do not employ intrusive behavioral tracking or third-party retargeting pixels on this portfolio platform
              without your explicit engagement.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3]">
            <h2 className="font-serif-title text-xl font-medium text-[#121614] mb-3">
              05. Direct Contact for Privacy Matters
            </h2>
            <p className="mb-3 text-[#535D55]">
              If you have any questions regarding how your data is handled, or wish to request the deletion
              of historical project correspondence from our studio archives, please contact:
            </p>
            <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#ECE5D9] inline-block">
              <p className="font-semibold text-[#121614]">Studio Privacy Officer</p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-[#2D4536] hover:underline font-medium text-xs sm:text-sm"
              >
                {siteConfig.contactEmail}
              </a>
              <p className="text-[11px] text-[#788479] mt-0.5">
                Yugark Digital Studio • Global Digital Practice
              </p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D7] text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
