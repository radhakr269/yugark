import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, ShieldCheck, AlertCircle, MessageSquare, Mail, Download, Database, RefreshCw, UploadCloud } from 'lucide-react';
import { adminCmsApi, getWebsiteSettings, downloadCmsBackupFile } from '../../../lib/cms';

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
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);

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
    setError(null);

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
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Database error: Failed to save website settings to Supabase.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = () => {
    downloadCmsBackupFile();
  };

  const handlePreviewSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await adminCmsApi.syncLocalStorageToSupabase(true);
      setSyncResult({ ...res, isDryRun: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze local storage data for migration.');
    } finally {
      setSyncing(false);
    }
  };

  const handleApplySync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await adminCmsApi.syncLocalStorageToSupabase(false);
      setSyncResult({ ...res, isDryRun: false });
    } catch (err: any) {
      setError(err?.message || 'Failed to migrate browser edits to Supabase database.');
    } finally {
      setSyncing(false);
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

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
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

      {/* PHASE 1 & 4: CENTRALIZED CMS DATA PROTECTION, BACKUP & MIGRATION */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#738277] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#2D4536]" />
              Data Integrity &amp; Migration
            </span>
            <h2 className="font-serif-title text-base font-semibold text-[#121614] mt-0.5">
              Browser Data Protection &amp; Centralized Supabase Migration
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#5C6A60] leading-relaxed">
          Preserve all drafts, hero headlines, demo configurations, services, and pricing stored in browser localStorage.
          Export a verified JSON backup before migrating, or sync local records into the production Supabase database.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-semibold text-[#121614] hover:bg-[#EBE5DA] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#2D4536]" />
            <span>Export CMS Backup (.json)</span>
          </button>

          <button
            type="button"
            disabled={syncing}
            onClick={handlePreviewSync}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-semibold text-[#121614] hover:bg-[#EBE5DA] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#2D4536] ${syncing ? 'animate-spin' : ''}`} />
            <span>Analyze &amp; Preview Migration</span>
          </button>

          <button
            type="button"
            disabled={syncing}
            onClick={handleApplySync}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4 text-[#4ADE80]" />
            <span>{syncing ? 'Syncing...' : 'Sync Local Edits to Supabase'}</span>
          </button>
        </div>

        {syncResult && (
          <div className={`p-4 rounded-xl text-xs space-y-2 border ${
            syncResult.success ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <div className="font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                {syncResult.isDryRun ? 'Migration Analysis Complete (Dry Run)' : 'Migration Completed to Supabase'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded bg-white/70 border border-black/5">Settings: {syncResult.summary?.settings || 0}</div>
              <div className="p-2 rounded bg-white/70 border border-black/5">Hero: {syncResult.summary?.hero || 0}</div>
              <div className="p-2 rounded bg-white/70 border border-black/5">Pages: {syncResult.summary?.pages || 0}</div>
              <div className="p-2 rounded bg-white/70 border border-black/5">Demos: {syncResult.summary?.demos || 0}</div>
              <div className="p-2 rounded bg-white/70 border border-black/5">Services: {syncResult.summary?.services || 0}</div>
              <div className="p-2 rounded bg-white/70 border border-black/5">Pricing: {syncResult.summary?.pricing || 0}</div>
              <div className="p-2 rounded bg-white/70 border border-black/5">Projects: {syncResult.summary?.projects || 0}</div>
            </div>

            {syncResult.conflicts && syncResult.conflicts.length > 0 && (
              <div className="mt-2 text-[11px] bg-amber-100/70 p-3 rounded-lg border border-amber-300 space-y-1.5 text-amber-950 font-mono">
                <span className="font-semibold block font-sans text-xs">Record-Level Conflicts &amp; Protection Status:</span>
                {syncResult.conflicts.map((c: any, idx: number) => (
                  <div key={idx} className="border-t border-amber-200/60 pt-1">
                    <span className="font-bold">[{c.type}]</span> {c.key}: local &quot;{c.localTitle}&quot; vs remote &quot;{c.remoteTitle}&quot; — <span className="text-emerald-800 font-sans font-medium">{c.resolution}</span>
                  </div>
                ))}
              </div>
            )}
            {syncResult.errors && syncResult.errors.length > 0 && (
              <div className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200 space-y-1">
                <span className="font-semibold">Notice:</span>
                {syncResult.errors.map((e: string, idx: number) => (
                  <p key={idx}>{e}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
