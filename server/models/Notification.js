import pool from '../config/database.js';

class Notification {
  static async create({ user_id, type, content, read = false }) {
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, type, content, read) VALUES (?, ?, ?, ?)',
      [user_id, type, content, read]
    );
    return { id: result.insertId, user_id, type, content, read };
  }

  static async findByUser(user_id) {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ?', [user_id]);
    return rows;
  }

  static async markAsRead(id) {
    await pool.query('UPDATE notifications SET read = true WHERE id = ?', [id]);
    return true;
  }
}

export default Notification; 