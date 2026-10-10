import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Clock,
  Laptop,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { submitLead, getWebsiteSettings } from '../lib/cms';
import { siteConfig } from '../data/studioData';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { InnerPageNav } from '../components/InnerPageNav';

export const FreeDemoPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Clinic & Healthcare');
  const [requirements, setRequirements] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const categories = [
    'Clinic & Healthcare',
    'Architecture & Interior',
    'Beauty, Salon & Wellness',
    'Fitness, Gym & Training',
    'E-Commerce & Retail',
    'Corporate & Professional Services',
    'Restaurant, Cafe & Hospitality',
    'Creative Studio & Agency',
    'Other Business',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMsg('Please enter your business or clinic name.');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, '').length < 8) {
      setErrorMsg('Please provide a valid WhatsApp number (minimum 8 digits with country code).');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address, or leave it blank.');
      return;
    }
    if (!requirements.trim() || requirements.trim().length < 5) {
      setErrorMsg('Please outline your website requirements or what you wish to see in your demo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitLead({
        name: fullName.trim(),
        email: email.trim() || undefined,
        phone: whatsappNumber.trim(),
        business_name: businessName.trim(),
        requirement: `[Business Category: ${category}]\n\nRequirements & Vision:\n${requirements.trim()}`,
        service: 'Free Website Demo',
        timeline: 'Immediate Free Demo Preview',
        page_source: 'free_website_demo_page',
        website_honeypot: honeypot,
      });

      if (result && result.success) {
        setRefId(result.refId || `YUG-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmitted(true);
      } else {
        throw new Error(result?.message || 'Server did not acknowledge demo submission.');
      }
    } catch (err: any) {
      console.error('Lead submission failure:', err);
      setErrorMsg(
        err.message ||
          'Failed to record your demo request. Please check your network connection or message our studio directly via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Yugark Studio, I would like to request a Free Website Demo for "${businessName || 'my business'}" (${category}). Name: ${fullName}, Phone: ${whatsappNumber}. Requirements: ${requirements}`
    );
    window.open(`https://wa.me/919125272460?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEOHead
        title="Get Your Free Website Demo — Yugark Digital Studio"
        description="Experience an interactive bespoke preview built specifically for your business or clinic before making any financial commitment."
        canonicalPath="/free-demo"
      />

      <div className="bg-[#F8F6F1] min-h-screen py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-[#7B857D] mb-4 sm:mb-6">
            <Link to="/" className="hover:text-[#121614] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#B0B8B2]" />
            <span className="text-[#121614] font-medium">Free Website Demo</span>
          </div>

          {/* Page Heading & Value Props */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4ECE6] border border-[#BACBBF] text-[#22442F] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#2D4536]" />
              <span>Complimentary Studio Initiative</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-[42px] font-medium text-[#121614] leading-tight mb-2.5">
              Get Your Free Website Demo
            </h1>
            <p className="text-xs sm:text-sm text-[#5C665E] leading-relaxed">
              We design and configure an interactive digital prototype customized to your brand, aesthetics, and patient/client booking flow with zero upfront obligation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Card */}
            <div className="lg:col-span-7 bg-[#FAF7F2] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E6DFD3] shadow-xs">
              {submitted ? (
                <div className="text-center py-8 sm:py-12 space-y-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#2D4536] uppercase bg-[#E2EBE4] px-2.5 py-1 rounded-md">
                      Ref #{refId}
                    </span>
                  </div>
                  <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
                    Demo Brief Transmitted Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556358] leading-relaxed max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-[#121614]">{fullName}</span>! We have queued your demonstration for <span className="font-semibold text-[#121614]">{businessName}</span>. Our lead digital designer will review your specifications and contact your WhatsApp within 24–48 hours.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors shadow-sm cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp Query</span>
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#D5CDC1] bg-white text-[#121614] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Return to Homepage
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="website_honeypot"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1 leading-relaxed">
                        <p className="font-semibold">Submission Incomplete</p>
                        <p>{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Verma / Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs sm:text-sm text-[#121614] placeholder-[#9EA8A0] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536]"
                    />
                  </div>

                  {/* 2. Business / Clinic Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1.5">
                      Business or Clinic Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Dental Clinic / Aurora Interiors"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs sm:text-sm text-[#121614] placeholder-[#9EA8A0] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536]"
                    />
                  </div>

                  {/* 3. WhatsApp Number & Email in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1.5">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs sm:text-sm text-[#121614] placeholder-[#9EA8A0] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-[10px] text-[#78857C] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. contact@business.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs sm:text-sm text-[#121614] placeholder-[#9EA8A0] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536]"
                      />
                    </div>
                  </div>

                  {/* 4. Business Category */}
                  <div>
                    <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1.5">
                      Business Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536]"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Website Requirements */}
                  <div>
                    <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1.5">
                      Website Requirements &amp; Preferred Style <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="e.g. We need an appointment booking system, doctor profiles, treatments list, modern luxury aesthetic..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs sm:text-sm text-[#121614] placeholder-[#9EA8A0] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A2621] text-white text-xs sm:text-sm font-semibold tracking-wider hover:bg-black transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-[#9AC3A8]" />
                          <span>Transmitting Demo Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#7A857D] mt-2">
                      100% Free • No Credit Card Required • Delivered In 24–48 Hours
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Information & Guarantees */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DFD3]">
                <h3 className="font-serif-title text-base sm:text-lg font-medium text-[#121614] mb-3">
                  What Happens Next?
                </h3>
                <ul className="space-y-3 text-xs text-[#525E55] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E5EDE7] text-[#2D4536] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </div>
                    <span>
                      <strong className="text-[#121614]">Brief Analysis:</strong> Our studio reviews your category, design preferences, and services.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E5EDE7] text-[#2D4536] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </div>
                    <span>
                      <strong className="text-[#121614]">Interactive Prototype:</strong> We build an interactive preview demo featuring responsive device mockups.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E5EDE7] text-[#2D4536] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </div>
                    <span>
                      <strong className="text-[#121614]">WhatsApp Walkthrough:</strong> We send the live preview link directly to your WhatsApp for test-driving.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DFD3] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#121614] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#2D4536]" />
                  <span>The Yugark Guarantee</span>
                </div>
                <p className="text-xs text-[#556358] leading-relaxed">
                  Zero sales pressure. If you love the prototype, we can launch it with full custom branding and Supabase CMS. If not, you keep all insights at no cost.
                </p>
                <div className="pt-2">
                  <a
                    href={siteConfig.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D4536] hover:underline"
                  >
                    <span>Prefer direct chat? Message {siteConfig.whatsappNumber}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
