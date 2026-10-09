-- ============================================================================
-- YUGARK DIGITAL STUDIO V2 — DATABASE & CMS SCHEMA MIGRATION
-- File: 20261009000000_initial_cms_schema.sql
-- Description: Complete normalized PostgreSQL schema with UUIDs, RLS, Storage,
--              Indexes, Triggers, and Seed Data for Yugark Digital Studio.
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ADMIN ROLES & PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    full_name VARCHAR(150),
    permissions JSONB DEFAULT '{"manage_content": true, "manage_leads": true, "manage_settings": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);

-- ============================================================================
-- 2. WEBSITE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name VARCHAR(100) NOT NULL DEFAULT 'Yugark Digital Studio',
    tagline VARCHAR(150) DEFAULT 'We Build. We Create. We Grow Brands.',
    business_email VARCHAR(150) NOT NULL DEFAULT 'business@yugark.in',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '+919125272460',
    whatsapp_message TEXT DEFAULT 'Hello Yugark Studio, I would like to discuss a project.',
    logo_url TEXT,
    favicon_url TEXT,
    social_links JSONB DEFAULT '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
    footer_text TEXT DEFAULT 'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
    seo_defaults JSONB DEFAULT '{"title": "YUGARK DIGITAL STUDIO | We Build. We Create. We Grow Brands.", "description": "Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further."}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. PAGES & PAGE SECTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    page_type VARCHAR(50) NOT NULL DEFAULT 'standard',
    content JSONB DEFAULT '{}'::jsonb,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);

CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    section_key VARCHAR(100) NOT NULL,
    section_type VARCHAR(100) NOT NULL,
    heading VARCHAR(255),
    subheading VARCHAR(255),
    content JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    button_label VARCHAR(100),
    button_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort ON public.page_sections(sort_order);

-- ============================================================================
-- 4. SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'code',
    image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    process JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    seo_title VARCHAR(255),
    seo_description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status_sort ON public.services(status, sort_order);

-- ============================================================================
-- 5. DEMO CATEGORIES & WEBSITE DEMOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.demo_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.website_demos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category_id UUID REFERENCES public.demo_categories(id) ON DELETE SET NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    thumbnail_url TEXT NOT NULL,
    additional_images JSONB DEFAULT '[]'::jsonb,
    demo_url TEXT NOT NULL,
    technology_tags JSONB DEFAULT '["React", "TypeScript", "Tailwind CSS"]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_demos_slug ON public.website_demos(slug);
CREATE INDEX IF NOT EXISTS idx_website_demos_status_sort ON public.website_demos(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_website_demos_category ON public.website_demos(category_id);

-- ============================================================================
-- 6. PORTFOLIO PROJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    project_url TEXT,
    project_type VARCHAR(100) DEFAULT 'Studio Concept',
    is_verified_client_work BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    year VARCHAR(20) DEFAULT '2025–2026',
    deliverables JSONB DEFAULT '[]'::jsonb,
    challenge TEXT,
    solution TEXT,
    key_features JSONB DEFAULT '[]'::jsonb,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON public.portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_status_sort ON public.portfolio_projects(status, sort_order);

-- ============================================================================
-- 7. PRICING PACKAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pricing_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL DEFAULT 'Custom Studio Quote',
    currency VARCHAR(10) DEFAULT 'USD',
    billing_type VARCHAR(50) DEFAULT 'Milestone-Based',
    turnaround VARCHAR(100) DEFAULT '2 – 4 Weeks',
    features JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    cta_label VARCHAR(100) DEFAULT 'Request Package Scope',
    cta_url TEXT DEFAULT '/contact',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pricing_slug ON public.pricing_packages(slug);
CREATE INDEX IF NOT EXISTS idx_pricing_status_sort ON public.pricing_packages(status, sort_order);

-- ============================================================================
-- 8. BLOG CATEGORIES & BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    rich_paragraphs JSONB DEFAULT '[]'::jsonb,
    cover_image_url TEXT,
    is_graphic_card BOOLEAN DEFAULT false,
    graphic_data JSONB DEFAULT '{}'::jsonb,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    author_id UUID,
    author_name VARCHAR(100) DEFAULT 'Yugark Editorial',
    author_role VARCHAR(100) DEFAULT 'Design Engineering',
    read_time VARCHAR(50) DEFAULT '5 min read',
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT now(),
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);

