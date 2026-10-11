import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

const serverSupabase =
  supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')
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
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    }
  }

  const { postSlug, referrer } = body || {};
  if (!postSlug || typeof postSlug !== 'string') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'postSlug is required' }));
  }

  const clientIpHeader =
    (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) ||
    req.socket?.remoteAddress ||
    'unknown';
  const clientIp = Array.isArray(clientIpHeader)
    ? clientIpHeader[0]
    : String(clientIpHeader).split(',')[0].trim();

  if (serverSupabase) {
    try {
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
    } catch (err) {
      console.error('[Yugark Studio] Analytics view error:', err);
    }
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ success: true }));
}
