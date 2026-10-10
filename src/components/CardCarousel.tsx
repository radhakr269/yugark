import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselPreset = 'services' | 'work' | 'demos' | 'pricing' | 'blog' | 'custom';

export interface CardCarouselProps {
  children: React.ReactNode[];
  preset?: CarouselPreset;
  cardClassName?: string;
  gapClassName?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  ariaLabel?: string;
  showControls?: boolean;
  showDots?: boolean;
  controlsPosition?: 'top' | 'bottom' | 'sides' | 'none';
  renderCustomControls?: (helpers: {
    canScrollLeft: boolean;
    canScrollRight: boolean;
    scrollPrev: () => void;
    scrollNext: () => void;
    activeIndex: number;
    totalCards: number;
    isPaused: boolean;
  }) => React.ReactNode;
  className?: string;
}

const PRESET_WIDTH_CLASSES: Record<CarouselPreset, string> = {
  // Mobile ~1.5 to 1.8 visible, Tablet ~2.4 visible, Desktop 5 visible
  services: 'w-[68%] sm:w-[42%] md:w-[34%] lg:w-[calc(20%-13px)]',
  // Mobile ~1.25 to 1.35 visible, Tablet ~2.2 visible, Desktop 3 visible
  work: 'w-[82%] sm:w-[47%] md:w-[46%] lg:w-[calc(33.333%-16px)]',
  // Mobile ~1.3 visible, Tablet ~2.3 visible, Desktop 4 visible
  demos: 'w-[76%] sm:w-[44%] md:w-[32%] lg:w-[calc(25%-15px)]',
  // Mobile ~1.2 visible, Tablet ~2.2 visible, Desktop 4 visible
  pricing: 'w-[84%] sm:w-[46%] md:w-[34%] lg:w-[calc(25%-15px)]',
  // Mobile ~1.25 visible, Tablet ~2.2 visible, Desktop 3 visible
  blog: 'w-[82%] sm:w-[47%] md:w-[46%] lg:w-[calc(33.333%-16px)]',
  custom: 'w-full',
};

export const CardCarousel: React.FC<CardCarouselProps> = ({
  children,
  preset = 'custom',
  cardClassName = '',
  gapClassName = 'gap-3 sm:gap-4 lg:gap-6',
  autoScroll = true,
  autoScrollInterval = 5500,
  ariaLabel = 'Card carousel',
  showControls = true,
  showDots = true,
  controlsPosition = 'bottom',
  renderCustomControls,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = children.length;
  const widthClass = PRESET_WIDTH_CLASSES[preset];

  // Check scroll boundary and update active index
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const tolerance = 4;

    const overflowDetected = scrollWidth > clientWidth + tolerance;
    setHasOverflow(overflowDetected);

    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < maxScroll - tolerance);

    // Compute approximate active card index
    if (el.children.length > 0) {
      let closestIdx = 0;
      let minDistance = Infinity;
      const containerLeft = el.getBoundingClientRect().left;

      Array.from(el.children).forEach((child, idx) => {
        const childLeft = (child as HTMLElement).getBoundingClientRect().left;
        const distance = Math.abs(childLeft - containerLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollState, children]);

  // Scroll to a specific card index
  const scrollToIndex = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el || !el.children[index]) return;

      const child = el.children[index] as HTMLElement;
      const targetLeft = child.offsetLeft - el.offsetLeft;

      el.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    },
    []
  );

  // Scroll Prev
  const scrollPrev = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (canScrollLeft) {
      const scrollAmount = el.clientWidth * 0.75;
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      // Wrap around to end if at beginning
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }
  }, [canScrollLeft]);

  // Scroll Next
  const scrollNext = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (canScrollRight) {
      const scrollAmount = el.clientWidth * 0.75;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      // Loop back to start smoothly
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [canScrollRight]);

  // Auto-scroll loop
  useEffect(() => {
    // Only auto-advance if enabled, not paused, and container actually has overflow
    if (!autoScroll || isPaused || !hasOverflow || totalCards <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    timerRef.current = setInterval(() => {
      scrollNext();
    }, autoScrollInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoScroll, isPaused, hasOverflow, autoScrollInterval, scrollNext, totalCards]);

  // Keyboard navigation inside carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    }
  };

  const controlsHelpers = {
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
    activeIndex,
    totalCards,
    isPaused,
  };

  return (
    <div
      className={`relative group/carousel ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {/* Custom Header Controls if provided */}
      {renderCustomControls && renderCustomControls(controlsHelpers)}

      {/* Top Controls if requested */}
      {controlsPosition === 'top' && showControls && hasOverflow && (
        <div className="flex items-center justify-end gap-1.5 mb-3">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous cards"
            className="w-8 h-8 rounded-full border border-[#DED7CB] bg-[#FAF8F5] hover:bg-[#1A2621] hover:text-white hover:border-[#1A2621] text-[#121614] flex items-center justify-center transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next cards"
            className="w-8 h-8 rounded-full border border-[#DED7CB] bg-[#FAF8F5] hover:bg-[#1A2621] hover:text-white hover:border-[#1A2621] text-[#121614] flex items-center justify-center transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Side Controls if requested */}
      {controlsPosition === 'sides' && showControls && hasOverflow && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous cards"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#1A2621] text-white shadow-md items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next cards"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#1A2621] text-white shadow-md items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Main Horizontal Scroll Container */}
      <div
        ref={containerRef}
        onScroll={updateScrollState}
        className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar ${gapClassName} pb-2.5 pt-1 px-0.5`}
        tabIndex={0}
        aria-live="polite"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={`snap-start snap-always shrink-0 ${widthClass} ${cardClassName}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${totalCards}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Bottom Controls & Dots */}
      {(controlsPosition === 'bottom' || showDots) && hasOverflow && (
        <div className="flex items-center justify-between mt-3 pt-1 border-t border-[#ECE5DA]/60">
          {/* Subtle Dot / Pill Indicators */}
          {showDots && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {children.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? 'w-6 bg-[#1A2621]'
                      : 'w-2 bg-[#D3CBC0] hover:bg-[#A39B8E]'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Bottom Prev / Next Nav Buttons */}
          {controlsPosition === 'bottom' && showControls && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous cards"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#DED7CB] bg-[#FAF8F5] hover:bg-[#1A2621] hover:text-white hover:border-[#1A2621] text-[#121614] flex items-center justify-center transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next cards"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#DED7CB] bg-[#FAF8F5] hover:bg-[#1A2621] hover:text-white hover:border-[#1A2621] text-[#121614] flex items-center justify-center transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
