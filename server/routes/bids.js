import express from 'express';
import Bid from '../models/Bid.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Create bid (freelancer or admin)
router.post('/', auth, role(['freelancer', 'admin']), async (req, res) => {
  try {
    const { job_id, amount, message } = req.body;
    const bid = await Bid.create({
      job_id,
      freelancer_id: req.user.id,
      amount,
      message
    });
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get bids for a job
router.get('/job/:job_id', async (req, res) => {
  try {
    const bids = await Bid.findByJob(req.params.job_id);
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get bids by freelancer
router.get('/freelancer/:freelancer_id', async (req, res) => {
  try {
    const bids = await Bid.findByFreelancer(req.params.freelancer_id);
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update bid (freelancer or admin)
router.put('/:id', auth, role(['freelancer', 'admin']), async (req, res) => {
  try {
    const bid = await Bid.update(req.params.id, req.body);
    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete bid (freelancer or admin)
router.delete('/:id', auth, role(['freelancer', 'admin']), async (req, res) => {
  try {
    await Bid.delete(req.params.id);
    res.json({ message: 'Bid deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 