import { trendResearchService } from '../services/trendResearchService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const executeResearch = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await trendResearchService.executeResearch(req.body, userContext);

  res.status(201).json({
    success: true,
    message: `Discovered ${result.trends.length} verified trends across ${result.research.sourceResults?.length || 0} sources`,
    data: result,
  });
});

export const getResearchHistory = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await trendResearchService.getResearchHistory(req.query, userContext);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getResearchById = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const research = await trendResearchService.getResearchById(req.params.id, userContext);

  res.status(200).json({
    success: true,
    data: { research },
  });
});
