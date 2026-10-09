import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, ExternalLink, Upload, Save, X } from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { PortfolioProjectRecord } from '../../../lib/supabase/types';
import { uploadCmsMedia } from '../../../lib/supabase/storage';

export const PortfolioManager: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProjectRecord | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Architecture & Interior',
    description: '',
    thumbnail_url: '/assets/images/Aurora living.jpg',
    project_url: '',
    is_verified_client_work: false,
    year: '2025–2026',
    challenge: '',
    solution: '',
    is_featured: true,
    status: 'published' as 'published' | 'draft',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listProjects();
      setProjects(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Architecture & Interior',
      description: 'Architectural portfolio designed with high precision typography and curated gallery layouts.',
      thumbnail_url: '/assets/images/Aurora living.jpg',
      project_url: 'https://yugark.in',
      is_verified_client_work: false,
      year: '2025–2026',
      challenge: 'Creating a high-performance minimalist portfolio with zero layout shifts.',
      solution: 'Engineered custom responsive grid tokens and image optimization pipelines.',
      is_featured: true,
      status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj: PortfolioProjectRecord) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      category: proj.category,
      description: proj.description,
      thumbnail_url: proj.thumbnail_url,
      project_url: proj.project_url || '',
      is_verified_client_work: proj.is_verified_client_work,
      year: proj.year || '2025–2026',
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      is_featured: proj.is_featured,
      status: proj.status as any,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadCmsMedia(file, 'portfolio');
      setFormData((prev) => ({ ...prev, thumbnail_url: res.publicUrl }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      description: formData.description.trim(),
      thumbnail_url: formData.thumbnail_url,
      project_url: formData.project_url.trim() || null,
      is_verified_client_work: formData.is_verified_client_work,
      project_type: formData.is_verified_client_work ? 'Verified Client Work' : 'Studio Concept',
      year: formData.year,
      challenge: formData.challenge,
      solution: formData.solution,
      is_featured: formData.is_featured,
      status: formData.status,
    };

    try {
      if (editingProject) {
        await adminCmsApi.updateProject(editingProject.id, payload);
      } else {
        await adminCmsApi.createProject(payload);
      }
      await loadProjects();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminCmsApi.deleteProject(id);
      setDeleteConfirmId(null);
      await loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Selected Studio Work
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Portfolio Work Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Manage case study breakdowns, verified client projects, and studio concept showcases.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Case Study</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6A786E]">Loading portfolio projects...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F1] border-b border-[#E5DFD5] text-[11px] font-mono uppercase text-[#6C7B71]">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Classification</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={proj.thumbnail_url}
                        alt={proj.title}
                        className="w-14 h-10 object-cover rounded-lg border border-[#DDD5C7] shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#121614] block">{proj.title}</span>
                        <span className="text-[10px] text-[#78887D]">{proj.year}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#556358]">{proj.category}</td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        proj.is_verified_client_work
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {proj.is_verified_client_work ? 'Verified Client' : 'Studio Concept'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-mono text-[10px] uppercase">
                    {proj.status}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmId === proj.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                          <button
                            onClick={() => handleDelete(proj.id)}
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
                          onClick={() => setDeleteConfirmId(proj.id)}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#DFD7CA] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <h3 className="font-serif-title text-xl font-medium text-[#121614]">
                {editingProject ? `Edit: ${editingProject.title}` : 'Add Portfolio Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-[#79887E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[10px] text-[#637267] mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                />
              </div>

              <div className="p-3 bg-[#F2EDE4] rounded-2xl flex items-center gap-3">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumb"
                  className="w-16 h-12 object-cover rounded-lg bg-white"
                />
                <div className="space-y-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFC5B4] cursor-pointer text-xs font-medium">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cover'}</span>
                    <input type="file" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="client_verified_cb"
                  checked={formData.is_verified_client_work}
                  onChange={(e) => setFormData({ ...formData, is_verified_client_work: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2D4536]"
                />
                <label htmlFor="client_verified_cb" className="font-semibold text-xs text-[#121614] cursor-pointer">
                  Verified Client Work (Unchecked = Concept / Demo Project)
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
                  {isSubmitting ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
