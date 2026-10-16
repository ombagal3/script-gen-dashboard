import express from 'express';
import * as methodController from '../controllers/methodController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createMethodSchema, updateMethodSchema } from '../validators/methodValidator.js';

const router = express.Router();

router.use(optionalAuth);

router.get('/', methodController.getMethods);
router.post('/', validate(createMethodSchema), methodController.createMethod);
router.get('/:id', methodController.getMethodById);
router.patch('/:id', validate(updateMethodSchema), methodController.updateMethod);
router.delete('/:id', methodController.deleteMethod);

export default router;
