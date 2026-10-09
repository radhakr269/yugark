import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Supabase Server Client (Prefers service-role key if available for server-only operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

const serverSupabase = isServerSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// In-Memory Rate Limiting for Lead Submissions
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
    return false;
  }
  if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Health & Configuration Check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: 'Express + Vite Full-Stack',
    supabaseConnected: isServerSupabaseConfigured,
    storageBucket: 'public-cms-media',
  });
});

/**
 * Secure Lead Submission Endpoint
 * Protects with spam honeypot, input validation, and length restrictions
 */
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    // 1. Rate Limiting Check
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a minute before submitting again.',
      });
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
    } = req.body;

    // 2. Spam Honeypot Check (Silently acknowledge bot submissions without storing)
    if (website_honeypot) {
      return res.json({
        success: true,
        refId: 'YUG-SEC-OK',
        message: 'Inquiry acknowledged.',
      });
    }

    // 3. Server-Side Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    // Email is optional for Free Website Demo as long as phone/WhatsApp is provided
    const hasPhone = Boolean(phone && String(phone).trim().length >= 7);
    const hasEmail = Boolean(email && typeof email === 'string' && email.trim().length > 0);

    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!hasEmail && !hasPhone) {
      return res.status(400).json({ error: 'Please provide either a WhatsApp number or email address.' });
    }

    if (!requirement || typeof requirement !== 'string' || requirement.trim().length === 0) {
      return res.status(400).json({ error: 'Project scope details or requirements are required.' });
    }

    // 4. Input Length Sanitization
    const sanitizedName = name.trim().substring(0, 150);
    const sanitizedPhone = phone ? String(phone).trim().substring(0, 50) : null;
    const sanitizedEmail = hasEmail
      ? email.trim().substring(0, 150)
      : (sanitizedPhone ? `${sanitizedPhone.replace(/\D/g, '') || 'client'}@whatsapp.demo` : 'inquiry@yugark.in');
    const sanitizedBusinessName = business_name ? String(business_name).trim().substring(0, 150) : null;
    const sanitizedRequirement = requirement.trim().substring(0, 3000);
    const sanitizedService = service ? String(service).trim().substring(0, 100) : 'General Inquiry';
    const sanitizedTimeline = timeline ? String(timeline).trim().substring(0, 100) : 'Standard (2–4 weeks)';
    const sanitizedSource = page_source ? String(page_source).trim().substring(0, 100) : 'website_contact';

    let leadId = `YUG-${Math.floor(100000 + Math.random() * 900000)}`;

    // 5. Database Persistence
    if (serverSupabase) {
      const { data, error } = await serverSupabase
        .from('leads')
        .insert({
          name: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          business_name: sanitizedBusinessName,
          requirement: sanitizedRequirement,
          service: sanitizedService,
          timeline: sanitizedTimeline,
          page_source: sanitizedSource,
          status: 'new',
          priority: sanitizedService === 'Free Website Demo' ? 'high' : 'normal',
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase lead insertion error:', error);
      } else if (data) {
        leadId = `YUG-${data.id.substring(0, 6).toUpperCase()}`;
      }
    }

    return res.json({
      success: true,
      refId: leadId,
      message: 'Your project brief has been securely transmitted to Yugark Digital Studio.',
    });
  } catch (err: any) {
    console.error('Error handling lead submission:', err);
    return res.status(500).json({
      error: 'An internal error occurred while processing your brief. Please try again or reach out on WhatsApp.',
    });
  }
});

/**
 * Privacy-Conscious Blog View Tracking
 */
app.post('/api/analytics/view', async (req: Request, res: Response) => {
  try {
    const { postSlug, referrer } = req.body;
    if (!postSlug || typeof postSlug !== 'string') {
      return res.status(400).json({ error: 'postSlug is required' });
    }

    if (serverSupabase) {
      // Find the post
      const { data: post } = await serverSupabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .single();

      if (post) {
        // Hash the IP with the current date to prevent duplicate counts without storing raw IP
        const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
        const dateStr = new Date().toISOString().split('T')[0];
        const visitorHash = crypto
          .createHash('sha256')
          .update(`${clientIp}-${dateStr}-${post.id}`)
          .digest('hex')
          .substring(0, 32);

        await serverSupabase
          .from('blog_page_views')
          .insert({
            post_id: post.id,
            visitor_hash: visitorHash,
            referrer_category: typeof referrer === 'string' ? referrer.substring(0, 100) : 'direct',
          });
      }
    }

    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
});

// ============================================================================
// FRONTEND SERVING (VITE DEV MIDDLEWARE / STATIC DIST)
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Yugark Studio] Full-stack server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
