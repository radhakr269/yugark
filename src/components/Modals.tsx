import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, CheckCircle, Clock, Send } from 'lucide-react';
import { ProjectItem, DemoItem, BlogPostItem, ServiceItem } from '../types/content';

// Reusable hook to handle Escape key dismissal
function useEscapeKey(handler: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, isActive]);
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onInquire }) => {
  useEscapeKey(onClose, !!project);
  if (!project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7E887E] uppercase">
              {project.category}
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project preview"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#EBE4D8]">
            <img
              src={project.image}
              alt={project.alt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-serif-title text-base sm:text-lg font-medium text-[#121614]">
              Project Overview
            </h4>
            <p className="text-xs sm:text-sm text-[#555C56] leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.deliverables && (
            <div className="space-y-2.5 sm:space-y-3">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#7E887E]">
                Key Deliverables
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#3C423E]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2D7] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/work/${project.slug}`}
            onClick={onClose}
            className="text-xs font-semibold text-[#121614] hover:text-[#2D4536] underline"
          >
            View Full Case Study →
          </Link>
          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all"
          >
            <span>Start a Project Like This</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface DemoModalProps {
  demo: DemoItem | null;
  onClose: () => void;
  onInquire: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ demo, onClose, onInquire }) => {
  useEscapeKey(onClose, !!demo);
  if (!demo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7E887E] uppercase">
              {demo.industry}
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
              {demo.title} — Template Demo
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close demo preview"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#1C1F1E] shadow-inner">
            <img
              src={demo.image}
              alt={demo.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-[11px] text-white font-medium flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Full Demo Architecture</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#555C56] leading-relaxed">
            {demo.description}
          </p>

          {demo.features && (
            <div className="space-y-2.5 sm:space-y-3">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#7E887E]">
                Included Architectural Features
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demo.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#3C423E]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2D4536] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#555C56] hover:text-black transition-colors min-h-[44px] px-3 flex items-center"
          >
            Close Preview
          </button>
          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            className="min-h-[44px] inline-flex items-center px-5 sm:px-6 py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all"
          >
            <span>Request This Website Template</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ArticleModalProps {
  article: BlogPostItem | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  useEscapeKey(onClose, !!article);
  if (!article) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E2D7]">
          <div>
            <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-[#7E887E] mb-1">
              <span className="font-bold uppercase tracking-[0.2em]">{article.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
            <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614] leading-snug">
              {article.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close article"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {article.image && (
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#EBE4D8]">
              <img
                src={article.image}
                alt={article.alt || article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose text-xs sm:text-sm text-[#3C423E] leading-relaxed space-y-3 sm:space-y-4">
            <p className="font-medium text-sm sm:text-base text-[#121614]">
              {article.excerpt}
            </p>
            <p>{article.content}</p>
            <p>
              At Yugark Digital Studio, our team approaches every brand touchpoint through an empirical lens. Rather than chasing fleeting design gimmicks, we root our decisions in clarity, deliberate typographic restraint, and technical precision that converts visitors into long-term patrons.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2D7] bg-[#FAF7F2] flex items-center justify-between">
          <span className="text-xs text-[#7E887E]">Published {article.publishedDate}</span>
          <div className="flex items-center gap-2">
            <Link
              to={`/blog/${article.slug}`}
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInquire: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onInquire }) => {
  useEscapeKey(onClose, !!service);
  if (!service) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7E887E] uppercase">
              Service Deep-Dive
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
              {service.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close service details"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          <p className="text-xs sm:text-sm text-[#555C56] leading-relaxed">
            {service.description}
          </p>

          {service.features && (
            <div className="space-y-2.5 sm:space-y-3">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#7E887E]">
                What We Deliver
              </h5>
              <div className="space-y-2">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-[#3C423E] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E6DFD3]">
                    <CheckCircle className="w-4 h-4 text-[#2D4536] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2D7] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/services/${service.slug}`}
            onClick={onClose}
            className="text-xs font-semibold text-[#121614] hover:text-[#2D4536] underline"
          >
            Explore Full Discipline →
          </Link>
          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            className="min-h-[44px] inline-flex items-center px-5 sm:px-6 py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all"
          >
            <span>Inquire About {service.title}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  useEscapeKey(onClose, isOpen);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    budget: '$5k - $10k',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7E887E] uppercase">
              Start Project
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
              Let's Build What's Next
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close contact dialog"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-6 sm:py-8 text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
                Inquiry Received!
              </h4>
              <p className="text-xs sm:text-sm text-[#555C56] max-w-sm mx-auto leading-relaxed">
                Thank you, {formData.name || 'there'}! Our digital studio director will review your project brief and get in touch at {formData.email || 'your email'} within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-3 min-h-[44px] px-6 py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all"
              >
                Back to Studio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3C423E] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC1] bg-white text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3C423E] mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@brand.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC1] bg-white text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3C423E] mb-1">
                    Primary Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5CDC1] bg-white text-xs text-[#121614] focus:outline-none focus:border-[#2D4536]"
                  >
                    <option>Website Development</option>
                    <option>Social Media</option>
                    <option>Ads & Performance</option>
                    <option>AI Creative</option>
                    <option>Branding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3C423E] mb-1">
                    Timeline / Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5CDC1] bg-white text-xs text-[#121614] focus:outline-none focus:border-[#2D4536]"
                  >
                    <option>$2.5k - $5k</option>
                    <option>$5k - $10k</option>
                    <option>$10k - $25k</option>
                    <option>$25k+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3C423E] mb-1">
                  Tell Us About Your Project
                </label>
                <textarea
                  rows={3}
                  placeholder="What are your goals, timelines, or reference inspirations?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC1] bg-white text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
              >
                <span>Send Project Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface LegalModalProps {
  title: string | null;
  content: string | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ title, content, onClose }) => {
  useEscapeKey(onClose, !!title);
  if (!title || !content) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E2D7]">
          <h3 className="font-serif-title text-xl font-medium text-[#121614]">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 text-xs sm:text-sm text-[#555C56] leading-relaxed">
          <p>{content}</p>
        </div>
        <div className="p-3 sm:p-4 border-t border-[#E8E2D7] bg-[#FAF7F2] text-right">
          <button
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
