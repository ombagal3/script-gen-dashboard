import express from 'express';
import * as contentStrategyController from '../controllers/contentStrategyController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

// Content Strategy Profile routes
router.get('/', contentStrategyController.getAllStrategies);
router.get('/active', contentStrategyController.getActiveStrategy);
router.post('/', contentStrategyController.createStrategy);
router.patch('/:id', contentStrategyController.updateStrategy);
router.post('/:id/set-active', contentStrategyController.setActiveStrategy);
router.delete('/:id', contentStrategyController.deleteStrategy);

export default router;
