import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { SelectedWork } from '../components/SelectedWork';
import { ServicesSection } from '../components/ServicesSection';
import { WebsiteDemos } from '../components/WebsiteDemos';
import { InsightsBlog } from '../components/InsightsBlog';
import { BottomCTA } from '../components/BottomCTA';
import {
  ProjectModal,
  DemoModal,
  ArticleModal,
  ServiceModal,
  FreeDemoModal,
} from '../components/Modals';
import { SEOHead } from '../components/SEOHead';
import { ProjectItem, DemoItem, BlogPostItem, ServiceItem } from '../types/content';
import { blogPostsData } from '../data/studioData';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPostItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isFreeDemoOpen, setIsFreeDemoOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="We Build. We Create. We Grow Brands."
        description="Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further."
        canonicalPath="/"
      />

      <main>
        {/* 1. Premium Hero & Value Highlights with Triple CTAs */}
        <HeroSection
          onStartProject={() => navigate('/contact')}
          onViewWork={() => navigate('/work')}
          onFreeDemo={() => setIsFreeDemoOpen(true)}
        />

        {/* 2. Selected Work (Natural transition from Hero without green statement section) */}
        <SelectedWork
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAllWork={() => navigate('/work')}
        />

        {/* 3. Complete Digital Solutions */}
        <ServicesSection
          onSelectService={(service) => setSelectedService(service)}
        />

        {/* 4. Ready-Made Website Demos */}
        <WebsiteDemos
          onSelectDemo={(demo) => setSelectedDemo(demo)}
          onViewAllDemos={() => navigate('/demos')}
        />

        {/* 5. Insights & Ideas */}
        <InsightsBlog
          onSelectArticle={(article) => setSelectedArticle(article)}
          onViewAllArticles={() => navigate('/blog')}
        />

        {/* 6. Final Call to Action */}
        <BottomCTA
          onStartProject={() => navigate('/contact')}
          onContactUs={() => navigate('/contact')}
        />
      </main>

      {/* Free Website Demo Registration Modal */}
      <FreeDemoModal
        isOpen={isFreeDemoOpen}
        onClose={() => setIsFreeDemoOpen(false)}
      />

      {/* Interactive Detail & Preview Modals with direct links to full detail pages */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={() => {
          setSelectedProject(null);
          navigate(`/contact?project=${selectedProject?.slug}`);
        }}
      />

      <DemoModal
        demo={selectedDemo}
        onClose={() => setSelectedDemo(null)}
        onInquire={() => {
          setSelectedDemo(null);
          navigate(`/contact?demo=${selectedDemo?.slug}`);
        }}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInquire={() => {
          setSelectedService(null);
          navigate(`/contact?service=${selectedService?.slug}`);
        }}
      />
    </>
  );
};
