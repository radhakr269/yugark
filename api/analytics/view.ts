import { recordPageView } from '../../src/lib/server/leadService';

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
    const body = { error: 'Method Not Allowed' };
    res.setHeader('Content-Type', 'application/json');
    return typeof res.json === 'function' ? res.json(body) : res.end(JSON.stringify(body));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return typeof res.json === 'function'
        ? res.json({ error: 'Invalid JSON payload' })
        : res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    }
  }

  const clientIpHeader =
    (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) ||
    req.socket?.remoteAddress ||
    'unknown';
  const clientIp = Array.isArray(clientIpHeader)
    ? clientIpHeader[0]
    : String(clientIpHeader).split(',')[0].trim();

  const success = await recordPageView(body, clientIp);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const payload = { success };
  if (typeof res.json === 'function') {
    return res.json(payload);
  }
  return res.end(JSON.stringify(payload));
}
