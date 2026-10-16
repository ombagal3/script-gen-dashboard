import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { ApiError } from './utils/ApiError.js';

import authRoutes from './routes/authRoutes.js';
import scriptRoutes from './routes/scriptRoutes.js';
import methodRoutes from './routes/methodRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import trendRoutes from './routes/trendRoutes.js';
import trendResearchRoutes from './routes/trendResearchRoutes.js';
import masterPromptRoutes from './routes/masterPromptRoutes.js';
import contentStrategyRoutes from './routes/contentStrategyRoutes.js';
import autopilotRoutes from './routes/autopilotRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import dataSourceRoutes from './routes/dataSourceRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import productAutoScriptRoutes from './routes/productAutoScriptRoutes.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching frontend
      if (!origin || origin === env.CLIENT_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for convenience
      }
    },
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Root endpoint
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ScriptCraft API Server</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1.25rem; max-width: 520px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); border: 1px solid #334155; text-align: center; }
            h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff; }
            p { font-size: 0.95rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem; }
            .btn { display: inline-block; background: #6366f1; color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: bold; font-size: 0.95rem; transition: background 0.2s; }
            .btn:hover { background: #4f46e5; }
            .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; margin-bottom: 1rem; }
            .endpoints { text-align: left; background: #0f172a; border-radius: 0.75rem; padding: 1rem; margin-top: 1.5rem; font-size: 0.8rem; font-family: monospace; color: #cbd5e1; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">API Server Online (Port 5000)</div>
            <h1>ScriptCraft Backend Running</h1>
            <p>You have accessed the backend API server. To view the visual dashboard and use the Autopilot Content Engine, visit the frontend client.</p>
            <a href="http://localhost:5173" class="btn">Open Web Dashboard (Port 5173) &rarr;</a>
            <div class="endpoints">
              <strong>Core API Endpoints:</strong><br>
              &bull; GET /api/health<br>
              &bull; GET /api/content-strategy/active<br>
              &bull; GET /api/autopilot/briefs<br>
              &bull; POST /api/autopilot/scan<br>
              &bull; GET /api/performance/summary
            </div>
          </div>
        </body>
      </html>
    `);
  }

  res.status(200).json({
    success: true,
    service: 'ScriptCraft API Server',
    status: 'running',
    message: 'Backend is active. For the frontend interface, visit http://localhost:5173',
    documentation: {
      health: '/api/health',
      autopilot: '/api/autopilot/briefs',
      contentStrategy: '/api/content-strategy/active',
      performance: '/api/performance/summary'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ScriptFlow API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/methods', methodRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/trend-research', trendResearchRoutes);
app.use('/api/master-prompts', masterPromptRoutes);
app.use('/api/content-strategy', contentStrategyRoutes);
app.use('/api/autopilot', autopilotRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/data-sources', dataSourceRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/product-autoscript', productAutoScriptRoutes);

// Catch-all for unhandled routes
app.use((req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.originalUrl} not found on this server`));
});

// Central Error Handler
app.use(errorHandler);

export default app;
