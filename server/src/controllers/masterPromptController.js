import { masterPromptService } from '../services/masterPromptService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateMasterPrompt = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  console.log(`[MasterPromptController] generateMasterPrompt requested | Language: ${req.body?.language} | Module: ${req.body?.module}`);
  const masterPrompt = await masterPromptService.generateMasterPrompt(req.body, userContext);

  res.status(201).json({
    success: true,
    message: 'Master prompt generated and saved successfully',
    data: { masterPrompt },
  });
});

export const getMasterPrompts = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await masterPromptService.getMasterPrompts(req.query, userContext);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMasterPromptById = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const masterPrompt = await masterPromptService.getMasterPromptById(req.params.id, userContext);

  res.status(200).json({
    success: true,
    data: { masterPrompt },
  });
});

export const updateMasterPrompt = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const masterPrompt = await masterPromptService.updateMasterPrompt(req.params.id, req.body, userContext);

  res.status(200).json({
    success: true,
    message: 'Master prompt updated successfully',
    data: { masterPrompt },
  });
});

export const deleteMasterPrompt = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await masterPromptService.deleteMasterPrompt(req.params.id, userContext);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const duplicateMasterPrompt = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const masterPrompt = await masterPromptService.duplicateMasterPrompt(req.params.id, userContext);

  res.status(201).json({
    success: true,
    message: 'Master prompt duplicated successfully',
    data: { masterPrompt },
  });
});

export const generateScriptFromPrompt = asyncHandler(async (req, res) => {
  const userContext = {
    userId: req.user?._id || null,
    guestId: req.guestId || null,
  };

  const result = await masterPromptService.generateScriptFromMasterPrompt(req.params.id, userContext);

  res.status(201).json({
    success: true,
    message: 'Script successfully generated from master prompt and saved to library',
    data: result,
  });
});
