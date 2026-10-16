import express from 'express';
import * as scriptController from '../controllers/scriptController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { scriptGenLimiter } from '../middleware/rateLimitMiddleware.js';
import {
  generateScriptSchema,
  regenerateSectionSchema,
  createScriptSchema,
  updateScriptSchema,
} from '../validators/scriptValidator.js';

const router = express.Router();

router.use(optionalAuth);

// Core Generation endpoints
router.post('/generate', scriptGenLimiter, validate(generateScriptSchema), scriptController.generateScript);
router.post('/generate-variation', scriptGenLimiter, scriptController.generateVariation);
router.post('/generate-from-trends', scriptGenLimiter, scriptController.generateFromTrends);
router.post('/regenerate-section', scriptGenLimiter, validate(regenerateSectionSchema), scriptController.regenerateSection);

// CRUD Script endpoints
router.get('/', scriptController.getScripts);
router.post('/', validate(createScriptSchema), scriptController.createScript);
router.get('/:id', scriptController.getScriptById);
router.patch('/:id', validate(updateScriptSchema), scriptController.updateScript);
router.delete('/:id', scriptController.deleteScript);
router.post('/:id/duplicate', scriptController.duplicateScript);

export default router;
