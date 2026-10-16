import { performanceFeedbackService } from '../services/performanceFeedbackService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const logPerformance = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await performanceFeedbackService.logPerformance(req.params.briefId, req.body, userContext);

  res.status(200).json({
    success: true,
    message: 'Performance metrics logged successfully',
    data: result,
  });
});

export const getPerformanceSummary = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const summary = await performanceFeedbackService.getPerformanceSummary(userContext);

  res.status(200).json({
    success: true,
    data: summary,
  });
});
