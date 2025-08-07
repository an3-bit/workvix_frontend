import pool from '../config/database.js';

class Bid {
  static async create({ job_id, freelancer_id, amount, message, status = 'pending' }) {
    const [result] = await pool.query(
      'INSERT INTO bids (job_id, freelancer_id, amount, message, status) VALUES (?, ?, ?, ?, ?)',
      [job_id, freelancer_id, amount, message, status]
    );
    return { id: result.insertId, job_id, freelancer_id, amount, message, status };
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM bids WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByJob(job_id) {
    const [rows] = await pool.query('SELECT * FROM bids WHERE job_id = ?', [job_id]);
    return rows;
  }

  static async findByFreelancer(freelancer_id) {
    const [rows] = await pool.query('SELECT * FROM bids WHERE freelancer_id = ?', [freelancer_id]);
    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    await pool.query(`UPDATE bids SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM bids WHERE id = ?', [id]);
    return true;
  }
}

export default Bid; 