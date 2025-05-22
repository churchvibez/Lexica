import express from 'express';
import { pool } from '../config/database';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, xp FROM users ORDER BY xp DESC'
    );
    res.json({ success: true, users: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
});

router.get('/profile', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT id, username, modules_completed, tests_completed, completed_A_modules, completed_B_modules, completed_C_modules, completed_A_tests, completed_B_tests, completed_C_tests, xp FROM users WHERE username = ?',
      [username]
    );
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: (rows as any[])[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});

export default router; 