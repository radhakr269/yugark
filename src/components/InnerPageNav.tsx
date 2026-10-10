import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface InnerPageNavProps {
  currentPageTitle?: string;
}

export const InnerPageNav: React.FC<InnerPageNavProps> = ({ currentPageTitle }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navigate to previous internal history if safe, otherwise return to home
    if (window.history.length > 1 && (window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-between py-3 mb-4 sm:mb-6 border-b border-[#EAE3D6] text-xs font-medium text-[#5A635C]">
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoBack}
          aria-label="Go Back"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#DED6C7] text-[#121614] hover:bg-white hover:border-[#121614] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D4536]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>

        <Link
          to="/"
          aria-label="Back to Homepage"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#DED6C7] text-[#121614] hover:bg-white hover:border-[#121614] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D4536]"
        >
          <Home className="w-3.5 h-3.5 text-[#2D4536]" />
          <span className="hidden sm:inline">Back to Homepage</span>
        </Link>
      </div>

      {currentPageTitle && (
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A857D] truncate max-w-[200px] sm:max-w-xs">
          {currentPageTitle}
        </span>
      )}
    </div>
  );
};
