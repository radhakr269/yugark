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
    <section
      className="py-14 sm:py-18 lg:py-24 border-t border-[#1F2C24]"
      id="blog"
      style={{
        background:
          'linear-gradient(135deg, rgb(11, 34, 25) 0%, rgb(15, 46, 34) 55%, rgb(9, 26, 19) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-[#2A3F33]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#A5C2B1] uppercase">
                From Our Blog
              </span>
              <span className="text-[10px] text-[#7A9886] font-medium tracking-wide">
                (Editorial Previews)
              </span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-[42px] font-medium text-[#FAF8F5]">
              Insights &amp; Ideas
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-4 sm:gap-6">
            <p className="text-xs text-[#CBD8D0] max-w-xs hidden md:block">
              Thoughts, tips and resources on web design, content, marketing and brand growth.
            </p>
            <button
              onClick={onViewAllArticles}
              className="min-h-[40px] inline-flex items-center px-4 sm:px-5 py-2 rounded-full border border-[#8DA998] text-xs font-semibold tracking-wider text-[#FAF8F5] hover:bg-white hover:text-[#1B2E24] transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* 3 Editorial Blog Cards: Refined height and padding for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {blogPostsData.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectArticle(post)}
              className="editorial-card group bg-[#FAF7F2] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E6DFD3] flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            >
              <div>
                {/* Card Media or Graphic Header */}
                {post.isGraphicCard && post.graphicData ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1A2621] p-5 sm:p-6 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[#A5C2B1] font-semibold">
                      <span>{post.graphicData.framework}</span>
                      <span>{post.graphicData.precision}</span>
                    </div>
                    <div className="my-auto py-2">
                      <p className="text-[10px] sm:text-[11px] text-[#A5C2B1] tracking-wider uppercase mb-1 font-mono">
                        {post.graphicData.architectureBadge}
                      </p>
                      <h4 className="font-serif-title text-xl sm:text-2xl text-white font-medium leading-tight">
                        {post.graphicData.headline}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <span className="w-2 h-2 rounded-full bg-[#8AA795]" />
                      <span className="text-[11px] text-[#CAD6CE]">
                        {post.graphicData.playbookLabel}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0]">
                    <img
                      alt={post.alt || post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={post.image}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {/* Card Body with Compact Responsive Padding */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#7A837A] uppercase mb-1.5 sm:mb-2">
                    {post.category}
                  </p>
                  <h3 className="font-serif-title text-lg sm:text-xl font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors leading-snug mb-2 sm:mb-2.5">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#6F766F] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Action Link */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6 pt-1">
                <div className="min-h-[36px] inline-flex items-center text-xs font-semibold tracking-wider text-[#121614] group-hover:text-[#2D4536]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
