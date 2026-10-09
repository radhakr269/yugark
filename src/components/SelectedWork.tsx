import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { selectedWorkProjects as initialProjects } from '../data/studioData';
import { ProjectItem } from '../types/content';
import { getPortfolioProjects } from '../lib/cms';

interface SelectedWorkProps {
  onSelectProject: (project: ProjectItem) => void;
  onViewAllWork: () => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  onSelectProject,
  onViewAllWork,
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);

  useEffect(() => {
    async function load() {
      const data = await getPortfolioProjects();
      if (data && data.length > 0) {
        setProjects(data);
      }
    }
    load();

    const handleUpdate = () => load();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-[#F8F6F1]" id="work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-[#E8E2D7]">
          <div>
            <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase mb-0.5 sm:mb-1">
              — Featured Projects
            </p>
            <h2 className="font-serif-title text-xl sm:text-3xl lg:text-[42px] font-medium text-[#121614] leading-tight">
              Selected Work
            </h2>
          </div>
          <div>
            <button
              onClick={onViewAllWork}
              className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-[#121614] hover:text-[#2D4536] transition-colors cursor-pointer group pb-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Selected Work Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
          {projects.slice(0, 3).map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="editorial-card group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#EBE4D8] aspect-[4/3] mb-2 sm:mb-3 shadow-xs transition-all duration-500 group-hover:shadow-md">
                  <img
                    alt={project.alt || project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={project.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
                <div className="flex items-start justify-between px-0.5">
                  <div className="min-w-0 pr-1">
                    <p className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] text-[#7E887E] uppercase truncate mb-0.5">
                      {project.category}
                    </p>
                    <h3 className="font-serif-title text-sm sm:text-base lg:text-xl font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors truncate leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#737C73] mt-0.5 truncate">
                      {project.tagline}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`View ${project.title} details`}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#121614] group-hover:bg-[#1A2621] group-hover:text-white transition-all shrink-0 cursor-pointer mt-0.5"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
