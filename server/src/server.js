import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { methodService } from './services/methodService.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Seed default script methods
  await methodService.seedDefaults();

  const server = app.listen(env.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 ScriptFlow API Server Running`);
    console.log(`📍 Port:        http://localhost:${env.PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`🤖 AI Provider: ${env.AI_PROVIDER} (${env.AI_API_KEY ? 'Live Key Configured' : 'Demo Mode Active'})`);
    console.log(`📦 MongoDB:     ${env.MONGODB_URI.replace(/:([^:@]{3,})@/, ':****@')}`);
    console.log(`====================================================`);
  });

  const handleShutdown = (signal) => {
    console.log(`\n[Server] ${signal} signal received. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
