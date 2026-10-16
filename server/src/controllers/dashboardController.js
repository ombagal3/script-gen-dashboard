import { scriptService } from '../services/scriptService.js';
import { getDbStatus } from '../config/db.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const stats = await scriptService.getDashboardStats(userId, guestId);

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

export const getRecentScripts = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;
  const limit = req.query.limit || 6;

  const scripts = await scriptService.getRecentScripts(userId, guestId, limit);

  res.status(200).json({
    success: true,
    data: { scripts },
  });
});

export const getSystemStatus = asyncHandler(async (req, res) => {
  const dbStatus = getDbStatus();

  res.status(200).json({
    success: true,
    data: {
      database: dbStatus,
      ai: {
        isConfigured: !!env.AI_API_KEY,
        isDemoMode: !env.AI_API_KEY,
        provider: env.AI_PROVIDER,
        model: env.AI_MODEL,
        modeLabel: env.AI_API_KEY ? 'Live AI Active' : 'Intelligent Demo Mode',
      },
      environment: env.NODE_ENV,
      serverTime: new Date().toISOString(),
    },
  });
});
