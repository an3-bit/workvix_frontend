import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Create support ticket
router.post('/', auth, async (req, res) => {
  try {
    const { subject } = req.body;
    const ticket = await SupportTicket.create({ user_id: req.user.id, subject });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get tickets by user
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.findByUser(req.params.user_id);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all tickets (admin only)
router.get('/', auth, role(['admin']), async (req, res) => {
  try {
    const tickets = await SupportTicket.findAll();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update ticket
router.put('/:id', auth, async (req, res) => {
  try {
    await SupportTicket.update(req.params.id, req.body);
    res.json({ message: 'Ticket updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 