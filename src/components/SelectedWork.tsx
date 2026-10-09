import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { selectedWorkProjects } from '../data/studioData';
import { ProjectItem } from '../types/content';

interface SelectedWorkProps {
  onSelectProject: (project: ProjectItem) => void;
  onViewAllWork: () => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  onSelectProject,
  onViewAllWork,
}) => {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#F8F6F1]" id="work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-[#E8E2D7]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#69746A] uppercase">
                Featured Projects
              </span>
              <span className="text-[10px] text-[#8C968E] font-medium tracking-wide">
                (Concept &amp; Demos)
              </span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-[42px] font-medium text-[#121614]">
              Selected Work
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-4 sm:gap-6">
            <p className="text-xs text-[#70786F] max-w-xs hidden md:block">
              A glimpse into our recent projects — websites, creative content and digital campaigns designed for modern brands.
            </p>
            <button
              onClick={onViewAllWork}
              className="min-h-[40px] inline-flex items-center px-4 sm:px-5 py-2 rounded-full border border-[#CDC4B6] text-xs font-semibold tracking-wider text-[#121614] hover:border-black transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4536]"
            >
              <span>View All Work</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* 3 Selected Work Cards (Compact responsive spacing on mobile, 3-column on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {selectedWorkProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="editorial-card group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#EBE4D8] aspect-[4/3] mb-3 sm:mb-4 shadow-sm transition-all duration-500 group-hover:shadow-md">
                  <img
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={project.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
                <div className="flex items-start justify-between px-1">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#7E887E] uppercase mb-0.5 sm:mb-1">
                      {project.category}
                    </p>
                    <h3 className="font-serif-title text-lg sm:text-xl font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#737C73] mt-0.5">
                      {project.tagline}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`View ${project.title} demo details`}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#121614] group-hover:bg-[#1A2621] group-hover:text-white transition-all shrink-0 cursor-pointer ml-2 mt-0.5"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
