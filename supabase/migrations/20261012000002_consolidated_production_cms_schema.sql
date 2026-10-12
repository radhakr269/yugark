-- ============================================================================
-- YUGARK DIGITAL STUDIO — CONSOLIDATED PRODUCTION CMS REPAIR MIGRATION
-- File: 20261012000002_consolidated_production_cms_schema.sql
-- Description:
--   1. Fully idempotent, non-destructive, and PostgreSQL syntax validated.
--   2. Strictly preserves existing leads, admin_roles, and public.is_admin().
--   3. Provisions missing CMS tables: website_settings, services, demo_categories,
--      website_demos, portfolio_projects, pricing_packages, blog_categories,
--      blog_posts, and media_assets.
--   4. Uses strictly valid RFC 4122 hexadecimal UUID literals ([0-9a-fA-F]).
--   5. Fixes PostgreSQL single-quote string escaping (e.g. 'What''s Next').
--   6. Enforces non-destructive initial seeding using ON CONFLICT DO NOTHING to
--      prevent overwriting existing CMS edits, pricing, or portfolio data.
--   7. Safely corrects Dr. Gautam Porwal demo record to Healthcare & Medical
--      category and canonical live URL without overwriting custom uploaded thumbnails.
--   8. Configures public-cms-media storage bucket with 50MB limit and video support
--      while preserving existing storage policies.
--   9. Establishes clean, non-recursive RLS policies: public read for published,
--      admin-only writes using public.is_admin().
--  10. Refreshes PostgREST schema cache.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. STORAGE BUCKET: public-cms-media (50MB, Images & Videos)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'public-cms-media',
            'public-cms-media',
            true,
            52428800, -- 50MB limit
            ARRAY[
                'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml',
                'video/mp4', 'video/webm', 'video/quicktime'
            ]::text[]
        )
        ON CONFLICT (id) DO UPDATE SET
            public = true,
            file_size_limit = 52428800,
            allowed_mime_types = ARRAY[
                'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml',
                'video/mp4', 'video/webm', 'video/quicktime'
            ]::text[];
    END IF;
END $$;

