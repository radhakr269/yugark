import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { navigationLinks, siteConfig } from '../data/studioData';

interface HeaderProps {
  onStartProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartProject }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Precise scroll observer to prevent erratic active indicator jumping
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection('home');
        return;
      }

      const sections = ['services', 'work', 'demos', 'blog', 'about', 'contact'];
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(targetId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#ECE6DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Studio Logo (aligned left) */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex flex-col group cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536] rounded"
        >
          <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#121614] group-hover:text-[#2D4536] transition-colors uppercase">
            {siteConfig.studioName}
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#787D75] uppercase -mt-0.5 sm:-mt-1 font-medium">
            {siteConfig.tagline}
          </span>
        </a>

        {/* Desktop Navigation Menu (Home | Services | Work | Demos | Blog | About | Contact) */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[13px] font-medium tracking-wide text-[#3C423E]">
          {navigationLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition-colors py-1 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D4536] rounded ${
                  isActive
                    ? 'text-[#121614] font-semibold border-b-2 border-[#121614]'
                    : 'hover:text-[#121614]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Start Project CTA: Only shown inline when sufficient width is available (sm screens and up) to prevent crowding on narrow mobile */}
          <button
            onClick={onStartProject}
            className="hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#1A2621] text-[#FAF8F5] text-xs font-medium tracking-wider hover:bg-black transition-all duration-200 shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <span>Start Project</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Accessible Hamburger Menu (aligned right on mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg text-[#121614] hover:bg-[#EAE3D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with accessible links & full-width CTA */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F6F1] border-b border-[#ECE6DC] px-4 py-5 sm:px-6 sm:py-6 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#3C423E]">
            {navigationLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#EAE3D6] text-[#121614] font-semibold'
                      : 'hover:bg-[#EAE3D6]/60 text-[#3C423E]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2D4536]" />}
                </a>
              );
            })}
            <div className="pt-3 border-t border-[#ECE6DC]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full min-h-[44px] inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-colors"
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
