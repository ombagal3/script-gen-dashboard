import { scriptService } from '../services/scriptService.js';
import { aiService } from '../services/aiService.js';
import { methodService } from '../services/methodService.js';
import { shootingBriefService } from '../services/shootingBriefService.js';
import { Trend } from '../models/Trend.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getScripts = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const result = await scriptService.getScripts({
    userId,
    guestId,
    ...req.query,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getScriptById = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const script = await scriptService.getScriptById(req.params.id, userId, guestId);

  res.status(200).json({
    success: true,
    data: { script },
  });
});

export const createScript = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const script = await scriptService.createScript(req.body, userId, guestId);

  res.status(201).json({
    success: true,
    message: 'Script saved successfully to database',
    data: { script },
  });
});

export const updateScript = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const script = await scriptService.updateScript(req.params.id, req.body, userId, guestId);

  res.status(200).json({
    success: true,
    message: 'Script updated successfully',
    data: { script },
  });
});

export const duplicateScript = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const duplicate = await scriptService.duplicateScript(req.params.id, userId, guestId);

  res.status(201).json({
    success: true,
    message: 'Script duplicated successfully',
    data: { script: duplicate },
  });
});

export const deleteScript = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;

  const result = await scriptService.deleteScript(req.params.id, userId, guestId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const generateScript = asyncHandler(async (req, res) => {
  const { module, category, objective, language, duration, inputData, methodId, variationsCount = 1 } = req.body;

  let method = null;
  if (methodId) {
    try {
      method = await methodService.getMethodById(methodId);
    } catch {
      // Use default if method not found
    }
  }

  // If variationsCount is 3, generate 3 variations with slight nuances
  if (variationsCount === 3) {
    const variations = await Promise.all([
      aiService.generateScript({
        module,
        category,
        objective,
        language,
        duration,
        inputData: { ...inputData, tone: `${inputData?.tone || 'Engaging'} (Angle A: Direct Impact)` },
        method,
      }),
      aiService.generateScript({
        module,
        category,
        objective,
        language,
        duration,
        inputData: { ...inputData, tone: `${inputData?.tone || 'Engaging'} (Angle B: Story & Curiosity)` },
        method,
      }),
      aiService.generateScript({
        module,
        category,
        objective,
        language,
        duration,
        inputData: { ...inputData, tone: `${inputData?.tone || 'Engaging'} (Angle C: Bold Contrarian)` },
        method,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: '3 Script variations generated successfully',
      data: {
        variations,
        primaryScript: variations[0],
      },
    });
  }

  const generatedScript = await aiService.generateScript({
    module,
    category,
    objective,
    language,
    duration,
    inputData,
    method,
  });

  res.status(200).json({
    success: true,
    message: 'Script generated successfully',
    data: {
      script: generatedScript,
    },
  });
});

export const generateVariation = asyncHandler(async (req, res) => {
  const { module, category, objective, language, duration, inputData, methodId } = req.body;

  let method = null;
  if (methodId) {
    try {
      method = await methodService.getMethodById(methodId);
    } catch {
      // Fallback
    }
  }

  const variation = await aiService.generateScript({
    module,
    category,
    objective,
    language,
    duration,
    inputData: { ...inputData, tone: `${inputData?.tone || 'Alternative'} (Alternative Creative Angle)` },
    method,
  });

  res.status(200).json({
    success: true,
    message: 'Variation generated successfully',
    data: { script: variation },
  });
});

export const regenerateSection = asyncHandler(async (req, res) => {
  const { module, section, currentScript, inputData } = req.body;

  const regeneratedData = await aiService.regenerateSection({
    module,
    section,
    currentScript,
    inputData,
  });

  res.status(200).json({
    success: true,
    message: regeneratedData.message || `${section.toUpperCase()} regenerated successfully`,
    data: regeneratedData,
  });
});

export const generateFromTrends = asyncHandler(async (req, res) => {
  const userId = req.user?._id || null;
  const guestId = req.guestId || null;
  const { trendId, masterPromptId, category, module, language, duration } = req.body;

  let trend = null;
  if (trendId) {
    trend = await Trend.findById(trendId);
  }

  const topic = trend?.name || req.body.topic || 'Market Strategy Breakdown';
  const strat = {
    brandName: req.body.brandName || 'Authority Creator',
    industry: trend?.industry || req.body.industry || 'Business & Tech',
    preferredLanguage: language || 'Hinglish',
    typicalDuration: duration || 60,
    module: module || 'personal-branding',
    category: category || 'Business Owner',
  };

  const briefPackage = await shootingBriefService.buildProductionBrief({
    topic,
    trend,
    strategy: strat,
    priorityRank: 'Best Opportunity',
    opportunityScore: trend?.opportunityScore || 88,
  });

  const savedScript = await scriptService.createScript(
    {
      title: topic,
      module: strat.module,
      category: strat.category,
      objective: 'Authority and Trust',
      language: strat.preferredLanguage,
      duration: strat.typicalDuration,
      content: {
        hook: briefPackage.script.recommendedHook,
        body: briefPackage.script.body,
        cta: briefPackage.script.cta,
        fullText: briefPackage.script.fullScript,
        caption: briefPackage.uploadPackage.caption,
        hashtags: briefPackage.uploadPackage.hashtags,
      },
      metadata: {
        trendId: trend?._id,
        masterPromptId,
        opportunityScore: briefPackage.opportunityScore,
        shootingInstructions: briefPackage.shootingInstructions,
        editingInstructions: briefPackage.editingInstructions,
      },
      status: 'Ready',
    },
    userId,
    guestId
  );

  res.status(201).json({
    success: true,
    message: 'Original ready-to-shoot script generated from trend data',
    data: {
      script: savedScript,
      briefPackage,
    },
  });
});

