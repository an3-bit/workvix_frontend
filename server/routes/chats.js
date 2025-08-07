import express from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create chat
router.post('/', auth, async (req, res) => {
  try {
    const { user1_id, user2_id } = req.body;
    let chat = await Chat.findByUsers(user1_id, user2_id);
    if (!chat) {
      chat = await Chat.create({ user1_id, user2_id });
    }
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get chat by users
router.get('/between/:user1_id/:user2_id', auth, async (req, res) => {
  try {
    const chat = await Chat.findByUsers(req.params.user1_id, req.params.user2_id);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get messages for chat
router.get('/:chat_id/messages', auth, async (req, res) => {
  try {
    const messages = await Message.findByChat(req.params.chat_id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Send message
router.post('/:chat_id/messages', auth, async (req, res) => {
  try {
    const { content, file_url } = req.body;
    const message = await Message.create({
      chat_id: req.params.chat_id,
      sender_id: req.user.id,
      content,
      file_url
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 