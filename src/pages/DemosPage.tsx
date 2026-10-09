import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Filter,
  Monitor,
  CheckCircle,
  Smartphone,
  Tablet,
  Sparkles,
  X,
} from 'lucide-react';
import { DemoItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedDemos } from '../lib/cms';
import { isSafeExternalUrl } from '../lib/supabase/storage';

export const DemosPage: React.FC = () => {
  const navigate = useNavigate();
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndustry, setActiveIndustry] = useState<string>('all');
  const [previewModalDemo, setPreviewModalDemo] = useState<DemoItem | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    async function loadDemos() {
      const data = await getPublishedDemos();
      setDemos(data);
      setLoading(false);
    }
    loadDemos();

    const handleUpdate = () => loadDemos();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  const industries = [
    { id: 'all', label: 'All Industries' },
    { id: 'Corporate & Business', label: 'Corporate & Architecture' },
    { id: 'Beauty & Lifestyle', label: 'Beauty & Wellness' },
    { id: 'Restaurant & Cafe', label: 'Hospitality & Dining' },
    { id: 'Fitness & Wellness', label: 'Fitness & Athletics' },
  ];

  // Filter only published demos, sorted by displayOrder
  const publishedDemos = demos
    .filter((d) => d.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const filteredDemos =
    activeIndustry === 'all'
      ? publishedDemos
      : publishedDemos.filter((d) => d.industry === activeIndustry);

  const handleLaunchDemo = (demo: DemoItem) => {
    setPreviewModalDemo(demo);
  };

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-24">
      <SEOHead
        title="Ready-Made Website Demos & Turnkey Platforms"
        description="Explore Yugark Digital Studio's premium turnkey website demos designed for Architecture, Beauty & Wellness, Hospitality, and Fitness."
        canonicalPath="/demos"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Turnkey Solutions
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            Ready-Made Website Demos.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            High-converting digital architecture ready for your brand content. Each turnkey template is
            fully responsive, performance-tuned, and deployable within days.
          </p>
        </div>

        {/* Industry Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-10 sm:mb-14 pb-4 border-b border-[#E8E2D7]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C887E] mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveIndustry(ind.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeIndustry === ind.id
                  ? 'bg-[#1A2621] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4E564F] hover:bg-[#EAE3D6] border border-[#E6DFD3]'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Demos Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#2D4536] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#7C887E]">Loading CMS Demos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16 sm:mb-24">
            {filteredDemos.map((demo) => (
              <div
                key={demo.id}
                className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] overflow-hidden group hover:border-[#2D4536]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Showcase Container */}
                  <div className="relative aspect-[16/10] bg-[#EBE4D8] overflow-hidden">
                    <img
                      src={demo.image}
                      alt={demo.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                    {/* Industry Badge */}
                    <span className="absolute top-3 left-3 bg-[#1B2E24]/90 backdrop-blur-sm text-[#E5ECE7] text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {demo.industry}
                    </span>

                    {demo.featured && (
                      <span className="absolute top-3 right-3 bg-[#C5A880] text-[#121614] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614]">
                        {demo.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5D665F] leading-relaxed mb-6">
                      {demo.description}
                    </p>

                    {/* Key Features */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2D4536] block mb-2">
                        Template Highlights:
                      </span>
                      {demo.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-[#3C423E]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] mr-2 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#ECE5D9]">
                      {demo.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-[#EFE9DF] text-[#4E564F] px-2.5 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 sm:p-8 pt-0 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleLaunchDemo(demo)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-sm cursor-pointer"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Launch Live Demo</span>
                  </button>

                  <button
                    onClick={() => navigate(`/contact?demo=${demo.slug}`)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors cursor-pointer"
                  >
                    <span>Acquire This Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Turnkey Deployment Guarantee Banner */}
        <div className="bg-[#1B2E24] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#A5C2B1] block mb-2">
                Turnkey Rapid Deployment
              </span>
              <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-white mb-3">
                How Our Website Demos Are Deployed.
              </h2>
              <p className="text-xs sm:text-sm text-[#CAD6CE] leading-relaxed">
                Choose any demo design above. Our studio customizes the typography, logo, color palette,
                and copy to match your brand identity. You receive a fully configured, production-ready website
                deployed to your domain within 5 to 7 business days.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all shadow-lg cursor-pointer"
              >
                <span>Request Demo Customization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Demo Preview Modal Fallback */}
      {previewModalDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] w-full max-w-5xl max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5CDC0]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#121B16] text-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C2922] text-[#A5C2B1] flex items-center justify-center font-bold text-xs">
                  {previewModalDemo.title.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg text-white">
                    {previewModalDemo.title} Preview
                  </h3>
                  <span className="text-[10px] text-[#A5C2B1] uppercase tracking-wider">
                    {previewModalDemo.industry}
                  </span>
                </div>
              </div>

              {/* Device View Switcher */}
              <div className="hidden sm:flex items-center bg-[#1C2922] p-1 rounded-full border border-[#2D4536]">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`p-1.5 px-3 rounded-full text-xs flex items-center gap-1.5 transition-colors ${
                    deviceView === 'desktop' ? 'bg-[#2D4536] text-white' : 'text-[#A5C2B1] hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceView('tablet')}
                  className={`p-1.5 px-3 rounded-full text-xs flex items-center gap-1.5 transition-colors ${
                    deviceView === 'tablet' ? 'bg-[#2D4536] text-white' : 'text-[#A5C2B1] hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 px-3 rounded-full text-xs flex items-center gap-1.5 transition-colors ${
                    deviceView === 'mobile' ? 'bg-[#2D4536] text-white' : 'text-[#A5C2B1] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setPreviewModalDemo(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Interactive Preview Frame */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EFE9DF]/50 flex flex-col items-center justify-center">
              <div
                className={`transition-all duration-300 bg-white rounded-xl shadow-lg overflow-hidden border border-[#D5CDC0] ${
                  deviceView === 'desktop'
                    ? 'w-full max-w-4xl'
                    : deviceView === 'tablet'
                    ? 'w-[720px] max-w-full'
                    : 'w-[375px] max-w-full'
                }`}
              >
                {/* Browser/Device Chrome Bar */}
                <div className="bg-[#EAE3D6] px-4 py-2 border-b border-[#D5CDC0] flex items-center justify-between text-xs text-[#525B54]">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E07A5F]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F4A261]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#81B29A]" />
                  </div>
                  <span className="font-mono text-[11px] truncate max-w-xs text-[#6A746B]">
                    {previewModalDemo.liveDemoUrl}
                  </span>
                  <div className="w-10" />
                </div>

                {/* Device Screen Content */}
                <div className="p-4 sm:p-6 bg-[#FAF8F5]">
                  <img
                    src={previewModalDemo.image}
                    alt={previewModalDemo.alt}
                    className="w-full rounded-lg shadow-sm mb-4 object-cover"
                  />
                  <div className="space-y-3">
                    <h4 className="font-serif-title text-xl text-[#121614]">
                      {previewModalDemo.title}
                    </h4>
                    <p className="text-xs text-[#525B54] leading-relaxed">
                      {previewModalDemo.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {previewModalDemo.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-[#EAE3D6] text-[#294B37] px-2.5 py-1 rounded font-medium"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#ECE5D9] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#69746A]">
                Configured URL: <span className="font-mono text-[#121614]">{previewModalDemo.liveDemoUrl}</span>
              </span>
              <div className="flex items-center gap-3">
                {isSafeExternalUrl(previewModalDemo.liveDemoUrl) && (
                  <a
                    href={previewModalDemo.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-semibold hover:bg-[#EAE3D6] transition-colors flex items-center gap-1.5"
                  >
                    <span>Open External Live URL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => {
                    const demo = previewModalDemo;
                    setPreviewModalDemo(null);
                    navigate(`/contact?demo=${demo.slug}`);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Acquire This Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
