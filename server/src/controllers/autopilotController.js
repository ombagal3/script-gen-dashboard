import { researchSchedulerService } from '../services/researchSchedulerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const runAutopilotScan = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const { strategyId, jobType = 'Manual On-Demand' } = req.body || {};

  const result = await researchSchedulerService.runAutopilotScan(strategyId, jobType, userContext);

  res.status(200).json({
    success: true,
    message: `Autopilot research scan completed successfully. Generated ${result.briefs?.length || 0} production packages.`,
    data: result,
  });
});

export const getDailyBriefs = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const briefs = await researchSchedulerService.getDailyBriefs(req.query, userContext);

  res.status(200).json({
    success: true,
    data: { briefs },
  });
});

export const getBriefById = asyncHandler(async (req, res) => {
  const brief = await researchSchedulerService.getBriefById(req.params.id);

  res.status(200).json({
    success: true,
    data: { brief },
  });
});

export const updateBriefStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const brief = await researchSchedulerService.updateBriefStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    message: `Status updated to '${status}'`,
    data: { brief },
  });
});

export const updateBrief = asyncHandler(async (req, res) => {
  const brief = await researchSchedulerService.updateBrief(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Brief updated successfully',
    data: { brief },
  });
});

export const getJobHistory = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const jobs = await researchSchedulerService.getJobHistory(userContext);

  res.status(200).json({
    success: true,
    data: { jobs },
  });
});
