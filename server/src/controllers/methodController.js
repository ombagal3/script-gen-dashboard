import { methodService } from '../services/methodService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMethods = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const methods = await methodService.getMethods(userId);

  res.status(200).json({
    success: true,
    data: { methods },
  });
});

export const getMethodById = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const method = await methodService.getMethodById(req.params.id, userId);

  res.status(200).json({
    success: true,
    data: { method },
  });
});

export const createMethod = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const newMethod = await methodService.createMethod(req.body, userId);

  res.status(201).json({
    success: true,
    message: 'Script method created successfully',
    data: { method: newMethod },
  });
});

export const updateMethod = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const updated = await methodService.updateMethod(req.params.id, req.body, userId);

  res.status(200).json({
    success: true,
    message: 'Script method updated successfully',
    data: { method: updated },
  });
});

export const deleteMethod = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const result = await methodService.deleteMethod(req.params.id, userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
