import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { BrandStatement } from '../components/BrandStatement';
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

  return (
    <>
      <SEOHead
        title="We Build. We Create. We Grow Brands."
        description="Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further."
        canonicalPath="/"
      />

      <main>
        {/* 2 & 3. Premium Hero & Value Highlights */}
        <HeroSection
          onStartProject={() => navigate('/contact')}
          onViewWork={() => navigate('/work')}
        />

        {/* 4. A Digital Studio for What's Next */}
        <BrandStatement onLearnApproach={() => navigate('/about')} />

        {/* 5. Selected Work */}
        <SelectedWork
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAllWork={() => navigate('/work')}
        />

        {/* 6. Complete Digital Solutions */}
        <ServicesSection
          onSelectService={(service) => setSelectedService(service)}
        />

        {/* 7. Ready-Made Website Demos */}
        <WebsiteDemos
          onSelectDemo={(demo) => setSelectedDemo(demo)}
          onViewAllDemos={() => navigate('/demos')}
        />

        {/* 8. Insights & Ideas */}
        <InsightsBlog
          onSelectArticle={(article) => setSelectedArticle(article)}
          onViewAllArticles={() => navigate('/blog')}
        />

        {/* 9. Final Call to Action */}
        <BottomCTA
          onStartProject={() => navigate('/contact')}
          onContactUs={() => navigate('/contact')}
        />
      </main>

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
