import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Instagram } from 'lucide-react';
import { siteConfig } from '../data/studioData';
import { getWebsiteSettings } from '../lib/cms';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onOpenTerms?: () => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const navigate = useNavigate();
  const [whatsappUrl, setWhatsappUrl] = useState(siteConfig.whatsappUrl || 'https://wa.me/919125205132');
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail || 'business@yugark.in');
  const [instagramUrl, setInstagramUrl] = useState<string>(siteConfig.socials?.instagram || 'https://www.instagram.com/yugark.in/');
  const [linkedinUrl, setLinkedinUrl] = useState<string>(siteConfig.socials?.linkedin || 'https://www.linkedin.com/company/yugark');

  useEffect(() => {
    async function loadSettings() {
      const settings = await getWebsiteSettings();
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
      if (settings?.contactEmail) {
        setContactEmail(settings.contactEmail);
      }
      if (settings?.socials?.instagram) {
        setInstagramUrl(settings.socials.instagram);
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
    <footer className="w-full bg-transparent px-3 sm:px-4 md:px-6 py-4 sm:py-6" id="contact">
      <div className="max-w-6xl mx-auto">

        {/* ========================================================
            MOBILE & TABLET FOOTER (< lg)
            Matches user's "Mobile Footer — Final Compact Design"
            - Logo & brand at top with short description
            - Row 1: Start Project ↗ | Email | WhatsApp
            - Row 2: Instagram | LinkedIn
            - NO Services section
           ======================================================== */}
        <div className="block lg:hidden rounded-2xl bg-[#14261C] text-[#FAF8F5] p-5 sm:p-6 shadow-lg border border-[#1E3628]">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#223B2D] flex items-center justify-center font-bold text-white text-base shadow-xs select-none">
              Y
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wide text-white font-sans uppercase">
                YUGARK
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#90A799] uppercase">
                DIGITALSTUDIO
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-[13px] text-[#C1D4C8] font-light leading-relaxed">
            Websites, creative content &amp; digital marketing.
          </p>

          {/* Button Row 1: Start Project ↗ | Email | WhatsApp */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => navigate('/contact')}
              className="h-10 sm:h-11 rounded-full bg-[#EFECE6] hover:bg-[#FAF8F5] text-[#14261C] text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer px-2 text-center"
            >
              <span>Start Project</span>
              <span className="text-xs">↗</span>
            </button>

            <a
              href={`mailto:${contactEmail}`}
              className="h-10 sm:h-11 rounded-full bg-[#273E31] hover:bg-[#2F4A3B] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs px-2 text-center"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>Email</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="h-10 sm:h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs px-2 text-center"
            >
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Button Row 2: Instagram | LinkedIn */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="h-10 sm:h-11 rounded-full bg-[#273E31] hover:bg-[#2F4A3B] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Instagram className="w-4 h-4 shrink-0 text-[#E1306C]" />
              <span>Instagram</span>
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="h-10 sm:h-11 rounded-full bg-[#273E31] hover:bg-[#2F4A3B] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            DESKTOP FOOTER (>= lg)
            Matches user's "Desktop Footer — Final Compact Design"
            - One slim horizontal forest-green pill/container
            - Brand on left: YUGARK / DIGITAL STUDIO / Websites. Content. Growth.
            - SERVICES in center (2 columns, 5 items)
            - Contact & Social buttons grouped on right in 2 compact rows
           ======================================================== */}
        <div className="hidden lg:flex items-center justify-between rounded-2xl bg-[#14261C] text-[#FAF8F5] px-8 py-5 shadow-lg border border-[#1E3628]">
          
          {/* Brand Left */}
          <div className="shrink-0 max-w-[220px]">
            <h2 className="font-extrabold text-lg tracking-wider text-white uppercase font-sans">
              YUGARK
            </h2>
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#90A799] uppercase mt-0.5">
              DIGITAL STUDIO
            </div>
            <p className="text-xs text-[#C1D4C8] mt-1.5 font-normal">
              Websites. Content. Growth.
            </p>
          </div>

          {/* Services Center */}
          <div className="px-6">
            <div className="text-[10px] font-mono tracking-widest text-[#90A799] uppercase font-semibold mb-1">
              SERVICES
            </div>
            <div className="flex items-start gap-8 text-xs">
              <div className="space-y-1">
                <div>
                  <Link
                    to="/services/website-development"
                    className="text-[#CAD7CE] hover:text-white transition-colors block whitespace-nowrap"
                  >
                    Website Development
                  </Link>
                </div>
                <div>
                  <Link
                    to="/services/social-media-management"
                    className="text-[#CAD7CE] hover:text-white transition-colors block whitespace-nowrap"
                  >
                    Social Media
                  </Link>
                </div>
              </div>

              <div className="space-y-1">
                <div>
                  <Link
                    to="/services/social-media-advertising"
                    className="text-[#CAD7CE] hover:text-white transition-colors block whitespace-nowrap"
                  >
                    Paid Advertisement
                  </Link>
                </div>
                <div>
                  <Link
                    to="/services/ai-content-video"
                    className="text-[#CAD7CE] hover:text-white transition-colors block whitespace-nowrap"
                  >
                    AI Creative
                  </Link>
                </div>
                <div>
                  <Link
                    to="/services/digital-growth-strategy"
                    className="text-[#CAD7CE] hover:text-white transition-colors block whitespace-nowrap"
                  >
                    Digital Studio Strategy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Action Buttons Right (Stacked 2 rows) */}
          <div className="shrink-0 flex flex-col items-end gap-2.5">
            {/* Top Row: Start Project | Email Icon | WhatsApp */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/contact')}
                className="h-9 px-4 rounded-full bg-[#EFECE6] hover:bg-[#FAF8F5] text-[#14261C] text-xs font-semibold flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                Start Project
              </button>

              <a
                href={`mailto:${contactEmail}`}
                aria-label="Email Us"
                className="w-9 h-9 rounded-full bg-[#273E31] hover:bg-[#2F4A3B] text-white flex items-center justify-center transition-all shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#CAD7CE]" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center transition-all shadow-xs"
              >
                WhatsApp
              </a>
            </div>

            {/* Bottom Row: Instagram | LinkedIn */}
            <div className="flex items-center gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 px-4 rounded-full bg-[#273E31] hover:bg-[#2F4A3B] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>Instagram</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 px-4 rounded-full bg-[#273E31] hover:bg-[#2F4A3B] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
