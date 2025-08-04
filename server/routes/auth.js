import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

export default router; 