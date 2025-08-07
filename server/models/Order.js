import pool from '../config/database.js';

class Order {
  static async create({ job_id, client_id, freelancer_id, status = 'active', total_amount }) {
    const [result] = await pool.query(
      'INSERT INTO orders (job_id, client_id, freelancer_id, status, total_amount) VALUES (?, ?, ?, ?, ?)',
      [job_id, client_id, freelancer_id, status, total_amount]
    );
    return { id: result.insertId, job_id, client_id, freelancer_id, status, total_amount };
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM orders');
    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    await pool.query(`UPDATE orders SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    return true;
  }
}

export default Order; 