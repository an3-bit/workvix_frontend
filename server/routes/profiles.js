import express from 'express';
import Profile from '../models/Profile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findByUserId(req.user.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update current user's profile
router.put('/me', auth, async (req, res) => {
  try {
    const updated = await Profile.update(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 