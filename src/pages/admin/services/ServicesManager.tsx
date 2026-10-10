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
    image_url: '/assets/images/website devlopment.jpg',
    icon: 'code',
    price_display: 'Launch Offer: ₹9,999 (Reg. ₹15,999)',
    regular_price: 15999,
    launch_price: 9999,
    badge: 'LAUNCH OFFER',
    billing_type: 'one-time',
    delivery_time: '~7–14 Days',
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
      image_url: '/assets/images/website devlopment.jpg',
      icon: 'code',
      price_display: 'Launch Offer: ₹9,999 (Reg. ₹15,999)',
      regular_price: 15999,
      launch_price: 9999,
      badge: 'LAUNCH OFFER',
      billing_type: 'one-time',
      delivery_time: '~7–14 Days',
      features: 'High-Converting Responsive Design\nDirect WhatsApp & Lead Capture\nFast Loading Speed & Zero Bloat',
      benefits: 'Complete Code Ownership\nZero Monthly Platform Subscriptions',
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
      full_description: srv.full_description || srv.short_description,
      image_url: srv.image_url || '/assets/images/website devlopment.jpg',
      icon: srv.icon || 'code',
      price_display: srv.price_display || '',
      regular_price: srv.regular_price || 0,
      launch_price: srv.launch_price || 0,
      badge: srv.badge || '',
      billing_type: srv.billing_type || 'one-time',
      delivery_time: srv.delivery_time || '',
      features: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      benefits: Array.isArray(srv.benefits) ? srv.benefits.join('\n') : '',
      status: (srv.status === 'published' ? 'published' : 'draft') as any,
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
      image_url: formData.image_url.trim() || undefined,
      icon: formData.icon,
      price_display: formData.price_display.trim() || undefined,
      regular_price: Number(formData.regular_price) || undefined,
      launch_price: Number(formData.launch_price) || undefined,
      badge: formData.badge.trim() || undefined,
      billing_type: formData.billing_type,
      delivery_time: formData.delivery_time.trim() || undefined,
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
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Pricing &amp; Offer</th>
                <th className="py-3 px-4">Billing &amp; Delivery</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-10 rounded-lg bg-[#F2EDE4] border border-[#E3DACB] overflow-hidden flex items-center justify-center shrink-0">
                      {srv.image_url ? (
                        <img
                          src={srv.image_url}
                          alt={srv.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        renderIcon(srv.icon)
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-xs text-[#121614] block">{srv.title}</span>
                    <span className="text-[10px] font-mono text-[#76857A]">/{srv.slug}</span>
                    {srv.badge && (
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-[#E5ECE7] text-[#294B37]">
                        {srv.badge}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-xs text-[#1B2E24]">
                      {srv.launch_price ? `₹${srv.launch_price.toLocaleString('en-IN')}` : srv.price_display || 'Custom Quote'}
                    </div>
                    {srv.regular_price && srv.launch_price && srv.regular_price > srv.launch_price && (
                      <div className="text-[10px] text-[#7A877E] line-through">
                        ₹{srv.regular_price.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#556358]">
                    <div className="capitalize font-mono text-[11px] font-medium text-[#2D4536]">
                      {srv.billing_type || 'one-time'}
                    </div>
                    <div className="text-[10px] text-[#7C887F]">
                      {srv.delivery_time || '~7–14 Days'}
                    </div>
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
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#DFD7CA] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3 sticky top-0 bg-[#FAF8F5] z-10">
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

              {/* Thumbnail URL & Preview */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Service Thumbnail URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image_url}
                    placeholder="/assets/images/website devlopment.jpg"
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs font-mono"
                  />
                  <div className="w-10 h-10 rounded-lg border border-[#DDD5C7] overflow-hidden bg-stone-100 shrink-0">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-1.5 flex-wrap text-[10px] text-[#6A786E]">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '/assets/images/website devlopment.jpg' })}
                    className="hover:underline text-[#2D4536]"
                  >
                    Website Dev
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '/assets/images/content-and-social-media.jpg' })}
                    className="hover:underline text-[#2D4536]"
                  >
                    Social Media
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '/assets/images/business-pro.jpg' })}
                    className="hover:underline text-[#2D4536]"
                  >
                    Business Pro
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '/assets/images/pixelplay.jpg' })}
                    className="hover:underline text-[#2D4536]"
                  >
                    Pixelplay
                  </button>
                </div>
              </div>

              {/* Pricing & Discount Fields */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#F4EFE6] rounded-2xl border border-[#ECE5D9]">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Launch Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.launch_price || ''}
                    placeholder="9999"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        launch_price: val,
                        price_display: formData.regular_price
                          ? `Launch Offer: ₹${val.toLocaleString('en-IN')} (Reg. ₹${formData.regular_price.toLocaleString('en-IN')})`
                          : `₹${val.toLocaleString('en-IN')}`,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Regular Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.regular_price || ''}
                    placeholder="15999"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        regular_price: val,
                        price_display: formData.launch_price
                          ? `Launch Offer: ₹${formData.launch_price.toLocaleString('en-IN')} (Reg. ₹${val.toLocaleString('en-IN')})`
                          : `₹${val.toLocaleString('en-IN')}`,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    placeholder="LAUNCH OFFER"
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Price Display String
                  </label>
                  <input
                    type="text"
                    value={formData.price_display}
                    placeholder="Launch Offer: ₹9,999 (Reg. ₹15,999)"
                    onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Billing Type
                  </label>
                  <select
                    value={formData.billing_type}
                    onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  >
                    <option value="one-time">One-Time Delivery</option>
                    <option value="monthly">Monthly Retainer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_time}
                    placeholder="~7 Days Delivery"
                    onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / Archived</option>
                  </select>
                </div>
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
                  Full Service Description
                </label>
                <textarea
                  rows={3}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Key Features (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Included Deliverables / Benefits
                  </label>
                  <textarea
                    rows={4}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
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
