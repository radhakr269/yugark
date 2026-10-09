import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  Upload,
  AlertCircle,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  X,
  Save,
  Check,
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { WebsiteDemoRecord } from '../../../lib/supabase/types';
import { uploadCmsMedia, isSafeExternalUrl } from '../../../lib/supabase/storage';
import { isSupabaseConfigured } from '../../../lib/supabase/client';

export const DemoManager: React.FC = () => {
  const [demos, setDemos] = useState<WebsiteDemoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<WebsiteDemoRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_name: 'Corporate & Business',
    short_description: '',
    full_description: '',
    thumbnail_url: '',
    demo_url: '',
    technology_tags: 'React, TypeScript, Tailwind CSS',
    is_featured: true,
    sort_order: 1,
    status: 'published' as 'published' | 'draft',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Preview Modal State
  const [previewModalDemo, setPreviewModalDemo] = useState<WebsiteDemoRecord | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadDemos();
  }, []);

  async function loadDemos() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listDemos();
      setDemos(list);
    } catch (err) {
      console.error('Failed to load demos:', err);
    } finally {
      setLoading(false);
    }
  }

  // Open modal for new demo
  const handleOpenAddModal = () => {
    setEditingDemo(null);
    setFormData({
      title: '',
      slug: '',
      category_name: 'Corporate & Business',
      short_description: '',
      full_description: '',
      thumbnail_url: '/assets/images/Business pro.jpg',
      demo_url: 'https://yugark.in',
      technology_tags: 'React, TypeScript, Tailwind CSS',
      is_featured: true,
      sort_order: demos.length + 1,
      status: 'published',
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (demo: WebsiteDemoRecord) => {
    setEditingDemo(demo);
    setFormData({
      title: demo.title,
      slug: demo.slug,
      category_name: demo.category_name || 'Turnkey Solution',
      short_description: demo.short_description,
      full_description: demo.full_description || demo.short_description,
      thumbnail_url: demo.thumbnail_url,
      demo_url: demo.demo_url,
      technology_tags: Array.isArray(demo.technology_tags)
        ? demo.technology_tags.join(', ')
        : 'React, TypeScript, Tailwind CSS',
      is_featured: demo.is_featured,
      sort_order: demo.sort_order,
      status: demo.status as any,
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  // Auto-slug generator on title change if creating new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingDemo
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.slug,
    }));
  };

  // Image file upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);

    try {
      const result = await uploadCmsMedia(file, 'demos');
      setFormData((prev) => ({ ...prev, thumbnail_url: result.publicUrl }));
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload preview image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save / Update Demo
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!formData.title.trim()) {
      setFormError('Demo title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('URL slug is required.');
      return;
    }
    if (!formData.thumbnail_url.trim()) {
      setFormError('Thumbnail image is required.');
      return;
    }
    if (!formData.demo_url.trim()) {
      setFormError('Live website URL is required.');
      return;
    }
    if (!isSafeExternalUrl(formData.demo_url)) {
      setFormError('Invalid or unsafe website URL. Must begin with https:// or http://.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category_name: formData.category_name,
      short_description: formData.short_description.trim() || formData.title,
      full_description: formData.full_description.trim() || formData.short_description.trim(),
      thumbnail_url: formData.thumbnail_url.trim(),
      demo_url: formData.demo_url.trim(),
      technology_tags: formData.technology_tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      is_featured: formData.is_featured,
      sort_order: Number(formData.sort_order) || 1,
      status: formData.status,
    };

    try {
      if (editingDemo) {
        await adminCmsApi.updateDemo(editingDemo.id, payload);
        setFormSuccess('Website Demo updated successfully! Public pages updated.');
      } else {
        await adminCmsApi.createDemo(payload);
        setFormSuccess('Website Demo created & published successfully!');
      }

      await loadDemos();
      setTimeout(() => {
        setModalOpen(false);
      }, 700);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save demo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick toggle publish/unpublish
  const handleTogglePublish = async (demo: WebsiteDemoRecord) => {
    const newStatus = demo.status === 'published' ? 'draft' : 'published';
    try {
      await adminCmsApi.updateDemo(demo.id, { status: newStatus as any });
      await loadDemos();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Duplicate Demo
  const handleDuplicate = async (demo: WebsiteDemoRecord) => {
    try {
      await adminCmsApi.createDemo({
        title: `${demo.title} (Copy)`,
        slug: `${demo.slug}-copy-${Date.now().toString().slice(-4)}`,
        category_name: demo.category_name,
        short_description: demo.short_description,
        full_description: demo.full_description,
        thumbnail_url: demo.thumbnail_url,
        demo_url: demo.demo_url,
        technology_tags: demo.technology_tags,
        is_featured: false,
        sort_order: demo.sort_order + 1,
        status: 'draft',
      });
      await loadDemos();
    } catch (err) {
      console.error('Failed to duplicate demo:', err);
    }
  };

  // Delete Demo
  const handleDelete = async (id: string) => {
    try {
      await adminCmsApi.deleteDemo(id);
      setDeleteConfirmId(null);
      await loadDemos();
    } catch (err) {
      console.error('Failed to delete demo:', err);
    }
  };

  // Reorder Demos
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= demos.length) return;

    const newDemos = [...demos];
    const [moved] = newDemos.splice(index, 1);
    newDemos.splice(targetIndex, 0, moved);

    const orderedIds = newDemos.map((d) => d.id);
    setDemos(newDemos);
    await adminCmsApi.reorderDemos(orderedIds);
  };

  // Filtered Demos
  const categories = ['all', 'Corporate & Business', 'Beauty & Lifestyle', 'Restaurant & Cafe', 'Fitness & Wellness'];

  const filteredDemos = demos.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.category_name && d.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.demo_url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || d.category_name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
              High Priority Module
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1B2E24] text-[#A5C2B1] font-mono uppercase">
              Phase 5 Active
            </span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Website Demos Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Manage interactive showcase demos, live preview URLs, responsive tags, and homepage featured placement.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Demo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search demos by title or URL..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs text-[#121614] placeholder-[#8C988F] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
          />
          <Search className="w-4 h-4 text-[#8C988F] absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#627066]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Demos Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6A786E]">
            <div className="w-6 h-6 border-2 border-[#2D4536] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading demos...
          </div>
        ) : filteredDemos.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#718075]">
            <p className="font-semibold text-sm mb-1 text-[#121614]">No demos match your criteria</p>
            <p>Try resetting filters or click "Add New Demo" above to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F1] border-b border-[#E5DFD5] text-[11px] font-mono uppercase text-[#6C7B71]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3 px-4">Demo Preview</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Website URL</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filteredDemos.map((demo, index) => (
                  <tr key={demo.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 text-[#88988D] hover:text-[#121614] disabled:opacity-20 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[10px] text-[#556358]">{demo.sort_order}</span>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === filteredDemos.length - 1}
                          className="p-0.5 text-[#88988D] hover:text-[#121614] disabled:opacity-20 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Preview Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={demo.thumbnail_url}
                          alt={demo.title}
                          className="w-16 h-11 object-cover rounded-lg border border-[#DDD5C7] shrink-0 bg-[#EBE4D8]"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-[#121614] block truncate">
                            {demo.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#76857A] truncate block">
                            /{demo.slug}
                          </span>
                          <span className="text-[10px] text-[#86968B] line-clamp-1 mt-0.5">
                            {demo.short_description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#526056] font-medium">
                      {demo.category_name || 'Turnkey Solution'}
                    </td>

                    {/* Website URL */}
                    <td className="py-3 px-4">
                      <a
                        href={demo.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#2D4536] hover:underline truncate max-w-[160px]"
                        title={demo.demo_url}
                      >
                        <span className="truncate">{demo.demo_url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    {/* Featured Status */}
                    <td className="py-3 px-4 text-center">
                      {demo.is_featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FDF5E6] text-[#B38734] border border-[#EAD09D]">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-[#A5B3A9] font-mono text-[10px]">—</span>
                      )}
                    </td>

                    {/* Published Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(demo)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                          demo.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {demo.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-stone-500" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewModalDemo(demo)}
                          title="Interactive Device Preview"
                          className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(demo)}
                          title="Edit Demo"
                          className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(demo)}
                          title="Duplicate Demo"
                          className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === demo.id ? (
                          <div className="inline-flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                            <button
                              onClick={() => handleDelete(demo.id)}
                              className="text-[10px] font-bold text-red-700 px-1.5 py-0.5 rounded bg-red-200 hover:bg-red-300 cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[10px] text-stone-600 px-1 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(demo.id)}
                            title="Delete Demo"
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* ADD / EDIT DEMO MODAL                                                */}
      {/* ==================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#DFD7CA] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E8E1D5] flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#79887E] uppercase block">
                  {editingDemo ? 'Edit Existing Record' : 'New Website Demo'}
                </span>
                <h3 className="font-serif-title text-xl font-medium text-[#121614]">
                  {editingDemo ? `Edit: ${editingDemo.title}` : 'Add Turnkey Website Demo'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full text-[#79887E] hover:text-[#121614] hover:bg-[#F2ECE1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Demo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., Sole Beauty Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="sole-beauty-studio"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] font-mono focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Industry Category *
                  </label>
                  <select
                    value={formData.category_name}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                  >
                    <option value="Corporate & Business">Corporate & Architecture</option>
                    <option value="Beauty & Lifestyle">Beauty & Lifestyle</option>
                    <option value="Restaurant & Cafe">Hospitality & Dining</option>
                    <option value="Fitness & Wellness">Fitness & Athletics</option>
                    <option value="Turnkey Solution">Turnkey Solution</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Live Demo Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="High-conversion digital storefront featuring direct WhatsApp lead routing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
                />
              </div>

              {/* Image Upload & Preview Section */}
              <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#DDD5C7] space-y-3">
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#556358]">
                  Preview / Thumbnail Image *
                </label>

                <div className="flex items-center gap-4">
                  {formData.thumbnail_url && (
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-[#D5CDC0] bg-white shrink-0"
                    />
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFC5B4] text-[#121614] hover:bg-[#FAF7F2] transition-colors cursor-pointer font-medium text-xs shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Choose File from Device'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-[#718075]">JPG, PNG, WebP (max 10MB)</span>
                    </div>

                    <input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      placeholder="Or enter image URL path directly"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DDD5C7] text-[11px] font-mono text-[#121614] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="is_featured_cb"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#2D4536] focus:ring-[#2D4536]"
                  />
                  <label htmlFor="is_featured_cb" className="font-semibold text-xs text-[#121614] cursor-pointer">
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DDD5C7] text-[#556358] hover:bg-[#F0EBE1] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#284434] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : editingDemo ? 'Update Demo' : 'Publish Demo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* INTERACTIVE DEVICE PREVIEW MODAL                                     */}
      {/* ==================================================================== */}
      {previewModalDemo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-between p-4">
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2">
            <div>
              <span className="text-[10px] font-mono text-[#A5C2B1] uppercase tracking-wider block">
                Live Interactive Sandbox
              </span>
              <h4 className="font-serif-title text-lg text-white font-medium">
                {previewModalDemo.title} ({previewModalDemo.category_name})
              </h4>
            </div>

            {/* Viewport Selectors */}
            <div className="flex items-center gap-1 bg-[#1F2E25] p-1 rounded-xl border border-[#2F4437]">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  deviceView === 'desktop' ? 'bg-[#2E4738] text-white' : 'text-[#8E9F94] hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  deviceView === 'tablet' ? 'bg-[#2E4738] text-white' : 'text-[#8E9F94] hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  deviceView === 'mobile' ? 'bg-[#2E4738] text-white' : 'text-[#8E9F94] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={() => setPreviewModalDemo(null)}
              className="p-2 rounded-full bg-[#1F2E25] text-white hover:bg-[#2F4437]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Device Mock Frame */}
          <div className="flex-1 w-full flex items-center justify-center my-3 overflow-hidden">
            <div
              className={`h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-all flex flex-col ${
                deviceView === 'desktop'
                  ? 'w-full max-w-5xl'
                  : deviceView === 'tablet'
                  ? 'w-[768px] max-w-full'
                  : 'w-[375px] max-w-full'
              }`}
            >
              <div className="bg-[#121614] px-4 py-2 flex items-center justify-between text-white text-[11px] font-mono">
                <span className="truncate">{previewModalDemo.demo_url}</span>
                <a
                  href={previewModalDemo.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A5C2B1] hover:underline flex items-center gap-1"
                >
                  <span>Open in Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <iframe
                src={previewModalDemo.demo_url}
                title={previewModalDemo.title}
                className="w-full flex-1 border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
