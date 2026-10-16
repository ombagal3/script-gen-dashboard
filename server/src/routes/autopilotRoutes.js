import express from 'express';
import * as autopilotController from '../controllers/autopilotController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

// Autopilot execution & jobs
router.post('/scan', autopilotController.runAutopilotScan);
router.get('/jobs', autopilotController.getJobHistory);

// Production briefs & status workflow
router.get('/briefs', autopilotController.getDailyBriefs);
router.get('/briefs/:id', autopilotController.getBriefById);
router.patch('/briefs/:id/status', autopilotController.updateBriefStatus);
router.patch('/briefs/:id', autopilotController.updateBrief);

export default router;
