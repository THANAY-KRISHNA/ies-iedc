import 'dotenv/config';
import express from 'express';
import { apiRouter } from './routes';
import { initializeAuth } from './auth';

export function createApp() {
  const app = express();

  // Initialize session tokens
  initializeAuth();

  // Global API Cache-Control Middleware: Ensure all devices get real-time updated data
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'IES IEDC CMS API',
      databaseMode: process.env.DATABASE_URL || process.env.SUPABASE_URL ? 'Cloud PostgreSQL / Supabase' : 'Persistent File DB',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Router
  app.use('/api', apiRouter);

  return app;
}

export const app = createApp();
