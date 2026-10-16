import express from 'express';
import * as productAutoScriptController from '../controllers/productAutoScriptController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { scriptGenLimiter } from '../middleware/rateLimitMiddleware.js';
import {
  generateProductAutoScriptSchema,
  regenerateHookSchema,
  alternativeAngleSchema,
} from '../validators/productAutoScriptValidator.js';

const router = express.Router();

router.use(optionalAuth);

router.post(
  '/generate',
  scriptGenLimiter,
  validate(generateProductAutoScriptSchema),
  productAutoScriptController.generateProductAutoScript
);

router.get('/defaults', productAutoScriptController.getUserDefaults);
router.get('/history', productAutoScriptController.getHistory);
router.get('/:id', productAutoScriptController.getById);

router.post(
  '/regenerate-hook',
  scriptGenLimiter,
  validate(regenerateHookSchema),
  productAutoScriptController.regenerateHook
);

router.post(
  '/alternative-angle',
  scriptGenLimiter,
  validate(alternativeAngleSchema),
  productAutoScriptController.generateAlternativeAngle
);

export default router;
