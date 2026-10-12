import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Check,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Mail,
  Download,
  Database,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  adminCmsApi,
  getWebsiteSettings,
  downloadCmsBackupFile,
  SyncMigrationResult,
  MigrationRecordItem,
} from '../../../lib/cms';

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
  const [syncResult, setSyncResult] = useState<SyncMigrationResult | null>(null);
  const [approvedKeys, setApprovedKeys] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'conflicts' | 'inserts' | 'identical'>('all');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

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
      const res = await adminCmsApi.syncLocalStorageToSupabase(true, Array.from(approvedKeys));
      setSyncResult(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze local storage data for migration.');
    } finally {
      setSyncing(false);
    }
  };

  const handleApplySync = async () => {
    if (!syncResult) {
      setError('Please run "Analyze & Preview Migration" first before applying any changes.');
      return;
    }
    setSyncing(true);
    setError(null);
    try {
      const res = await adminCmsApi.syncLocalStorageToSupabase(false, Array.from(approvedKeys));
      setSyncResult(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to migrate browser edits to Supabase database.');
    } finally {
      setSyncing(false);
    }
  };

  const toggleApproval = (key: string) => {
    setApprovedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const approveAllConflicts = () => {
    if (!syncResult?.records) return;
    const next = new Set(approvedKeys);
    syncResult.records.filter((r) => r.isProtected).forEach((r) => next.add(r.key));
    setApprovedKeys(next);
  };

  const clearAllApprovals = () => {
    setApprovedKeys(new Set());
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
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
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#DDD5C7] space-y-4">
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E3DDD1] pb-3">
              <div className="flex items-center gap-2">
                {syncResult.isDryRun ? (
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                )}
                <div>
                  <h3 className="text-xs font-bold text-[#121614]">
                    {syncResult.isDryRun
                      ? 'Migration Dry-Run Analysis Complete (Zero Writes Performed)'
                      : 'Live Synchronization Completed'}
                  </h3>
                  <p className="text-[11px] text-[#5C6A60]">
                    Zero-overwrite safety protocol active. Production records will not be overwritten without explicit per-record approval.
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold uppercase self-start sm:self-auto ${
                  syncResult.isDryRun
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {syncResult.isDryRun ? 'Dry-Run Mode (Read-Only)' : 'Live Mode'}
              </span>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#E3DDD1]">
                <span className="text-[10px] uppercase font-mono text-[#738277] block">Local Records</span>
                <span className="text-lg font-bold text-[#121614]">{syncResult.summary.totalLocal}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] uppercase font-mono text-emerald-800 block">Safe Inserts</span>
                <span className="text-lg font-bold text-emerald-700">+{syncResult.summary.inserts}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] uppercase font-mono text-blue-800 block">Identical / Skip</span>
                <span className="text-lg font-bold text-blue-700">{syncResult.summary.identical}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] uppercase font-mono text-amber-800 block">Protected Conflicts</span>
                <span className="text-lg font-bold text-amber-700">{syncResult.summary.conflicts}</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="text-[10px] uppercase font-mono text-purple-800 block">Admin Approved</span>
                <span className="text-lg font-bold text-purple-700">
                  {approvedKeys.size} / {syncResult.summary.conflicts}
                </span>
              </div>
            </div>

            {/* Table-by-Table Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-white border border-black/5">Settings: {syncResult.summary?.settings || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Hero: {syncResult.summary?.hero || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Pages: {syncResult.summary?.pages || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Demos: {syncResult.summary?.demos || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Services: {syncResult.summary?.services || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Pricing: {syncResult.summary?.pricing || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Projects: {syncResult.summary?.projects || 0}</div>
              <div className="p-2 rounded bg-white border border-black/5">Blogs: {syncResult.summary?.blogs || 0}</div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E3DDD1]">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-mono text-[#738277] mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-[#1B2E24] text-white'
                      : 'bg-white border border-[#DDD5C7] text-[#5C6A60] hover:bg-[#EBE5DA]'
                  }`}
                >
                  All Records ({syncResult.records.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('conflicts')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'conflicts'
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Conflicts ({syncResult.summary.conflicts})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('inserts')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'inserts'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Inserts ({syncResult.summary.inserts})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('identical')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeFilter === 'identical'
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  Identical ({syncResult.summary.identical})
                </button>
              </div>

              {syncResult.summary.conflicts > 0 && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={approveAllConflicts}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    Approve All ({syncResult.summary.conflicts})
                  </button>
                  <span className="text-[#C5BCAD]">|</span>
                  <button
                    type="button"
                    onClick={clearAllApprovals}
                    className="text-[11px] font-semibold text-[#5C6A60] hover:text-[#121614] underline cursor-pointer"
                  >
                    Clear Approvals
                  </button>
                </div>
              )}
            </div>

            {/* Itemized Record-Level Conflict & Diff Panel */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {syncResult.records
                .filter((r) => {
                  if (activeFilter === 'conflicts') return r.isProtected;
                  if (activeFilter === 'inserts') return r.action === 'insert';
                  if (activeFilter === 'identical') return r.action === 'identical';
                  return true;
                })
                .map((record) => {
                  const isApproved = approvedKeys.has(record.key);
                  const isExpanded = expandedKeys.has(record.key);

                  return (
                    <div
                      key={record.key}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        isApproved
                          ? 'bg-purple-50/60 border-purple-300'
                          : record.isProtected
                          ? 'bg-amber-50/50 border-amber-300'
                          : record.action === 'insert'
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-[#E5DFD5]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 text-[#4E5C52] font-semibold">
                              {record.table}
                            </span>
                            <span className="text-[10px] font-mono text-[#738277]">slug: {record.slug}</span>

                            {/* Status Badge */}
                            {record.isProtected ? (
                              isApproved ? (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                                  Approved for Overwrite
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> Protected Conflict
                                </span>
                              )
                            ) : record.action === 'insert' ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Safe Insert (New)
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                Identical (Safe Skip)
                              </span>
                            )}
                          </div>

                          <div className="font-semibold text-[#121614] flex flex-wrap items-baseline gap-2">
                            <span>Local: &quot;{record.localTitle}&quot;</span>
                            {record.remoteTitle && (
                              <span className="text-[#68776D] font-normal text-[11px]">
                                vs Remote: &quot;{record.remoteTitle}&quot;
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Per-Record Approval Checkbox */}
                        {record.isProtected ? (
                          <label
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-colors self-start sm:self-auto ${
                              isApproved
                                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                                : 'bg-white border-[#DDD5C7] text-[#4E5C52] hover:bg-[#F3EFEA]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isApproved}
                              onChange={() => toggleApproval(record.key)}
                              className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{isApproved ? 'Approved' : 'Authorize Overwrite'}</span>
                          </label>
                        ) : record.action === 'insert' ? (
                          <span className="text-[11px] text-emerald-700 font-medium">Safe to insert</span>
                        ) : (
                          <span className="text-[11px] text-blue-700 font-medium">In sync</span>
                        )}
                      </div>

                      {/* Differences & Resolution Toggle */}
                      {record.differences && record.differences.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-black/5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => toggleExpand(record.key)}
                            className="text-[#5C6A60] hover:text-[#121614] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            <span>{record.differences.length} comparison details / resolution notes</span>
                          </button>

                          {isExpanded && (
                            <div className="mt-1.5 pl-4 space-y-1 text-[#4E5C52]">
                              <p className="font-medium text-xs text-[#2D4536]">{record.resolution}</p>
                              {record.differences.map((diff, dIdx) => (
                                <p key={dIdx} className="font-mono text-[10px] text-[#637267]">
                                  • {diff}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Safety Notification */}
            <div className="p-3.5 rounded-xl bg-[#EBE5DA] border border-[#DDD5C7] text-xs space-y-1 text-[#4E5C52]">
              <div className="flex items-center gap-1.5 font-semibold text-[#1B2E24]">
                <ShieldCheck className="w-4 h-4 text-[#2D4536]" />
                <span>Zero-Overwrite Safety Shield Active</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {approvedKeys.size === 0 && syncResult.summary.conflicts > 0
                  ? `None of the ${syncResult.summary.conflicts} conflicting production records are authorized for overwrite. If sync is run, existing production records will be strictly preserved, and only new records will be safely inserted.`
                  : approvedKeys.size > 0
                  ? `${approvedKeys.size} record(s) explicitly authorized for overwrite. All other ${
                      syncResult.summary.conflicts - approvedKeys.size
                    } production records remain strictly protected.`
                  : 'All records are either safe inserts or identical to production.'}
              </p>
            </div>

            {/* Error Reporting */}
            {syncResult.errors && syncResult.errors.length > 0 && (
              <div className="text-[11px] text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Supabase Query Diagnostics ({syncResult.errors.length}):
                </span>
                {syncResult.errors.map((e: string, idx: number) => (
                  <p key={idx} className="font-mono text-[10px]">
                    {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