-- Storage object RLS policies (preserves working production policies)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view media'
        ) THEN
            CREATE POLICY "Public can view media"
                ON storage.objects FOR SELECT
                TO anon, authenticated
                USING (bucket_id = 'public-cms-media');
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload media'
        ) THEN
            CREATE POLICY "Admins can upload media"
                ON storage.objects FOR INSERT
                TO authenticated
                WITH CHECK (
                    bucket_id = 'public-cms-media'
                    AND public.is_admin()
                );
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can update media'
        ) THEN
            CREATE POLICY "Admins can update media"
                ON storage.objects FOR UPDATE
                TO authenticated
                USING (
                    bucket_id = 'public-cms-media'
                    AND public.is_admin()
                )
                WITH CHECK (
                    bucket_id = 'public-cms-media'
                    AND public.is_admin()
                );
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete media'
        ) THEN
            CREATE POLICY "Admins can delete media"
                ON storage.objects FOR DELETE
                TO authenticated
                USING (
                    bucket_id = 'public-cms-media'
                    AND public.is_admin()
                );
        END IF;
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. TABLE: public.website_settings (Settings, Hero & Homepage Copywriting)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name VARCHAR(100) NOT NULL DEFAULT 'Yugark Digital Studio',
    tagline VARCHAR(150) DEFAULT 'We Build. We Create. We Grow Brands.',
    business_email VARCHAR(150) NOT NULL DEFAULT 'business@yugark.in',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '+91 9125205132',
    whatsapp_message TEXT DEFAULT 'Hello Yugark Studio, I would like to discuss a project.',
    logo_url TEXT,
    favicon_url TEXT,
    social_links JSONB DEFAULT '{"instagram": "https://www.instagram.com/yugark.in/", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
    footer_text TEXT DEFAULT 'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
    hero_config JSONB DEFAULT '{
        "heroImage": "/assets/images/hero.jpg",
        "heroStates": [
            {
                "eyebrow": "DIGITAL STUDIO FOR MODERN BRANDS",
                "headline": "We Build.",
                "supportingText": "Premium websites and smart digital systems that help your business make a lasting impression.",
                "labels": ["Business Websites", "Landing Pages", "Lead Management"]
            },
            {
                "eyebrow": "CREATIVE CONTENT THAT CONNECTS",
                "headline": "We Create.",
                "supportingText": "Engaging videos, social media content and brand creatives that make your business stand out.",
                "labels": ["Promotional Videos", "Social Media", "Brand Creatives"]
            },
            {
                "eyebrow": "STRATEGY FOR BUSINESS GROWTH",
                "headline": "We Grow Brands.",
                "supportingText": "Targeted advertising and digital strategies that help your business reach more customers.",
                "labels": ["Meta & Google Ads", "Content Strategy", "Digital Growth"]
            }
        ],
        "ctaPrimaryText": "Start Project",
        "ctaSecondaryText": "View Our Work",
        "ctaDemoText": "Get Your Free Website Demo"
    }'::jsonb,
    page_content JSONB DEFAULT '{
        "headlineLine1": "We Build.",
        "headlineLine2": "We Create.",
        "headlineLine3Accent": "We Grow Brands.",
        "heroDescription": "Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further.",
        "brandStatementTitle": "A Digital Studio for What''s Next",
        "brandStatementText": "We help founders, brands, and modern businesses build unforgettable web experiences, tell compelling visual stories, and capture high-intent demand across digital channels.",
        "footerText": "Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world."
    }'::jsonb,
    seo_defaults JSONB DEFAULT '{"title": "YUGARK DIGITAL STUDIO | We Build. We Create. We Grow Brands.", "description": "Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further."}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure jsonb columns exist if website_settings was partially created
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_config JSONB;
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS page_content JSONB;

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'website_settings' AND policyname = 'Public can view website settings'
    ) THEN
        CREATE POLICY "Public can view website settings"
            ON public.website_settings FOR SELECT
            TO anon, authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'website_settings' AND policyname = 'Admins can update website settings'
    ) THEN
        CREATE POLICY "Admins can update website settings"
            ON public.website_settings FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Seed singleton settings record (Preserves existing data)
INSERT INTO public.website_settings (
    id, site_name, tagline, business_email, whatsapp_number, whatsapp_message,
    social_links, footer_text
)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Yugark Digital Studio',
    'We Build. We Create. We Grow Brands.',
    'business@yugark.in',
    '+91 9125205132',
    'Hello Yugark Studio, I would like to discuss a project.',
    '{"instagram": "https://www.instagram.com/yugark.in/", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
    'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.'
)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. TABLE: public.demo_categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'demo_categories' AND policyname = 'Public can view demo categories'
    ) THEN
        CREATE POLICY "Public can view demo categories"
            ON public.demo_categories FOR SELECT
            TO anon, authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'demo_categories' AND policyname = 'Admins can manage demo categories'
    ) THEN
        CREATE POLICY "Admins can manage demo categories"
            ON public.demo_categories FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Seed canonical demo categories (Preserves existing records with DO NOTHING)
INSERT INTO public.demo_categories (id, name, slug, sort_order)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Corporate & Business', 'corporate-business', 1),
    ('b0000000-0000-0000-0000-000000000002', 'Beauty & Lifestyle', 'beauty-lifestyle', 2),
    ('b0000000-0000-0000-0000-000000000003', 'Restaurant & Cafe', 'restaurant-cafe', 3),
    ('b0000000-0000-0000-0000-000000000004', 'Fitness & Wellness', 'fitness-wellness', 4),
    ('b0000000-0000-0000-0000-000000000005', 'Healthcare & Medical', 'healthcare-medical', 5)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. TABLE: public.website_demos
