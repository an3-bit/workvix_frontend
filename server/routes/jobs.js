import express from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Create job (client or admin)
router.post('/', auth, role(['client', 'admin']), async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const job = await Job.create({
      client_id: req.user.id,
      title,
      description,
      budget
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get job by id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update job (client or admin)
router.put('/:id', auth, role(['client', 'admin']), async (req, res) => {
  try {
    const job = await Job.update(req.params.id, req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete job (client or admin)
router.delete('/:id', auth, role(['client', 'admin']), async (req, res) => {
  try {
    await Job.delete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 