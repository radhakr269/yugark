import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Linkedin } from 'lucide-react';
import { siteConfig } from '../data/studioData';
import { getWebsiteSettings } from '../lib/cms';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenTerms?: () => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
}) => {
  const navigate = useNavigate();
  const [whatsappUrl, setWhatsappUrl] = useState(siteConfig.whatsappUrl);
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail);
  const [linkedinUrl, setLinkedinUrl] = useState<string | undefined>(siteConfig.socials?.linkedin);

  useEffect(() => {
    async function loadSettings() {
      const settings = await getWebsiteSettings();
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
      if (settings?.contactEmail) {
        setContactEmail(settings.contactEmail);
      }
      if (settings?.socials?.linkedin) {
        setLinkedinUrl(settings.socials.linkedin);
      }
    }
    loadSettings();

    const handleUpdate = () => loadSettings();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  return (
    <footer
      className="bg-[#18261F] text-[#B0C0B7] border-t border-[#253A2F] relative overflow-hidden"
      id="contact"
    >
      {/* Subtle forest-green gradient and muted ivory glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(45,69,54,0.45),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* ROW 1: Compact Integrated CTA Bar */}
        <div className="py-4 sm:py-5 border-b border-[#253A2F] flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div className="max-w-xl">
            <h2 className="font-serif-title text-lg sm:text-xl lg:text-2xl font-medium text-[#FAF8F5] leading-snug">
              Ready to Grow Your Brand?
            </h2>
            <p className="text-[11.5px] sm:text-xs text-[#CAD6CE] mt-0.5 font-light leading-relaxed">
              Let&apos;s build a stronger digital presence for your business.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="min-h-[36px] inline-flex items-center justify-center px-4 sm:px-4.5 py-1.5 rounded-full bg-[#FAF8F5] text-[#1B2E24] text-xs font-semibold tracking-wide hover:bg-white transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-[36px] inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold tracking-wide hover:bg-[#20ba5a] transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp Query</span>
            </a>
          </div>
        </div>

        {/* ROW 2: Ultra-Compact Multi-Column Navigation (Brand | Services | Contact) */}
        <div className="py-5 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start text-xs">
          {/* Brand Wordmark & Description */}
          <div className="md:col-span-4 space-y-2">
            <BrandLogo variant="dark" size="sm" />

            <p className="text-[11px] sm:text-[11.5px] text-[#98AAA0] max-w-xs leading-relaxed">
              Websites, creative content and digital marketing for growing businesses.
            </p>

            {/* Subtle legal links inline without any copyright row */}
            <div className="pt-0.5 flex items-center gap-2.5 text-[10px] text-[#7E9185]">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              {onOpenTerms ? (
                <button onClick={onOpenTerms} className="hover:text-white transition-colors cursor-pointer">
                  Terms
                </button>
              ) : (
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Terms
                </Link>
              )}
            </div>
          </div>

          {/* EXACT FIVE SERVICES in a balanced 2-column grid */}
          <div className="md:col-span-5 space-y-1.5">
            <p className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-wider text-white font-semibold mb-2">
              Services
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] sm:text-xs">
              {/* Column A */}
              <div className="space-y-1.5">
                <div>
                  <Link
                    to="/services/website-development"
                    className="hover:text-white transition-colors block text-[#CAD6CE]"
                  >
                    Website Development
                  </Link>
                </div>
                <div>
                  <Link
                    to="/services/social-media-management"
                    className="hover:text-white transition-colors block text-[#CAD6CE]"
                  >
                    Social Media
                  </Link>
                </div>
              </div>

              {/* Column B */}
              <div className="space-y-1.5">
                <div>
                  <Link
                    to="/services/social-media-advertising"
                    className="hover:text-white transition-colors block text-[#CAD6CE]"
                  >
                    Paid Advertisement
                  </Link>
                </div>
                <div>
                  <Link
                    to="/services/ai-content-video"
                    className="hover:text-white transition-colors block text-[#CAD6CE]"
                  >
                    AI Creative
                  </Link>
                </div>
                <div>
                  <Link
                    to="/services/digital-growth-strategy"
                    className="hover:text-white transition-colors block text-[#CAD6CE]"
                  >
                    Digital Studio Strategy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Actions: Email Us, WhatsApp Query & LinkedIn (No visible phone number, No Instagram) */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-wider text-white font-semibold">
              Get In Touch
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-white border border-white/15 text-[11px] font-medium transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                <Mail className="w-3.5 h-3.5 text-[#CAD6CE]" />
                <span>Email Us</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-semibold transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp Query</span>
              </a>

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Connect with Yugark on LinkedIn"
                  className="w-7 h-7 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-white/15 flex items-center justify-center transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
