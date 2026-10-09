/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { LegalModal } from './components/Modals';

// Public Page Views
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { WorkPage } from './pages/WorkPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { DemosPage } from './pages/DemosPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const navigate = useNavigate();
  const [legalModal, setLegalModal] = useState<{ title: string; content: string } | null>(null);

  const handleOpenTerms = () => {
    setLegalModal({
      title: 'Terms of Engagement',
      content:
        'Standard digital studio engagement terms apply. All custom design deliverables, source codes, and digital assets transfer completely to client ownership upon milestone completion and final settlement.',
    });
  };

  const handleOpenSitemap = () => {
    setLegalModal({
      title: 'Studio Site Architecture',
      content:
        'Studio Public Routes:\n\n• / — Studio Homepage & Hero\n• /services — Complete Solutions Overview\n• /services/:slug — Individual Discipline Detail Pages\n• /work — Selected Work Portfolio Listing\n• /work/:slug — Project Case Study Breakdowns\n• /demos — Turnkey Website Demos Gallery\n• /pricing — Studio Engagement Packages & Scopes\n• /blog — Editorial Insights & Technical Playbooks\n• /blog/:slug — Full Editorial Article Views\n• /about — Studio Mission & Craftsmanship Philosophy\n• /contact — Direct Inquiries & Verified WhatsApp\n• /privacy-policy — Data Governance & Confidentiality',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#121614] font-sans antialiased selection:bg-[#2D4536] selection:text-white flex flex-col justify-between">
      <ScrollToTop />

      {/* 1. Global Navigation Header */}
      <Header onStartProject={() => navigate('/contact')} />

      {/* Main Content Router */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/demos" element={<DemosPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Global Studio Footer */}
      <Footer
        onOpenTerms={handleOpenTerms}
        onOpenSitemap={handleOpenSitemap}
      />

      {/* Terms & Sitemap Modal */}
      <LegalModal
        title={legalModal?.title || null}
        content={legalModal?.content || null}
        onClose={() => setLegalModal(null)}
      />
    </div>
  );
}
