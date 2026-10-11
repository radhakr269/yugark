import { getBackendHealth } from '../src/lib/server/leadService';

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

  const health = getBackendHealth('Vercel Serverless');
  res.statusCode = 200;
  if (typeof res.json === 'function') {
    return res.json(health);
  }
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(health));
}