-- ----------------------------------------------------------------------------
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

ALTER TABLE public.website_demos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'website_demos' AND policyname = 'Public can view website demos'
    ) THEN
        CREATE POLICY "Public can view website demos"
            ON public.website_demos FOR SELECT
            TO anon, authenticated
            USING (status = 'published' OR public.is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'website_demos' AND policyname = 'Admins can manage website demos'
    ) THEN
        CREATE POLICY "Admins can manage website demos"
            ON public.website_demos FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Seed approved baseline demos (Preserves existing data with DO NOTHING)
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
),
(
    'd0000000-0000-0000-0000-000000000005',
    'Dr. Gautam Porwal — Homoeopathic Clinic',
    'dr-gautam-porwal',
    'b0000000-0000-0000-0000-000000000005',
    'Specialized clinical & homeopathic healthcare portal with patient appointment scheduling, treatment specializations, and direct consultation routing.',
    'Premium, responsive homoeopathic clinic website featuring elegant design, doctor profile, treatment information, patient reviews and appointment enquiry options.',
    '/assets/images/dr-gautam-porwal.svg',
    'https://dr-gautam-porwal.vercel.app/',
    '["React", "Tailwind CSS", "TypeScript", "Vite"]'::jsonb,
    true, 5, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- Targeted non-destructive correction for Dr. Gautam Porwal:
-- Corrects stale category (Hospitality -> Healthcare & Medical) and canonical live URL without overwriting newly uploaded screenshots.
UPDATE public.website_demos
SET category_id = 'b0000000-0000-0000-0000-000000000005',
    demo_url = 'https://dr-gautam-porwal.vercel.app/',
    updated_at = now()
WHERE slug = 'dr-gautam-porwal'
  AND (category_id IS NULL OR category_id != 'b0000000-0000-0000-0000-000000000005' OR demo_url != 'https://dr-gautam-porwal.vercel.app/');

-- Replace stale Business pro.jpg thumbnail if still attached to Dr. Gautam Porwal
UPDATE public.website_demos
SET thumbnail_url = '/assets/images/dr-gautam-porwal.svg',
    updated_at = now()
WHERE slug = 'dr-gautam-porwal'
  AND thumbnail_url ILIKE '%Business pro%';

-- ----------------------------------------------------------------------------
-- 5. TABLE: public.services
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'code',
    image_url TEXT,
    price_display VARCHAR(100),
    regular_price NUMERIC,
    launch_price NUMERIC,
    billing_type VARCHAR(50) DEFAULT 'one-time',
    delivery_time VARCHAR(100),
    badge VARCHAR(100),
    category VARCHAR(100),
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

-- Ensure all columns exist if table was partially created
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_display VARCHAR(100);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS regular_price NUMERIC;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS launch_price NUMERIC;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS billing_type VARCHAR(50) DEFAULT 'one-time';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(100);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS badge VARCHAR(100);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status_sort ON public.services(status, sort_order);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Public can view published services'
    ) THEN
        CREATE POLICY "Public can view published services"
            ON public.services FOR SELECT
            TO anon, authenticated
            USING (status = 'published' OR public.is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Admins can manage services'
    ) THEN
        CREATE POLICY "Admins can manage services"
            ON public.services FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Seed approved core services using valid hexadecimal UUIDs (Preserves existing data with DO NOTHING)
