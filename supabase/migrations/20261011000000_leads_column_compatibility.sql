-- ============================================================================
-- YUGARK DIGITAL STUDIO — LEADS COLUMN COMPATIBILITY MIGRATION
-- Ensures complete bidirectional compatibility between:
-- (full_name, whatsapp_number, business_company, project_requirement)
-- AND (name, phone, business_name, requirement)
-- Preserves all existing records, never drops or renames columns.
-- ============================================================================

-- 1. Ensure all columns exist in public.leads without error if already present
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_company VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS project_requirement TEXT;

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS name VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_name VARCHAR(150);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS requirement TEXT;

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS timeline VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS page_source VARCHAR(100) DEFAULT 'website_contact';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Backfill existing rows so all matching columns have data
UPDATE public.leads
SET
    name = COALESCE(name, full_name),
    full_name = COALESCE(full_name, name),
    phone = COALESCE(phone, whatsapp_number),
    whatsapp_number = COALESCE(whatsapp_number, phone),
    business_name = COALESCE(business_name, business_company),
    business_company = COALESCE(business_company, business_name),
    requirement = COALESCE(requirement, project_requirement),
    project_requirement = COALESCE(project_requirement, requirement)
WHERE
    (name IS NULL AND full_name IS NOT NULL) OR
    (full_name IS NULL AND name IS NOT NULL) OR
    (phone IS NULL AND whatsapp_number IS NOT NULL) OR
    (whatsapp_number IS NULL AND phone IS NOT NULL) OR
    (business_name IS NULL AND business_company IS NOT NULL) OR
    (business_company IS NULL AND business_name IS NOT NULL) OR
    (requirement IS NULL AND project_requirement IS NOT NULL) OR
    (project_requirement IS NULL AND requirement IS NOT NULL);

-- 3. Automatic Synchronization Trigger for Future Inserts/Updates
CREATE OR REPLACE FUNCTION public.sync_leads_compatibility_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Synchronize full_name <-> name
    IF NEW.full_name IS NOT NULL AND (NEW.name IS NULL OR NEW.name = '') THEN
        NEW.name := NEW.full_name;
    ELSIF NEW.name IS NOT NULL AND (NEW.full_name IS NULL OR NEW.full_name = '') THEN
        NEW.full_name := NEW.name;
    END IF;

    -- Synchronize whatsapp_number <-> phone
    IF NEW.whatsapp_number IS NOT NULL AND (NEW.phone IS NULL OR NEW.phone = '') THEN
        NEW.phone := NEW.whatsapp_number;
    ELSIF NEW.phone IS NOT NULL AND (NEW.whatsapp_number IS NULL OR NEW.whatsapp_number = '') THEN
        NEW.whatsapp_number := NEW.phone;
    END IF;

    -- Synchronize business_company <-> business_name
    IF NEW.business_company IS NOT NULL AND (NEW.business_name IS NULL OR NEW.business_name = '') THEN
        NEW.business_name := NEW.business_company;
    ELSIF NEW.business_name IS NOT NULL AND (NEW.business_company IS NULL OR NEW.business_company = '') THEN
        NEW.business_company := NEW.business_name;
    END IF;

    -- Synchronize project_requirement <-> requirement
    IF NEW.project_requirement IS NOT NULL AND (NEW.requirement IS NULL OR NEW.requirement = '') THEN
        NEW.requirement := NEW.project_requirement;
    ELSIF NEW.requirement IS NOT NULL AND (NEW.project_requirement IS NULL OR NEW.project_requirement = '') THEN
        NEW.project_requirement := NEW.requirement;
    END IF;

    NEW.updated_at := now();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_leads_compatibility ON public.leads;
CREATE TRIGGER trg_sync_leads_compatibility
    BEFORE INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_leads_compatibility_columns();
