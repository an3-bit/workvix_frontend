import pool from '../config/database.js';

class SupportTicket {
  static async create({ user_id, subject, status = 'open' }) {
    const [result] = await pool.query(
      'INSERT INTO support_tickets (user_id, subject, status) VALUES (?, ?, ?)',
      [user_id, subject, status]
    );
    return { id: result.insertId, user_id, subject, status };
  }

  static async findByUser(user_id) {
    const [rows] = await pool.query('SELECT * FROM support_tickets WHERE user_id = ?', [user_id]);
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM support_tickets');
    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    await pool.query(`UPDATE support_tickets SET ${fields} WHERE id = ?`, values);
    return true;
  }
}

export default SupportTicket; 