INSERT INTO public.services (
    id, title, slug, short_description, full_description, icon, image_url,
    price_display, regular_price, launch_price, billing_type, delivery_time, badge, category,
    features, benefits, sort_order, status
)
VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'Custom Website Development',
    'website-development',
    'High-performance, bespoke websites engineered with clean typography and modern frontend stacks.',
    'Bespoke digital architecture engineered with sub-second page performance, mobile responsiveness, and high conversion lead systems.',
    'code',
    '/assets/images/website devlopment.jpg',
    'Launch Offer: ₹9,999', 19999, 9999, 'one-time', '5–7 Days', 'Core Architecture', 'Development',
    '["Next-Gen Responsive Architecture", "Sub-Second Page Performance", "Lead Capture Integration", "Search Engine Optimization"]'::jsonb,
    '["Production-ready website deployed on verified domain", "Complete source ownership", "30-day technical support warranty"]'::jsonb,
    1, 'published'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'Social Media Management',
    'social-media-management',
    'Narrative-driven social grids, high-converting short-form videos, and community growth systems.',
    'End-to-end social media stewardship including creative content production, scheduled distribution, copy engineering, and community building.',
    'chat',
    '/assets/images/content-and-social-media.jpg',
    'Monthly Retainer: ₹14,999/mo', 24999, 14999, 'monthly', 'Ongoing Retainer', 'Growth Retainer', 'Marketing',
    '["12 High-Impact Social Creatives", "4 Strategic Reels / Short Videos", "Captions & Strategic Hashtags", "Monthly Performance Analytics"]'::jsonb,
    '["Consistent brand presence across platforms", "Higher organic audience engagement", "Hands-off creative management"]'::jsonb,
    2, 'published'
),
(
    'f0000000-0000-0000-0000-000000000003',
    'Paid Meta & Google Ads',
    'social-media-advertising',
    'Data-backed advertising campaigns engineered to capture qualified customer demand and maximize ROAS.',
    'Precision paid search and social campaigns with targeted conversion funnels, pixel tracking, audience segmentation, and A/B creative testing.',
    'target',
    '/assets/images/Business pro.jpg',
    'Management: ₹15,000/mo', 25000, 15000, 'monthly', 'Bi-weekly Sprints', 'High Intent', 'Advertising',
    '["Precision Audience Targeting", "High-Converting Ad Copy & Visuals", "Pixel & Event Tracking Setup", "Continuous Budget Optimization"]'::jsonb,
    '["Predictable inbound client inquiries", "Transparent weekly ROAS reports", "Direct WhatsApp & CRM lead routing"]'::jsonb,
    3, 'published'
),
(
    'f0000000-0000-0000-0000-000000000004',
    'Brand Identity & Growth Strategy',
    'digital-growth-strategy',
    'Holistic visual identity, brand guidelines, and full-funnel digital positioning for ambitious businesses.',
    'Foundational brand development that unites design systems, messaging frameworks, and omnichannel customer acquisition strategies.',
    'sparkles',
    '/assets/images/Aurora living.jpg',
    'Full Scope: ₹24,999', 39999, 24999, 'one-time', '10–14 Days', 'Studio Transformation', 'Branding',
    '["Logo Architecture & Variations", "Typography & Color Tokens", "Complete Brand Guidelines PDF", "Market Positioning Blueprint"]'::jsonb,
    '["Distinct visual authority in your industry", "Cohesive assets across all touchpoints", "Ready-to-use social & print templates"]'::jsonb,
    4, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. TABLE: public.portfolio_projects
-- ----------------------------------------------------------------------------
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

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'portfolio_projects' AND policyname = 'Public can view published portfolio projects'
    ) THEN
        CREATE POLICY "Public can view published portfolio projects"
            ON public.portfolio_projects FOR SELECT
            TO anon, authenticated
            USING (status = 'published' OR public.is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'portfolio_projects' AND policyname = 'Admins can manage portfolio projects'
    ) THEN
        CREATE POLICY "Admins can manage portfolio projects"
            ON public.portfolio_projects FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Seed approved portfolio projects using valid hexadecimal UUIDs (Preserves existing data with DO NOTHING)
