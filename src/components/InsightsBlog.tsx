import React from 'react';
import { ArrowRight } from 'lucide-react';
import { blogPostsData } from '../data/studioData';
import { BlogPostItem } from '../types/content';

interface InsightsBlogProps {
  onSelectArticle: (article: BlogPostItem) => void;
  onViewAllArticles: () => void;
}

export const InsightsBlog: React.FC<InsightsBlogProps> = ({
  onSelectArticle,
  onViewAllArticles,
}) => {
  return (
    <section className="py-7 sm:py-14 lg:py-20 bg-[#F8F6F1] border-t border-[#ECE5D9]" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: Left title with kicker, Right clean "View All Articles ->" link */}
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-[#E8E2D7]">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — From Our Blog
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
              Insights &amp; Ideas
            </h2>
          </div>
          <div>
            <button
              onClick={onViewAllArticles}
              className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* 3 Editorial Blog Cards: Exact 3-column horizontal layout as shown in image.png */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
          {blogPostsData.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectArticle(post)}
              className="editorial-card group bg-[#FAF7F2] rounded-lg sm:rounded-2xl overflow-hidden border border-[#E6DFD3] flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                {/* Card Media or Graphic Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0]">
                  <img
                    alt={post.alt || post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={post.image || '/assets/images/website devlopment.jpg'}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Card Body */}
                <div className="p-2 sm:p-4 lg:p-6">
                  <h3 className="font-serif-title text-[9.5px] sm:text-base lg:text-xl font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors leading-tight mb-1 sm:mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[7.5px] sm:text-xs text-[#6F766F] leading-snug sm:leading-relaxed hidden sm:line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Action Link */}
              <div className="px-2 pb-2 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6 pt-0">
                <div className="inline-flex items-center text-[7.5px] sm:text-xs font-semibold tracking-wider text-[#121614] group-hover:text-[#2D4536]">
                  <span>Read Article</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
