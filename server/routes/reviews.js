import express from 'express';
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Create review (client, freelancer, or admin)
router.post('/', auth, role(['client', 'freelancer', 'admin']), async (req, res) => {
  try {
    const { order_id, reviewer_id, reviewee_id, rating, comment } = req.body;
    const review = await Review.create({ order_id, reviewer_id, reviewee_id, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get reviews for a user
router.get('/user/:reviewee_id', async (req, res) => {
  try {
    const reviews = await Review.findByReviewee(req.params.reviewee_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get reviews for an order
router.get('/order/:order_id', async (req, res) => {
  try {
    const reviews = await Review.findByOrder(req.params.order_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update review (admin only)
router.put('/:id', auth, role(['admin']), async (req, res) => {
  try {
    const review = await Review.update(req.params.id, req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete review (admin only)
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Review.delete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 