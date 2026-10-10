import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Send,
  AlertCircle,
} from 'lucide-react';
import { siteConfig, servicesData } from '../data/studioData';
import { SEOHead } from '../components/SEOHead';
import { submitLead, getWebsiteSettings } from '../lib/cms';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { InnerPageNav } from '../components/InnerPageNav';

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

  const [whatsappUrl, setWhatsappUrl] = useState(siteConfig.whatsappUrl);
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail);

  useEffect(() => {
    async function loadSettings() {
      const settings = await getWebsiteSettings();
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
      if (settings?.contactEmail) {
        setContactEmail(settings.contactEmail);
      }
    }
    loadSettings();
  }, []);

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

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please provide either your email or WhatsApp number so we can respond.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitLead({
        name: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        requirement: message.trim() || 'General Project Consultation Inquiry',
        service: selectedService,
        timeline,
        page_source: 'website_contact_page',
        website_honeypot: honeypot,
      });

      if (result && result.success) {
        setInquiryRef(result.refId || `YUG-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmitted(true);
      } else {
        setErrorMsg('We encountered an error recording your brief. Please message our studio directly via WhatsApp.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please connect with our team via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dynamicWhatsAppInquiryUrl = `${whatsappUrl}?text=${encodeURIComponent(
    `Hello Yugark Studio, I would like to discuss a project.\nName: ${fullName || 'Client'}\nService: ${selectedService}\nNotes: ${message || 'Project inquiry'}`
  )}`;

  return (
    <div className="bg-[#F8F6F1] py-6 sm:py-10 lg:py-14">
      <SEOHead
        title="Start a Project & Studio Contact"
        description="Connect directly with Yugark Digital Studio. Submit a project brief, email our directors, or chat directly via verified WhatsApp."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <InnerPageNav currentPageTitle="Contact Yugark" />

        {/* Page Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Project Inquiries
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-3">
            Let's Talk About Your Project.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            Tell us what your business needs. We'll help you explore the right solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-16">
          {/* Left Column: Direct Communication Channels & Details */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* WhatsApp Priority Action Box */}
            <div className="bg-[#18261F] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#2D4536] shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5C2B1] block">
                    Fastest Response Channel
                  </span>
                  <h2 className="font-serif-title text-lg sm:text-xl font-medium text-white">
                    Chat on WhatsApp
                  </h2>
                </div>
              </div>
              <p className="text-xs text-[#CAD6CE] leading-relaxed mb-5">
                Have a quick question? Send us a WhatsApp enquiry.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-semibold tracking-wider hover:bg-[#20ba5a] transition-all shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Query</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
                    href={`mailto:${contactEmail}`}
                    className="text-xs sm:text-sm font-semibold text-[#121614] hover:text-[#2D4536] transition-colors"
                  >
                    {contactEmail}
                  </a>
                  <p className="text-[11px] text-[#7C887E] mt-0.5">
                    Replies sent directly by our core digital team.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center shrink-0 mt-0.5">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block">
                    Verified WhatsApp
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2D4536] hover:text-[#18261F] transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Query</span>
                  </a>
                  <p className="text-[11px] text-[#7C887E] mt-0.5">
                    Monday to Saturday studio hours
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
                and technical requirements are strictly protected.
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
                  We will review your requirements and reach out directly.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={dynamicWhatsAppInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp Query</span>
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-[#ECE5D9] pb-4 mb-2">
                  <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
                    Project Consultation Brief
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6C786F] mt-1">
                    Fill out the parameters below to receive an authentic scope proposal.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="website_honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D4740] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhe Verma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED6C7] text-xs text-[#121614] placeholder-[#9EAAA2] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D4740] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED6C7] text-xs text-[#121614] placeholder-[#9EAAA2] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536] transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Service Required Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D4740] mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED6C7] text-xs text-[#121614] placeholder-[#9EAAA2] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D4740] mb-2">
                      Primary Service Focus
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED6C7] text-xs text-[#121614] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536] transition-all"
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="General Brand Advisory">General Brand Advisory</option>
                    </select>
                  </div>
                </div>

                {/* Timeline Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D4740] mb-2">
                    Target Completion Timeline
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {['Immediate (< 2 weeks)', 'Standard (2–4 weeks)', 'Flexible Scope'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTimeline(t)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                          timeline === t
                            ? 'bg-[#18261F] text-white border-[#18261F]'
                            : 'bg-white text-[#4A544C] border-[#DED6C7] hover:border-[#18261F]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brief Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D4740] mb-2">
                    Project Vision &amp; Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your brand, current challenges, and desired digital outcome..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED6C7] text-xs text-[#121614] placeholder-[#9EAAA2] focus:outline-none focus:border-[#2D4536] focus:ring-1 focus:ring-[#2D4536] transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#18261F] text-[#FAF8F5] text-xs font-bold tracking-wider hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Brief...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
