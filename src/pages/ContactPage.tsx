import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Send,
  AlertCircle,
} from 'lucide-react';
import { siteConfig, servicesData } from '../data/studioData';
import { SEOHead } from '../components/SEOHead';
import { submitLead } from '../lib/cms';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState('Website Development');
  const [timeline, setTimeline] = useState('Standard (2–4 weeks)');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryRef, setInquiryRef] = useState('');

  // Handle URL query parameters to pre-fill context
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const projectParam = searchParams.get('project');
    const packageParam = searchParams.get('package');
    const demoParam = searchParams.get('demo');

    if (serviceParam) {
      const match = servicesData.find((s) => s.slug === serviceParam);
      if (match) setSelectedService(match.title);
    }
    if (packageParam) {
      setMessage((prev) =>
        prev ? prev : `Inquiring about engagement package: ${packageParam.replace(/-/g, ' ').toUpperCase()}`
      );
    }
    if (projectParam) {
      setMessage((prev) =>
        prev ? prev : `Inquiring regarding architectural case study: ${projectParam.replace(/-/g, ' ').toUpperCase()}`
      );
    }
    if (demoParam) {
      setMessage((prev) =>
        prev ? prev : `Inquiring about acquiring and customizing website demo: ${demoParam.replace(/-/g, ' ').toUpperCase()}`
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await submitLead({
        name: fullName,
        email,
        phone,
        requirement: message,
        service: selectedService,
        timeline,
        page_source: 'website_contact_page',
        website_honeypot: honeypot,
      });

      if (result.success) {
        setInquiryRef(result.refId);
        setSubmitted(true);
      } else {
        setErrorMsg('We encountered an error recording your brief. Please message us on WhatsApp.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please connect with our team via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/919125272460?text=${encodeURIComponent(
    `Hello Yugark Studio, I would like to discuss a project.\nName: ${fullName || 'Client'}\nService: ${selectedService}\nNotes: ${message || 'Project inquiry'}`
  )}`;

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-24">
      <SEOHead
        title="Start a Project & Studio Contact"
        description="Connect directly with Yugark Digital Studio. Submit a project brief, email our directors, or chat directly via verified WhatsApp."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Project Inquiries
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            Let’s Build Something Remarkable.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            Every partnership starts with a direct scope consultation. Share your brand parameters,
            timelines, and objectives below, or message us directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-16">
          {/* Left Column: Direct Communication Channels & Details (No physical address, WhatsApp only) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* WhatsApp Priority Action Box */}
            <div className="bg-[#1B2E24] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#2D4536] shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5C2B1] block">
                    Fastest Response Channel
                  </span>
                  <h3 className="font-serif-title text-lg font-medium text-white">
                    Direct WhatsApp Chat
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[#CAD6CE] leading-relaxed mb-5">
                Connect directly with our studio lead on our verified WhatsApp line for immediate project scoping and quick questions.
              </p>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-semibold tracking-wider hover:bg-[#20ba5a] transition-all shadow-sm"
              >
                <span>Message +91 9125272460</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Studio Channels */}
            <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#E6DFD3] space-y-6">
              <h3 className="font-serif-title text-xl font-medium text-[#121614] pb-3 border-b border-[#ECE5D9]">
                Studio Coordinates
              </h3>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block">
                    Direct Studio Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="text-xs sm:text-sm font-semibold text-[#121614] hover:text-[#2D4536] transition-colors"
                  >
                    {siteConfig.contactEmail}
                  </a>
                  <p className="text-[11px] text-[#7C887E] mt-0.5">
                    Replies guaranteed within 24 business hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block">
                    Verified WhatsApp Channel
                  </span>
                  <a
                    href={siteConfig.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm font-semibold text-[#121614] hover:text-[#2D4536] transition-colors"
                  >
                    {siteConfig.whatsappNumber}
                  </a>
                  <p className="text-[11px] text-[#7C887E] mt-0.5">
                    WhatsApp text & voice inquiries • Monday to Saturday
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Commitment Banner */}
            <div className="bg-[#F4EFE6] rounded-2xl p-6 border border-[#ECE5D9]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D4536] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Our Privacy Promise</span>
              </div>
              <p className="text-xs text-[#525B54] leading-relaxed">
                We respect your business confidentiality. Your project concepts, contact information,
                and technical requirements are strictly protected by our studio governance policy.
              </p>
            </div>
          </div>

          {/* Right Column: Functional Project Brief Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E6DFD3] shadow-sm">
            {submitted ? (
              <div className="py-12 sm:py-16 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono text-[#7C887E] uppercase tracking-wider block mb-2">
                  Inquiry Reference #{inquiryRef}
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614] mb-3">
                  Thank You, {fullName || 'Partner'}.
                </h3>
                <p className="text-xs sm:text-sm text-[#5D675F] max-w-md mx-auto leading-relaxed mb-8">
                  Your project parameters have been securely stored in our studio system.
                  We will review your requirements and reach out via email within 24 business hours.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors cursor-pointer"
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614] mb-1">
                    Project Brief Submission
                  </h2>
                  <p className="text-xs text-[#6D776F]">
                    Fill in the details below. All fields marked with * are required.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-xs text-red-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <div>{errorMsg}</div>
                  </div>
                )}

                {/* Honeypot Spam Trap (Hidden from genuine visitors) */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website_honeypot">Leave blank</label>
                  <input
                    type="text"
                    id="website_honeypot"
                    name="website_honeypot"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3C423E] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD5C9] text-xs sm:text-sm text-[#121614] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3C423E] mb-1.5">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD5C9] text-xs sm:text-sm text-[#121614] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                    />
                  </div>
                </div>

                {/* Phone & Service Required Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3C423E] mb-1.5">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD5C9] text-xs sm:text-sm text-[#121614] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3C423E] mb-1.5">
                      Primary Service Required *
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD5C9] text-xs sm:text-sm text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536] cursor-pointer"
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="Social Media">Social Media & Creative</option>
                      <option value="Ads">Performance Ads (Meta & Google)</option>
                      <option value="AI Creative">AI Creative Workflows</option>
                      <option value="Branding">Brand Identity & Design System</option>
                      <option value="Website Demo Customization">Turnkey Website Demo</option>
                      <option value="Comprehensive Studio Retainer">Comprehensive Retainer</option>
                    </select>
                  </div>
                </div>

                {/* Timeline Expectation */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3C423E] mb-1.5">
                    Estimated Launch Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD5C9] text-xs sm:text-sm text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536] cursor-pointer"
                  >
                    <option value="Urgent (< 2 weeks)">Urgent (Less than 2 weeks)</option>
                    <option value="Standard (2–4 weeks)">Standard Studio Build (2–4 weeks)</option>
                    <option value="Flexible (1–2 months)">Flexible Roadmap (1–2 months)</option>
                    <option value="Turnkey Demo Rapid Deployment">Turnkey Demo Deployment (5–7 days)</option>
                  </select>
                </div>

                {/* Project Scope & Details */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3C423E] mb-1.5">
                    Project Scope & Objectives *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your brand, key deliverables, target launch date, and any reference sites you admire..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD5C9] text-xs sm:text-sm text-[#121614] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Brief...' : 'Submit Project Brief to Studio'}</span>
                  </button>
                  <p className="text-[11px] text-[#7C887E] text-center mt-3">
                    Direct confirmation and receipt code provided immediately upon submission.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
