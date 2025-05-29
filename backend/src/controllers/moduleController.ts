import { Request, Response } from 'express';
import { pool } from '../config/database';

export const moduleController = {
  async getModules(req: Request, res: Response) {
    try {
      // Fetch module levels and modules from the database
      const [levelsRows] = await pool.query('SELECT * FROM module_levels ORDER BY display_order');
      const levels = levelsRows as any[];

      const [modulesRows] = await pool.query('SELECT m.* FROM modules m ORDER BY m.level_id, m.order_id');
      const modules = modulesRows as any[];

      // Group modules by level
      const modulesByLevel = levels.map(level => ({
        ...level,
        modules: modules.filter(module => module.level_id === level.id)
      }));

      // Fetch user progress
      let userProgress: Record<string, number> = {};
      if (req.user?.userId) {
        const [userRows] = await pool.query('SELECT progress_A_modules, progress_B_modules, progress_C_modules FROM users WHERE id = ?', [req.user.userId]);
        const userRowsArr = userRows as any[];
        if (userRowsArr && userRowsArr.length > 0) {
          userProgress = userRowsArr[0];
        }
      }

      res.json({ data: modulesByLevel, userProgress });
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ success: false, message: 'Error fetching modules' });
    }
  },

  async getModuleDetail(req: Request, res: Response) {
    try {
      console.log('ModuleController loaded');
      const { levelSlug, moduleOrderId } = req.params;
      console.log('DEBUG: levelSlug =', levelSlug, 'moduleOrderId =', moduleOrderId); // Debug log
      const userId = req.user?.userId;
      // Find the module based on level slug and order
      const [moduleRows] = await pool.query(
        'SELECT m.* FROM modules m JOIN module_levels ml ON m.level_id = ml.id WHERE ml.slug = ? AND m.order_id = ?',
        [levelSlug, moduleOrderId]
      );
      const module = (moduleRows as any[])[0];
      if (!module) {
        return res.status(404).json({ success: false, message: 'Module not found' });
      }
      // Get user progress
      let userProgress: Record<string, number> = {};
      if (userId) {
        const [userRows] = await pool.query('SELECT progress_A_modules, progress_B_modules, progress_C_modules FROM users WHERE id = ?', [userId]);
        userProgress = (userRows as any[])[0] || {};
      }
      // Get total modules in this level
      const [levelModuleRows] = await pool.query('SELECT COUNT(*) as count FROM modules WHERE level_id = ?', [module.level_id]);
      const totalModulesInLevel = (levelModuleRows as any[])[0]?.count || 0;
      // Check if user is allowed to access this module
      let progressKey = '';
      if (module.level_id === 1) progressKey = 'progress_A_modules';
      else if (module.level_id === 2) progressKey = 'progress_B_modules';
      else if (module.level_id === 3) progressKey = 'progress_C_modules';
      const progress = userProgress[progressKey] || 0;
      // For first module in B1-B2 or C1-C2, require previous level fully completed
      if (module.order_id === 1 && module.level_id > 1) {
        let prevProgressKey = '';
        let prevLevelId = module.level_id - 1;
        if (prevLevelId === 1) prevProgressKey = 'progress_A_modules';
        else if (prevLevelId === 2) prevProgressKey = 'progress_B_modules';
        // Get total modules in previous level
        const [prevLevelModuleRows] = await pool.query('SELECT COUNT(*) as count FROM modules WHERE level_id = ?', [prevLevelId]);
        const totalPrevLevelModules = (prevLevelModuleRows as any[])[0]?.count || 0;
        const prevProgress = userProgress[prevProgressKey] || 0;
        if (prevProgress < totalPrevLevelModules) {
          return res.status(403).json({ success: false, message: 'Module not unlocked yet' });
        }
      } else {
        // For other modules, require progress >= order_id - 1
        if (progress < (module.order_id - 1)) {
          return res.status(403).json({ success: false, message: 'Module not unlocked yet' });
        }
      }
      // Fetch slides for the module
      const [slidesRows] = await pool.query(
        'SELECT * FROM module_slides WHERE module_id = ? ORDER BY order_id',
        [module.id]
      );
      const slides = slidesRows as any[];
      // Fetch quiz questions for the module
      const [quizQuestionsRows] = await pool.query(
        'SELECT * FROM module_quiz_questions WHERE module_id = ?',
        [module.id]
      );
      const quizQuestions = quizQuestionsRows as any[];
      res.json({ success: true, data: { module, slides, quizQuestions } });
    } catch (error) {
      console.error('Error fetching module detail:', error);
      res.status(500).json({ success: false, message: 'Error fetching module detail' });
    }
  },

  async completeModule(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const moduleId = parseInt(req.params.moduleId, 10);
      const { correctAnswers } = req.body;
      if (!userId || !moduleId || typeof correctAnswers !== 'number') {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Get module info
      const [moduleRows] = await pool.query('SELECT * FROM modules WHERE id = ?', [moduleId]);
      const module = (moduleRows as any[])[0];
      if (!module) {
        return res.status(404).json({ success: false, message: 'Module not found' });
      }
      const baseXP = module.points;
      const bonusXP = correctAnswers;
      const totalXP = baseXP + bonusXP;

      // Add XP to user
      await pool.query('UPDATE users SET xp = xp + ?, modules_completed = modules_completed + 1 WHERE id = ?', [totalXP, userId]);

      // Check if user already completed this module
      const [progressRows] = await pool.query('SELECT * FROM user_module_progress WHERE user_id = ? AND module_id = ?', [userId, moduleId]);
      let firstCompletion = false;
      if ((progressRows as any[]).length === 0) {
        // Always record first completion
        await pool.query('INSERT INTO user_module_progress (user_id, module_id) VALUES (?, ?)', [userId, moduleId]);
        firstCompletion = true;
      }
      // Always check if progress should be incremented if 5/5 and progress is behind
      if (correctAnswers === 5) {
        let progressCol = '';
        if (module.level_id === 1) progressCol = 'progress_A_modules';
        else if (module.level_id === 2) progressCol = 'progress_B_modules';
        else if (module.level_id === 3) progressCol = 'progress_C_modules';
        if (progressCol) {
          // Get current progress (use COALESCE to default to 0)
          const [userRows] = await pool.query(`SELECT COALESCE(${progressCol}, 0) as progress FROM users WHERE id = ?`, [userId]);
          const currentProgress = (userRows as any[])[0]?.progress || 0;
          // For first module in B1-B2 or C1-C2, require previous level fully completed
          if (module.order_id === 1 && module.level_id > 1) {
            let prevProgressCol = '';
            let prevLevelId = module.level_id - 1;
            if (prevLevelId === 1) prevProgressCol = 'progress_A_modules';
            else if (prevLevelId === 2) prevProgressCol = 'progress_B_modules';
            // Get total modules in previous level
            const [prevLevelModuleRows] = await pool.query('SELECT COUNT(*) as count FROM modules WHERE level_id = ?', [prevLevelId]);
            const totalPrevLevelModules = (prevLevelModuleRows as any[])[0]?.count || 0;
            const [prevUserRows] = await pool.query(`SELECT COALESCE(${prevProgressCol}, 0) as progress FROM users WHERE id = ?`, [userId]);
            const prevProgress = (prevUserRows as any[])[0]?.progress || 0;
            if (prevProgress >= totalPrevLevelModules && module.order_id === currentProgress + 1) {
              await pool.query(`UPDATE users SET ${progressCol} = ${progressCol} + 1 WHERE id = ?`, [userId]);
            }
          } else if (module.order_id === currentProgress + 1) {
            await pool.query(`UPDATE users SET ${progressCol} = ${progressCol} + 1 WHERE id = ?`, [userId]);
          }
        }
      }

      // After updating progress, fetch the latest user progress
      const [userRows] = await pool.query('SELECT xp, progress_A_modules, progress_B_modules, progress_C_modules FROM users WHERE id = ?', [userId]);
      const userRow = (userRows as any[])[0] || {};
      const newXP = userRow.xp || 0;
      const updatedProgress = userRow;
      res.json({ success: true, xp: newXP, firstCompletion, userProgress: updatedProgress });
    } catch (error) {
      console.error('Error completing module:', error);
      res.status(500).json({ success: false, message: 'Error completing module' });
    }
  },

  // We will add more functions here later for fetching slides and quizzes
}; 