import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Edit,
  Trash2,
  Code,
  MessageSquare,
  Send,
  Zap,
  Palette,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  Check,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { ServiceRecord } from '../../../lib/supabase/types';

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon: 'code',
    features: '',
    benefits: '',
    status: 'published' as 'published' | 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listServices();
      setServices(list);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      icon: 'code',
      features: 'High Conversion Design\nPerformance Engineering\nDirect Lead Capture',
      benefits: 'Full Source Code Ownership\nResponsive Cross-Device Layouts',
      status: 'published',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceRecord) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      slug: srv.slug,
      short_description: srv.short_description,
      full_description: srv.full_description,
      icon: srv.icon || 'code',
      features: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      benefits: Array.isArray(srv.benefits) ? srv.benefits.join('\n') : '',
      status: srv.status as any,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingService
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      setFormError('Title and URL slug are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const featureList = formData.features.split('\n').map((f) => f.trim()).filter(Boolean);
    const benefitList = formData.benefits.split('\n').map((b) => b.trim()).filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      short_description: formData.short_description.trim() || formData.title,
      full_description: formData.full_description.trim() || formData.short_description.trim(),
      icon: formData.icon,
      features: featureList,
      benefits: benefitList,
      status: formData.status,
    };

    try {
      if (editingService) {
        await adminCmsApi.updateService(editingService.id, payload);
      } else {
        await adminCmsApi.createService(payload);
      }
      await loadServices();
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminCmsApi.deleteService(id);
      setDeleteConfirmId(null);
      await loadServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-4 h-4 text-[#2D4536]" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-[#2D4536]" />;
      case 'target':
        return <Send className="w-4 h-4 text-[#2D4536]" />;
      case 'sparkles':
        return <Zap className="w-4 h-4 text-[#2D4536]" />;
      case 'palette':
        return <Palette className="w-4 h-4 text-[#2D4536]" />;
      default:
        return <Code className="w-4 h-4 text-[#2D4536]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Studio Capabilities
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Services Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Manage core disciplines, deliverables, and service landing page content.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6A786E]">Loading services...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F1] border-b border-[#E5DFD5] text-[11px] font-mono uppercase text-[#6C7B71]">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-xs text-[#121614] block">{srv.title}</span>
                    <span className="text-[10px] font-mono text-[#76857A]">/{srv.slug}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="w-8 h-8 rounded-lg bg-[#F2EDE4] flex items-center justify-center">
                      {renderIcon(srv.icon)}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#556358] max-w-xs truncate">
                    {srv.short_description}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        srv.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {srv.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/services/${srv.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmId === srv.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                          <button
                            onClick={() => handleDelete(srv.id)}
                            className="text-[10px] font-bold text-red-700 px-1.5 py-0.5 rounded bg-red-200 cursor-pointer"
                          >
                            Delete
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
                          onClick={() => setDeleteConfirmId(srv.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
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
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#DFD7CA] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <h3 className="font-serif-title text-xl font-medium text-[#121614]">
                {editingService ? `Edit: ${editingService.title}` : 'Add Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#79887E] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-red-100 text-red-800 text-xs">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Icon Design
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                >
                  <option value="code">Code (Engineering &amp; Websites)</option>
                  <option value="chat">Chat (Social Media &amp; Content)</option>
                  <option value="target">Target (Paid Ads &amp; Performance)</option>
                  <option value="sparkles">Sparkles (AI Creative &amp; Vision)</option>
                  <option value="palette">Palette (Branding &amp; Identity)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Tagline / Short Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Key Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#284434] cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
