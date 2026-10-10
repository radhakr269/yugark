import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/studioData';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  to?: string;
  className?: string;
  showMark?: boolean;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  asLink = true,
  to = '/',
  className = '',
  showMark = true,
  showText = true,
}) => {
  const isDark = variant === 'dark';
  const [hasValidImage, setHasValidImage] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = '/assets/images/logo.jpg';
    img.onload = () => setHasValidImage(true);
  }, []);

  const markSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[7px] sm:text-[7.5px]',
    md: 'text-[8px] sm:text-[8.5px]',
    lg: 'text-[9px] sm:text-[10px]',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {showMark && (
        <div
          className={`relative ${markSizes[size]} shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs overflow-hidden ${
            isDark
              ? 'bg-[#21352A] ring-1 ring-white/15'
              : 'bg-[#18261F] ring-1 ring-black/5'
          }`}
          aria-hidden="true"
        >
          {hasValidImage ? (
            <img
              src="/assets/images/logo.jpg"
              alt="YUGARK"
              className="w-full h-full object-cover rounded-lg sm:rounded-xl"
            />
          ) : (
            /* Studio Monogram Vector Mark */
            <svg
              viewBox="0 0 64 64"
              className="w-4/5 h-4/5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Geometric Y structure */}
              <path
                d="M19 19 L32 37 L45 19"
                stroke={isDark ? '#FAF8F5' : '#F8F6F1'}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 37 L32 47"
                stroke={isDark ? '#FAF8F5' : '#F8F6F1'}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Studio Green/Gold Accent dot */}
              <circle
                cx="32"
                cy="18"
                r="2.8"
                fill={isDark ? '#5AE48B' : '#588157'}
              />
            </svg>
          )}
        </div>
      )}

      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          <span
            className={`font-serif-title ${titleSizes[size]} font-bold tracking-[0.18em] uppercase leading-none transition-colors ${
              isDark
                ? 'text-[#FAF8F5] group-hover:text-white'
                : 'text-[#121614] group-hover:text-[#2D4536]'
            }`}
          >
            {siteConfig.studioName}
          </span>
          <span
            className={`font-mono ${subtitleSizes[size]} tracking-[0.32em] uppercase font-medium mt-1 sm:mt-1.2 leading-none transition-colors ${
              isDark ? 'text-[#8AA795]' : 'text-[#787D75]'
            }`}
          >
            DIGITAL STUDIO
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        to={to}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536] rounded"
        aria-label={`${siteConfig.studioName} Digital Studio Home`}
      >
        {content}
      </Link>
    );
  }

  return content;
};
