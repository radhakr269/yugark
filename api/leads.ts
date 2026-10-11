import { createClient } from '@supabase/supabase-js';

// In-Memory Rate Limiting (per serverless instance)
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
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

// Supabase Client for Serverless Function
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id')
);

const serverSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    const body = { error: 'Method Not Allowed' };
    return typeof res.json === 'function' ? res.json(body) : res.end(JSON.stringify(body));
  }

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      const err = { error: 'Invalid JSON payload in request.' };
      return typeof res.json === 'function' ? res.json(err) : res.end(JSON.stringify(err));
    }
  }

  if (!body || typeof body !== 'object') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Invalid payload structure.' }));
  }

  // Rate Limiting
  const clientIpHeader =
    (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) ||
    req.socket?.remoteAddress ||
    'unknown';
  const clientIp = Array.isArray(clientIpHeader)
    ? clientIpHeader[0]
    : String(clientIpHeader).split(',')[0].trim();

  if (checkRateLimit(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({ error: 'Too many requests. Please wait a minute before submitting again.' })
    );
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

  // Honeypot Protection (Silent 200 acknowledgment without storing spam)
  if (website_honeypot) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const resp = { success: true, refId: 'YUG-SEC-OK', message: 'Inquiry acknowledged.' };
    return typeof res.json === 'function' ? res.json(resp) : res.end(JSON.stringify(resp));
  }

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Full name is required.' }));
  }

  const hasPhone = Boolean(phone && String(phone).trim().length >= 7);
  const hasEmail = Boolean(email && typeof email === 'string' && email.trim().length > 0);

  if (!hasEmail && !hasPhone) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({ error: 'Please provide either a WhatsApp contact number or an email address.' })
    );
  }

  if (hasEmail) {
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Please provide a valid email address.' }));
    }
  }

  if (!requirement || typeof requirement !== 'string' || requirement.trim().length === 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Project scope details or requirements are required.' }));
  }

  // Sanitization
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

  let leadRefId = `YUG-${Math.floor(100000 + Math.random() * 900000)}`;

  // Database Persistence
  if (serverSupabase) {
    try {
      // 1. Primary schema: full_name, whatsapp_number, business_company, project_requirement
      const primaryPayload: Record<string, any> = {
        full_name: sanitizedName,
        email: sanitizedEmail,
        whatsapp_number: sanitizedPhone,
        business_company: sanitizedBusinessName,
        project_requirement: sanitizedRequirement,
        service: sanitizedService,
        status: 'new',
        priority,
      };

      let { data, error } = await serverSupabase
        .from('leads')
        .insert(primaryPayload)
        .select('id')
        .single();

      // 2. If column mismatch error (table uses name, phone, etc.), fallback
      if (error && (error.message.includes('column') || error.code === '42703' || error.code === 'PGRST204')) {
        const fallbackPayload: Record<string, any> = {
          name: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          business_name: sanitizedBusinessName,
          requirement: sanitizedRequirement,
          service: sanitizedService,
          timeline: sanitizedTimeline,
          page_source: sanitizedSource,
          status: 'new',
          priority,
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
        console.error('[Yugark Studio] Supabase lead insertion error:', error.message);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(
          JSON.stringify({
            error: 'Unable to record your project brief at this time. Please contact our studio directly via WhatsApp.',
          })
        );
      }

      if (data && data.id) {
        leadRefId = `YUG-${String(data.id).substring(0, 6).toUpperCase()}`;
      }
    } catch (dbErr: any) {
      console.error('[Yugark Studio] Database persistence exception:', dbErr?.message || dbErr);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(
        JSON.stringify({
          error: 'An unexpected database error occurred. Please message our studio directly via WhatsApp.',
        })
      );
    }
  } else {
    // In production without credentials, return 503 instead of false positive
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SANDBOX_LEADS) {
      console.error('[Yugark Studio] Production database connection unconfigured.');
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      return res.end(
        JSON.stringify({
          error: 'Studio inquiry database is currently undergoing maintenance. Please connect directly via WhatsApp.',
        })
      );
    }
    console.warn('[Yugark Studio] Database credentials not configured; processed lead in local preview mode.');
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const responseData = {
    success: true,
    refId: leadRefId,
    message: 'Your project brief has been securely transmitted to Yugark Digital Studio.',
  };
  if (typeof res.json === 'function') {
    return res.json(responseData);
  }
  return res.end(JSON.stringify(responseData));
}
