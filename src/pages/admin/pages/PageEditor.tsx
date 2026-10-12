import React, { useState, useEffect } from 'react';
import { Globe, Save, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';

export const PageEditor: React.FC = () => {
  const [content, setContent] = useState({
    headlineLine1: 'We Build.',
    headlineLine2: 'We Create.',
    headlineLine3Accent: 'We Grow Brands.',
    heroDescription:
      'Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further.',
    brandStatementTitle: "A Digital Studio for What's Next",
    brandStatementText:
      'We help founders, brands, and modern businesses build unforgettable web experiences, tell compelling visual stories, and capture high-intent demand across digital channels.',
    footerText:
      'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await adminCmsApi.getHomepageContent();
      setContent(data);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await adminCmsApi.updateHomepageContent(content);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Database error: Failed to update homepage content in Supabase.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Core Visual Copywriting
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Page Content Editor
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Safely update core homepage hero statements, value copy, and footer descriptors with strict design protection.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Publish Content Updates'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Homepage text updated and broadcast to all live components successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Hero Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h2 className="font-serif-title text-base font-semibold text-[#121614]">
              1. Hero Headline &amp; Lead Statement
            </h2>
            <p className="text-[11px] text-[#69786E]">
              The 3-line monumental statement rendered in Playfair Display on the primary hero viewport.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                Line 1 (Lead)
              </label>
              <input
                type="text"
                required
                value={content.headlineLine1}
                onChange={(e) => setContent({ ...content, headlineLine1: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-serif font-bold text-[#121614]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                Line 2 (Secondary)
              </label>
              <input
                type="text"
                required
                value={content.headlineLine2}
                onChange={(e) => setContent({ ...content, headlineLine2: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-serif font-bold text-[#121614]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                Line 3 (Forest Accent)
              </label>
              <input
                type="text"
                required
                value={content.headlineLine3Accent}
                onChange={(e) => setContent({ ...content, headlineLine3Accent: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-serif font-bold text-[#2D4536]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Hero Paragraph Description
            </label>
            <textarea
              rows={3}
              required
              value={content.heroDescription}
              onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed text-[#121614]"
            />
          </div>
        </div>

        {/* Section 2: Brand Statement */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h2 className="font-serif-title text-base font-semibold text-[#121614]">
              2. Studio Manifesto &amp; Value Proposition
            </h2>
            <p className="text-[11px] text-[#69786E]">
              Displayed in the editorial section below the value metric cards.
            </p>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Section Title
            </label>
            <input
              type="text"
              required
              value={content.brandStatementTitle}
              onChange={(e) => setContent({ ...content, brandStatementTitle: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-serif font-semibold text-[#121614]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Section Narrative Text
            </label>
            <textarea
              rows={3}
              required
              value={content.brandStatementText}
              onChange={(e) => setContent({ ...content, brandStatementText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed text-[#121614]"
            />
          </div>
        </div>

        {/* Section 3: Global Footer Statement */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h2 className="font-serif-title text-base font-semibold text-[#121614]">
              3. Global Footer Text
            </h2>
            <p className="text-[11px] text-[#69786E]">
              Appears in the studio footer across all pages.
            </p>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Footer Description
            </label>
            <textarea
              rows={2}
              required
              value={content.footerText}
              onChange={(e) => setContent({ ...content, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed text-[#121614]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
