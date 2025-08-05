import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!['client', 'freelancer', 'affiliate_marketer'].includes(role)) {
      return res.status(400).json({ // Modified: Added 'affiliate_marketer' to valid roles
        success: false,
        message: 'Role must be either client or freelancer'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const userId = uuidv4();
      await connection.execute(
        `INSERT INTO users (id, name, email, password_hash, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, name, email, passwordHash, role]
      );

      // If the role is affiliate_marketer, insert into the affiliate_marketers table
      if (role === 'affiliate_marketer') {
        const { phone } = req.body;
        // Parse name into first and last name (similar to frontend logic)
        const [firstName, ...lastNameParts] = name.trim().split(' ');
        const lastName = lastNameParts.join(' ');

        // Insert into affiliate_marketers table
        await connection.execute(
          `INSERT INTO affiliate_marketers (id, email, first_name, last_name, phone, created_at, updated_at, online) 
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE)`,
          [userId, email, firstName, lastName, phone]
        );
        logger.info(`Affiliate marketer registered successfully: ${email}`);
      } else {
        // You might want to add similar checks and insertions for other roles here
        // For example, inserting into a 'clients' or 'freelancers' table if they exist
      }

      // Get user data (without password). Re-fetch to include potential additions from role-specific tables if needed later.
      // For now, fetching from 'users' as before.
      const [users] = await connection.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [userId]
      );

      // Generate tokens
      const token = generateToken(userId, role);
      const refreshToken = generateRefreshToken(userId);

      // Get user data (without password)
      // const [users] = await connection.execute(
      //   'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      //   [userId]
      // );

      const user = users[0];

      logger.info(`User registered successfully: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token,
          refreshToken
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Find user by email
      const [users] = await connection.execute(
        'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = users[0];

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate tokens
      const token = generateToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id);

      // Update last login (optional)
      await connection.execute(
        'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Remove password from response
      delete user.password_hash;

      logger.info(`User logged in successfully: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          refreshToken
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        `SELECT id, name, email, role, avatar_url, bio, skills, 
                hourly_rate, rating, total_earnings, completed_jobs, 
                is_verified, is_active, created_at, updated_at 
         FROM users WHERE id = ?`,
        [userId]
      );

      // TODO: If the user is an affiliate_marketer, fetch additional details
      // from the affiliate_marketers table and merge them with the user object.

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      // Parse JSON fields
      if (user.skills) {
        user.skills = JSON.parse(user.skills);
      }

      res.json({
        success: true,
        data: user
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if user still exists
      const [users] = await connection.execute(
        'SELECT id, role FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      const user = users[0];

      // Generate new tokens
      const newToken = generateToken(user.id, user.role);
      const newRefreshToken = generateRefreshToken(user.id);

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    logger.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout (optional - client-side token removal is usually sufficient)
export const logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    
    logger.info(`User logged out: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, name FROM users WHERE email = ? AND is_active = TRUE',
        [email]
      );

      if (users.length === 0) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: users[0].id, type: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Store reset token in database (optional)
      await connection.execute(
        'UPDATE users SET password_reset_token = ?, password_reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
        [resetToken, users[0].id]
      );

      // TODO: Send email with reset link
      // For now, just return the token (in production, send via email)
      
      logger.info(`Password reset requested for: ${email}`);

      res.json({
        success: true,
        message: 'Password reset link sent to your email',
        data: {
          resetToken // Remove this in production
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if token is still valid in database
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ? AND password_reset_token = ? AND password_reset_expires > NOW()',
        [decoded.userId, token]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await connection.execute(
        'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
        [passwordHash, decoded.userId]
      );

      logger.info(`Password reset successful for user: ${decoded.userId}`);

      res.json({
        success: true,
        message: 'Password reset successful'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 