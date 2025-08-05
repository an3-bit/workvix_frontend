import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Create a new bid
export const createBid = async (req, res) => {
  try {
    const { job_id, amount, proposal, delivery_time } = req.body;
    const freelancerId = req.user.userId;

    // Validate required fields
    if (!job_id || !amount || !proposal || !delivery_time) {
      return res.status(400).json({
        success: false,
        message: 'Job ID, amount, proposal, and delivery time are required'
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Validate delivery time
    if (isNaN(delivery_time) || delivery_time <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Delivery time must be a positive number'
      });
    }


    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if job exists and is open
      const [jobs] = await connection.execute(
        'SELECT id, client_id, budget, status FROM jobs WHERE id = ?',
        [job_id]
      );

      if (jobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const job = jobs[0];

      if (job.status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Job is not open for bidding'
        });
      }

      // Check if freelancer is not the job owner
      if (job.client_id === freelancerId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot bid on your own job'
        });
      }

      // Check if freelancer has already bid on this job
      const [existingBids] = await connection.execute(
        'SELECT id FROM bids WHERE job_id = ? AND freelancer_id = ?',
        [job_id, freelancerId]
      );

      if (existingBids.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'You have already bid on this job'
        });
      }

      // Create bid
      const bidId = uuidv4();
      await connection.execute(
        `INSERT INTO bids (id, job_id, freelancer_id, amount, proposal, delivery_time) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [bidId, job_id, freelancerId, amount, proposal, delivery_time]
      );

      // Get the created bid with job and freelancer details
      const [bids] = await connection.execute(
        `SELECT b.*, j.title as job_title, j.budget as job_budget, j.category as job_category,
                u.name as freelancer_name, u.email as freelancer_email, u.avatar_url as freelancer_avatar
         FROM bids b
         JOIN jobs j ON b.job_id = j.id
         JOIN users u ON b.freelancer_id = u.id
         WHERE b.id = ?`,
        [bidId]
      );

      const bid = bids[0];

      logger.info(`Bid created: ${bidId} for job: ${job_id} by freelancer: ${freelancerId}`);

      res.status(201).json({
        success: true,
        message: 'Bid submitted successfully',
        data: bid
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Create bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all bids with filters
export const getAllBids = async (req, res) => {
  try {
    const {
      job_id,
      freelancer_id,
      client_id,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
  
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      let query = `
        SELECT b.*, j.title as job_title, j.budget as job_budget, j.category as job_category,
               j.status as job_status, j.client_id,
               u.name as freelancer_name, u.email as freelancer_email, u.avatar_url as freelancer_avatar,
               u.rating as freelancer_rating, u.completed_jobs as freelancer_completed_jobs
        FROM bids b
        JOIN jobs j ON b.job_id = j.id
        JOIN users u ON b.freelancer_id = u.id
      `;

      const whereConditions = [];
      const queryParams = [];

      // Add filters
      if (job_id) {
        whereConditions.push('b.job_id = ?');
        queryParams.push(job_id);
      }

      if (freelancer_id) {
        whereConditions.push('b.freelancer_id = ?');
        queryParams.push(freelancer_id);
      }

      if (client_id) {
        whereConditions.push('j.client_id = ?');
        queryParams.push(client_id);
      }

      if (status) {
        whereConditions.push('b.status = ?');
        queryParams.push(status);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
      queryParams.push(parseInt(limit), offset);

      const [bids] = await connection.execute(query, queryParams);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM bids b
        JOIN jobs j ON b.job_id = j.id
      `;

      if (whereConditions.length > 0) {
        countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      const [countResult] = await connection.execute(countQuery, queryParams.slice(0, -2));
      const totalBids = countResult[0].total;

      res.json({
        success: true,
        data: bids,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalBids,
          pages: Math.ceil(totalBids / limit)
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get all bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get bid by ID
export const getBidById = async (req, res) => {
  try {
    const { id } = req.params;
 
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [bids] = await connection.execute(
        `SELECT b.*, j.title as job_title, j.budget as job_budget, j.category as job_category,
                j.status as job_status, j.client_id, j.description as job_description,
                u.name as freelancer_name, u.email as freelancer_email, u.avatar_url as freelancer_avatar,
                u.rating as freelancer_rating, u.completed_jobs as freelancer_completed_jobs,
                u.bio as freelancer_bio, u.skills as freelancer_skills
         FROM bids b
         JOIN jobs j ON b.job_id = j.id
         JOIN users u ON b.freelancer_id = u.id
         WHERE b.id = ?`,
        [id]
      );

      if (bids.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bid not found'
        });
      }

      const bid = bids[0];

      // Parse JSON fields
      if (bid.freelancer_skills) {
        bid.freelancer_skills = JSON.parse(bid.freelancer_skills);
      }

      res.json({
        success: true,
        data: bid
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get bid by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update bid
export const updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, proposal, delivery_time } = req.body;
    const freelancerId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if bid exists and belongs to user
      const [existingBids] = await connection.execute(
        'SELECT id, status, job_id FROM bids WHERE id = ? AND freelancer_id = ?',
        [id, freelancerId]
      );

      if (existingBids.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bid not found or you do not have permission to update it'
        });
      }

      const existingBid = existingBids[0];

      // Prevent updates if bid is accepted or rejected
      if (existingBid.status === 'accepted' || existingBid.status === 'rejected') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update bid that has been accepted or rejected'
        });
      }

      // Check if job is still open
      const [jobs] = await connection.execute(
        'SELECT status FROM jobs WHERE id = ?',
        [existingBid.job_id]
      );

      if (jobs.length === 0 || jobs[0].status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update bid for a job that is not open'
        });
      }

      // Build update query dynamically
      const updateFields = [];
      const updateValues = [];

      if (amount !== undefined) {
        if (isNaN(amount) || amount <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Amount must be a positive number'
          });
        }
        updateFields.push('amount = ?');
        updateValues.push(amount);
      }

      if (proposal !== undefined) {
        updateFields.push('proposal = ?');
        updateValues.push(proposal);
      }

      if (delivery_time !== undefined) {
        if (isNaN(delivery_time) || delivery_time <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Delivery time must be a positive number'
          });
        }
        updateFields.push('delivery_time = ?');
        updateValues.push(delivery_time);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await connection.execute(
        `UPDATE bids SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Get updated bid
      const [updatedBids] = await connection.execute(
        `SELECT b.*, j.title as job_title, j.budget as job_budget, j.category as job_category
         FROM bids b
         JOIN jobs j ON b.job_id = j.id
         WHERE b.id = ?`,
        [id]
      );

      const updatedBid = updatedBids[0];

      logger.info(`Bid updated: ${id} by freelancer: ${freelancerId}`);

      res.json({
        success: true,
        message: 'Bid updated successfully',
        data: updatedBid
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Update bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Accept bid (by client)
export const acceptBid = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if bid exists and job belongs to client
      const [bids] = await connection.execute(
        `SELECT b.*, j.client_id, j.status as job_status, j.title as job_title
         FROM bids b
         JOIN jobs j ON b.job_id = j.id
         WHERE b.id = ?`,
        [id]
      );

      if (bids.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bid not found'
        });
      }

      const bid = bids[0];

      // Check if client owns the job
      if (bid.client_id !== clientId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to accept this bid'
        });
      }

      // Check if job is open
      if (bid.job_status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Job is not open for accepting bids'
        });
      }

      // Check if bid is pending
      if (bid.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Bid is not in pending status'
        });
      }

      // Start transaction
      await connection.beginTransaction();

      try {
        // Update bid status to accepted
        await connection.execute(
          'UPDATE bids SET status = "accepted", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [id]
        );

        // Reject all other bids for this job
        await connection.execute(
          'UPDATE bids SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE job_id = ? AND id != ?',
          [bid.job_id, id]
        );

        // Update job status to in_progress
        await connection.execute(
          'UPDATE jobs SET status = "in_progress", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [bid.job_id]
        );

        // Create order
        const orderId = uuidv4();
        await connection.execute(
          `INSERT INTO orders (id, job_id, bid_id, client_id, freelancer_id, amount, status) 
           VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
          [orderId, bid.job_id, bid.id, bid.client_id, bid.freelancer_id, bid.amount]
        );

        await connection.commit();

        logger.info(`Bid accepted: ${id} by client: ${clientId}`);

        res.json({
          success: true,
          message: 'Bid accepted successfully',
          data: {
            bid_id: id,
            order_id: orderId,
            job_id: bid.job_id
          }
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      }

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Accept bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reject bid (by client)
export const rejectBid = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if bid exists and job belongs to client
      const [bids] = await connection.execute(
        `SELECT b.*, j.client_id, j.status as job_status
         FROM bids b
         JOIN jobs j ON b.job_id = j.id
         WHERE b.id = ?`,
        [id]
      );

      if (bids.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bid not found'
        });
      }

      const bid = bids[0];

      // Check if client owns the job
      if (bid.client_id !== clientId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to reject this bid'
        });
      }

      // Check if bid is pending
      if (bid.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Bid is not in pending status'
        });
      }

      // Update bid status to rejected
      await connection.execute(
        'UPDATE bids SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      logger.info(`Bid rejected: ${id} by client: ${clientId}`);

      res.json({
        success: true,
        message: 'Bid rejected successfully'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Reject bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Withdraw bid (by freelancer)
export const withdrawBid = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if bid exists and belongs to freelancer
      const [bids] = await connection.execute(
        'SELECT id, status FROM bids WHERE id = ? AND freelancer_id = ?',
        [id, freelancerId]
      );

      if (bids.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Bid not found or you do not have permission to withdraw it'
        });
      }

      const bid = bids[0];

      // Check if bid is pending
      if (bid.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot withdraw bid that is not in pending status'
        });
      }

      // Update bid status to withdrawn
      await connection.execute(
        'UPDATE bids SET status = "withdrawn", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      logger.info(`Bid withdrawn: ${id} by freelancer: ${freelancerId}`);

      res.json({
        success: true,
        message: 'Bid withdrawn successfully'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Withdraw bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get bid statistics
export const getBidStats = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_bids,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bids,
          COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_bids,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_bids,
          COUNT(CASE WHEN status = 'withdrawn' THEN 1 END) as withdrawn_bids,
          AVG(amount) as avg_bid_amount,
          MIN(amount) as min_bid_amount,
          MAX(amount) as max_bid_amount
        FROM bids
      `);

      res.json({
        success: true,
        data: stats[0]
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get bid stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 