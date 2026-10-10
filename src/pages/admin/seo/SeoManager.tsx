import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Check, Globe } from 'lucide-react';
import { adminCmsApi, getWebsiteSettings } from '../../../lib/cms';

export const SeoManager: React.FC = () => {
  const [seo, setSeo] = useState({
    siteTitle: 'YUGARK DIGITAL STUDIO | We Build. We Create. We Grow Brands.',
    metaDescription:
      'Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const settings = await getWebsiteSettings();
      if (settings.studioName) {
        setSeo((prev) => ({
          ...prev,
          siteTitle: `${settings.studioName} | We Build. We Create. We Grow Brands.`,
        }));
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCmsApi.updateSettings({
        seo_defaults: {
          title: seo.siteTitle,
          description: seo.metaDescription,
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Search Engine Grounding
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            SEO &amp; OpenGraph Metadata Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Configure global meta titles, search index tags, and social media card previews.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Global SEO'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>SEO settings updated and synchronized across all public page headers!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Global Homepage SEO Title *
            </label>
            <input
              type="text"
              required
              value={seo.siteTitle}
              onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-medium text-[#121614]"
            />
            <span className="text-[10px] text-[#78887D] mt-1 block">Recommended: 50–60 characters</span>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Global Meta Description *
            </label>
            <textarea
              rows={3}
              required
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed text-[#121614]"
            />
            <span className="text-[10px] text-[#78887D] mt-1 block">Recommended: 120–160 characters</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                OpenGraph Type
              </label>
              <input
                type="text"
                disabled
                value={seo.ogType}
                className="w-full px-3 py-2 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] text-xs font-mono text-[#556358]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
                Twitter Card
              </label>
              <input
                type="text"
                disabled
                value={seo.twitterCard}
                className="w-full px-3 py-2 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] text-xs font-mono text-[#556358]"
              />
            </div>
          </div>
        </form>

        {/* Live Search Snippet Preview */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#738277] block font-semibold">
              Google Search Result Preview
            </span>
            <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EBE4D8] space-y-1">
              <div className="text-[11px] text-[#1A0DAB] font-mono flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#5F6368]" />
                <span>https://yugark.in</span>
              </div>
              <h4 className="text-base font-medium text-[#1A0DAB] hover:underline cursor-pointer line-clamp-1">
                {seo.siteTitle}
              </h4>
              <p className="text-xs text-[#4D5156] line-clamp-2 leading-relaxed">
                {seo.metaDescription}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#738277] block font-semibold">
              Social Share Card Preview (og:image)
            </span>
            <div className="rounded-xl border border-[#E0D7C9] overflow-hidden bg-[#FAF8F5]">
              <img
                src="/assets/images/hero.jpg"
                alt="Social Card Banner"
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <span className="text-[10px] font-mono text-[#78887D] uppercase">yugark.in</span>
                <div className="font-semibold text-xs text-[#121614] line-clamp-1 mt-0.5">
                  {seo.siteTitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
