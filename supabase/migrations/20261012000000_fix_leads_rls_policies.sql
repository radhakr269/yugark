-- ============================================================================
-- YUGARK DIGITAL STUDIO — LEADS RLS POLICIES & SCHEMA RECONCILIATION
-- File: 20261012000000_fix_leads_rls_policies.sql
-- Description:
--   1. Ensures all required leads columns exist without modifying existing data
--   2. Enables Row Level Security (RLS) on public.leads
--   3. Creates permissive INSERT policy for public website contact forms
--   4. Creates full SELECT/UPDATE/DELETE policy for authenticated administrators
--      using the verified public.is_admin() SECURITY DEFINER helper function
--   5. Reloads PostgREST schema cache via NOTIFY pgrst
-- ============================================================================

-- 1. Ensure required columns exist safely (idempotent)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_company VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_category VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS project_requirement TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'normal';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS page_source VARCHAR(100) DEFAULT 'website_contact';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Enable Row Level Security on public.leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Idempotently drop existing leads policies to prevent duplicate policy errors
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view and manage leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;

-- Policy A: Allow anonymous visitors and authenticated users to submit new contact leads
CREATE POLICY "Public can insert leads"
    ON public.leads FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy B: Grant full SELECT, UPDATE, DELETE permissions to authorized studio administrators
-- Evaluates public.is_admin() which securely verifies auth.uid() in public.admin_roles
CREATE POLICY "Admins can view and manage leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Reload PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
