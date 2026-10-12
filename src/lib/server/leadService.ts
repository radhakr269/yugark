import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ============================================================================
// SUPABASE CLIENT INITIALIZATION (SERVER-SIDE)
// ============================================================================

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

// Server prefers service-role key for privileged server operations,
// falling back to anon key if service-role is not provisioned.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id')
);

export const serverSupabase: SupabaseClient | null = isServerSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ============================================================================
// IN-MEMORY RATE LIMITING WITH AUTOMATIC PURGE
// ============================================================================

const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 5;

export function checkRateLimit(ip: string): boolean {
  const cleanIp = ip.trim() || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(cleanIp);

  if (!entry) {
    rateLimitMap.set(cleanIp, { count: 1, firstSeen: now });
    return false;
  }

  if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(cleanIp, { count: 1, firstSeen: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// Reset rate limits (useful for testing)
export function resetRateLimits(): void {
  rateLimitMap.clear();
}

// Prevent memory leak by periodically cleaning up stale IP entries
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.firstSeen > RATE_LIMIT_WINDOW_MS * 2) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (timer && typeof timer.unref === 'function') {
    timer.unref();
  }
}

// ============================================================================
// INPUT SANITIZATION & VALIDATION
// ============================================================================

export interface SanitizedLeadData {
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  requirement: string;
  service: string;
  timeline: string;
  page_source: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'new';
}

export type ValidationResult =
  | { isSpam: true; isValid: false; refId: string; message: string }
  | { isSpam: false; isValid: false; error: string; statusCode: number }
  | { isSpam: false; isValid: true; lead: SanitizedLeadData };

export function validateAndSanitizeLead(body: any): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { isSpam: false, isValid: false, error: 'Invalid payload structure.', statusCode: 400 };
  }

  const {
    name,
    email,
    phone,
    business_name,
    requirement,
    service,
    timeline,
    page_source,
    website_honeypot,
  } = body;

  // 1. Spam Honeypot Check (Silently acknowledge bot submissions without storing)
  if (website_honeypot) {
    return {
      isSpam: true,
      isValid: false,
      refId: 'YUG-SEC-OK',
      message: 'Inquiry acknowledged.',
    };
  }

  // 2. Validate Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { isSpam: false, isValid: false, error: 'Full name is required.', statusCode: 400 };
  }

  // 3. Validate Contact Channels (Either valid email OR phone must be provided)
  const hasPhone = Boolean(phone && String(phone).trim().length >= 7);
  const hasEmail = Boolean(email && typeof email === 'string' && email.trim().length > 0);

  if (!hasEmail && !hasPhone) {
    return {
      isSpam: false,
      isValid: false,
      error: 'Please provide either a WhatsApp contact number or an email address.',
      statusCode: 400,
    };
  }

  if (hasEmail) {
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { isSpam: false, isValid: false, error: 'Please provide a valid email address.', statusCode: 400 };
    }
  }

  // 4. Validate Project Requirements
  if (!requirement || typeof requirement !== 'string' || requirement.trim().length === 0) {
    return {
      isSpam: false,
      isValid: false,
      error: 'Project scope details or requirements are required.',
      statusCode: 400,
    };
  }

  // 5. Sanitize and Bound Lengths (matches database column specifications)
  const sanitizedName = name.trim().substring(0, 150);
  const sanitizedPhone = phone ? String(phone).trim().replace(/[^\d+()\-\s]/g, '').substring(0, 50) : null;
  const sanitizedEmail = hasEmail
    ? email.trim().substring(0, 150)
    : (sanitizedPhone ? `${sanitizedPhone.replace(/\D/g, '') || 'client'}@whatsapp.demo` : 'inquiry@yugark.in');
  const sanitizedBusinessName = business_name ? String(business_name).trim().substring(0, 150) : null;
  const sanitizedRequirement = requirement.trim().substring(0, 3000);
  const sanitizedService = service ? String(service).trim().substring(0, 100) : 'General Inquiry';
  const sanitizedTimeline = timeline ? String(timeline).trim().substring(0, 100) : 'Standard (2–4 weeks)';
  const sanitizedSource = page_source ? String(page_source).trim().substring(0, 100) : 'website_contact';

  const priority: 'high' | 'normal' = sanitizedService === 'Free Website Demo' ? 'high' : 'normal';

  return {
    isSpam: false,
    isValid: true,
    lead: {
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      business_name: sanitizedBusinessName,
      requirement: sanitizedRequirement,
      service: sanitizedService,
      timeline: sanitizedTimeline,
      page_source: sanitizedSource,
      priority,
      status: 'new',
    },
  };
}

