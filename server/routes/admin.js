import express from 'express';

const router = express.Router();

// Get admin dashboard
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Get admin dashboard' });
});

// Get all users
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

// Get all jobs
router.get('/jobs', (req, res) => {
  res.json({ message: 'Get all jobs' });
});

// Get system stats
router.get('/stats', (req, res) => {
  res.json({ message: 'Get system stats' });
});

export default router; 