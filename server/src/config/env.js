import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/script_dashboard',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'scriptflow_super_secret_jwt_key_2026_default',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_API_KEY: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GOOGLE_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-3.5-flash-lite',
  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini',
  IS_DEMO_MODE: !(process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GOOGLE_API_KEY),
};
