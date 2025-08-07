import express from 'express';
import AffiliateMarketer from '../models/AffiliateMarketer.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Get all affiliate marketers with profiles (admin only)
router.get('/', auth, role(['admin']), async (req, res) => {
  try {
    const affiliates = await AffiliateMarketer.findAllWithProfiles();
    res.json(affiliates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get affiliate marketer by id
router.get('/:id', auth, async (req, res) => {
  try {
    const affiliate = await AffiliateMarketer.findById(req.params.id);
    if (!affiliate) return res.status(404).json({ message: 'Affiliate marketer not found' });
    res.json(affiliate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 