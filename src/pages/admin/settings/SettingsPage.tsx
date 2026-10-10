import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, ShieldCheck, AlertCircle, MessageSquare, Mail } from 'lucide-react';
import { adminCmsApi, getWebsiteSettings } from '../../../lib/cms';

export const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    site_name: 'Yugark Digital Studio',
    tagline: 'We Build. We Create. We Grow Brands.',
    business_email: 'business@yugark.in',
    whatsapp_number: '+91 9125205132',
    whatsapp_message: 'Hello Yugark Studio, I would like to discuss a project.',
    instagram: 'https://www.instagram.com/yugark.in/',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    footer_text: 'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await getWebsiteSettings();
      setFormData({
        site_name: s.studioName,
        tagline: s.tagline,
        business_email: s.contactEmail,
        whatsapp_number: s.whatsappNumber,
        whatsapp_message: 'Hello Yugark Studio, I would like to discuss a project.',
        instagram: s.socials.instagram,
        linkedin: s.socials.linkedin,
        youtube: s.socials.youtube,
        footer_text: 'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
      });
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await adminCmsApi.updateSettings({
        site_name: formData.site_name,
        tagline: formData.tagline,
        business_email: formData.business_email,
        whatsapp_number: formData.whatsapp_number,
        whatsapp_message: formData.whatsapp_message,
        social_links: {
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          youtube: formData.youtube,
        },
        footer_text: formData.footer_text,
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Global Governance
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Website Business Settings
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Verified studio identity tokens, official WhatsApp routing, and verified electronic mail channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Studio settings updated and synchronized with public navigation and contact modules!</span>
        </div>
      )}

      {/* Strict Compliance Notice */}
      <div className="p-4 rounded-2xl bg-[#EBE5DA] border border-[#DDD5C7] text-xs text-[#4E5C52] space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#1B2E24]">
          <ShieldCheck className="w-4 h-4 text-[#2D4536]" />
          <span>Strict Business Protocol Applied</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Physical addresses, map coordinates, and telephone call links have been strictly omitted in accordance with studio directives.
          All client interaction is routed through verified WhatsApp (<strong>+91 9125205132</strong>) and studio email (<strong>business@yugark.in</strong>).
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Studio Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-medium text-[#121614]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Tagline *
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs text-[#121614]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Official WhatsApp Number *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono text-[#121614]"
              />
              <MessageSquare className="w-4 h-4 text-[#25D366] absolute left-3 top-2.5" />
            </div>
            <span className="text-[10px] font-mono text-[#78887D] mt-1 block">
              Direct Link: https://wa.me/{formData.whatsapp_number.replace(/[^0-9]/g, '')}
            </span>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
              Official Studio Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.business_email}
                onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono text-[#121614]"
              />
              <Mail className="w-4 h-4 text-[#2D4536] absolute left-3 top-2.5" />
            </div>
            <span className="text-[10px] font-mono text-[#78887D] mt-1 block">
              Direct Link: mailto:{formData.business_email}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
            Default WhatsApp Greeting Message
          </label>
          <input
            type="text"
            value={formData.whatsapp_message}
            onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs text-[#121614]"
          />
        </div>

        <div className="border-t border-[#F0EBE1] pt-4">
          <span className="font-semibold uppercase text-[10px] text-[#637267] block mb-3 font-mono">
            Verified Social Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-[#718075] mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#718075] mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#718075] mb-1">YouTube URL</label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#F0EBE1] pt-4">
          <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">
            Footer Copyright &amp; Descriptor Text
          </label>
          <textarea
            rows={2}
            value={formData.footer_text}
            onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed"
          />
        </div>
      </form>
    </div>
  );
};
