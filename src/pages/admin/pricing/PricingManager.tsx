import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, CheckCircle, Save, X, DollarSign, AlertCircle } from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { PricingPackageRecord } from '../../../lib/supabase/types';

export const PricingManager: React.FC = () => {
  const [packages, setPackages] = useState<PricingPackageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PricingPackageRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 'Launch Offer: ₹9,999 (Reg. ₹15,999)',
    regular_price: 15999,
    launch_price: 9999,
    badge: 'LAUNCH OFFER',
    billing_type: 'one-time',
    turnaround: '~7 Days Delivery',
    features: 'Modern, High-Converting Design\n100% Mobile, Tablet & Desktop Responsive\nContact Form & Direct Lead Capture\nWhatsApp Inquiry Integration\nBasic Google SEO Setup',
    is_featured: false,
    status: 'published' as 'published' | 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listPricing();
      setPackages(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData({
      title: '',
      slug: '',
      description: 'A fast, premium and mobile-friendly website that clearly presents your business and makes it easy for customers to contact you.',
      price: 'Launch Offer: ₹9,999 (Reg. ₹15,999)',
      regular_price: 15999,
      launch_price: 9999,
      badge: 'LAUNCH OFFER',
      billing_type: 'one-time',
      turnaround: '~7 Days Delivery',
      features: 'Modern, High-Converting Design\n100% Mobile, Tablet & Desktop Responsive\nContact Form & Direct Lead Capture\nWhatsApp Inquiry Integration\nBasic Google SEO Setup',
      is_featured: false,
      status: 'published',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: PricingPackageRecord) => {
    setEditingPkg(pkg);
    setFormData({
      title: pkg.title,
      slug: pkg.slug,
      description: pkg.description,
      price: pkg.price,
      regular_price: pkg.regular_price || 0,
      launch_price: pkg.launch_price || 0,
      badge: pkg.badge || '',
      billing_type: pkg.billing_type || 'one-time',
      turnaround: pkg.turnaround,
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      is_featured: pkg.is_featured,
      status: pkg.status as any,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    const featureList = formData.features.split('\n').map((f) => f.trim()).filter(Boolean);
    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formData.description.trim(),
      price: formData.price.trim(),
      regular_price: Number(formData.regular_price) || undefined,
      launch_price: Number(formData.launch_price) || undefined,
      badge: formData.badge.trim() || undefined,
      billing_type: formData.billing_type,
      turnaround: formData.turnaround.trim(),
      features: featureList,
      is_featured: formData.is_featured,
      status: formData.status,
    };

    try {
      if (editingPkg) {
        await adminCmsApi.updatePricing(editingPkg.id, payload);
      } else {
        await adminCmsApi.createPricing(payload);
      }
      await loadPricing();
      setModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || 'Database error: Failed to save pricing package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminCmsApi.deletePricing(id);
      setDeleteConfirmId(null);
      await loadPricing();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Commercial Scopes
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Pricing Packages Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Manage studio package tiers, investments, deliverable lists, and popular badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-xs text-[#6A786E]">Loading packages...</div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs ${
                pkg.is_featured ? 'border-[#C5A880] ring-1 ring-[#C5A880]/30' : 'border-[#E5DFD5]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif-title text-lg font-bold text-[#121614]">{pkg.title}</h3>
                  {pkg.is_featured && (
                    <span className="text-[9px] font-mono uppercase bg-[#FBF4E8] text-[#B88728] px-2 py-0.5 rounded-full border border-[#E9D5A5]">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="font-serif-title text-2xl font-bold text-[#1B2E24] mb-2">
                  {pkg.price}
                </div>
                <p className="text-xs text-[#627066] mb-4">{pkg.description}</p>

                <div className="text-[11px] font-mono text-[#8C988F] mb-3">
                  Turnaround: {pkg.turnaround}
                </div>

                <ul className="space-y-1.5 border-t border-[#F2ECE1] pt-3 text-xs text-[#445248]">
                  {pkg.features?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#25D366] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1] mt-5 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#738277]">{pkg.status}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {deleteConfirmId === pkg.id ? (
                    <div className="inline-flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-[10px] font-bold text-red-700 px-1.5 cursor-pointer"
                      >
                        Del
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-[10px] text-stone-600 px-1 cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(pkg.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#DFD7CA] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <h3 className="font-serif-title text-xl font-medium text-[#121614]">
                {editingPkg ? `Edit: ${editingPkg.title}` : 'Add Pricing Package'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#79887E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Badge (e.g. LAUNCH OFFER)</label>
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
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Launch Price (₹)</label>
                  <input
                    type="number"
                    value={formData.launch_price || ''}
                    placeholder="9999"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        launch_price: val,
                        price: formData.regular_price ? `Launch Offer: ₹${val.toLocaleString('en-IN')} (Reg. ₹${formData.regular_price.toLocaleString('en-IN')})` : `₹${val.toLocaleString('en-IN')}`
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={formData.regular_price || ''}
                    placeholder="15999"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        regular_price: val,
                        price: formData.launch_price ? `Launch Offer: ₹${formData.launch_price.toLocaleString('en-IN')} (Reg. ₹${val.toLocaleString('en-IN')})` : `₹${val.toLocaleString('en-IN')}`
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Billing Type</label>
                  <select
                    value={formData.billing_type}
                    onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  >
                    <option value="one-time">One-Time Delivery</option>
                    <option value="monthly">Monthly Retainer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Price Display String</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Turnaround</label>
                  <input
                    type="text"
                    value={formData.turnaround}
                    placeholder="~7 Days Delivery"
                    onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pop_pkg_cb"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2D4536]"
                />
                <label htmlFor="pop_pkg_cb" className="font-semibold text-xs text-[#121614] cursor-pointer">
                  Mark as Most Popular / Featured
                </label>
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
                  {isSubmitting ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
