import express from 'express';
import Payment from '../models/Payment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create payment
router.post('/', auth, async (req, res) => {
  try {
    const { order_id, payer_id, payee_id, amount } = req.body;
    const payment = await Payment.create({ order_id, payer_id, payee_id, amount });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get payments by order
router.get('/order/:order_id', auth, async (req, res) => {
  try {
    const payments = await Payment.findByOrder(req.params.order_id);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get payments by user
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const payments = await Payment.findByUser(req.params.user_id);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update payment
router.put('/:id', auth, async (req, res) => {
  try {
    await Payment.update(req.params.id, req.body);
    res.json({ message: 'Payment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 