-- ============================================================================
-- 9. BLOG PAGE VIEWS (ANALYTICS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    visitor_hash VARCHAR(64),
    referrer_category VARCHAR(100) DEFAULT 'direct'
);

CREATE INDEX IF NOT EXISTS idx_blog_views_post_id ON public.blog_page_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_viewed_at ON public.blog_page_views(viewed_at);

-- ============================================================================
-- 10. MEDIA ASSETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    bucket VARCHAR(100) NOT NULL DEFAULT 'public-cms-media',
    public_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    alt_text VARCHAR(255),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_bucket ON public.media_assets(bucket);

-- ============================================================================
-- 11. LEADS & LEAD ACTIVITIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    business_name VARCHAR(150),
    requirement TEXT NOT NULL,
    service VARCHAR(100),
    timeline VARCHAR(100),
    page_source VARCHAR(100) DEFAULT 'website_contact',
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'proposal_sent', 'closed_won', 'closed_lost')),
    priority VARCHAR(30) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL DEFAULT 'note' CHECK (activity_type IN ('note', 'status_change', 'email_sent', 'call_logged', 'meeting')),
    notes TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.lead_activities(lead_id);

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current authenticated user has an active admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_roles
        WHERE user_id = auth.uid()
          AND role IN ('super_admin', 'admin', 'editor')
    );
$$;

-- A. ADMIN ROLES POLICIES
CREATE POLICY "Admins can view admin roles"
    ON public.admin_roles FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Super admins can manage admin roles"
    ON public.admin_roles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_roles
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- B. WEBSITE SETTINGS POLICIES
CREATE POLICY "Public can view website settings"
    ON public.website_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can update website settings"
    ON public.website_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- C. PAGES & SECTIONS POLICIES
CREATE POLICY "Public can view published pages"
    ON public.pages FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage pages"
    ON public.pages FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Public can view visible page sections"
    ON public.page_sections FOR SELECT
    TO anon, authenticated
    USING (is_visible = true OR public.is_admin());

CREATE POLICY "Admins can manage page sections"
    ON public.page_sections FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- D. SERVICES POLICIES
CREATE POLICY "Public can view published services"
    ON public.services FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage services"
    ON public.services FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- E. DEMOS & CATEGORIES POLICIES
CREATE POLICY "Public can view demo categories"
    ON public.demo_categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage demo categories"
    ON public.demo_categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Public can view published website demos"
    ON public.website_demos FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage website demos"
    ON public.website_demos FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- F. PORTFOLIO POLICIES
CREATE POLICY "Public can view published portfolio projects"
    ON public.portfolio_projects FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage portfolio projects"
    ON public.portfolio_projects FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- G. PRICING POLICIES
CREATE POLICY "Public can view published pricing packages"
    ON public.pricing_packages FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage pricing packages"
    ON public.pricing_packages FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- H. BLOG POLICIES
CREATE POLICY "Public can view blog categories"
    ON public.blog_categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage blog categories"
    ON public.blog_categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Public can view published blog posts"
    ON public.blog_posts FOR SELECT
    TO anon, authenticated
    USING (
        (status = 'published' AND published_at <= now())
        OR public.is_admin()
    );

CREATE POLICY "Admins can manage blog posts"
    ON public.blog_posts FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- I. BLOG PAGE VIEWS POLICIES
CREATE POLICY "Public can insert blog page views"
    ON public.blog_page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view blog page views"
    ON public.blog_page_views FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- J. MEDIA ASSETS POLICIES
CREATE POLICY "Public can view media assets"
    ON public.media_assets FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage media assets"
    ON public.media_assets FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- K. LEADS POLICIES (STRICT: ANONYMOUS INSERT ONLY, ADMIN ONLY SELECT/UPDATE)
