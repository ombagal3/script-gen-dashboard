import { trendService } from '../services/trendService.js';
import { trendResearchService } from '../services/trendResearchService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTrends = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await trendService.getTrends(req.query, userContext);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTrendById = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const trend = await trendService.getTrendById(req.params.id, userContext);

  res.status(200).json({
    success: true,
    data: { trend },
  });
});

export const analyzeTrend = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const trend = await trendService.analyzeTrend(req.params.id, userContext);

  res.status(200).json({
    success: true,
    message: 'Trend re-analyzed across all categories successfully',
    data: { trend },
  });
});

export const toggleSaveTrend = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const trend = await trendService.toggleSaveTrend(req.params.id, userContext);

  res.status(200).json({
    success: true,
    message: trend.isSaved ? 'Trend saved to bookmarks' : 'Trend removed from bookmarks',
    data: { trend },
  });
});

export const deleteTrend = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await trendService.deleteTrend(req.params.id, userContext);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getTrendKPIs = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const overview = await trendService.getKPIsAndOverview(userContext);

  res.status(200).json({
    success: true,
    data: overview,
  });
});

export const getSourceStatuses = asyncHandler(async (req, res) => {
  const statuses = await trendResearchService.getSourceStatuses();

  res.status(200).json({
    success: true,
    data: { sources: statuses },
  });
});

export const importTrend = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const trend = await trendResearchService.importTrend(req.body, userContext);

  res.status(201).json({
    success: true,
    message: 'Trend imported and evaluated successfully',
    data: { trend },
  });
});