INSERT INTO public.portfolio_projects (
    id, title, slug, category, description, thumbnail_url, project_type,
    is_verified_client_work, is_featured, year, deliverables, sort_order, status
)
VALUES
(
    'f1000000-0000-0000-0000-000000000001',
    'Aurora Living',
    'aurora-living',
    'Architecture & Interior Design',
    'A minimalist luxury architectural portal showcasing residential developments with spatial visual balance.',
    '/assets/images/Aurora living.jpg',
    'Studio Concept', false, true, '2025–2026',
    '["Bespoke Web Platform", "Interactive Spatial Gallery", "Private Viewing Inquiries"]'::jsonb,
    1, 'published'
),
(
    'f1000000-0000-0000-0000-000000000002',
    'Sole Beauty & Wellness',
    'sole-beauty',
    'Aesthetics & Dermatology',
    'Champagne-toned digital destination engineered for an upscale cosmetic dermatology and aesthetic medicine clinic.',
    '/assets/images/Sole beauty.jpg',
    'Studio Concept', false, true, '2025–2026',
    '["Treatment Menu Architecture", "WhatsApp Booking Funnel", "Mobile First Design"]'::jsonb,
    2, 'published'
),
(
    'f1000000-0000-0000-0000-000000000003',
    'Pulse Fitness Studio',
    'pulse-fitness',
    'Athletics & Performance',
    'High-energy athletic club platform with automated weekly schedule management and tiered membership onboarding.',
    '/assets/images/Fit Life.jpg',
    'Studio Concept', false, true, '2025–2026',
    '["Class Timetable Interface", "Coach Roster Profiles", "Membership Funnel"]'::jsonb,
    3, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. TABLE: public.pricing_packages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL DEFAULT 'Custom Quote',
    regular_price NUMERIC,
    launch_price NUMERIC,
    badge VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'INR',
    billing_type VARCHAR(50) DEFAULT 'one-time',
    turnaround VARCHAR(100) DEFAULT '~7 Days',
    features JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    cta_label VARCHAR(100) DEFAULT 'Choose Package',
    cta_url TEXT DEFAULT '/contact',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist
ALTER TABLE public.pricing_packages ADD COLUMN IF NOT EXISTS regular_price NUMERIC;
ALTER TABLE public.pricing_packages ADD COLUMN IF NOT EXISTS launch_price NUMERIC;
ALTER TABLE public.pricing_packages ADD COLUMN IF NOT EXISTS badge VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_pricing_slug ON public.pricing_packages(slug);
CREATE INDEX IF NOT EXISTS idx_pricing_status_sort ON public.pricing_packages(status, sort_order);

ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'pricing_packages' AND policyname = 'Public can view published pricing packages'
    ) THEN
        CREATE POLICY "Public can view published pricing packages"
            ON public.pricing_packages FOR SELECT
            TO anon, authenticated
            USING (status = 'published' OR public.is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'pricing_packages' AND policyname = 'Admins can manage pricing packages'
    ) THEN
        CREATE POLICY "Admins can manage pricing packages"
            ON public.pricing_packages FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Seed verified transparent pricing packages (Preserves existing data with DO NOTHING)
