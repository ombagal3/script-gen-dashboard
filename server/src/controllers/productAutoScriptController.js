import { productAutoScriptService } from '../services/productAutoScriptService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateProductAutoScript = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await productAutoScriptService.generateProductAutoScript(req.body, userContext);

  res.status(201).json({
    success: true,
    message: 'Product AutoScript generated successfully',
    data: result,
  });
});

export const getUserDefaults = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const defaults = await productAutoScriptService.getUserDefaults(userContext);

  res.status(200).json({
    success: true,
    data: defaults,
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await productAutoScriptService.getHistory(req.query, userContext);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const autoScript = await productAutoScriptService.getById(req.params.id, userContext);

  res.status(200).json({
    success: true,
    data: { autoScript },
  });
});

export const regenerateHook = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await productAutoScriptService.regenerateHook(req.body.autoScriptId, userContext);

  res.status(200).json({
    success: true,
    message: 'Hooks regenerated successfully',
    data: result,
  });
});

export const generateAlternativeAngle = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await productAutoScriptService.generateAlternativeAngle(req.body.autoScriptId, userContext);

  res.status(201).json({
    success: true,
    message: 'Alternative angle generated successfully',
    data: result,
  });
});