CREATE POLICY "Public can insert leads"
    ON public.leads FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view and manage leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage lead activities"
    ON public.lead_activities FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 13. SEED INITIAL APPROVED DATA
-- ============================================================================

-- 1. Website Settings (Exact Verified Contact Information)
INSERT INTO public.website_settings (
    id,
    site_name,
    tagline,
    business_email,
    whatsapp_number,
    whatsapp_message,
    social_links,
    footer_text,
    seo_defaults
)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Yugark Digital Studio',
    'We Build. We Create. We Grow Brands.',
    'business@yugark.in',
    '+919125272460',
    'Hello Yugark Studio, I would like to discuss a project.',
    '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
    'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
    '{"title": "YUGARK DIGITAL STUDIO | We Build. We Create. We Grow Brands.", "description": "Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further."}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. Demo Categories
INSERT INTO public.demo_categories (id, name, slug, sort_order)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Corporate & Business', 'corporate-business', 1),
    ('b0000000-0000-0000-0000-000000000002', 'Beauty & Lifestyle', 'beauty-lifestyle', 2),
    ('b0000000-0000-0000-0000-000000000003', 'Restaurant & Cafe', 'restaurant-cafe', 3),
    ('b0000000-0000-0000-0000-000000000004', 'Fitness & Wellness', 'fitness-wellness', 4)
ON CONFLICT (slug) DO NOTHING;

