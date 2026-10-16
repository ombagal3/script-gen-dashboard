import express from 'express';
import * as trendController from '../controllers/trendController.js';
import * as trendResearchController from '../controllers/trendResearchController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  researchTrendsSchema,
  importTrendSchema,
  updateTrendSchema,
} from '../validators/trendValidator.js';

const router = express.Router();

router.use(optionalAuth);

// Overview KPIs
router.get('/kpis', trendController.getTrendKPIs);

// Source Connection Statuses
router.get('/sources/status', trendController.getSourceStatuses);

// Research execution & history
router.post('/research', validate(researchTrendsSchema), trendResearchController.executeResearch);
router.get('/research-history', trendResearchController.getResearchHistory);

// Manual Import
router.post('/import', validate(importTrendSchema), trendController.importTrend);

// Trends List & Detail
router.get('/', trendController.getTrends);
router.get('/:id', trendController.getTrendById);
router.post('/:id/analyze', trendController.analyzeTrend);
router.post('/:id/toggle-save', trendController.toggleSaveTrend);
router.delete('/:id', trendController.deleteTrend);

export default router;
