import pool from '../config/database.js';

class AffiliateMarketer {
  static async create({ user_id, email, first_name, last_name, phone, online = false }) {
    const [result] = await pool.query(
      'INSERT INTO affiliate_marketers (user_id, email, first_name, last_name, phone, online) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, email, first_name, last_name, phone, online]
    );
    return { id: result.insertId, user_id, email, first_name, last_name, phone, online };
  }

  static async findAllWithProfiles() {
    const [rows] = await pool.query(`
      SELECT am.*, p.bio, p.skills, p.hourly_rate, p.portfolio_links, p.avatar_url
      FROM affiliate_marketers am
      LEFT JOIN profiles p ON am.user_id = p.user_id
    `);
    return rows.map(row => ({
      ...row,
      skills: row.skills ? JSON.parse(row.skills) : [],
      portfolio_links: row.portfolio_links ? JSON.parse(row.portfolio_links) : []
    }));
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM affiliate_marketers WHERE id = ?', [id]);
    return rows[0];
  }
}

export default AffiliateMarketer; 