import React from 'react';
import { Mail, ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { siteConfig, navigationLinks, servicesData } from '../data/studioData';

interface FooterProps {
  onNavClick: (href: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenSitemap: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onOpenPrivacy,
  onOpenTerms,
  onOpenSitemap,
}) => {
  return (
    <footer className="bg-[#121B16] text-[#A6B2AB] pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-[#232F28]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#FAF8F5] uppercase">
                {siteConfig.studioName}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#7B8B81] uppercase -mt-0.5 sm:-mt-1 font-medium">
                {siteConfig.tagline}
              </span>
            </div>
            <p className="text-xs text-[#89978F] leading-relaxed max-w-xs pt-1">
              Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Quick Links
            </p>
            <ul className="space-y-2 text-xs">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavClick(link.href)}
                    className="hover:text-white transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8AA795]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="lg:col-span-3 space-y-2.5 sm:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Our Services
            </p>
            <ul className="space-y-2 text-xs">
              {servicesData.map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onNavClick('#services')}
                    className="hover:text-white transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8AA795]"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Verified Contact Us */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact Us
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#7C8F83] shrink-0" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-white transition-colors text-white font-medium"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
              <p className="text-[11px] text-[#7C8F83] leading-relaxed">
                Direct inquiries for new client engagements, brand consulting, and website projects.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#1C2922] flex items-center justify-center hover:bg-white hover:text-[#1B2E24] transition-colors text-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-[#1C2922] flex items-center justify-center hover:bg-white hover:text-[#1B2E24] transition-colors text-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#1C2922] flex items-center justify-center hover:bg-white hover:text-[#1B2E24] transition-colors text-xs"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal / Copyright Footer Row */}
        <div className="pt-6 sm:pt-8 border-t border-[#1F2C24] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6E7C73] gap-3 sm:gap-0">
          <p>© 2025 Yugark Digital Studio. All rights reserved.</p>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-white transition-colors cursor-pointer">
              Terms
            </button>
            <span>•</span>
            <button onClick={onOpenSitemap} className="hover:text-white transition-colors cursor-pointer">
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
