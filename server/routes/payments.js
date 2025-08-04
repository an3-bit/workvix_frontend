import express from 'express';

const router = express.Router();

// Get payment history
router.get('/', (req, res) => {
  res.json({ message: 'Get payment history' });
});

// Process payment
router.post('/process', (req, res) => {
  res.json({ message: 'Process payment' });
});

// Get payment details
router.get('/:id', (req, res) => {
  res.json({ message: 'Get payment details' });
});

export default router; 