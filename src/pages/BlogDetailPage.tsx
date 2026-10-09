import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Check,
  Bookmark,
  User,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { BlogPostItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPublishedBlogPosts, trackBlogView } from '../lib/cms';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getPublishedBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (slug) {
      trackBlogView(slug);
    }
  }, [slug]);

  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = posts[postIndex];

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F6F1] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2D4536] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#7C887E]">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] bg-[#F8F6F1] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <h1 className="font-serif-title text-3xl font-medium text-[#121614] mb-3">
            Article Not Found
          </h1>
          <p className="text-sm text-[#6A746B] mb-6">
            The editorial essay or playbook you are looking for has been archived or relocated.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-20">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        ogImage={post.image}
        articleData={{
          headline: post.title,
          authorName: post.author,
          image: post.image,
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-[#7C887E] mb-8">
          <Link to="/" className="hover:text-[#121614] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#121614] transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[#121614] font-semibold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#E5ECE7] text-[#294B37] text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-[#788479] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span className="text-xs text-[#788479]">•</span>
            <span className="text-xs text-[#788479] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.publishedDate}</span>
            </span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-5xl font-medium text-[#121614] leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-[#4A544C] leading-relaxed font-serif italic pb-6 border-b border-[#E8E2D7]">
            {post.excerpt}
          </p>

          {/* Author Byline & Sharing Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B2E24] text-[#FAF8F5] flex items-center justify-center font-bold text-xs uppercase">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#121614]">
                  {post.author}
                </p>
                <p className="text-[11px] text-[#768278]">
                  {post.authorRole}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D5CDC0] text-xs font-medium text-[#4E564F] hover:bg-[#EAE3D6] transition-colors cursor-pointer"
                title="Copy article link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2D4536]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Visual */}
        {post.isGraphicCard && post.graphicData ? (
          <div className="rounded-2xl sm:rounded-3xl bg-[#1B2E24] p-8 sm:p-12 text-[#FAF8F5] mb-12 sm:mb-16 relative overflow-hidden shadow-lg border border-[#2D4536]">
            <div className="relative z-10 max-w-lg">
              <span className="text-xs font-mono text-[#A5C2B1] uppercase tracking-wider block mb-2">
                {post.graphicData.framework} • {post.graphicData.precision}
              </span>
              <h2 className="font-serif-title text-2xl sm:text-4xl text-white mb-4">
                {post.graphicData.headline}
              </h2>
              <p className="text-xs sm:text-sm text-[#CAD6CE]">
                {post.graphicData.architectureBadge} — Documented for high-performing modern brands.
              </p>
            </div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#2D4536]/50 rounded-full blur-3xl pointer-events-none" />
          </div>
        ) : post.image ? (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E8E2D7] border border-[#E0D8CB] mb-12 sm:mb-16 aspect-[16/9] shadow-md">
            <img
              src={post.image}
              alt={post.alt || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Article Body Content */}
        <div className="prose prose-lg max-w-none text-[#2F3832] leading-relaxed space-y-6 sm:space-y-8 mb-16 sm:mb-24">
          <p className="text-base sm:text-lg text-[#26312A] font-medium leading-relaxed">
            {post.content}
          </p>

          {post.richParagraphs && post.richParagraphs.length > 0 && (
            <>
              {post.richParagraphs.map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base text-[#4E5851] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </>
          )}

          {/* Key Takeaways Callout Box */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E6DFD3] my-8 not-prose">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#2D4536]">
              <Sparkles className="w-4 h-4 text-[#2D4536]" />
              <span>Studio Key Takeaway</span>
            </div>
            <p className="text-xs sm:text-sm text-[#3E4841] leading-relaxed italic">
              "Technical speed and typographic restraint are not cosmetic preferences; they are the baseline foundation of digital authority and long-term customer trust."
            </p>
          </div>
        </div>

        {/* Next / Previous Article Navigation */}
        <div className="border-t border-b border-[#E8E2D7] py-6 sm:py-8 my-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="group flex flex-col items-start text-left max-w-xs"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] flex items-center gap-1 group-hover:text-[#2D4536] transition-colors">
                <ArrowLeft className="w-3 h-3" /> Previous Article
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#121614] group-hover:underline line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group flex flex-col items-end text-right max-w-xs ml-auto"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] flex items-center gap-1 group-hover:text-[#2D4536] transition-colors">
                Next Article <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#121614] group-hover:underline line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          )}
        </div>

        {/* Direct Studio Consultation CTA */}
        <div className="bg-[#121B16] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
          <BookOpen className="w-6 h-6 text-[#A5C2B1] mx-auto mb-3" />
          <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-white mb-2">
            Put These Principles Into Practice
          </h2>
          <p className="text-xs sm:text-sm text-[#CAD6CE] max-w-md mx-auto mb-6">
            Partner with Yugark Digital Studio to engineer a tailored website, content strategy, or advertising pipeline.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold hover:bg-white transition-all shadow-md cursor-pointer"
            >
              <span>Schedule Studio Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#314B3B] text-[#FAF8F5] text-xs font-medium hover:bg-[#1C2922] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Articles</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
