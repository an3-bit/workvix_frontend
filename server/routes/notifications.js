import express from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create notification
router.post('/', auth, async (req, res) => {
  try {
    const { type, content } = req.body;
    const notification = await Notification.create({ user_id: req.user.id, type, content });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get notifications by user
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.params.user_id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 