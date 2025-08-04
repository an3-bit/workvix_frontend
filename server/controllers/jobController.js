import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, category, budget, min_budget, max_budget, deadline, skills_required } = req.body;
    const clientId = req.user.userId;

    // Validate required fields
    if (!title || !description || !category || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and budget are required'
      });
    }

    // Validate budget
    if (isNaN(budget) || budget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a positive number'
      });
    }

    // Validate budget range
    if (min_budget && max_budget && min_budget > max_budget) {
      return res.status(400).json({
        success: false,
        message: 'Minimum budget cannot be greater than maximum budget'
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const jobId = uuidv4();
      
      await connection.execute(
        `INSERT INTO jobs (id, client_id, title, description, category, budget, 
                          min_budget, max_budget, deadline, skills_required) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          jobId,
          clientId,
          title,
          description,
          category,
          budget,
          min_budget || null,
          max_budget || null,
          deadline || null,
          skills_required ? JSON.stringify(skills_required) : null
        ]
      );

      // Get the created job
      const [jobs] = await connection.execute(
        `SELECT j.*, u.name as client_name, u.email as client_email
         FROM jobs j
         JOIN users u ON j.client_id = u.id
         WHERE j.id = ?`,
        [jobId]
      );

      const job = jobs[0];

      // Parse JSON fields
      if (job.skills_required) {
        job.skills_required = JSON.parse(job.skills_required);
      }

      logger.info(`Job created: ${jobId} by user: ${clientId}`);

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all jobs with filters
export const getAllJobs = async (req, res) => {
  try {
    const {
      status = 'open',
      category,
      min_budget,
      max_budget,
      client_id,
      freelancer_id,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      let query = `
        SELECT j.*, u.name as client_name, u.email as client_email,
               COUNT(b.id) as bid_count
        FROM jobs j
        JOIN users u ON j.client_id = u.id
        LEFT JOIN bids b ON j.id = b.job_id
      `;

      const whereConditions = [];
      const queryParams = [];

      // Add filters
      if (status) {
        whereConditions.push('j.status = ?');
        queryParams.push(status);
      }

      if (category) {
        whereConditions.push('j.category = ?');
        queryParams.push(category);
      }

      if (min_budget) {
        whereConditions.push('j.budget >= ?');
        queryParams.push(min_budget);
      }

      if (max_budget) {
        whereConditions.push('j.budget <= ?');
        queryParams.push(max_budget);
      }

      if (client_id) {
        whereConditions.push('j.client_id = ?');
        queryParams.push(client_id);
      }

      if (search) {
        whereConditions.push('(j.title LIKE ? OR j.description LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`);
      }

      // If freelancer_id is provided, exclude jobs they've already bid on
      if (freelancer_id) {
        query += ` LEFT JOIN bids fb ON j.id = fb.job_id AND fb.freelancer_id = ?`;
        queryParams.push(freelancer_id);
        whereConditions.push('fb.id IS NULL');
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ` GROUP BY j.id ORDER BY j.created_at DESC LIMIT ? OFFSET ?`;
      queryParams.push(parseInt(limit), offset);

      const [jobs] = await connection.execute(query, queryParams);

      // Parse JSON fields and add bid info
      const processedJobs = jobs.map(job => {
        if (job.skills_required) {
          job.skills_required = JSON.parse(job.skills_required);
        }
        return job;
      });

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(DISTINCT j.id) as total
        FROM jobs j
      `;

      if (freelancer_id) {
        countQuery += ` LEFT JOIN bids fb ON j.id = fb.job_id AND fb.freelancer_id = ?`;
      }

      if (whereConditions.length > 0) {
        countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      const [countResult] = await connection.execute(countQuery, queryParams.slice(0, -2));
      const totalJobs = countResult[0].total;

      res.json({
        success: true,
        data: processedJobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalJobs,
          pages: Math.ceil(totalJobs / limit)
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [jobs] = await connection.execute(
        `SELECT j.*, u.name as client_name, u.email as client_email,
                u.avatar_url as client_avatar, u.rating as client_rating,
                COUNT(b.id) as bid_count
         FROM jobs j
         JOIN users u ON j.client_id = u.id
         LEFT JOIN bids b ON j.id = b.job_id
         WHERE j.id = ?
         GROUP BY j.id`,
        [id]
      );

      if (jobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const job = jobs[0];

      // Parse JSON fields
      if (job.skills_required) {
        job.skills_required = JSON.parse(job.skills_required);
      }

      res.json({
        success: true,
        data: job
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, budget, min_budget, max_budget, deadline, skills_required, status } = req.body;
    const clientId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if job exists and belongs to user
      const [existingJobs] = await connection.execute(
        'SELECT id, status FROM jobs WHERE id = ? AND client_id = ?',
        [id, clientId]
      );

      if (existingJobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job not found or you do not have permission to update it'
        });
      }

      const existingJob = existingJobs[0];

      // Prevent updates if job is in progress or completed
      if (existingJob.status === 'in_progress' || existingJob.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update job that is in progress or completed'
        });
      }

      // Build update query dynamically
      const updateFields = [];
      const updateValues = [];

      if (title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }

      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }

      if (category !== undefined) {
        updateFields.push('category = ?');
        updateValues.push(category);
      }

      if (budget !== undefined) {
        updateFields.push('budget = ?');
        updateValues.push(budget);
      }

      if (min_budget !== undefined) {
        updateFields.push('min_budget = ?');
        updateValues.push(min_budget);
      }

      if (max_budget !== undefined) {
        updateFields.push('max_budget = ?');
        updateValues.push(max_budget);
      }

      if (deadline !== undefined) {
        updateFields.push('deadline = ?');
        updateValues.push(deadline);
      }

      if (skills_required !== undefined) {
        updateFields.push('skills_required = ?');
        updateValues.push(JSON.stringify(skills_required));
      }

      if (status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(status);
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
        `UPDATE jobs SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Get updated job
      const [updatedJobs] = await connection.execute(
        `SELECT j.*, u.name as client_name, u.email as client_email
         FROM jobs j
         JOIN users u ON j.client_id = u.id
         WHERE j.id = ?`,
        [id]
      );

      const updatedJob = updatedJobs[0];

      // Parse JSON fields
      if (updatedJob.skills_required) {
        updatedJob.skills_required = JSON.parse(updatedJob.skills_required);
      }

      logger.info(`Job updated: ${id} by user: ${clientId}`);

      res.json({
        success: true,
        message: 'Job updated successfully',
        data: updatedJob
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.userId;

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if job exists and belongs to user
      const [existingJobs] = await connection.execute(
        'SELECT id, status FROM jobs WHERE id = ? AND client_id = ?',
        [id, clientId]
      );

      if (existingJobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job not found or you do not have permission to delete it'
        });
      }

      const existingJob = existingJobs[0];

      // Prevent deletion if job has bids or is in progress
      if (existingJob.status === 'in_progress' || existingJob.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete job that is in progress or completed'
        });
      }

      // Check if job has bids
      const [bids] = await connection.execute(
        'SELECT COUNT(*) as bid_count FROM bids WHERE job_id = ?',
        [id]
      );

      if (bids[0].bid_count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete job that has bids. Consider cancelling instead.'
        });
      }

      // Delete job
      await connection.execute('DELETE FROM jobs WHERE id = ?', [id]);

      logger.info(`Job deleted: ${id} by user: ${clientId}`);

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get job categories
export const getJobCategories = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [categories] = await connection.execute(
        'SELECT DISTINCT category, COUNT(*) as job_count FROM jobs WHERE status = "open" GROUP BY category ORDER BY job_count DESC'
      );

      res.json({
        success: true,
        data: categories
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get job categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get jobs statistics
export const getJobStats = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open_jobs,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_jobs,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
          AVG(budget) as avg_budget,
          SUM(budget) as total_budget
        FROM jobs
      `);

      res.json({
        success: true,
        data: stats[0]
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    logger.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 