INSERT INTO public.pricing_packages (
    id, title, slug, description, price, regular_price, launch_price, badge,
    currency, billing_type, turnaround, features, deliverables, cta_label, is_featured, sort_order, status
)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Business Website',
    'business-website',
    'Essential bespoke web architecture for ambitious small-to-medium businesses seeking an authoritative digital face.',
    '₹9,999', 19999, 9999, 'Launch Offer',
    'INR', 'one-time', '5–7 Days Delivery',
    '["Custom Responsive Design (Up to 5 Pages)", "Mobile & Tablet Optimization", "1-Click Direct WhatsApp Integration", "Fast Cloud Hosting Setup", "Basic On-Page SEO"]'::jsonb,
    '["Fully operational website", "Domain & DNS configuration", "Post-launch warranty"]'::jsonb,
    'Choose Business Website', false, 1, 'published'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Website + Lead Dashboard',
    'website-leads-dashboard',
    'Complete customer acquisition engine with integrated lead capture and private administrator CRM portal.',
    '₹14,999', 27999, 14999, 'Most Popular',
    'INR', 'one-time', '7–10 Days Delivery',
    '["Everything in Business Website", "Secure In-House Admin CRM Portal", "Real-Time WhatsApp & Email Lead Alerts", "Inquiry Export to CSV/Excel", "Priority 60-Day Support"]'::jsonb,
    '["Turnkey web presence + CRM system", "Admin credential setup", "Full staff walkthrough"]'::jsonb,
    'Choose Website + CRM', true, 2, 'published'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Growth Social Media Plan',
    'growth-social-plan',
    'End-to-end creative social media presence that builds trust, drives engagement, and turns followers into buyers.',
    '₹14,999/mo', 24999, 14999, 'Monthly Retainer',
    'INR', 'monthly', 'Ongoing Monthly Sprints',
    '["12 High-Converting Social Post Creatives", "4 Professional Short-Form Reels / Videos", "Custom Copywriting & Hashtag Strategy", "Monthly Performance & Reach Report"]'::jsonb,
    '["Monthly content calendar", "Scheduled publishing", "Dedicated account designer"]'::jsonb,
    'Choose Social Retainer', false, 3, 'published'
),
(
    'c0000000-0000-0000-0000-000000000004',
    'Meta & Google Ads Growth',
    'paid-ads-growth',
    'Laser-targeted paid ad campaigns engineered to generate high-intent customer inquiries for your services.',
    '₹15,000/mo', 25000, 15000, 'ROI Focused',
    'INR', 'monthly', 'Bi-weekly Optimizations',
    '["Campaign Setup & Audience Research", "Ad Creative & Compelling Copywriting", "Pixel & Lead Conversion Tracking", "Continuous A/B Testing & Bid Optimization"]'::jsonb,
    '["Live ad dashboard access", "Weekly ROAS breakdown", "Lead verification alerts"]'::jsonb,
    'Choose Ads Retainer', false, 4, 'published'
)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. TABLE: public.blog_categories & public.blog_posts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'blog_categories' AND policyname = 'Public can view blog categories'
    ) THEN
        CREATE POLICY "Public can view blog categories"
            ON public.blog_categories FOR SELECT
            TO anon, authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'blog_categories' AND policyname = 'Admins can manage blog categories'
    ) THEN
        CREATE POLICY "Admins can manage blog categories"
            ON public.blog_categories FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

INSERT INTO public.blog_categories (id, name, slug)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Design Engineering', 'design-engineering'),
    ('e0000000-0000-0000-0000-000000000002', 'Growth & Acquisition', 'growth-acquisition'),
    ('e0000000-0000-0000-0000-000000000003', 'Studio Practice', 'studio-practice')
ON CONFLICT (slug) DO NOTHING;

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
    author_name VARCHAR(100) DEFAULT 'Yugark Editorial',
    author_role VARCHAR(100) DEFAULT 'Design Engineering',
    read_time VARCHAR(50) DEFAULT '5 min read',
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Public can view published blog posts'
    ) THEN
        CREATE POLICY "Public can view published blog posts"
            ON public.blog_posts FOR SELECT
            TO anon, authenticated
            USING (
                (status = 'published' AND published_at <= now())
                OR public.is_admin()
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Admins can manage blog posts'
    ) THEN
        CREATE POLICY "Admins can manage blog posts"
            ON public.blog_posts FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 9. TABLE: public.media_assets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'media_assets' AND policyname = 'Public can view media assets'
    ) THEN
        CREATE POLICY "Public can view media assets"
            ON public.media_assets FOR SELECT
            TO anon, authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'media_assets' AND policyname = 'Admins can manage media assets'
    ) THEN
        CREATE POLICY "Admins can manage media assets"
            ON public.media_assets FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 10. RELOAD POSTGREST SCHEMA CACHE
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
