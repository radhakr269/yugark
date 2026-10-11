-- ============================================================================
-- YUGARK DIGITAL STUDIO — CREATE ADMIN ROLES TABLE & AUTHORIZATION MIGRATION
-- File: 20261011000002_create_admin_roles_table.sql
-- Description:
--   1. Creates public.admin_roles table with strict constraints & foreign keys
--   2. Enables Row Level Security (RLS) with restrictive non-escalation policies
--   3. Defines public.is_admin() SECURITY DEFINER helper function
--   4. Safely maps business@yugark.in (auth.uid()) as super_admin if user exists
--   5. Creates an automatic trigger to map business@yugark.in on future registration/updates
--   6. Reloads the PostgREST schema cache via NOTIFY pgrst
-- ============================================================================

-- Ensure pgcrypto extension is active for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CREATE TABLE IF NOT EXISTS public.admin_roles
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    full_name VARCHAR(150),
    permissions JSONB DEFAULT '{"manage_content": true, "manage_leads": true, "manage_settings": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. CREATE INDEX FOR FAST AUTH USER ID LOOKUPS
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 4. CREATE OR REPLACE HELPER FUNCTION public.is_admin()
-- Used across CMS tables (leads, settings, etc.) to check authorization safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_roles
        WHERE user_id = auth.uid()
          AND role IN ('super_admin', 'admin', 'editor')
    );
$$;

-- 5. ROW LEVEL SECURITY POLICIES FOR public.admin_roles
-- Drop existing policies if they exist to allow clean idempotent re-execution
DROP POLICY IF EXISTS "Users can view their own admin role" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can view all admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON public.admin_roles;

-- Policy A: Authenticated users can view ONLY their own admin role record
CREATE POLICY "Users can view their own admin role"
    ON public.admin_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Policy B: Authenticated administrators can view all admin role records
CREATE POLICY "Admins can view all admin roles"
    ON public.admin_roles FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Policy C: Only verified super_admin users can insert, update, or delete admin roles
-- Prevents ordinary users from self-elevating privileges
CREATE POLICY "Super admins can manage admin roles"
    ON public.admin_roles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_roles
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_roles
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- 6. SAFELY ASSIGN super_admin ROLE TO business@yugark.in IF USER EXISTS IN auth.users
DO $$
DECLARE
    v_admin_user_id UUID;
BEGIN
    -- Query auth.users for business@yugark.in
    SELECT id INTO v_admin_user_id
    FROM auth.users
    WHERE LOWER(email) = 'business@yugark.in'
    LIMIT 1;

    IF v_admin_user_id IS NOT NULL THEN
        INSERT INTO public.admin_roles (
            user_id,
            role,
            full_name,
            permissions,
            created_at,
            updated_at
        )
        VALUES (
            v_admin_user_id,
            'super_admin',
            'Studio Director',
            '{"manage_content": true, "manage_leads": true, "manage_settings": true}'::jsonb,
            now(),
            now()
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
            role = 'super_admin',
            full_name = 'Studio Director',
            permissions = '{"manage_content": true, "manage_leads": true, "manage_settings": true}'::jsonb,
            updated_at = now();

        RAISE NOTICE 'Successfully granted super_admin role to business@yugark.in (User UUID: %)', v_admin_user_id;
    ELSE
        RAISE NOTICE 'User business@yugark.in does not yet exist in auth.users. The automatic trigger will link the user upon registration.';
    END IF;
END $$;

-- 7. AUTOMATIC REGISTRATION TRIGGER FOR business@yugark.in
-- Automatically assigns super_admin when business@yugark.in is created or updated in auth.users
CREATE OR REPLACE FUNCTION public.handle_admin_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF LOWER(NEW.email) = 'business@yugark.in' THEN
        INSERT INTO public.admin_roles (
            user_id,
            role,
            full_name,
            permissions,
            created_at,
            updated_at
        )
        VALUES (
            NEW.id,
            'super_admin',
            'Studio Director',
            '{"manage_content": true, "manage_leads": true, "manage_settings": true}'::jsonb,
            now(),
            now()
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
            role = 'super_admin',
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_admin_role_on_signup ON auth.users;
CREATE TRIGGER trg_assign_admin_role_on_signup
    AFTER INSERT OR UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_user_registration();

-- 8. REFRESH POSTGREST SCHEMA CACHE
-- Forces Supabase PostgREST API to immediately register the new public.admin_roles table
NOTIFY pgrst, 'reload schema';