-- 3. Five Initial Approved Services
INSERT INTO public.services (
    id, title, slug, short_description, full_description, icon,
    features, deliverables, process, faqs, sort_order, is_featured, status
)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Website Development',
    'website-development',
    'Custom, high-performing websites that look premium and deliver results.',
    'We architect bespoke websites tailored for ambitious businesses, premium consultancies, and innovative brands. Every interface is built with responsive precision, sub-second loading speeds, accessible UX, and headless CMS readiness.',
    'code',
    '["Custom React / TypeScript Architecture", "Sub-Second Core Web Vitals Optimization", "Headless CMS & Database Readiness (Supabase)", "100% Mobile & Tablet Responsive Engineering", "Clean Semantic Code & Built-In SEO Structure", "Interactive Demos & Client Portal Foundations"]'::jsonb,
    '["Production-Ready Source Code", "Design System & Component Token Library", "Validated Contact & Lead Form Routing", "Deployment & Hosting Configuration Support"]'::jsonb,
    '[{"step": "01", "title": "Discovery & Wireframing", "description": "We audit your brand objectives, competitor landscape, and information architecture before establishing structural wireframes."}, {"step": "02", "title": "Design System & Prototyping", "description": "Crafting responsive layouts, refined typography pairings, and tactile components in alignment with your luxury brand tone."}, {"step": "03", "title": "Full-Stack Development", "description": "Writing clean, typed React/TypeScript code with zero bloat, modular styling, and rigorous cross-device testing."}, {"step": "04", "title": "Launch & Handoff", "description": "Comprehensive QA, performance audits, domain routing, and seamless handoff with documentation."}]'::jsonb,
    '[{"question": "What technologies do you build websites with?", "answer": "We specialize in modern frontend stacks including React, TypeScript, Vite, and Tailwind CSS, backed by headless databases such as Supabase."}, {"question": "Will our team be able to update content without a developer?", "answer": "Yes. Our studio integrates with an intuitive Admin Dashboard and Supabase backend for effortless content editing."}, {"question": "How long does a custom studio website build take?", "answer": "Typical engagements range from 2 to 4 weeks depending on the number of bespoke templates, case-studies, and custom interactions."}]'::jsonb,
    1, true, 'published'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Social Media',
    'social-media',
    'Engaging content and strategies to grow your brand''s presence.',
    'We craft elevated social media assets and disciplined publishing frameworks that cut through algorithm noise. Our focus is on high-retention storytelling, visual consistency, and converting casual scrollers into engaged brand advocates.',
    'chat',
    '["Strategic Monthly Content Roadmaps", "High-Fidelity Visual Asset Production", "Platform-Native Copywriting & Hooks", "Brand Cohesion Across Channels", "Engagement Strategy & Community Frameworks"]'::jsonb,
    '["Monthly High-Resolution Asset Packs", "Ready-to-Publish Captions & Tagging Sets", "Custom Brand Template Files", "Quarterly Creative Trajectory Reports"]'::jsonb,
    '[{"step": "01", "title": "Brand Voice Audit", "description": "Analyzing existing engagement touchpoints and formalizing your distinctive brand tone and editorial pillars."}, {"step": "02", "title": "Calendar Architecture", "description": "Structuring weekly rhythms balancing educational insight, proof points, and high-impact visual showpieces."}, {"step": "03", "title": "Asset Design & Packaging", "description": "Producing custom carousels, typography boards, and story assets aligned with your brand guidelines."}, {"step": "04", "title": "Iteration & Optimization", "description": "Refining hook structures and visual treatments based on real engagement data and audience response."}]'::jsonb,
    '[{"question": "Which platforms do you support?", "answer": "We focus primarily on Instagram, LinkedIn, and YouTube/X, tailoring asset dimensions and editorial tone for each platform."}, {"question": "Do you provide photography and design assets?", "answer": "Yes, we provide full digital asset creation including typographic carousels, mockups, product graphics, and story templates."}]'::jsonb,
    2, true, 'published'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Ads',
    'ads',
    'Data-driven ad campaigns across platforms to reach the right audience.',
    'We design and deploy performance-driven ad campaigns across Meta and Google ecosystems. By uniting persuasive visual design with disciplined audience targeting and high-converting landing pages, we scale client acquisition systematically.',
    'target',
    '["Multi-Format Creative Asset Testing", "Meta & Google Ads Campaign Architecture", "Conversion-Optimized Landing Page Alignment", "Audience Segmentation & Retargeting Funnels", "Rigorous Attribution & Pixel Configuration"]'::jsonb,
    '["Tested Campaign Ad Creatives", "High-Intent Copy Variations & Angles", "Campaign Architecture Documentation", "Performance Dashboard & Spend Tracking"]'::jsonb,
    '[{"step": "01", "title": "Customer Angle Analysis", "description": "Deconstructing your target demographic pain points, objections, and aspirational triggers."}, {"step": "02", "title": "Creative Production", "description": "Designing bespoke ad creatives that match the visual sophistication of your primary brand presence."}, {"step": "03", "title": "Structured Testing Launch", "description": "Deploying controlled budget experiments to identify high-performing creative and copy combinations."}, {"step": "04", "title": "Scaling & Optimization", "description": "Reallocating spend toward proven winning variations while maintaining healthy acquisition costs."}]'::jsonb,
    '[{"question": "Do you manage both the ad creative and the campaign settings?", "answer": "Yes, we provide end-to-end support covering visual ad production, copywriting, platform configuration, and optimization."}, {"question": "What ad spend budget is required to start?", "answer": "We typically recommend minimum testing budgets that allow statistically valid iteration across target audience segments."}]'::jsonb,
    3, true, 'published'
),
(
    'c0000000-0000-0000-0000-000000000004',
    'AI Creative',
    'ai-creative',
    'Modern, AI-powered creative content for faster, smarter growth.',
    'We combine human design taste with modern AI workflows to accelerate brand production. From rapid visual conceptualization and personalized imagery to automated copy variation systems, we give modern studios an unfair speed advantage.',
    'sparkles',
    '["Brand-Trained Prompt Architectures", "High-Fidelity Concept Visualization", "Dynamic Copy & Angle Generation", "Automated Multi-Channel Asset Variations", "Custom Generative Image Styling Pipelines"]'::jsonb,
    '["Custom Studio Prompt Libraries", "Generated Visual Asset Libraries", "Copy Generation Template Workflows", "Automated Workflow Documentation"]'::jsonb,
    '[{"step": "01", "title": "Workflow Mapping", "description": "Identifying creative bottlenecks in your current production pipeline suitable for intelligent acceleration."}, {"step": "02", "title": "Prompt & Style Engineering", "description": "Calibrating AI models to adhere strictly to your typography, lighting, and palette rules."}, {"step": "03", "title": "Human Curation & Polish", "description": "Reviewing and elevating every generated asset through expert designer hands before deployment."}, {"step": "04", "title": "System Integration", "description": "Embedding automated creative workflows directly into your operational stack."}]'::jsonb,
    '[{"question": "Does AI creative replace human design?", "answer": "No. AI acts as a high-powered production engine, while human creative direction dictates taste, brand coherence, and quality."}, {"question": "Are all generated assets commercially safe?", "answer": "Yes, our workflows utilize commercially licensed enterprise models and bespoke style guidelines."}]'::jsonb,
    4, true, 'published'
),
(
    'c0000000-0000-0000-0000-000000000005',
    'Branding',
    'branding',
    'Distinctive brand identities that make a lasting impression.',
    'We design timeless brand identities for modern founders, creative studios, and premium enterprises. From typographic hierarchy and balanced color tokens to stationery and digital style systems, we build identities that resonate deeply.',
    'palette',
    '["Comprehensive Visual Identity Design", "Editorial Serif & Structural Sans Typography Pairings", "Color Token Architecture", "Vector Logo & Studio Mark System", "Brand Guidelines Specification Document"]'::jsonb,
    '["Comprehensive Brand Guidelines", "Vector Master Assets", "Typography System & Licensing Guidance", "Design Tokens for Web Implementation"]'::jsonb,
    '[{"step": "01", "title": "Brand Archetype Discovery", "description": "Uncovering the underlying values, competitive positioning, and emotional resonance of your organization."}, {"step": "02", "title": "Visual Direction Exploration", "description": "Presenting distinct editorial moodboards and identity concepts for collaborative review."}, {"step": "03", "title": "Identity Refinement", "description": "Polishing letterforms, color ratios, spatial margins, and application mockups."}, {"step": "04", "title": "System Handoff", "description": "Delivering complete asset packages and digital tokens ready for immediate implementation."}]'::jsonb,
    '[{"question": "What is included in the final brand package?", "answer": "You receive primary wordmarks, secondary badges, color token palettes, typography rules, and usage guidelines in vector and web formats."}, {"question": "Can you implement our new brand into a website directly?", "answer": "Yes, our studio integrates identity design seamlessly with full website engineering for a unified rollout."}]'::jsonb,
    5, true, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Initial Turnkey Website Demos
INSERT INTO public.website_demos (
    id, title, slug, category_id, short_description, full_description,
    thumbnail_url, demo_url, technology_tags, is_featured, sort_order, status
)
VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'Business Pro',
    'business-pro',
    'b0000000-0000-0000-0000-000000000001',
    'Designed for corporate architecture firms, enterprise consultancies, and commercial development studios with authoritative proof points.',
    'High-converting turnkey digital architecture tailored for corporate consultancies, architecture firms, and engineering practices.',
    '/assets/images/Business pro.jpg',
    'https://aurorabuilders.demo.yugark.in',
    '["React", "TypeScript", "Tailwind CSS", "Vite"]'::jsonb,
    true, 1, 'published'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'Glow Studio',
    'glow-studio',
    'b0000000-0000-0000-0000-000000000002',
    'Soft champagne tones and organic layout for boutique wellness salons, dermatological studios, and aesthetic lifestyle practitioners.',
    'Turnkey beauty, spa, and medical wellness portal with integrated ritual menus and friction-free direct appointment routing.',
    '/assets/images/glow Studio.jpg',
    'https://glowstudio.demo.yugark.in',
    '["React", "Tailwind CSS", "TypeScript"]'::jsonb,
    true, 2, 'published'
),
(
    'd0000000-0000-0000-0000-000000000003',
    'DineCraft',
    'dinecraft',
    'b0000000-0000-0000-0000-000000000003',
    'Atmospheric dark dining experience showcasing artisanal culinary creations, seasonal degustation menus, and seamless table booking.',
    'Bespoke digital presence crafted for fine dining restaurants, artisanal cafes, and culinary venues seeking sensory online impact.',
    '/assets/images/dinecraft.jpg',
    'https://dinecraft.demo.yugark.in',
    '["React", "Tailwind CSS", "TypeScript"]'::jsonb,
    true, 3, 'published'
),
(
    'd0000000-0000-0000-0000-000000000004',
    'FitLife',
    'fitlife',
    'b0000000-0000-0000-0000-000000000004',
    'High-impact performance training portal designed for personal coaches, boutique gyms, and high-energy athletic wellness clubs.',
    'Performance-driven platform featuring weekly class schedules, coach credentials, and tiered fitness membership acquisitions.',
    '/assets/images/Fit Life.jpg',
    'https://fitlife.demo.yugark.in',
    '["React", "Tailwind CSS", "TypeScript"]'::jsonb,
    true, 4, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Portfolio Projects (Distinguishing Curated Studio Concepts)
INSERT INTO public.portfolio_projects (
    id, title, slug, category, description, thumbnail_url,
    project_type, is_verified_client_work, is_featured, year,
    deliverables, challenge, solution, key_features, tech_stack, sort_order, status
)
VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'Aurora Living',
    'aurora-living',
    'Website Development',
    'Elevated spaces and timeless interior architecture crafted with serene spatial proportions, refined serif typography, and responsive luxury presentation.',
    '/assets/images/Aurora living.jpg',
    'Studio Concept Showcase',
    false,
    true,
    '2025–2026',
    '["Custom React/Vite Responsive Architecture", "Editorial Layout System", "High-Resolution Device Mockup Showcase", "Sub-Second Performance Optimization"]'::jsonb,
    'Architectural practices require spatial breathing room. The challenge was displaying high-resolution interior photography without sluggish load times or visual clutter.',
    'We engineered a tailored, minimalist portfolio system pairing warm ivory substrates with high-contrast architectural serifs and pre-cached image delivery.',
    '["Bespoke Project Gallery with Zero Layout Shift", "Tactile Editorial Typography System", "Client Inquiry Pipeline with Direct Routing", "Adaptive Mobile Screen Presets"]'::jsonb,
    '["React", "TypeScript", "Tailwind CSS", "Vite"]'::jsonb,
    1,
    'published'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'Solé Beauty',
    'sole-beauty',
    'Branding & Creative',
    'Holistic skincare and wellness portal created with tactile warm stone hues, gentle biological curves, and seamless appointment bookings.',
    '/assets/images/Sole beauty.jpg',
    'Studio Concept Showcase',
    false,
    true,
    '2025–2026',
    '["Brand Identity & Color Token Design", "Responsive E-Commerce & Treatment Portal", "Treatment Scheduling System", "Social Asset Design System"]'::jsonb,
    'Modern cosmetic and wellness brands struggle with sterile clinic aesthetics. Solé required an organic, botanical warmth that feels both scientifically credible and deeply restorative.',
    'Formulated an editorial palette grounded in champagne gold, soft stone linen, and deep forest accents, paired with friction-free appointment inquiries.',
    '["Treatment Catalog with Duration & Pricing Clarity", "Direct WhatsApp Booking Integration", "Product Formula Showcase", "Mobile-First Touch Optimization"]'::jsonb,
    '["React", "Tailwind CSS", "TypeScript"]'::jsonb,
    2,
    'published'
),
(
    'e0000000-0000-0000-0000-000000000003',
    'PixelPlay',
    'pixelplay',
    'Website + Content',
    'High-energy creative studio showreel and digital production portfolio engineered for immersive visual impact, cinematic previews, and bold aesthetics.',
    '/assets/images/pixelplay.jpg',
    'Studio Concept Showcase',
    false,
    true,
    '2025–2026',
    '["Cinematic Dark-Canvas Experience", "Video Showreel Container Integration", "Creative Service Matrix", "Multi-Device Responsive Grid"]'::jsonb,
    'Creative production agencies need their visual showreels to make immediate visceral impact without overpowering navigable portfolio case-studies.',
    'Crafted a high-contrast dark-canvas layout with razor-sharp typography, immersive preview grids, and lightning-fast navigation transitions.',
    '["Hero Video Showcase Support", "Modular Production Case-Studies", "Interactive Media Player Controls", "Direct WhatsApp Brief Submission"]'::jsonb,
    '["React", "Tailwind CSS", "Vite"]'::jsonb,
    3,
    'published'
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Pricing Packages
INSERT INTO public.pricing_packages (
    id, title, slug, description, price, currency, billing_type, turnaround,
    features, deliverables, is_featured, sort_order, status
)
VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'Starter Launch',
    'starter-launch',
    'Ideal for emerging brands, boutique firms, and focused product launches.',
    'Custom Studio Quote',
    'USD',
    'Milestone-Based',
    '2 – 3 Weeks',
    '["Up to 5 Custom Responsive Templates", "Mobile-First Feathered Visual Architecture", "Clean Contact & WhatsApp Lead Flow", "Core Web Vitals Speed Tuning", "Basic On-Page SEO Foundations", "Supabase CMS Ready Architecture"]'::jsonb,
    '["Complete React/TypeScript Source Code", "Production Deployment Setup", "Design Token Documentation", "2 Weeks Post-Launch Support"]'::jsonb,
    false, 1, 'published'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'Growth Studio',
    'growth-studio',
    'Our flagship studio tier for scaling companies and established service practices.',
    'Custom Studio Quote',
    'USD',
    'Milestone-Based',
    '3 – 5 Weeks',
    '["Up to 12 Bespoke Templates & Case Studies", "Comprehensive Brand Token Alignment", "Dynamic Blog & Project Showcase Systems", "Interactive Template Demos & Previews", "Advanced Meta/Google Attribution Setup", "Direct WhatsApp & Secure Form Inquiries", "Priority Turnaround & Revision Cycles"]'::jsonb,
    '["Full-Stack Source Repository", "Supabase Database Schema & Setup", "Custom Component Design System", "4 Weeks Dedicated Studio Support"]'::jsonb,
    true, 2, 'published'
),
(
    'f0000000-0000-0000-0000-000000000003',
    'Bespoke Enterprise',
    'bespoke-enterprise',
    'Comprehensive digital transformation, custom architectures, and ongoing studio partnership.',
    'Custom Studio Quote',
    'USD',
    'Milestone-Based',
    'Bespoke Milestones',
    '["Unlimited Bespoke Templates & Pages", "Custom Database & API Architecture", "End-to-End Brand Identity & Guidelines", "Multi-Role Admin Dashboard Prep", "Automated Lead Notification Pipelines", "Enterprise Performance & Security Audits", "Direct Studio Director Collaboration"]'::jsonb,
    '["Enterprise Source Repository & IP Transfer", "Complete Master Asset Vector Packages", "Architectural Documentation & Walkthroughs", "Ongoing Retainer & Support Options"]'::jsonb,
    false, 3, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- 7. Blog Categories & Blog Posts
INSERT INTO public.blog_categories (id, name, slug, description)
VALUES
    ('a1000000-0000-0000-0000-000000000001', 'Website Development', 'website-development', 'Architecture, Core Web Vitals, and responsive UI engineering.'),
    ('a1000000-0000-0000-0000-000000000002', 'Content & Social Media', 'content-social-media', 'Strategic brand storytelling, documentation, and authority.'),
    ('a1000000-0000-0000-0000-000000000003', 'Digital Marketing', 'digital-marketing', 'High-ROAS testing frameworks and performance campaigns.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_posts (
    id, title, slug, excerpt, content, rich_paragraphs,
    cover_image_url, is_graphic_card, graphic_data,
    category_id, category_name, author_name, author_role, read_time,
    is_featured, status, published_at
)
VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'What Makes a Website Truly Effective in 2026?',
    'effective-website-2026',
    'Key elements that turn a good website into a powerful growth tool for modern business.',
    'In 2026, a successful website is no longer just an aesthetic brochure; it is an active conversion engine. Modern consumers expect sub-second load times, tactile micro-interactions, uncompromising mobile typography, and authentic brand storytelling that bridges proof directly to user value.',
    '["The modern web has grown intolerant of friction. Over-engineered animations, bloated client scripts, and jarring layout shifts immediately signal a lack of technical discipline. Conversely, interfaces that load instantly and respond deliberately establish unconscious trust before a single paragraph is read.", "True conversion effectiveness stems from typographic restraint. By establishing a clear hierarchy between characterful editorial serifs and crisp geometric body type, brands guide the eye naturally toward proof points and calls to action without visual coercion.", "Furthermore, the architecture beneath the canvas matters. Modern digital studios build with headless data layers and type-safe components from day one, allowing content to evolve without risking layout regressions or expensive rewrites."]'::jsonb,
    '/assets/images/website devlopment.jpg',
    false, '{}'::jsonb,
    'a1000000-0000-0000-0000-000000000001',
    'Website Development',
    'Yugark Editorial',
    'Design Engineering',
    '4 min read',
    true, 'published', now()
),
(
    'b1000000-0000-0000-0000-000000000002',
    'Content Ideas to Keep Your Brand Ahead',
    'content-ideas-brand-ahead',
    'Creative content strategies to stay relevant, authentic and engaging in an ever-shifting landscape.',
    'The modern feed demands depth over noise. We explore how documenting genuine operational processes, behind-the-scenes decision making, and customer transformation narratives yields exponentially higher retention than repetitive trend-chasing.',
    '["Generic social feeds generate passive scrolling, not active interest. To build an enduring presence, modern brands must shift from superficial broadcast messaging to documentary transparency.", "Audiences connect with the philosophy and rigorous problem-solving behind a product. Sharing unvarnished project iterations, material selection rationale, and strategic lessons positions a brand as an authority rather than a vendor.", "By organizing social output into consistent editorial pillars, studios maintain predictable production cadences while ensuring every single post reinforces the master brand narrative."]'::jsonb,
    '/assets/images/Content & Social Media.jpg',
    false, '{}'::jsonb,
    'a1000000-0000-0000-0000-000000000002',
    'Content & Social Media',
    'Yugark Creative',
    'Content Strategy',
    '5 min read',
    true, 'published', now()
),
(
    'b1000000-0000-0000-0000-000000000003',
    'A Simple Guide to Running Better Ad Campaigns',
    'guide-better-ad-campaigns',
    'Practical tips to get more out of your ad spend and reach the right audience consistently.',
    'Scaling paid channels requires rigorous testing architectures: decoupling hook testing from pitch mechanics, maintaining strict creative cadence, and structuring conversion-focused landing pages that mirror ad copy verbatim.',
    '["High-return advertising is rarely about creative genius alone; it is about disciplined testing frameworks. The most successful performance campaigns decouple the opening 3-second hook from the underlying value proposition to pinpoint exact resonance factors.", "Equally crucial is message symmetry. When an ad creative promises a specific aesthetic or outcome, the destination landing page must reflect that exact imagery, headline tone, and promise within the initial viewport.", "By treating paid acquisition as an empirical feedback loop rather than a lottery, businesses build sustainable customer acquisition engines that compound alongside their organic authority."]'::jsonb,
    NULL,
    true,
    '{"framework": "Framework 03", "precision": "Ad Precision", "architectureBadge": "High-ROAS Architecture", "headline": "Reach & Convert at Scale.", "playbookLabel": "Performance Playbook"}'::jsonb,
    'a1000000-0000-0000-0000-000000000003',
    'Digital Marketing',
    'Yugark Growth Lab',
    'Performance Marketing',
    '6 min read',
    true, 'published', now()
)
ON CONFLICT (slug) DO NOTHING;
