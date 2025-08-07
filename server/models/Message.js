import pool from '../config/database.js';

class Message {
  static async create({ chat_id, sender_id, content, file_url }) {
    const [result] = await pool.query(
      'INSERT INTO messages (chat_id, sender_id, content, file_url) VALUES (?, ?, ?, ?)',
      [chat_id, sender_id, content, file_url]
    );
    return { id: result.insertId, chat_id, sender_id, content, file_url };
  }

  static async findByChat(chat_id) {
    const [rows] = await pool.query('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC', [chat_id]);
    return rows;
  }

  static async delete(id) {
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    return true;
  }
}

export default Message; 