import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

router.get('/stats', dashboardController.getStats);
router.get('/recent-scripts', dashboardController.getRecentScripts);
router.get('/status', dashboardController.getSystemStatus);

export default router;
