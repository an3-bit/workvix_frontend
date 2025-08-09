import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { name, email, password, role, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.beginTransaction();

    // Insert user with optional phone
    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone || null]
    );

    await connection.commit();

    // Create token
    const token = jwt.sign(
      { 
        id: userResult.insertId,
        role,
        email,
        name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      user: {
        id: userResult.insertId,
        name,
        email,
        role,
        phone: phone || null
      },
      token
    });

  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get additional profile data for affiliate marketers
    let profileData = {};
    if (user.role === 'affiliate_marketer') {
      const [profiles] = await pool.query(
        'SELECT * FROM affiliate_profiles WHERE user_id = ?',
        [user.id]
      );
      if (profiles.length > 0) {
        profileData = profiles[0];
      }
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: {
        ...userWithoutPassword,
        ...profileData
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('session'); // Assuming your session cookie is named 'session'
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;