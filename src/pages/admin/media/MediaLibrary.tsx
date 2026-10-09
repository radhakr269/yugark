import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { uploadCmsMedia } from '../../../lib/supabase/storage';

export const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listMediaAssets();
      setAssets(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const res = await uploadCmsMedia(file, 'media-library');
      await adminCmsApi.registerMediaAsset({
        name: file.name,
        url: res.publicUrl,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type,
      });
      await loadMedia();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminCmsApi.deleteMediaAsset(id);
      setDeleteConfirmId(null);
      await loadMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Media Storage Bucket (public-cms-media)
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Media Asset Library
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Upload, preview, and reference high-resolution visual assets across demos, blogs, and portfolio case studies.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Media Asset'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by file name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#8C988F] absolute left-3 top-2.5" />
        </div>
        <div className="text-[11px] font-mono text-[#78887D]">
          {assets.length} assets recorded
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#6A786E]">Loading media library...</div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#718075]">No media assets found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-[#F2EDE4] overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <span className="font-semibold text-[11px] text-[#121614] block truncate" title={asset.name}>
                  {asset.name}
                </span>
                <span className="text-[10px] text-[#7A8A7F] font-mono block mt-0.5">
                  {asset.size || 'Image'}
                </span>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EBE1]">
                  <button
                    onClick={() => handleCopyUrl(asset.url)}
                    className="inline-flex items-center gap-1 text-[10px] text-[#2D4536] hover:underline cursor-pointer"
                  >
                    {copiedUrl === asset.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  {deleteConfirmId === asset.id ? (
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-[9px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(asset.id)}
                      className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
