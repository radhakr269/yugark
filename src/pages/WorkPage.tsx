import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { ProjectItem } from '../types/content';
import { SEOHead } from '../components/SEOHead';
import { getPortfolioProjects } from '../lib/cms';

export const WorkPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    async function loadProjects() {
      const data = await getPortfolioProjects();
      setProjects(data);
    }
    loadProjects();

    const handleUpdate = () => loadProjects();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Website Development', label: 'Websites' },
    { id: 'Branding & Creative', label: 'Branding & Identity' },
    { id: 'Website + Content', label: 'Creative Content' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-[#F8F6F1] py-10 sm:py-16 lg:py-24">
      <SEOHead
        title="Selected Work & Studio Portfolio"
        description="Explore Yugark Digital Studio's curated portfolio of websites, brand identities, and digital production showcases."
        canonicalPath="/work"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-2">
            — Studio Portfolio
          </p>
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-medium text-[#121614] leading-tight mb-4">
            Selected Work & Design Showcases.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5A635C] leading-relaxed">
            A curated collection of digital experiences, architectural layouts, and luxury brand assets.
            Every showcase demonstrates our commitment to sub-second speed, editorial restraint, and tactile interaction.
          </p>
        </div>

        {/* Transparent Note Distinguishing Concept / Demo from Confirmed Client Work */}
        <div className="bg-[#F4EFE6] border border-[#ECE5D9] rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-8 sm:mb-12 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#2D4536] mt-0.5 shrink-0" />
          <div className="text-xs text-[#525B54] leading-relaxed">
            <strong className="text-[#121614] font-semibold">Studio Showcase Transparency: </strong>
            To protect confidentiality and present unconstrained creative standards, our portfolio features official studio concept architectures and working demonstration platforms alongside private client engagements.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 sm:mb-14 pb-4 border-b border-[#E8E2D7]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C887E] mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#1A2621] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4E564F] hover:bg-[#EAE3D6] border border-[#E6DFD3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-24">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#E6DFD3] overflow-hidden group hover:border-[#2D4536]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-[#EBE4D8]">
                  <img
                    src={project.image}
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                  {/* Concept Badge */}
                  {project.isConcept && (
                    <span className="absolute top-3 left-3 bg-[#1B2E24]/90 backdrop-blur-sm text-[#E5ECE7] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Concept Showcase
                    </span>
                  )}

                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#121614] text-[10px] font-mono px-2 py-0.5 rounded">
                    {project.year}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-7">
                  <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#7E887E] uppercase mb-1.5">
                    {project.category}
                  </p>
                  <h2 className="font-serif-title text-xl sm:text-2xl font-medium text-[#121614] mb-2 group-hover:text-[#2D4536] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#616B63] leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Deliverables Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.deliverables.slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#EFE9DF] text-[#4E564F] px-2.5 py-0.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 sm:p-7 pt-0 border-t border-[#ECE5D9]/60 mt-2 flex items-center justify-between">
                <Link
                  to={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#121614] group-hover:text-[#2D4536] transition-colors"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => navigate(`/contact?project=${project.slug}`)}
                  className="text-[11px] text-[#7C887E] hover:text-[#121614] transition-colors"
                >
                  Inquire Similar
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Ready-Made Demos Teaser Card */}
        <div className="bg-[#121B16] text-[#FAF8F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#A5C2B1] block mb-2">
              Ready-Made Website Systems
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-medium text-white mb-2">
              Looking for Turnkey Industry Website Demos?
            </h2>
            <p className="text-xs sm:text-sm text-[#CAD6CE]">
              Explore live, pre-engineered solutions tailored for Architecture, Medical & Wellness, Dining, and Athletics.
            </p>
          </div>
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold hover:bg-white transition-all shrink-0"
          >
            <span>Explore Website Demos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
