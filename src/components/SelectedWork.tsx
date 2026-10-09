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
    <section className="py-7 sm:py-14 lg:py-20 bg-[#F8F6F1]" id="work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header: Left title with kicker, Right clean "View All ->" link */}
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-[#E8E2D7]">
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

        {/* 3 Selected Work Cards (3-column layout matching mobile reference in image.png) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
          {selectedWorkProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="editorial-card group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-lg sm:rounded-2xl bg-[#EBE4D8] aspect-[4/3] mb-1.5 sm:mb-3 shadow-sm transition-all duration-500 group-hover:shadow-md">
                  <img
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={project.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-lg sm:rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
                <div className="flex items-start justify-between px-0.5">
                  <div className="min-w-0 pr-1">
                    <p className="text-[7px] sm:text-[9px] font-bold tracking-[0.16em] text-[#7E887E] uppercase truncate mb-0.5">
                      {project.category}
                    </p>
                    <h3 className="font-serif-title text-[10px] sm:text-base lg:text-xl font-medium text-[#121614] group-hover:text-[#2D4536] transition-colors truncate leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-[7.5px] sm:text-[11px] text-[#737C73] mt-0.5 truncate hidden xs:block">
                      {project.tagline}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`View ${project.title} details`}
                    className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#121614] group-hover:bg-[#1A2621] group-hover:text-white transition-all shrink-0 cursor-pointer mt-0.5"
                  >
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
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
