import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react';
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
    <footer className="bg-[#121B16] text-[#A6B2AB] pt-10 sm:pt-16 pb-8 sm:pb-12 border-t border-[#232F28]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 mb-8 sm:mb-16">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 lg:col-span-4 space-y-2 sm:space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#FAF8F5] uppercase">
                {siteConfig.studioName}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#7B8B81] uppercase -mt-0.5 sm:-mt-1 font-medium">
                {siteConfig.tagline}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#89978F] leading-relaxed max-w-xs pt-1">
              Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-1">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-[#1C2922] flex items-center justify-center hover:bg-white hover:text-[#1B2E24] transition-colors text-xs"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full bg-[#1C2922] flex items-center justify-center hover:bg-white hover:text-[#1B2E24] transition-colors text-xs"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded-full bg-[#1C2922] flex items-center justify-center hover:bg-white hover:text-[#1B2E24] transition-colors text-xs"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1 lg:col-span-2 space-y-2 sm:space-y-3">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">
              Quick Links
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavClick(link.href)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="col-span-1 lg:col-span-3 space-y-2 sm:space-y-3">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">
              Our Services
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
              {servicesData.map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onNavClick('#services')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="col-span-2 lg:col-span-3 space-y-2 sm:space-y-3">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">
              Contact Us
            </p>
            <div className="space-y-2 text-[10px] sm:text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#7C8F83] shrink-0" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-white transition-colors text-white font-medium truncate"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#7C8F83] shrink-0" />
                <span className="text-[#89978F]">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#7C8F83] shrink-0" />
                <span className="text-[#89978F]">Bengaluru, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal / Copyright Footer Row */}
        <div className="pt-4 sm:pt-8 border-t border-[#1F2C24] flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-[#6E7C73] gap-2 sm:gap-0">
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
