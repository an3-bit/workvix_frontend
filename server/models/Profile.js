import pool from '../config/database.js';

class Profile {
  static async create({ user_id, first_name, last_name, bio, skills, hourly_rate, portfolio_links, avatar_url }) {
    const [result] = await pool.query(
      'INSERT INTO profiles (user_id, first_name, last_name, bio, skills, hourly_rate, portfolio_links, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, first_name, last_name, bio, JSON.stringify(skills), hourly_rate, JSON.stringify(portfolio_links), avatar_url]
    );
    return { id: result.insertId, user_id, first_name, last_name, bio, skills, hourly_rate, portfolio_links, avatar_url };
  }

  static async findByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [user_id]);
    if (rows[0]) {
      rows[0].skills = JSON.parse(rows[0].skills || '[]');
      rows[0].portfolio_links = JSON.parse(rows[0].portfolio_links || '[]');
    }
    return rows[0];
  }

  static async update(user_id, data) {
    if (data.skills) data.skills = JSON.stringify(data.skills);
    if (data.portfolio_links) data.portfolio_links = JSON.stringify(data.portfolio_links);
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(user_id);
    await pool.query(`UPDATE profiles SET ${fields} WHERE user_id = ?`, values);
    return this.findByUserId(user_id);
  }
}

export default Profile; 