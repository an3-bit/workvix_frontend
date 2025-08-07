import pool from '../config/database.js';

class Review {
  static async create({ order_id, reviewer_id, reviewee_id, rating, comment }) {
    const [result] = await pool.query(
      'INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [order_id, reviewer_id, reviewee_id, rating, comment]
    );
    return { id: result.insertId, order_id, reviewer_id, reviewee_id, rating, comment };
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByReviewee(reviewee_id) {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE reviewee_id = ?', [reviewee_id]);
    return rows;
  }

  static async findByOrder(order_id) {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE order_id = ?', [order_id]);
    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    await pool.query(`UPDATE reviews SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return true;
  }
}

export default Review; 