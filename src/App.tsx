/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BrandStatement } from './components/BrandStatement';
import { SelectedWork } from './components/SelectedWork';
import { ServicesSection } from './components/ServicesSection';
import { WebsiteDemos } from './components/WebsiteDemos';
import { InsightsBlog } from './components/InsightsBlog';
import { BottomCTA } from './components/BottomCTA';
import { Footer } from './components/Footer';
import {
  ProjectModal,
  DemoModal,
  ArticleModal,
  ServiceModal,
  ContactModal,
  LegalModal,
} from './components/Modals';
import { ProjectItem, DemoItem, BlogPostItem, ServiceItem } from './types/content';
import { selectedWorkProjects, websiteDemosData, blogPostsData } from './data/studioData';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPostItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const [legalModal, setLegalModal] = useState<{ title: string; content: string } | null>(null);

  const handleNavClick = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPrivacy = () => {
    setLegalModal({
      title: 'Privacy Policy',
      content:
        'Yugark Digital Studio respects your privacy. We strictly safeguard all client information, correspondence, and technical architectures. No proprietary materials or visitor analytics are distributed or sold to third-party ad networks.',
    });
  };

  const handleOpenTerms = () => {
    setLegalModal({
      title: 'Terms of Engagement',
      content:
        'Standard digital studio engagement terms apply. All design deliverables, source codes, and digital assets transfer completely to client ownership upon milestone completion and final settlement.',
    });
  };

  const handleOpenSitemap = () => {
    setLegalModal({
      title: 'Site Architecture',
      content:
        'Homepage sections: 01. Studio Header & Navigation, 02. Premium Hero & Value Badges, 03. Green Studio Statement, 04. Selected Work Projects, 05. Complete Digital Solutions, 06. Ready-Made Website Demos, 07. Insights & Ideas, 08. Closing CTA, 09. Studio Footer & Contacts.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#121614] font-sans antialiased selection:bg-[#2D4536] selection:text-white">
      {/* 1. Header & Navigation */}
      <Header onStartProject={() => setContactOpen(true)} />

      <main>
        {/* 2 & 3. Premium Hero & Value Highlights */}
        <HeroSection
          onStartProject={() => setContactOpen(true)}
          onViewWork={() => handleNavClick('#work')}
        />

        {/* 4. A Digital Studio for What's Next */}
        <BrandStatement onLearnApproach={() => handleNavClick('#services')} />

        {/* 5. Selected Work */}
        <SelectedWork
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAllWork={() => handleNavClick('#demos')}
        />

        {/* 6. Complete Digital Solutions */}
        <ServicesSection
          onSelectService={(service) => setSelectedService(service)}
        />

        {/* 7. Ready-Made Website Demos */}
        <WebsiteDemos
          onSelectDemo={(demo) => setSelectedDemo(demo)}
          onViewAllDemos={() => setContactOpen(true)}
        />

        {/* 8. Insights & Ideas */}
        <InsightsBlog
          onSelectArticle={(article) => setSelectedArticle(article)}
          onViewAllArticles={() => setSelectedArticle(blogPostsData[0])}
        />

        {/* 9. Final Call to Action */}
        <BottomCTA
          onStartProject={() => setContactOpen(true)}
          onContactUs={() => setContactOpen(true)}
        />
      </main>

      {/* 10. Studio Footer */}
      <Footer
        onNavClick={handleNavClick}
        onOpenPrivacy={handleOpenPrivacy}
        onOpenTerms={handleOpenTerms}
        onOpenSitemap={handleOpenSitemap}
      />

      {/* Interactive Detail & Inquiry Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={() => setContactOpen(true)}
      />

      <DemoModal
        demo={selectedDemo}
        onClose={() => setSelectedDemo(null)}
        onInquire={() => setContactOpen(true)}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInquire={() => setContactOpen(true)}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      <LegalModal
        title={legalModal?.title || null}
        content={legalModal?.content || null}
        onClose={() => setLegalModal(null)}
      />
    </div>
  );
}
