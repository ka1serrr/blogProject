import Router from 'express';
import { authController } from '../controllers/authController.js';
import { loginValidation, regValidation } from '../validations/authValidation.js';
import { authMiddleware, validationCheckMiddleware } from '../middleware/index.js';

export const router = new Router();
router.post('/registration', regValidation, validationCheckMiddleware, authController.registration);
router.post('/login', loginValidation, validationCheckMiddleware, authController.login);
router.get('/profile/me', authMiddleware, authController.getProfile);
router.get('/profile/:id', authController.getProfileUnLogged);
