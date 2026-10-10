import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { siteConfig, navigationLinks, servicesData } from '../data/studioData';
import { getWebsiteSettings } from '../lib/cms';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onOpenTerms?: () => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenSitemap,
}) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
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

    const handleUpdate = () => loadSettings();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  return (
    <footer
      className="bg-[#18261F] text-[#B0C0B7] border-t border-[#253A2F]"
      id="contact"
    >
      {/* Integrated Unified Forest-Green CTA & Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ROW 1: Compact Integrated CTA Bar */}
        <div className="py-6 sm:py-8 lg:py-9 border-b border-[#253A2F] flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          <div className="max-w-xl">
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-[#8AA795] mb-1">
              — Let's Build Something Great
            </p>
            <h2 className="font-serif-title text-xl sm:text-2xl lg:text-3xl font-medium text-[#FAF8F5] leading-tight">
              Ready to Grow Your Brand?
            </h2>
            <p className="text-xs sm:text-[13px] text-[#CAD6CE] mt-1 font-light leading-relaxed">
              Let's create a website, content or digital strategy that helps your business move forward.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="min-h-[40px] inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#FAF8F5] text-[#1B2E24] text-xs font-bold tracking-wider hover:bg-white transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-[40px] inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold tracking-wide hover:bg-[#20ba5a] transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp Query</span>
            </a>
          </div>
        </div>

        {/* ROW 2: Ultra-Compact Multi-Column Navigation */}
        <div className="py-6 sm:py-8 grid grid-cols-2 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 text-xs">
          {/* Brand Wordmark & Tagline: Fixed alignment with no vertical crowding */}
          <div className="col-span-2 md:col-span-4 space-y-2">
            <Link to="/" className="inline-block group focus-visible:outline-none">
              <span className="font-serif-title text-lg sm:text-xl font-bold tracking-[0.18em] text-[#FAF8F5] uppercase block group-hover:text-white transition-colors">
                {siteConfig.studioName}
              </span>
              <span className="text-[8px] sm:text-[8.5px] font-mono tracking-[0.3em] text-[#8AA795] uppercase block mt-0.5">
                DIGITAL STUDIO
              </span>
            </Link>

            <p className="text-[11px] sm:text-xs text-[#98AAA0] max-w-xs leading-relaxed">
              Websites, creative content and digital marketing for growing businesses.
            </p>

            <div className="pt-1 flex items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Query"
                className="w-7 h-7 rounded-full bg-[#22352B] hover:bg-[#25D366] text-[#FAF8F5] flex items-center justify-center transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                aria-label="Email Studio"
                className="w-7 h-7 rounded-full bg-[#22352B] hover:bg-white hover:text-[#18261F] text-[#FAF8F5] flex items-center justify-center transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white font-semibold">
              Quick Links
            </p>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/work" className="hover:text-white transition-colors">Work</Link></li>
              <li><Link to="/demos" className="hover:text-white transition-colors">Demos</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="col-span-1 md:col-span-3 space-y-2">
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white font-semibold">
              Services
            </p>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              <li><Link to="/services/website-development" className="hover:text-white transition-colors">Website Development</Link></li>
              <li><Link to="/services/social-media-management" className="hover:text-white transition-colors">Social Media</Link></li>
              <li><Link to="/services/social-media-advertising" className="hover:text-white transition-colors">Paid Advertising</Link></li>
              <li><Link to="/services/ai-content-video" className="hover:text-white transition-colors">AI Creative</Link></li>
              <li><Link to="/services/digital-growth-strategy" className="hover:text-white transition-colors">Digital Strategy</Link></li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="col-span-2 md:col-span-3 space-y-2">
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white font-semibold">
              Contact
            </p>
            <div className="space-y-2 text-[11px] sm:text-xs">
              <div>
                <span className="text-[9.5px] font-mono uppercase text-[#7E9185] block">Email</span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white transition-colors text-white font-medium"
                >
                  {contactEmail}
                </a>
              </div>

              <div>
                <span className="text-[9.5px] font-mono uppercase text-[#7E9185] block">Direct Inquiry</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#5AE48B] hover:text-white transition-colors font-medium mt-0.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp Query</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Ultra-Minimal Copyright & Legal Bar */}
        <div className="py-4 border-t border-[#253A2F] flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-[#7E9185] gap-2 sm:gap-0">
          <p>© {currentYear} Yugark Digital Studio. All rights reserved.</p>
          <div className="flex items-center space-x-3 sm:space-x-4">
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
            <span>•</span>
            {onOpenSitemap ? (
              <button onClick={onOpenSitemap} className="hover:text-white transition-colors cursor-pointer">
                Sitemap
              </button>
            ) : (
              <Link to="/services" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
