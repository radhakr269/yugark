import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, CheckCircle, Clock, Send, ExternalLink } from 'lucide-react';
import { ProjectItem, DemoItem, BlogPostItem, ServiceItem } from '../types/content';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../data/studioData';
import { getWebsiteSettings } from '../lib/cms';

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
        <div className="p-4 sm:p-6 border-t border-[#E8E2D7] bg-[#FAF7F2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#555C56] hover:text-black transition-colors min-h-[44px] px-3 flex items-center justify-center sm:justify-start"
          >
            Close Preview
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onInquire();
              }}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
            >
              <span>Inquire / Request</span>
            </button>
            
            <a
              href={demo.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-sm"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>
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
          {article.isGraphicCard && article.graphicData ? (
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#1B2E24] p-6 flex flex-col justify-between text-[#FAF8F5]">
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-mono text-[#A5C2B1] uppercase tracking-wider">
                  {article.graphicData.framework}
                </span>
                <span className="bg-[#2D4536] text-[#E5ECE7] text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                  {article.graphicData.architectureBadge}
                </span>
              </div>
              <div className="z-10">
                <p className="text-[11px] font-medium text-[#A5C2B1] uppercase tracking-wider mb-1">
                  {article.graphicData.playbookLabel}
                </p>
                <h4 className="font-serif-title text-xl text-white leading-tight">
                  {article.graphicData.headline}
                </h4>
              </div>
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#2D4536]/50 rounded-full blur-2xl pointer-events-none" />
            </div>
          ) : article.image ? (
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#EBE4D8]">
              <img
                src={article.image}
                alt={article.alt || article.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

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
                Thank you, {formData.name || 'there'}! Our digital studio director will review your project brief and get in touch at {formData.email || 'your email'} promptly.
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

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({ isOpen, onClose }) => {
  useEscapeKey(onClose, isOpen);

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Clinic & Healthcare');
  const [requirements, setRequirements] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState(siteConfig.whatsappUrl);

  useEffect(() => {
    async function loadSettings() {
      const settings = await getWebsiteSettings();
      if (settings?.whatsappUrl) {
        setWhatsappUrl(settings.whatsappUrl);
      }
    }
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    'Clinic & Healthcare',
    'Architecture & Interior',
    'Beauty, Salon & Wellness',
    'Fitness, Gym & Training',
    'E-Commerce & Retail',
    'Corporate & Professional Services',
    'Restaurant, Cafe & Hospitality',
    'Creative Studio & Agency',
    'Other Business',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMsg('Please provide your business or clinic name.');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, '').length < 8) {
      setErrorMsg('Please provide a valid WhatsApp number (minimum 8 digits with country code).');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address, or leave it blank.');
      return;
    }
    if (!requirements.trim() || requirements.trim().length < 5) {
      setErrorMsg('Please describe your website requirements.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Dynamic import to avoid circular dependency
      const { submitLead } = await import('../lib/cms');
      const result = await submitLead({
        name: fullName.trim(),
        email: email.trim() || undefined,
        phone: whatsappNumber.trim(),
        business_name: businessName.trim(),
        requirement: `[Business Category: ${category}]\n\nRequirements & Vision:\n${requirements.trim()}`,
        service: 'Free Website Demo',
        timeline: 'Immediate Free Demo Preview',
        page_source: 'hero_free_demo_modal',
        website_honeypot: honeypot,
      });

      if (result && result.success) {
        setRefId(result.refId || `YUG-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmitted(true);
      } else {
        throw new Error(result?.message || 'Server did not acknowledge demo submission.');
      }
    } catch (err: any) {
      console.error('Demo registration error:', err);
      setErrorMsg(
        err.message ||
          'Failed to record your demo request. Please check your network connection or message our studio directly via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Yugark Studio, I would like to request a Free Website Demo for "${businessName || 'my business'}" (${category}). Name: ${fullName}, Phone: ${whatsappNumber}. Requirements: ${requirements}`
    );
    const baseUrl = whatsappUrl.includes('?') ? whatsappUrl.split('?')[0] : whatsappUrl;
    window.open(`${baseUrl}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#F8F6F1] rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E2D7]">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-[#2D4536] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#2D4536]" />
              <span>Complimentary Studio Preview</span>
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
              Get Your Free Website Demo
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close demo registration"
            className="p-2 rounded-full hover:bg-[#EAE3D6] text-[#121614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-6 sm:py-8 text-center space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E5ECE7] text-[#294B37] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#2D4536] uppercase bg-[#E2EBE4] px-2.5 py-1 rounded-md">
                  Ref #{refId}
                </span>
              </div>
              <h4 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614]">
                Free Demo Request Received!
              </h4>
              <p className="text-xs sm:text-sm text-[#556358] max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[#121614]">{fullName}</span>! We have queued your demonstration for <span className="font-semibold text-[#121614]">{businessName}</span>. Our lead digital designer will review your specifications and contact your WhatsApp directly.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={handleWhatsAppDirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors shadow-sm cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp Query</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#D5CDC1] bg-white text-[#121614] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <input
                type="text"
                name="website_honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <p className="font-semibold">Submission Incomplete</p>
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* 1. Name */}
              <div>
                <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma / Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5CDC1] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                />
              </div>

              {/* 2. Business / Clinic Name */}
              <div>
                <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1">
                  Business or Clinic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Dental Clinic / Solé Beauty"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5CDC1] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                />
              </div>

              {/* 3. WhatsApp Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5CDC1] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1">
                    Email <span className="text-[10px] text-[#7A857D] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5CDC1] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                  />
                </div>
              </div>

              {/* 4. Business Category */}
              <div>
                <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1">
                  Business Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5CDC1] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Website Requirements */}
              <div>
                <label className="block text-xs font-bold text-[#121614] uppercase tracking-wider mb-1">
                  Website Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2.5}
                  placeholder="Tell us what you want to showcase (e.g. online appointments, treatment menu, portfolio gallery)..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5CDC1] text-xs sm:text-sm text-[#121614] focus:outline-none focus:border-[#2D4536] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-2.5 rounded-full bg-[#1A2621] text-white text-xs font-semibold tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin text-[#9AC3A8]" />
                      <span>Submitting Demo Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-[#7A857D] mt-2">
                  100% Free Demo • No Obligation • Custom Studio Preview
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
