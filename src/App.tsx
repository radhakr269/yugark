/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

// Admin Views (Step 3)
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { OverviewDashboard } from './pages/admin/OverviewDashboard';
import { DemoManager } from './pages/admin/demos/DemoManager';
import { BlogManager } from './pages/admin/blog/BlogManager';
import { ServicesManager } from './pages/admin/services/ServicesManager';
import { PricingManager } from './pages/admin/pricing/PricingManager';
import { PortfolioManager } from './pages/admin/portfolio/PortfolioManager';
import { PageEditor } from './pages/admin/pages/PageEditor';
import { MediaLibrary } from './pages/admin/media/MediaLibrary';
import { LeadsCrm } from './pages/admin/leads/LeadsCrm';
import { AnalyticsPage } from './pages/admin/analytics/AnalyticsPage';
import { SeoManager } from './pages/admin/seo/SeoManager';
import { SettingsPage } from './pages/admin/settings/SettingsPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [legalModal, setLegalModal] = useState<{ title: string; content: string } | null>(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

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
        'Studio Public Routes:\n\n• / — Studio Homepage & Hero\n• /services — Complete Solutions Overview\n• /services/:slug — Individual Discipline Detail Pages\n• /work — Selected Work Portfolio Listing\n• /work/:slug — Project Case Study Breakdowns\n• /demos — Turnkey Website Demos Gallery\n• /pricing — Studio Engagement Packages & Scopes\n• /blog — Editorial Insights & Technical Playbooks\n• /blog/:slug — Full Editorial Article Views\n• /about — Studio Mission & Craftsmanship Philosophy\n• /contact — Direct Inquiries & Verified WhatsApp\n• /privacy-policy — Data Governance & Confidentiality\n• /admin — Secure Administrator & CMS Portal',
    });
  };

  return (
    <div className={`min-h-screen ${isAdminRoute ? 'bg-[#111A15]' : 'bg-[#F8F6F1]'} text-[#121614] font-sans antialiased selection:bg-[#2D4536] selection:text-white flex flex-col justify-between`}>
      <ScrollToTop />

      {/* Global Navigation Header (Hidden on Admin Routes) */}
      {!isAdminRoute && <Header onStartProject={() => navigate('/contact')} />}

      {/* Main Content Router */}
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Public Website Routes */}
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

          {/* Secure Admin Portal (Step 3) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OverviewDashboard />} />
            <Route path="demos" element={<DemoManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="pricing" element={<PricingManager />} />
            <Route path="portfolio" element={<PortfolioManager />} />
            <Route path="pages" element={<PageEditor />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="leads" element={<LeadsCrm />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Global Studio Footer (Hidden on Admin Routes) */}
      {!isAdminRoute && (
        <Footer
          onOpenTerms={handleOpenTerms}
          onOpenSitemap={handleOpenSitemap}
        />
      )}

      {/* Terms & Sitemap Modal */}
      <LegalModal
        title={legalModal?.title || null}
        content={legalModal?.content || null}
        onClose={() => setLegalModal(null)}
      />
    </div>
  );
}
