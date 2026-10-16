import express from 'express';
import * as trendResearchController from '../controllers/trendResearchController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { researchTrendsSchema } from '../validators/trendValidator.js';

const router = express.Router();

router.use(optionalAuth);

router.post('/', validate(researchTrendsSchema), trendResearchController.executeResearch);
router.get('/', trendResearchController.getResearchHistory);
router.get('/:id', trendResearchController.getResearchById);

export default router;
