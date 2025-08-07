import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ name, email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (UUID(), ?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return { id: result.insertId || 'UUID generated', name, email, role };
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
}

export default User; 