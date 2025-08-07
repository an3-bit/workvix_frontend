import pool from '../config/database.js';

class Payment {
  static async create({ order_id, payer_id, payee_id, amount, status = 'pending' }) {
    const [result] = await pool.query(
      'INSERT INTO payments (order_id, payer_id, payee_id, amount, status) VALUES (?, ?, ?, ?, ?)',
      [order_id, payer_id, payee_id, amount, status]
    );
    return { id: result.insertId, order_id, payer_id, payee_id, amount, status };
  }

  static async findByOrder(order_id) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE order_id = ?', [order_id]);
    return rows;
  }

  static async findByUser(user_id) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE payer_id = ? OR payee_id = ?', [user_id, user_id]);
    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    await pool.query(`UPDATE payments SET ${fields} WHERE id = ?`, values);
    return true;
  }
}

export default Payment; 