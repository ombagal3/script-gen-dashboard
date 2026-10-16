import { dataSourceService } from '../services/dataSourceService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDataSources = asyncHandler(async (req, res) => {
  const sources = await dataSourceService.getAllSources();
  res.status(200).json({
    success: true,
    data: { sources },
  });
});

export const testDataSource = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const result = await dataSourceService.testSource(provider, req.body);
  res.status(200).json({
    success: true,
    message: result.testResult.message,
    data: result,
  });
});

export const syncDataSource = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const result = await dataSourceService.syncSource(provider);
  res.status(200).json({
    success: true,
    message: `Synchronized ${result.result?.count || 0} items from ${result.providerId}`,
    data: result,
  });
});

export const configureDataSource = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const result = await dataSourceService.saveConfig(provider, req.body);
  res.status(200).json({
    success: true,
    message: `Configuration saved and connection tested for ${provider}`,
    data: result,
  });
});

export const disconnectDataSource = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const result = await dataSourceService.disconnectSource(provider);
  res.status(200).json({
    success: true,
    message: `Disconnected ${provider}`,
    data: { source: result },
  });
});
