import express from 'express';
import * as authController from '../controllers/authController.js';
import { createRateLimiter } from '../middleware/rateLimit.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', createRateLimiter('register', 3, 60), authController.register);
router.post('/verify-email', createRateLimiter('verify', 5, 15), authController.verifyEmail);
router.post('/resend-code', createRateLimiter('resend', 3, 60), authController.resendCode);
router.post('/login', createRateLimiter('login', 5, 15), authController.login);
router.post('/forgot-password', createRateLimiter('forgot', 3, 60), authController.forgotPassword);
router.post('/reset-password', createRateLimiter('reset', 5, 15), authController.resetPassword);

// Protected routes (require authentication)
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;
