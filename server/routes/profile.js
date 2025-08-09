import express from 'express';
import pool from '../config/database.js'; // Assuming pool is your database connection pool
import auth from '../middleware/auth.js';

const router = express.Router();

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         role,
         name
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Update current user's profile
router.put('/me', auth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { first_name, last_name, phone, ...profileData } = req.body;

    // Update users table for first_name, last_name, phone
    const [userUpdateResult] = await connection.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, phone = ? 
       WHERE id = ?`,
      [first_name, last_name, phone, userId]
    );

    // Check if a profile exists for the user
    const [existingProfiles] = await connection.query(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfiles.length > 0) {
      // Update existing profile
      if (Object.keys(profileData).length > 0) {
        const profileUpdateFields = Object.keys(profileData).map(key => `${key} = ?`).join(', ');
        const profileUpdateValues = Object.values(profileData);
        await connection.query(
          `UPDATE profiles SET ${profileUpdateFields} WHERE user_id = ?`,
          [...profileUpdateValues, userId]
        );
      }
    } else {
      // Insert new profile if it doesn't exist and there is profile data
      if (Object.keys(profileData).length > 0) {
        const profileInsertFields = ['user_id', ...Object.keys(profileData)].join(', ');
        const profileInsertPlaceholders = Array(Object.keys(profileData).length + 1).fill('?').join(', ');
        const profileInsertValues = [userId, ...Object.values(profileData)];
        await connection.query(
          `INSERT INTO profiles (${profileInsertFields}) VALUES (${profileInsertPlaceholders})`,
          profileInsertValues
        );
      }
    }

    await connection.commit();

    // Fetch the updated profile to return
    const [updatedRows] = await pool.query(
      `SELECT 
         u.id, 
         u.name, 
         u.email, 
         u.role, 
         u.phone, 
         u.first_name, 
         u.last_name,
         p.*
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (updatedRows.length === 0) {
      // Return user details without profile if no profile is linked after update
      const [userRows] = await pool.query(
        `SELECT 
           id, 
           name, 
           email, 
           role, 
           phone, 
           first_name, 
           last_name
         FROM users
         WHERE id = ?`,
        [req.user.id]
      );
      if (userRows.length > 0) {
        return res.json(userRows[0]);
      }
      return res.status(404).json({ message: 'User not found after update' });
    }


    res.json(updatedRows[0]);

  } catch (err) {
    await connection.rollback();
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
});


export default router;