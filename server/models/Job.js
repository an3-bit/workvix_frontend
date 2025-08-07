import pool from '../config/database.js';

class Job {
  static async create({ client_id, title, description, budget, status = 'open' }) {
    const [result] = await pool.query(
      'INSERT INTO jobs (client_id, title, description, budget, status) VALUES (?, ?, ?, ?, ?)',
      [client_id, title, description, budget, status]
    );
    return { id: result.insertId, client_id, title, description, budget, status };
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM jobs');
    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    await pool.query(`UPDATE jobs SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    return true;
  }
}

export default Job; 