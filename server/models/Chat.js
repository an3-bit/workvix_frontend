import pool from '../config/database.js';

class Chat {
  static async create({ user1_id, user2_id }) {
    const [result] = await pool.query(
      'INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)',
      [user1_id, user2_id]
    );
    return { id: result.insertId, user1_id, user2_id };
  }

  static async findByUsers(user1_id, user2_id) {
    const [rows] = await pool.query(
      'SELECT * FROM chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [user1_id, user2_id, user2_id, user1_id]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM chats WHERE id = ?', [id]);
    return rows[0];
  }
}

export default Chat; 