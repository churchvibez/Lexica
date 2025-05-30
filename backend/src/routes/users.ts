import express from 'express';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

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
      'SELECT id, username, modules_completed, tests_completed, xp, progress_A_modules, progress_B_modules, progress_C_modules, progress_A_tests, progress_B_tests, progress_C_tests FROM users WHERE username = ?',
      [username]
    );
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = (rows as any[])[0];

    // Get total modules and tests per level
    const [moduleCounts] = await pool.query('SELECT level_id, COUNT(*) as count FROM modules GROUP BY level_id');
    const [testCounts] = await pool.query('SELECT level_id, COUNT(*) as count FROM tests GROUP BY level_id');
    const moduleCountMap: Record<number, number> = {};
    const testCountMap: Record<number, number> = {};
    (moduleCounts as any[]).forEach((row: any) => { moduleCountMap[row.level_id] = row.count; });
    (testCounts as any[]).forEach((row: any) => { testCountMap[row.level_id] = row.count; });

    // Compute achievements
    user.completed_A_modules = user.progress_A_modules >= (moduleCountMap[1] || 0);
    user.completed_B_modules = user.progress_B_modules >= (moduleCountMap[2] || 0);
    user.completed_C_modules = user.progress_C_modules >= (moduleCountMap[3] || 0);
    user.completed_A_tests = user.progress_A_tests >= (testCountMap[1] || 0);
    user.completed_B_tests = user.progress_B_tests >= (testCountMap[2] || 0);
    user.completed_C_tests = user.progress_C_tests >= (testCountMap[3] || 0);

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});

router.post('/change-password', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  try {
    // Hash the password (if not already hashed)
    const isHashed = password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$');
    const hashedPassword = isHashed ? password : await bcrypt.hash(password, 10);
    const [result] = await pool.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

export default router; 