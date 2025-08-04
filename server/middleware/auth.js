import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is a refresh token
      if (decoded.type === 'refresh') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type. Access token required.'
        });
      }

      // Get user from database
      const pool = getPool();
    const connection = await pool.getConnection();
      
      try {
        const [users] = await connection.execute(
          'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
          [decoded.userId]
        );

        if (users.length === 0) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
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

        // Add user info to request
        req.user = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };

        next();

      } finally {
        connection.release();
      }

    } catch (jwtError) {
      logger.error('JWT verification failed:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Optional auth - doesn't fail if no token provided
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // No token provided, continue without user info
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is a refresh token
      if (decoded.type === 'refresh') {
        req.user = null;
        return next();
      }

      // Get user from database
      const pool = getPool();
    const connection = await pool.getConnection();
      
      try {
        const [users] = await connection.execute(
          'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
          [decoded.userId]
        );

        if (users.length === 0 || !users[0].is_active) {
          req.user = null;
          return next();
        }

        const user = users[0];

        // Add user info to request
        req.user = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };

        next();

      } finally {
        connection.release();
      }

    } catch (jwtError) {
      // Invalid token, continue without user info
      req.user = null;
      next();
    }

  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if user owns the resource
export const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.'
        });
      }

      const resourceId = req.params.id || req.params.jobId || req.params.bidId;
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      const pool = getPool();
    const connection = await pool.getConnection();
      
      try {
        let query;
        let ownerField;

        switch (resourceType) {
          case 'job':
            query = 'SELECT client_id FROM jobs WHERE id = ?';
            ownerField = 'client_id';
            break;
          case 'bid':
            query = 'SELECT freelancer_id FROM bids WHERE id = ?';
            ownerField = 'freelancer_id';
            break;
          case 'order':
            query = 'SELECT client_id, freelancer_id FROM orders WHERE id = ?';
            ownerField = ['client_id', 'freelancer_id'];
            break;
          default:
            return res.status(400).json({
              success: false,
              message: 'Invalid resource type'
            });
        }

        const [resources] = await connection.execute(query, [resourceId]);

        if (resources.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Resource not found'
          });
        }

        const resource = resources[0];

        // Check if user owns the resource
        let hasAccess = false;

        if (Array.isArray(ownerField)) {
          // For resources that can be owned by multiple user types (like orders)
          hasAccess = ownerField.some(field => resource[field] === req.user.userId);
        } else {
          hasAccess = resource[ownerField] === req.user.userId;
        }

        // Admin can access all resources
        if (req.user.role === 'admin') {
          hasAccess = true;
        }

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You do not own this resource.'
          });
        }

        next();

      } finally {
        connection.release();
      }

    } catch (error) {
      logger.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}; 