// ============================================================================
// CORE LEAD PROCESSING PIPELINE
// ============================================================================

export interface ProcessLeadResponse {
  status: number;
  body: {
    success?: boolean;
    refId?: string;
    message?: string;
    error?: string;
  };
}

export async function processLeadSubmission(
  body: any,
  clientIp: string
): Promise<ProcessLeadResponse> {
  try {
    // 1. Rate Limiting Check
    if (checkRateLimit(clientIp)) {
      return {
        status: 429,
        body: {
          error: 'Too many requests. Please wait a minute before submitting again.',
        },
      };
    }

    // 2. Validation & Sanitization
    const validation = validateAndSanitizeLead(body);

    if ('isSpam' in validation && validation.isSpam) {
      return {
        status: 200,
        body: {
          success: true,
          refId: validation.refId,
          message: validation.message,
        },
      };
    }

    if (!validation.isValid) {
      return {
        status: validation.statusCode,
        body: {
          error: validation.error,
        },
      };
    }

    const { lead } = validation;
    let leadRefId = `YUG-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Database Persistence
    if (serverSupabase) {
      // 1. Primary schema: full_name, whatsapp_number, business_company, project_requirement
      const primaryPayload: Record<string, any> = {
        full_name: lead.name,
        email: lead.email,
        whatsapp_number: lead.phone,
        business_company: lead.business_name,
        business_category: lead.business_name,
        project_requirement: lead.requirement,
        service: lead.service,
        status: lead.status,
        priority: lead.priority,
      };

      let { data, error } = await serverSupabase
        .from('leads')
        .insert(primaryPayload)
        .select('id')
        .single();

      // 2. If column mismatch error (table uses name, phone, etc.), fallback
      if (error && (error.message.includes('column') || error.code === '42703' || error.code === 'PGRST204')) {
        const fallbackPayload: Record<string, any> = {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          business_name: lead.business_name,
          requirement: lead.requirement,
          service: lead.service,
          timeline: lead.timeline,
          page_source: lead.page_source,
          status: lead.status,
          priority: lead.priority,
        };
        const fallbackRes = await serverSupabase
          .from('leads')
          .insert(fallbackPayload)
          .select('id')
          .single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        // Log detailed error internally on server; NEVER leak database schema/credentials to public visitors
        console.error('[Yugark Studio] Supabase lead insertion error:', error.message);
        return {
          status: 500,
          body: {
            error: 'Unable to record your project brief at this time. Please contact our studio directly via WhatsApp.',
          },
        };
      }

      if (data && data.id) {
        leadRefId = `YUG-${String(data.id).substring(0, 6).toUpperCase()}`;
      }
    } else {
      // In production environment without database credentials, return 503 instead of false positive
      if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SANDBOX_LEADS) {
        console.error('[Yugark Studio] Production database connection unconfigured.');
        return {
          status: 503,
          body: {
            error: 'Studio inquiry database is currently undergoing maintenance. Please connect directly via WhatsApp.',
          },
        };
      }
      console.warn('[Yugark Studio] Database credentials not configured; processed lead in local preview mode.');
    }

    return {
      status: 200,
      body: {
        success: true,
        refId: leadRefId,
        message: 'Your project brief has been securely transmitted to Yugark Digital Studio.',
      },
    };
  } catch (err: any) {
    console.error('[Yugark Studio] Unexpected error handling lead submission:', err?.message || err);
    return {
      status: 500,
      body: {
        error: 'An internal error occurred while processing your brief. Please message our studio directly on WhatsApp.',
      },
    };
  }
}

// ============================================================================
// BLOG VIEW TRACKING & ANALYTICS
// ============================================================================

export async function recordPageView(
  body: any,
  clientIp: string
): Promise<boolean> {
  try {
    const { postSlug, referrer } = body || {};
    if (!postSlug || typeof postSlug !== 'string') return false;

    if (serverSupabase) {
      const { data: post } = await serverSupabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .single();

      if (post && post.id) {
        const dateStr = new Date().toISOString().split('T')[0];
        const visitorHash = crypto
          .createHash('sha256')
          .update(`${clientIp}-${dateStr}-${post.id}`)
          .digest('hex')
          .substring(0, 32);

        await serverSupabase.from('blog_page_views').insert({
          post_id: post.id,
          visitor_hash: visitorHash,
          referrer_category: typeof referrer === 'string' ? referrer.substring(0, 100) : 'direct',
        });
      }
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// HEALTH STATUS
// ============================================================================

export function getBackendHealth(runtimeName: string = 'Express Full-Stack') {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: runtimeName,
    supabaseConnected: isServerSupabaseConfigured,
    storageBucket: 'public-cms-media',
  };
}

// ============================================================================
// AUTHENTICATED ADMIN LEADS ACCESS
// ============================================================================

export async function getAuthenticatedLeads(token: string) {
  if (!token) {
    return { status: 401, body: { error: 'Authorization header with Bearer token is required.' } };
  }
  if (!serverSupabase) {
    return { status: 503, body: { error: 'Database service unavailable.' } };
  }
  try {
    const { data: { user }, error: userError } = await serverSupabase.auth.getUser(token);
    if (userError || !user) {
      return { status: 401, body: { error: 'Invalid or expired authentication session.' } };
    }

    const isDesignatedAdmin = user.email && user.email.toLowerCase().trim() === 'business@yugark.in';
    let hasAdminRole = false;

    if (!isDesignatedAdmin) {
      const { data: roleData } = await serverSupabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      hasAdminRole = Boolean(roleData && ['super_admin', 'admin', 'editor'].includes(roleData.role));
    }

    if (!isDesignatedAdmin && !hasAdminRole) {
      return { status: 403, body: { error: 'Access denied. Account is not an authorized administrator.' } };
    }

    const { data, error } = await serverSupabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Yugark Studio] Error fetching leads via server API:', error.message);
      return { status: 500, body: { error: 'Failed to retrieve leads from database.' } };
    }

    return { status: 200, body: { success: true, leads: data || [] } };
  } catch (err: any) {
    console.error('[Yugark Studio] Exception fetching leads:', err?.message || err);
    return { status: 500, body: { error: 'Internal server error retrieving leads.' } };
  }
}

export async function updateAuthenticatedLead(token: string, body: any) {
  if (!token) {
    return { status: 401, body: { error: 'Authorization token required.' } };
  }
  if (!serverSupabase) {
    return { status: 503, body: { error: 'Database service unavailable.' } };
  }
  try {
    const { data: { user }, error: userError } = await serverSupabase.auth.getUser(token);
    if (userError || !user) {
      return { status: 401, body: { error: 'Invalid session token.' } };
    }

    const isDesignatedAdmin = user.email && user.email.toLowerCase().trim() === 'business@yugark.in';
    let hasAdminRole = false;

    if (!isDesignatedAdmin) {
      const { data: roleData } = await serverSupabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      hasAdminRole = Boolean(roleData && ['super_admin', 'admin', 'editor'].includes(roleData.role));
    }

    if (!isDesignatedAdmin && !hasAdminRole) {
      return { status: 403, body: { error: 'Access denied.' } };
    }

    const { id, status, priority, remarks } = body || {};
    if (!id) {
      return { status: 400, body: { error: 'Lead ID is required.' } };
    }

    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (priority) updatePayload.priority = priority;
    if (remarks !== undefined) updatePayload.remarks = remarks;

    const { data, error } = await serverSupabase
      .from('leads')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { status: 500, body: { error: error.message || 'Failed to update lead.' } };
    }

    return { status: 200, body: { success: true, lead: data } };
  } catch (err: any) {
    return { status: 500, body: { error: err?.message || 'Server error updating lead.' } };
  }
}
