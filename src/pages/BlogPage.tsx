import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Filter, Sparkles, BookOpen } from 'lucide-react';
import { BlogPostItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedBlogPosts } from '../lib/cms';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function loadPosts() {
      const data = await getPublishedBlogPosts();
      setPosts(data);
    }
    loadPosts();

    const handleUpdate = () => loadPosts();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Website Development', label: 'Website Development' },
    { id: 'Content & Social Media', label: 'Content Strategy' },
    { id: 'Digital Marketing', label: 'Performance Ads' },
  ];

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const filteredPosts =
    activeCategory === 'all'
      ? publishedPosts
      : publishedPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#F8F6F1] py-8 sm:py-12 lg:py-16">
      <SEOHead
        title="Insights, Ideas & Editorial Playbooks"
        description="Thoughtful design engineering, content strategies, and performance frameworks for modern brands."
        canonicalPath="/blog"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-6 sm:mb-10">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Studio Editorial
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            Insights, Ideas & Technical Playbooks.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            Essays on design engineering, conversion architecture, organic retention, and paid acquisition.
            Written from real studio practice, not theoretical fluff.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 sm:mb-14 pb-4 border-b border-[#E8E2D7]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C887E] mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Topic:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1A2621] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4E564F] hover:bg-[#EAE3D6] border border-[#E6DFD3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16 sm:mb-24">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] overflow-hidden group hover:border-[#2D4536]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Header / Cover Image or Graphic Representation */}
                {post.isGraphicCard && post.graphicData ? (
                  <div className="aspect-[16/10] bg-[#1B2E24] p-6 flex flex-col justify-between text-[#FAF8F5] relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-mono text-[#A5C2B1] uppercase tracking-wider">
                        {post.graphicData.framework}
                      </span>
                      <span className="bg-[#2D4536] text-[#E5ECE7] text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {post.graphicData.architectureBadge}
                      </span>
                    </div>

                    <div className="z-10">
                      <p className="text-[11px] font-medium text-[#A5C2B1] uppercase tracking-wider mb-1">
                        {post.graphicData.playbookLabel}
                      </p>
                      <h3 className="font-serif-title text-xl text-white leading-tight">
                        {post.graphicData.headline}
                      </h3>
                    </div>

                    {/* Atmospheric background blur circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#2D4536]/40 rounded-full blur-2xl pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] bg-[#EBE4D8] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.alt || post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-[11px] text-[#788479] mb-3">
                    <span className="font-bold tracking-wider uppercase text-[#2D4536]">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614] mb-3 group-hover:text-[#2D4536] transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5C665E] leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 sm:p-8 pt-0 border-t border-[#ECE5D9]/60 mt-2 flex items-center justify-between">
                <div className="text-[11px] text-[#7C887E]">
                  <span className="font-medium text-[#121614]">{post.author}</span>
                  <span className="mx-1">•</span>
                  <span>{post.publishedDate}</span>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#121614] group-hover:text-[#2D4536] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Mission Statement Box */}
        <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <BookOpen className="w-6 h-6 text-[#2D4536] mx-auto mb-3" />
          <h2 className="font-serif-title text-2xl font-medium text-[#121614] mb-2">
            The Yugark Editorial Philosophy
          </h2>
          <p className="text-xs sm:text-sm text-[#616B63] leading-relaxed max-w-xl mx-auto">
            We write to document our architectural choices, test hypotheses, and provide transparent insights
            for modern founders and developers who care about craftsmanship.
          </p>
        </div>
      </div>
    </div>
  );
};
