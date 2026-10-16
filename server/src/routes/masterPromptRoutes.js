import express from 'express';
import * as masterPromptController from '../controllers/masterPromptController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { scriptGenLimiter } from '../middleware/rateLimitMiddleware.js';
import {
  generateMasterPromptSchema,
  updateMasterPromptSchema,
} from '../validators/masterPromptValidator.js';

const router = express.Router();

router.use(optionalAuth);

router.post('/generate', scriptGenLimiter, validate(generateMasterPromptSchema), masterPromptController.generateMasterPrompt);
router.get('/', masterPromptController.getMasterPrompts);
router.get('/:id', masterPromptController.getMasterPromptById);
router.patch('/:id', validate(updateMasterPromptSchema), masterPromptController.updateMasterPrompt);
router.delete('/:id', masterPromptController.deleteMasterPrompt);
router.post('/:id/duplicate', masterPromptController.duplicateMasterPrompt);
router.post('/:id/generate-script', scriptGenLimiter, masterPromptController.generateScriptFromPrompt);

export default router;
