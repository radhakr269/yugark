import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { navigationLinks, siteConfig } from '../data/studioData';

interface HeaderProps {
  onStartProject?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartProject }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleStartProjectClick = () => {
    setMobileMenuOpen(false);
    if (onStartProject) {
      onStartProject();
    } else {
      navigate('/contact');
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#ECE6DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Studio Logo (aligned left) */}
        <Link
          to="/"
          className="flex flex-col group cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536] rounded"
        >
          <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#121614] group-hover:text-[#2D4536] transition-colors uppercase">
            {siteConfig.studioName}
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#787D75] uppercase -mt-0.5 sm:-mt-1 font-medium">
            {siteConfig.tagline}
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[13px] font-medium tracking-wide text-[#3C423E]">
          {navigationLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors py-1 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D4536] rounded ${
                  active
                    ? 'text-[#121614] font-semibold border-b-2 border-[#121614]'
                    : 'hover:text-[#121614]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Start Project CTA: direct navigation to /contact */}
          <button
            onClick={handleStartProjectClick}
            className="hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#1A2621] text-[#FAF8F5] text-xs font-medium tracking-wider hover:bg-black transition-all duration-200 shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <span>Start Project</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Accessible Hamburger Menu (aligned right on mobile/tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg text-[#121614] hover:bg-[#EAE3D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Drawer with accessible links & full-width CTA */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F6F1] border-b border-[#ECE6DC] px-4 py-5 sm:px-6 sm:py-6 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-[#3C423E]">
            {navigationLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-[#EAE3D6] text-[#121614] font-semibold'
                      : 'hover:bg-[#EAE3D6]/60 text-[#3C423E]'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#2D4536]" />}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#ECE6DC]">
              <button
                onClick={handleStartProjectClick}
                className="w-full min-h-[44px] inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-colors cursor-pointer"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
