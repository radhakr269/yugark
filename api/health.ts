export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('your-project-id')
  );

  const payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: 'Vercel Serverless',
    supabaseConnected: isConfigured,
    storageBucket: 'public-cms-media',
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  if (typeof res.json === 'function') {
    return res.json(payload);
  }
  return res.end(JSON.stringify(payload));
}
