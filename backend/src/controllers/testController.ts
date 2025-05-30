import { Request, Response } from 'express';
import { pool } from '../config/database';

export const testController = {
  async getAllTests(req: Request, res: Response) {
    try {
      // Fetch levels
      const [levelsRows] = await pool.query('SELECT * FROM module_levels ORDER BY display_order');
      const levels = levelsRows as any[];
      // Fetch all tests
      const [testsRows] = await pool.query('SELECT * FROM tests ORDER BY level_id, sequence');
      const tests = testsRows as any[];
      // Group tests by level
      const testsByLevel = levels.map(level => ({
        ...level,
        tests: tests.filter(test => test.level_id === level.id)
      }));
      // Fetch user progress
      const userId = req.user?.userId;
      let userProgress: Record<string, number> = {};
      if (userId) {
        const [userRows] = await pool.query('SELECT progress_A_tests, progress_B_tests, progress_C_tests FROM users WHERE id = ?', [userId]);
        userProgress = (userRows as any[])[0] || {};
      }
      res.json({ success: true, data: testsByLevel, userProgress });
    } catch (error) {
      console.error('Error fetching tests:', error);
      res.status(500).json({ success: false, message: 'Error fetching tests' });
    }
  },

  async getTestDetail(req: Request, res: Response) {
    try {
      const testId = parseInt(req.params.testId, 10);
      const userId = req.user?.userId;
      if (!testId) {
        return res.status(400).json({ success: false, message: 'Missing testId' });
      }
      // Get test info
      const [testRows] = await pool.query('SELECT * FROM tests WHERE id = ?', [testId]);
      const test = (testRows as any[])[0];
      if (!test) {
        return res.status(404).json({ success: false, message: 'Test not found' });
      }
      // Get user progress
      let userProgress: Record<string, number> = {};
      if (userId) {
        const [userRows] = await pool.query('SELECT progress_A_tests, progress_B_tests, progress_C_tests FROM users WHERE id = ?', [userId]);
        userProgress = (userRows as any[])[0] || {};
      }
      // Get total tests in this level
      const [levelTestRows] = await pool.query('SELECT COUNT(*) as count FROM tests WHERE level_id = ?', [test.level_id]);
      const totalTestsInLevel = (levelTestRows as any[])[0]?.count || 0;
      // Check if user is allowed to access this test
      let progressKey = '';
      if (test.level_id === 1) progressKey = 'progress_A_tests';
      else if (test.level_id === 2) progressKey = 'progress_B_tests';
      else if (test.level_id === 3) progressKey = 'progress_C_tests';
      const progress = userProgress[progressKey] || 0;
      // For first test in B1-B2 or C1-C2, require previous level fully completed
      if (test.sequence === 1 && test.level_id > 1) {
        let prevProgressKey = '';
        let prevLevelId = test.level_id - 1;
        if (prevLevelId === 1) prevProgressKey = 'progress_A_tests';
        else if (prevLevelId === 2) prevProgressKey = 'progress_B_tests';
        // Get total tests in previous level
        const [prevLevelTestRows] = await pool.query('SELECT COUNT(*) as count FROM tests WHERE level_id = ?', [prevLevelId]);
        const totalPrevLevelTests = (prevLevelTestRows as any[])[0]?.count || 0;
        const prevProgress = userProgress[prevProgressKey] || 0;
        if (prevProgress < totalPrevLevelTests) {
          return res.status(403).json({ success: false, message: 'Test not unlocked yet' });
        }
      } else {
        // For other tests, require progress >= sequence - 1
        if (progress < (test.sequence - 1)) {
          return res.status(403).json({ success: false, message: 'Test not unlocked yet' });
        }
      }
      // Get questions
      const [questionRows] = await pool.query('SELECT * FROM test_questions WHERE test_id = ?', [testId]);
      const questions = questionRows as any[];
      res.json({ success: true, data: { test, questions } });
    } catch (error) {
      console.error('Error fetching test detail:', error);
      res.status(500).json({ success: false, message: 'Error fetching test detail' });
    }
  },

  async completeTest(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const testId = parseInt(req.params.testId, 10);
      const { correctAnswers } = req.body;
      if (!userId || !testId || typeof correctAnswers !== 'number') {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      // Get test info
      const [testRows] = await pool.query('SELECT * FROM tests WHERE id = ?', [testId]);
      const test = (testRows as any[])[0];
      if (!test) {
        return res.status(404).json({ success: false, message: 'Test not found' });
      }
      // XP logic for tests
      let bonusXP = 0;
      if (test.level_id === 1) bonusXP = correctAnswers; // 1-5
      else if (test.level_id === 2) bonusXP = 9 + correctAnswers; // 10-14
      else if (test.level_id === 3) bonusXP = 19 + correctAnswers; // 20-24

      // Add XP to user
      await pool.query('UPDATE users SET xp = xp + ?, tests_completed = tests_completed + 1 WHERE id = ?', [bonusXP, userId]);

      // Check if user already completed this test
      const [progressRows] = await pool.query('SELECT * FROM user_test_progress WHERE user_id = ? AND test_id = ?', [userId, testId]);
      let firstCompletion = false;
      if ((progressRows as any[]).length === 0) {
        // Always record first completion
        await pool.query('INSERT INTO user_test_progress (user_id, test_id) VALUES (?, ?)', [userId, testId]);
        firstCompletion = true;
      }
      // Always check if progress should be incremented if 5/5 and progress is behind
      if (correctAnswers === 5) {
        let progressCol = '';
        if (test.level_id === 1) progressCol = 'progress_A_tests';
        else if (test.level_id === 2) progressCol = 'progress_B_tests';
        else if (test.level_id === 3) progressCol = 'progress_C_tests';
        if (progressCol) {
          // Get current progress (use COALESCE to default to 0)
          const [userRows] = await pool.query(`SELECT COALESCE(${progressCol}, 0) as progress FROM users WHERE id = ?`, [userId]);
          const currentProgress = (userRows as any[])[0]?.progress || 0;
          console.log(`DEBUG: test.sequence=${test.sequence}, currentProgress=${currentProgress}, progressCol=${progressCol}`);
          // For first test in B1-B2 or C1-C2, require previous level fully completed
          if (test.sequence === 1 && test.level_id > 1) {
            let prevProgressCol = '';
            let prevLevelId = test.level_id - 1;
            if (prevLevelId === 1) prevProgressCol = 'progress_A_tests';
            else if (prevLevelId === 2) prevProgressCol = 'progress_B_tests';
            // Get total tests in previous level
            const [prevLevelTestRows] = await pool.query('SELECT COUNT(*) as count FROM tests WHERE level_id = ?', [prevLevelId]);
            const totalPrevLevelTests = (prevLevelTestRows as any[])[0]?.count || 0;
            const [prevUserRows] = await pool.query(`SELECT COALESCE(${prevProgressCol}, 0) as progress FROM users WHERE id = ?`, [userId]);
            const prevProgress = (prevUserRows as any[])[0]?.progress || 0;
            console.log(`DEBUG: prevProgress=${prevProgress}, totalPrevLevelTests=${totalPrevLevelTests}, prevProgressCol=${prevProgressCol}`);
            if (prevProgress >= totalPrevLevelTests && test.sequence === currentProgress + 1) {
              await pool.query(`UPDATE users SET ${progressCol} = ${progressCol} + 1 WHERE id = ?`, [userId]);
              console.log(`DEBUG: Incremented ${progressCol} for user ${userId}`);
            }
          } else if (test.sequence === currentProgress + 1) {
            await pool.query(`UPDATE users SET ${progressCol} = ${progressCol} + 1 WHERE id = ?`, [userId]);
            console.log(`DEBUG: Incremented ${progressCol} for user ${userId}`);
          }
        }
      }

      // Get user's new XP
      const [userRows] = await pool.query('SELECT xp FROM users WHERE id = ?', [userId]);
      const newXP = (userRows as any[])[0]?.xp || 0;

      res.json({ success: true, xp: newXP, firstCompletion });
    } catch (error) {
      console.error('Error completing test:', error);
      res.status(500).json({ success: false, message: 'Error completing test' });
    }
  },
}; 