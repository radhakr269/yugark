-- ============================================================================
-- YUGARK DIGITAL STUDIO — ADMIN AUTHORIZATION ASSIGNMENT MIGRATION
-- File: 20261011000001_assign_admin_role.sql
-- Assigns super_admin role to authorized studio administrator (business@yugark.in)
-- in public.admin_roles mapped to their authenticated Supabase auth.users(id).
-- ============================================================================

DO $$
DECLARE
    v_admin_user_id UUID;
BEGIN
    -- 1. Locate the authenticated Supabase user ID for business@yugark.in
    SELECT id INTO v_admin_user_id
    FROM auth.users
    WHERE LOWER(email) = 'business@yugark.in'
    LIMIT 1;

    -- 2. If the user exists in auth.users, safely upsert into public.admin_roles
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

        RAISE NOTICE 'Successfully granted super_admin role to business@yugark.in (User ID: %)', v_admin_user_id;
    ELSE
        RAISE WARNING 'User business@yugark.in was not found in auth.users. Please register or invite this user in Supabase Authentication first.';
    END IF;
END $$;

-- 3. Also provide an idempotent trigger to automatically link business@yugark.in
-- whenever the user is created or updated in auth.users
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
