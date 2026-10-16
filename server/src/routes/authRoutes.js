import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema, updatePreferencesSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.patch('/preferences', authenticate, validate(updatePreferencesSchema), authController.updatePreferences);

export default router;
