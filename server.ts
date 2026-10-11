import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  processLeadSubmission,
  recordPageView,
  getBackendHealth,
} from './src/lib/server/leadService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security & Body Parsing Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Health & Configuration Check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json(getBackendHealth('Express + Vite Full-Stack'));
});

/**
 * Secure Lead Submission Endpoint
 * Protects with spam honeypot, input validation, rate limiting, and length restrictions
 */
app.post('/api/leads', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const result = await processLeadSubmission(req.body, clientIp);
  return res.status(result.status).json(result.body);
});

app.all('/api/leads', (_req: Request, res: Response) => {
  return res.status(405).json({ error: 'Method Not Allowed. Leads submission requires POST.' });
});

/**
 * Privacy-Conscious Blog View Tracking
 */
app.post('/api/analytics/view', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const success = await recordPageView(req.body, clientIp);
  return res.json({ success });
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
