import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { blogPostsData as initialBlogPosts } from '../data/studioData';
import { BlogPostItem } from '../types/content';
import { getPublishedBlogPosts } from '../lib/cms';

interface InsightsBlogProps {
  onSelectArticle: (article: BlogPostItem) => void;
  onViewAllArticles: () => void;
}

export const InsightsBlog: React.FC<InsightsBlogProps> = ({
  onSelectArticle,
  onViewAllArticles,
}) => {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialBlogPosts);

  useEffect(() => {
    async function load() {
      const data = await getPublishedBlogPosts();
      if (data && data.length > 0) {
        setPosts(data);
      }
    }
    load();

    const handleUpdate = () => load();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-[#F8F6F1] border-t border-[#ECE5D9]" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: Left title with kicker, Right clean "Explore Our Blog ->" link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-[#E8E2D7] gap-2">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — From Our Blog
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
              Insights &amp; Ideas
            </h2>
            <p className="text-xs sm:text-sm text-[#5A635C] mt-1 max-w-xl leading-relaxed">
              Useful tips about websites, creative content and digital marketing.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={onViewAllArticles}
              className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
            >
              <span>Explore Our Blog</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* 3 Editorial Blog Cards: Adaptable responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectArticle(post)}
              className="editorial-card group bg-[#FAF7F2] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E6DFD3] flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                {/* Card Media or Graphic Header */}
                {post.isGraphicCard && post.graphicData ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1B2E24] p-5 flex flex-col justify-between text-[#FAF8F5]">
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[9px] font-mono text-[#A5C2B1] uppercase tracking-wider">
                        {post.graphicData.framework}
                      </span>
                      <span className="bg-[#2D4536] text-[#E5ECE7] text-[9px] px-2 py-0.5 rounded-full font-medium">
                        {post.graphicData.architectureBadge}
                      </span>
                    </div>

                    <div className="z-10">
                      <p className="text-[10px] font-medium text-[#A5C2B1] uppercase tracking-wider mb-0.5">
                        {post.graphicData.playbookLabel}
                      </p>
                      <h4 className="font-serif-title text-base text-white leading-tight">
                        {post.graphicData.headline}
                      </h4>
                    </div>

                    {/* Atmospheric background blur circle */}
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#2D4536]/50 rounded-full blur-xl pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0]">
                    <img
                      alt={post.alt || post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={post.image || '/assets/images/website devlopment.jpg'}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {/* Card Body */}
                <div className="p-3 sm:p-5">
                  <span className="text-[9px] font-mono uppercase text-[#76857A] tracking-wider block mb-1">
                    {post.category}
                  </span>
                  <h3 className="font-serif-title text-sm sm:text-base lg:text-lg font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6F766F] leading-relaxed line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Action Link */}
              <div className="px-3 pb-3 sm:px-5 sm:pb-5 pt-0">
                <div className="inline-flex items-center text-xs font-semibold tracking-wider text-[#121614] group-hover:text-[#2D4536]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
