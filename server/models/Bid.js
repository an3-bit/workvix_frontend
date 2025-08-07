import pool from '../config/database.js';

class Bid {
  static async create({ job_id, freelancer_id, amount, message, status = 'pending' }) {
    const [result] = await pool.query(
      'INSERT INTO bids (job_id, freelancer_id, amount, message, status, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [job_id, freelancer_id, amount, message, status]
    );
 return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT 
        b.*,
        f.user_id AS freelancer_user_id, f.username AS freelancer_username, f.email AS freelancer_email,
        j.title AS job_title, j.description AS job_description, j.budget AS job_budget
      FROM bids b
      JOIN users f ON b.freelancer_id = f.id
      JOIN jobs j ON b.job_id = j.id
      WHERE b.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByJob(job_id) {
    const [rows] = await pool.query(`
      SELECT 
        b.*,
        f.user_id AS freelancer_user_id, f.username AS freelancer_username, f.email AS freelancer_email
      FROM bids b
      JOIN users f ON b.freelancer_id = f.id
      WHERE b.job_id = ?
    `, [job_id]);
    return rows;
  }

  static async findByFreelancer(freelancer_id) {
    const [rows] = await pool.query(`
      SELECT 
        b.*,
        j.title AS job_title, j.description AS job_description, j.budget AS job_budget
      FROM bids b
      JOIN jobs j ON b.job_id = j.id
      WHERE b.freelancer_id = ?
    `, [freelancer_id]);
    return rows;
  }

  static async delete(id) {
    await pool.query('DELETE FROM bids WHERE id = ?', [id]);
    return true;
  }
}

export default Bid; 