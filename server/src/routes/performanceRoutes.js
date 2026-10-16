import express from 'express';
import * as performanceController from '../controllers/performanceController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

// Performance feedback routes
router.post('/:briefId', performanceController.logPerformance);
router.get('/summary', performanceController.getPerformanceSummary);

export default router;
