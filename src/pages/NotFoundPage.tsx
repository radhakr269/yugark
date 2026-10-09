import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] bg-[#F8F6F1] flex items-center justify-center px-4 py-20">
      <SEOHead
        title="Page Not Found"
        description="The requested studio page could not be located."
        canonicalPath="/404"
      />
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-[#7C887E] uppercase block mb-2">
          Error 404
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-medium text-[#121614] mb-4">
          Page Not Located
        </h1>
        <p className="text-xs sm:text-sm text-[#5D675F] leading-relaxed mb-8">
          The route you navigated to does not exist in our studio architecture or has been restructured.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
          >
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
