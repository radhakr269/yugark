-- ============================================================================
-- YUGARK DIGITAL STUDIO — DEMO MANAGEMENT & SUPABASE STORAGE MIGRATION
-- File: 20261012000001_demo_management_and_storage_fix.sql
-- Description:
--   1. Provisions the centralized 'public-cms-media' Supabase Storage bucket
--      with public read access and scoped admin upload/update/delete policies.
--   2. Ensures public.demo_categories exists with all industry categories,
--      specifically adding 'Healthcare & Medical' (slug: healthcare-medical).
--   3. Ensures public.website_demos exists with strict RLS policies.
--   4. Re-associates the Dr. Gautam Porwal demo to 'Healthcare & Medical'
--      and replaces the stale Aurora Builders screenshot with the dedicated
--      clinical demo asset.
--   5. Refreshes the PostgREST schema cache.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROVISION 'public-cms-media' STORAGE BUCKET & RLS POLICIES
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        -- Insert or update the public-cms-media bucket
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'public-cms-media',
            'public-cms-media',
            true,
            10485760, -- 10MB limit
            ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
        )
        ON CONFLICT (id) DO UPDATE SET
            public = true,
            file_size_limit = 10485760,
            allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];
    END IF;
END $$;

-- Storage object RLS policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
        -- Allow public read access to objects in public-cms-media
        DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
        CREATE POLICY "Public can view media"
            ON storage.objects FOR SELECT
            TO anon, authenticated
            USING (bucket_id = 'public-cms-media');

        -- Allow only authenticated administrators to upload media
        DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
        CREATE POLICY "Admins can upload media"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK (
                bucket_id = 'public-cms-media'
                AND (public.is_admin())
            );

        -- Allow only authenticated administrators to update media
        DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
        CREATE POLICY "Admins can update media"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (
                bucket_id = 'public-cms-media'
                AND (public.is_admin())
            )
            WITH CHECK (
                bucket_id = 'public-cms-media'
                AND (public.is_admin())
            );

        -- Allow only authenticated administrators to delete media
        DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
        CREATE POLICY "Admins can delete media"
            ON storage.objects FOR DELETE
            TO authenticated
            USING (
                bucket_id = 'public-cms-media'
                AND (public.is_admin())
            );
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. ENSURE public.demo_categories TABLE & CATEGORIES EXIST
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
    DROP POLICY IF EXISTS "Public can view demo categories" ON public.demo_categories;
    CREATE POLICY "Public can view demo categories"
        ON public.demo_categories FOR SELECT
        TO anon, authenticated
        USING (true);

    DROP POLICY IF EXISTS "Admins can manage demo categories" ON public.demo_categories;
    CREATE POLICY "Admins can manage demo categories"
        ON public.demo_categories FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
END $$;

-- Seed all five approved industry categories including 'Healthcare & Medical'
INSERT INTO public.demo_categories (id, name, slug, sort_order)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Corporate & Business', 'corporate-business', 1),
    ('b0000000-0000-0000-0000-000000000002', 'Beauty & Lifestyle', 'beauty-lifestyle', 2),
    ('b0000000-0000-0000-0000-000000000003', 'Restaurant & Cafe', 'restaurant-cafe', 3),
    ('b0000000-0000-0000-0000-000000000004', 'Fitness & Wellness', 'fitness-wellness', 4),
    ('b0000000-0000-0000-0000-000000000005', 'Healthcare & Medical', 'healthcare-medical', 5)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order;

-- ----------------------------------------------------------------------------
-- 3. ENSURE public.website_demos TABLE & POLICIES EXIST
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
    DROP POLICY IF EXISTS "Public can view website demos" ON public.website_demos;
    CREATE POLICY "Public can view website demos"
        ON public.website_demos FOR SELECT
        TO anon, authenticated
        USING (status = 'published' OR public.is_admin());

    DROP POLICY IF EXISTS "Admins can manage website demos" ON public.website_demos;
    CREATE POLICY "Admins can manage website demos"
        ON public.website_demos FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
END $$;

-- ----------------------------------------------------------------------------
-- 4. SEED / CORRECT TURNKEY DEMOS (INCLUDING DR. GAUTAM PORWAL)
-- ----------------------------------------------------------------------------

-- Seed Initial approved demos
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
    'Dr. Gautam Porwal',
    'dr-gautam-porwal',
    'b0000000-0000-0000-0000-000000000005',
    'Specialized clinical & homeopathic healthcare portal with patient appointment scheduling, treatment specializations, and direct consultation routing.',
    'Turnkey clinical practice portal engineered for specialized medical and homeopathic doctors, featuring treatment portfolios, award credentials, and 1-click WhatsApp consultation routing.',
    '/assets/images/dr-gautam-porwal.svg',
    'https://drgautamporwal.demo.yugark.in',
    '["React", "Tailwind CSS", "TypeScript", "Vite"]'::jsonb,
    true, 5, 'published'
)
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    updated_at = now();

-- Update any existing Gautam Porwal records that were previously assigned to Hospitality & Dining or using Aurora Builders image
UPDATE public.website_demos
SET category_id = 'b0000000-0000-0000-0000-000000000005',
    thumbnail_url = CASE 
        WHEN thumbnail_url ILIKE '%Business pro%' THEN '/assets/images/dr-gautam-porwal.svg'
        ELSE thumbnail_url
    END,
    updated_at = now()
WHERE slug ILIKE '%porwal%' 
   OR slug ILIKE '%gautam%'
   OR title ILIKE '%porwal%'
   OR title ILIKE '%gautam%';

-- ----------------------------------------------------------------------------
-- 5. RELOAD POSTGREST SCHEMA CACHE
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
