import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Check,
  Upload,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { uploadCmsMedia } from '../../../lib/supabase/storage';

interface HeroStateItem {
  eyebrow: string;
  headline: string;
  supportingText: string;
  labels: string[];
}

export const HeroManager: React.FC = () => {
  const [heroStates, setHeroStates] = useState<HeroStateItem[]>([
    {
      eyebrow: 'DIGITAL STUDIO FOR MODERN BRANDS',
      headline: 'We Build.',
      supportingText: 'Premium websites and smart digital systems that help your business make a lasting impression.',
      labels: ['Business Websites', 'Landing Pages', 'Lead Management'],
    },
    {
      eyebrow: 'CREATIVE CONTENT THAT CONNECTS',
      headline: 'We Create.',
      supportingText: 'Engaging videos, social media content and brand creatives that make your business stand out.',
      labels: ['Promotional Videos', 'Social Media', 'Brand Creatives'],
    },
    {
      eyebrow: 'STRATEGY FOR BUSINESS GROWTH',
      headline: 'We Grow Brands.',
      supportingText: 'Targeted advertising and digital strategies that help your business reach more customers.',
      labels: ['Meta & Google Ads', 'Content Strategy', 'Digital Growth'],
    },
  ]);

  const [heroImage, setHeroImage] = useState('/assets/images/hero.jpg');
  const [ctaPrimaryText, setCtaPrimaryText] = useState('Start Project');
  const [ctaSecondaryText, setCtaSecondaryText] = useState('View Our Work');
  const [ctaDemoText, setCtaDemoText] = useState('Get Your Free Website Demo');

  const [activeSlide, setActiveSlide] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const config = await adminCmsApi.getHeroSettings();
        if (config?.heroStates && config.heroStates.length > 0) {
          setHeroStates(config.heroStates);
        }
        if (config?.heroImage) {
          setHeroImage(config.heroImage);
        }
        if (config?.ctaPrimaryText) setCtaPrimaryText(config.ctaPrimaryText);
        if (config?.ctaSecondaryText) setCtaSecondaryText(config.ctaSecondaryText);
        if (config?.ctaDemoText) setCtaDemoText(config.ctaDemoText);
      } catch (err) {
        console.error('Failed to load hero configuration:', err);
      }
    }
    loadData();
  }, []);

  const handleStateChange = (index: number, field: keyof HeroStateItem, value: any) => {
    const updated = [...heroStates];
    updated[index] = { ...updated[index], [field]: value };
    setHeroStates(updated);
  };

  const handleLabelsChange = (index: number, commaSeparated: string) => {
    const labels = commaSeparated.split(',').map((l) => l.trim()).filter(Boolean);
    handleStateChange(index, 'labels', labels);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadCmsMedia(file, 'hero-images');
      setHeroImage(res.publicUrl);
    } catch (err: any) {
      console.warn('Upload fallback to local URL preview:', err);
      const tempUrl = URL.createObjectURL(file);
      setHeroImage(tempUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await adminCmsApi.updateHeroSettings({
        heroImage,
        heroStates,
        ctaPrimaryText,
        ctaSecondaryText,
        ctaDemoText,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save hero settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const activeMsg = heroStates[activeSlide] || heroStates[0];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2D4536]" />
            Homepage Dynamic Showcase
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Hero Section Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Customize all three animated headline states, hero image asset, badges, and Call-To-Action buttons with live responsive preview.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Publish Hero Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Hero configuration published and synchronized across desktop and mobile views!</span>
        </div>
      )}

      {/* Grid Layout: Left Column Controls, Right Column Live Responsive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls & State Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Animated States Selector & Editor */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div>
                <h2 className="font-serif-title text-base font-semibold text-[#121614]">
                  Animated Hero Message States (3 Slides)
                </h2>
                <p className="text-[11px] text-[#69786E]">
                  Select a slide to edit its headline, eyebrow kicker, descriptive copy, and tags.
                </p>
              </div>
            </div>

            {/* Slide Tabs */}
            <div className="flex items-center gap-2 border-b border-[#EAE3D6] pb-3">
              {heroStates.map((state, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeSlide === idx
                      ? 'bg-[#1B2E24] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#556358] hover:bg-[#EAE3D6]'
                  }`}
                >
                  Slide 0{idx + 1}: {state.headline}
                </button>
              ))}
            </div>

            {/* Form for Active Slide */}
            <div className="space-y-4 pt-1">
              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Eyebrow Kicker (Uppercase tracking banner)
                </label>
                <input
                  type="text"
                  required
                  value={activeMsg.eyebrow}
                  onChange={(e) => handleStateChange(activeSlide, 'eyebrow', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono font-medium text-[#121614]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Monumental Headline Text
                </label>
                <input
                  type="text"
                  required
                  value={activeMsg.headline}
                  onChange={(e) => handleStateChange(activeSlide, 'headline', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-sm font-serif font-bold text-[#121614]"
                />
                <span className="text-[10px] text-[#86968B] mt-0.5 block">
                  Tip: If headline contains &quot;Grow&quot;, the &quot;Grow Brands.&quot; segment automatically renders in elegant italic green accent.
                </span>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Supporting Paragraph Narrative
                </label>
                <textarea
                  rows={2}
                  required
                  value={activeMsg.supportingText}
                  onChange={(e) => handleStateChange(activeSlide, 'supportingText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed text-[#121614]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Supporting Labels (Comma-separated)
                </label>
                <input
                  type="text"
                  value={activeMsg.labels.join(', ')}
                  onChange={(e) => handleLabelsChange(activeSlide, e.target.value)}
                  placeholder="e.g. Business Websites, Landing Pages, Lead Management"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs text-[#121614]"
                />
              </div>
            </div>
          </div>

          {/* 2. Hero Image Asset & Upload */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="border-b border-[#F0EBE1] pb-3">
              <h2 className="font-serif-title text-base font-semibold text-[#121614]">
                Hero Workspace Mockup Image
              </h2>
              <p className="text-[11px] text-[#69786E]">
                Rendered across desktop (with curved gradient mask) and mobile (clean card container).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#D5CDC1] shrink-0">
                <img
                  src={heroImage}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono text-[#121614]"
                  placeholder="Path e.g. /assets/images/hero.jpg or https://"
                />

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE3D6] text-[#1B2E24] text-xs font-medium border border-[#D5CDC1] cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading Image...' : 'Upload New Hero Asset'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3. Call To Action Button Labels */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="border-b border-[#F0EBE1] pb-3">
              <h2 className="font-serif-title text-base font-semibold text-[#121614]">
                Hero Call-To-Action Labels
              </h2>
              <p className="text-[11px] text-[#69786E]">
                Configure the three action buttons rendered in the hero viewport.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Primary Button
                </label>
                <input
                  type="text"
                  value={ctaPrimaryText}
                  onChange={(e) => setCtaPrimaryText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-medium text-[#121614]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Secondary Button
                </label>
                <input
                  type="text"
                  value={ctaSecondaryText}
                  onChange={(e) => setCtaSecondaryText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-medium text-[#121614]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                  Special Demo Button
                </label>
                <input
                  type="text"
                  value={ctaDemoText}
                  onChange={(e) => setCtaDemoText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-medium text-[#121614]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Viewport Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-mono uppercase text-[#738277] font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#2D4536]" />
              Live Viewport Preview
            </span>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E0D9CD] shadow-2xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-[#1B2E24] text-white' : 'text-[#6D7D72] hover:bg-[#F3EFE6]'
                }`}
                title="Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-[#1B2E24] text-white' : 'text-[#6D7D72] hover:bg-[#F3EFE6]'
                }`}
                title="Tablet"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-[#1B2E24] text-white' : 'text-[#6D7D72] hover:bg-[#F3EFE6]'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Simulation Frame */}
          <div
            className={`mx-auto bg-[#F8F6F1] border-4 border-[#303833] rounded-3xl p-4 shadow-xl overflow-hidden transition-all duration-300 ${
              previewDevice === 'mobile'
                ? 'max-w-[320px]'
                : previewDevice === 'tablet'
                ? 'max-w-[440px]'
                : 'w-full'
            }`}
          >
            {/* Simulation Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-[#556358] uppercase">
                <span className="w-3 h-[1px] bg-[#556358]" />
                <span className="truncate">{activeMsg.eyebrow}</span>
              </div>

              <h3 className="font-serif-title text-xl font-medium text-[#121614] leading-tight">
                {activeMsg.headline.includes('Grow') ? (
                  <>
                    We <span className="italic text-[#2D4536]">Grow Brands.</span>
                  </>
                ) : (
                  activeMsg.headline
                )}
              </h3>

              <p className="text-[11px] text-[#555C56] leading-relaxed line-clamp-3">
                {activeMsg.supportingText}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {activeMsg.labels.map((lbl, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-[#EAE3D6] text-[#2D4536] font-medium"
                  >
                    {lbl}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="px-3 py-1 rounded-full bg-[#1A2621] text-white text-[10px] font-medium">
                  {ctaPrimaryText}
                </span>
                <span className="px-3 py-1 rounded-full border border-[#D5CDC1] bg-white text-[#121614] text-[10px]">
                  {ctaSecondaryText}
                </span>
              </div>

              {/* Preview Hero Image */}
              <div className="mt-3 rounded-xl overflow-hidden border border-[#E0D8CB] bg-[#EAE2D5] aspect-[16/10]">
                <img
                  src={heroImage}
                  alt="Mockup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-[#7C8B81]">
            Slide 0{activeSlide + 1} shown above. Changes will update live on Homepage once published.
          </p>
        </div>

      </div>
    </div>
  );
};
