import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Create order (client, freelancer, or admin)
router.post('/', auth, role(['client', 'freelancer', 'admin']), async (req, res) => {
  try {
    const { job_id, client_id, freelancer_id, total_amount } = req.body;
    const order = await Order.create({ job_id, client_id, freelancer_id, total_amount });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders
router.get('/', auth, role(['admin']), async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get order by id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order (client, freelancer, or admin)
router.put('/:id', auth, role(['client', 'freelancer', 'admin']), async (req, res) => {
  try {
    const order = await Order.update(req.params.id, req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete order (admin only)
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Order.delete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 