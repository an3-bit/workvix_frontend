import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  await AuthController.register(req, res);
});

// Login
router.post('/login', async (req, res) => {
  await AuthController.login(req, res);
});

export default router; 