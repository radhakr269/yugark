-- ============================================================================
-- YUGARK DIGITAL STUDIO V2 — SUPABASE STORAGE SETUP
-- File: 20261009000001_storage_buckets.sql
-- Description: Create public-cms-media storage bucket with RLS security policies.
-- ============================================================================

-- Insert public-cms-media bucket into storage.buckets if storage schema exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
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

-- Storage policies for public-cms-media
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
        -- Allow public read access to objects in public-cms-media
        DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
        CREATE POLICY "Public can view media"
            ON storage.objects FOR SELECT
            TO anon, authenticated
            USING (bucket_id = 'public-cms-media');

        -- Allow only authenticated admin users to upload, update, or delete media
        DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
        CREATE POLICY "Admins can upload media"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK (
                bucket_id = 'public-cms-media'
                AND public.is_admin()
            );

        DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
        CREATE POLICY "Admins can update media"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (
                bucket_id = 'public-cms-media'
                AND public.is_admin()
            );

        DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
        CREATE POLICY "Admins can delete media"
            ON storage.objects FOR DELETE
            TO authenticated
            USING (
                bucket_id = 'public-cms-media'
                AND public.is_admin()
            );
    END IF;
END $$;
