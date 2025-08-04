import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

// Update user profile
router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile' });
});

// Get user dashboard
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Get user dashboard' });
});

export default router; 