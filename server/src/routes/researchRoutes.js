import express from 'express';
import * as trendResearchController from '../controllers/trendResearchController.js';
import * as trendController from '../controllers/trendController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { researchTrendsSchema } from '../validators/trendValidator.js';

const router = express.Router();

router.use(optionalAuth);

// Research execution
router.post('/run', validate(researchTrendsSchema), trendResearchController.executeResearch);

// Research Jobs History
router.get('/jobs', trendResearchController.getResearchHistory);
router.get('/jobs/:id', trendResearchController.getResearchById);

// Trends discovered through research
router.get('/trends', trendController.getTrends);
router.get('/trends/:id', trendController.getTrendById);
router.post('/trends/:id/analyze', trendController.analyzeTrend);

export default router;
