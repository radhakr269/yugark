import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ProjectItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getProjectBySlug } from '../lib/cms';

export const WorkDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (slug) {
        const item = await getProjectBySlug(slug);
        setProject(item);
      }
      setLoading(false);
    }
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F6F1] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2D4536] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#7C887E]">Loading Case Study...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] bg-[#F8F6F1] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <h1 className="font-serif-title text-3xl font-medium text-[#121614] mb-3">
            Case Study Not Found
          </h1>
          <p className="text-sm text-[#6A746B] mb-6">
            The project case study you requested could not be located in our studio archives.
          </p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A2621] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Work</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-20">
      <SEOHead
        title={`${project.title} Case Study — ${project.category}`}
        description={project.description}
        canonicalPath={`/work/${project.slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-[#7C887E] mb-8">
          <Link to="/" className="hover:text-[#121614] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/work" className="hover:text-[#121614] transition-colors">
            Work
          </Link>
          <span>/</span>
          <span className="text-[#121614] font-semibold">{project.title}</span>
        </nav>

        {/* Hero Title Section */}
        <div className="max-w-4xl mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#69746A] uppercase">
              {project.category}
            </span>
            <span className="text-xs text-[#A1AAA2]">•</span>
            <span className="text-xs font-mono text-[#788479]">{project.year}</span>
            {project.isConcept && (
              <span className="bg-[#E5ECE7] text-[#294B37] text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Studio Concept & Architecture Showcase
              </span>
            )}
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-[#394B3D] font-medium leading-snug mb-4">
            {project.tagline}
          </p>

          <p className="text-sm sm:text-base text-[#5A635C] leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E8E2D7] border border-[#E0D8CB] mb-12 sm:mb-16 shadow-md aspect-[16/9] max-h-[560px]">
          <img
            src={project.image}
            alt={project.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* Project Metadata Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E6DFD3] mb-12 sm:mb-20">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block mb-1">
              Discipline
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#121614]">
              {project.category}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block mb-1">
              Client / Scope
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#121614]">
              {project.client || 'Yugark Digital Studio'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block mb-1">
              Timeline / Year
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#121614]">
              {project.year}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C887E] block mb-1">
              Classification
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#294B37] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{project.isConcept ? 'Curated Concept' : 'Client Delivery'}</span>
            </span>
          </div>
        </div>

        {/* Challenge & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-24">
          <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-10 border border-[#E6DFD3]">
            <span className="text-[11px] font-mono font-semibold text-[#8C7A58] uppercase tracking-wider block mb-2">
              01 — The Challenge
            </span>
            <h2 className="font-serif-title text-2xl font-medium text-[#121614] mb-4">
              Context & Strategic Hurdle
            </h2>
            <p className="text-xs sm:text-sm text-[#525B54] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-10 border border-[#E6DFD3]">
            <span className="text-[11px] font-mono font-semibold text-[#294B37] uppercase tracking-wider block mb-2">
              02 — The Solution
            </span>
            <h2 className="font-serif-title text-2xl font-medium text-[#121614] mb-4">
              Design & Architecture Execution
            </h2>
            <p className="text-xs sm:text-sm text-[#525B54] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Key Architectural Features & Deliverables */}
        <div className="bg-[#F4EFE6] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#ECE5D9] mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-1">
                — Engineering Details
              </p>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#121614] mb-4">
                Architecture & Key Deliverables
              </h2>
              <p className="text-xs sm:text-sm text-[#5E6760] leading-relaxed mb-6">
                Engineered with strict zero-layout-shift performance, accessible semantic structure, and bespoke luxury art direction.
              </p>

              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D4536] block mb-2">
                  Technology Stack:
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#FAF7F2] text-[#121614] px-3 py-1 rounded-md border border-[#E3DACB] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D4536] mb-3">
                Key Features Implemented
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.keyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E0D8CB] flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-[#2D4536] mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-[13px] text-[#3C423E] font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E3DACB] mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D4536] block mb-2">
                  Full Deliverables Package:
                </span>
                <ul className="space-y-1.5">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#525B54] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D4536]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA / Inquiry */}
        <div className="bg-[#121B16] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="font-serif-title text-2xl sm:text-4xl font-medium text-white mb-3">
            Interested in an Experience Like {project.title}?
          </h2>
          <p className="text-xs sm:text-sm text-[#CAD6CE] max-w-lg mx-auto mb-6">
            We partner with ambitious founders to engineer tailored digital platforms that embody their exact brand standard.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/contact?project=${project.slug}`)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
            >
              <span>Inquire for Similar Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#314B3B] text-[#FAF8F5] text-xs font-medium hover:bg-[#1C2922] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
