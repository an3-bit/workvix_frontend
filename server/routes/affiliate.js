import express from 'express';

const router = express.Router();

// Get affiliate dashboard
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Get affiliate dashboard' });
});

// Get commission summary
router.get('/commissions', (req, res) => {
  res.json({ message: 'Get commission summary' });
});

// Get referral links
router.get('/referrals', (req, res) => {
  res.json({ message: 'Get referral links' });
});

export default router; 