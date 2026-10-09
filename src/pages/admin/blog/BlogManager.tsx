import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Upload,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  Check,
  TrendingUp,
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { BlogPostRecord } from '../../../lib/supabase/types';
import { uploadCmsMedia } from '../../../lib/supabase/storage';

export const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_name: 'Website Development',
    excerpt: '',
    content: '',
    cover_image_url: '/assets/images/content-and-social-media.jpg',
    author_name: 'Yugark Editorial',
    author_role: 'Design Engineering',
    read_time: '5 min read',
    seo_title: '',
    seo_description: '',
    status: 'published' as 'published' | 'draft',
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Delete Confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listBlogPosts();
      setBlogs(list);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category_name: 'Website Development',
      excerpt: '',
      content: '',
      cover_image_url: '/assets/images/content-and-social-media.jpg',
      author_name: 'Yugark Editorial',
      author_role: 'Design Engineering',
      read_time: '5 min read',
      seo_title: '',
      seo_description: '',
      status: 'published',
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPostRecord) => {
    setEditingBlog(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      category_name: post.category_name || 'Website Development',
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url || '/assets/images/content-and-social-media.jpg',
      author_name: post.author_name || 'Yugark Editorial',
      author_role: post.author_role || 'Design Engineering',
      read_time: post.read_time || '5 min read',
      seo_title: post.seo_title || post.title,
      seo_description: post.seo_description || post.excerpt,
      status: post.status as any,
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingBlog
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.slug,
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setFormError(null);

    try {
      const result = await uploadCmsMedia(file, 'blogs');
      setFormData((prev) => ({ ...prev, cover_image_url: result.publicUrl }));
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload cover image.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Blog title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('URL slug is required.');
      return;
    }
    if (!formData.excerpt.trim()) {
      setFormError('Excerpt is required.');
      return;
    }
    if (!formData.content.trim()) {
      setFormError('Article content is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const paragraphs = formData.content
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category_name: formData.category_name,
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      rich_paragraphs: paragraphs,
      cover_image_url: formData.cover_image_url,
      author_name: formData.author_name,
      author_role: formData.author_role,
      read_time: formData.read_time,
      seo_title: formData.seo_title || formData.title,
      seo_description: formData.seo_description || formData.excerpt,
      status: formData.status,
    };

    try {
      if (editingBlog) {
        await adminCmsApi.updateBlogPost(editingBlog.id, payload);
        setFormSuccess('Article updated successfully!');
      } else {
        await adminCmsApi.createBlogPost(payload);
        setFormSuccess('Article published successfully!');
      }

      await loadBlogs();
      setTimeout(() => setModalOpen(false), 700);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (post: BlogPostRecord) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await adminCmsApi.updateBlogPost(post.id, { status: nextStatus as any });
      await loadBlogs();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDuplicate = async (post: BlogPostRecord) => {
    try {
      await adminCmsApi.createBlogPost({
        title: `${post.title} (Draft Copy)`,
        slug: `${post.slug}-copy-${Date.now().toString().slice(-4)}`,
        category_name: post.category_name,
        excerpt: post.excerpt,
        content: post.content,
        rich_paragraphs: post.rich_paragraphs,
        cover_image_url: post.cover_image_url,
        author_name: post.author_name,
        author_role: post.author_role,
        read_time: post.read_time,
        status: 'draft',
      });
      await loadBlogs();
    } catch (err) {
      console.error('Failed to duplicate post:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminCmsApi.deleteBlogPost(id);
      setDeleteConfirmId(null);
      await loadBlogs();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const categories = ['all', 'Website Development', 'Content & Social Media', 'Digital Marketing', 'Branding & Identity'];

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.category_name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Editorial Playbooks &amp; Insights
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Blog &amp; Editorial Manager
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Author and publish long-form essays, technical playbooks, and track real article readership.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#264032] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs text-[#121614] focus:outline-none focus:ring-2 focus:ring-[#2D4536]"
          />
          <Search className="w-4 h-4 text-[#8C988F] absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
          >
            <option value="all">All Topics</option>
            {categories.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Blog Articles Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6A786E]">Loading editorial posts...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#718075]">No articles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F1] border-b border-[#E5DFD5] text-[11px] font-mono uppercase text-[#6C7B71]">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Tracked Views</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filteredBlogs.map((post) => {
                  const views = adminCmsApi.getBlogViews(post.slug);
                  return (
                    <tr key={post.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {post.cover_image_url && (
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              className="w-14 h-10 object-cover rounded-lg border border-[#DDD5C7] shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-[#121614] block truncate">
                              {post.title}
                            </span>
                            <span className="text-[10px] text-[#78887D] truncate block mt-0.5">
                              {post.author_name} • {post.read_time}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#526056] font-medium">
                        {post.category_name || 'Design'}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-[#1B2E24]">
                        <span className="inline-flex items-center gap-1 bg-[#F2EDE4] px-2.5 py-0.5 rounded-full text-[11px]">
                          <Eye className="w-3 h-3 text-[#556358]" />
                          <span>{views}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold cursor-pointer ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            title="View Public Post"
                            className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(post)}
                            title="Edit Article"
                            className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(post)}
                            title="Duplicate Article"
                            className="p-1.5 rounded-lg text-[#65756A] hover:text-[#121614] hover:bg-[#F2ECE1] cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {deleteConfirmId === post.id ? (
                            <div className="inline-flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="text-[10px] font-bold text-red-700 px-1.5 py-0.5 rounded bg-red-200 hover:bg-red-300 cursor-pointer"
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
                              onClick={() => setDeleteConfirmId(post.id)}
                              title="Delete Article"
                              className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* BLOG EDITOR MODAL                                                    */}
      {/* ==================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#DFD7CA] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[#E8E1D5] flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#79887E] uppercase block">
                  Studio Editorial
                </span>
                <h3 className="font-serif-title text-xl font-medium text-[#121614]">
                  {editingBlog ? `Edit: ${editingBlog.title}` : 'Write New Article'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full text-[#79887E] hover:text-[#121614] hover:bg-[#F2ECE1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Why Speed is the Best Brand Strategy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614] focus:ring-2 focus:ring-[#2D4536] focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs font-mono text-[#121614] focus:ring-2 focus:ring-[#2D4536] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Category Topic
                  </label>
                  <select
                    value={formData.category_name}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#121614]"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="Content & Social Media">Content & Social Media</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Branding & Identity">Branding & Identity</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="4 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="One or two sentences summarizing the core thesis..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs focus:ring-2 focus:ring-[#2D4536] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[10px] text-[#637267] mb-1">
                  Article Body (Markdown / Structured Paragraphs) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full editorial article here. Separate paragraphs with double line breaks..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs leading-relaxed font-sans focus:ring-2 focus:ring-[#2D4536] focus:outline-none"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#DDD5C7] flex items-center gap-4">
                {formData.cover_image_url && (
                  <img
                    src={formData.cover_image_url}
                    alt="Cover"
                    className="w-20 h-14 object-cover rounded-xl border border-[#D5CDC0] bg-white shrink-0"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFC5B4] text-[#121614] hover:bg-[#FAF7F2] cursor-pointer font-medium text-xs shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCover ? 'Uploading Cover...' : 'Upload Cover from Device'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    placeholder="Or enter image URL path"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DDD5C7] text-[11px] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#637267]">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD5C7] text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#DDD5C7] text-[#556358] hover:bg-[#F0EBE1] text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingCover}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#284434] shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Saving...' : editingBlog ? 'Update Post' : 'Publish Article'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
