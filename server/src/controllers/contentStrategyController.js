import { contentStrategyService } from '../services/contentStrategyService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getActiveStrategy = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const strategy = await contentStrategyService.getActiveStrategy(userContext);

  res.status(200).json({
    success: true,
    data: { strategy },
  });
});

export const getAllStrategies = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const strategies = await contentStrategyService.getAllStrategies(userContext);

  res.status(200).json({
    success: true,
    data: { strategies },
  });
});

export const createStrategy = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const strategy = await contentStrategyService.createStrategy(req.body, userContext);

  res.status(201).json({
    success: true,
    message: 'Content strategy profile created successfully',
    data: { strategy },
  });
});

export const updateStrategy = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const strategy = await contentStrategyService.updateStrategy(req.params.id, req.body, userContext);

  res.status(200).json({
    success: true,
    message: 'Strategy profile updated successfully',
    data: { strategy },
  });
});

export const setActiveStrategy = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const strategy = await contentStrategyService.setActiveStrategy(req.params.id, userContext);

  res.status(200).json({
    success: true,
    message: `Active profile switched to '${strategy.brandName}'`,
    data: { strategy },
  });
});

export const deleteStrategy = asyncHandler(async (req, res) => {
  const result = await contentStrategyService.deleteStrategy(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
