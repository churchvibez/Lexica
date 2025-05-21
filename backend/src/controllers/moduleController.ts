import { Request, Response } from 'express';
import { pool } from '../config/database';

export const moduleController = {
  async getModules(req: Request, res: Response) {
    try {
      // Fetch module levels and modules from the database
      const [levelsRows] = await pool.query('SELECT * FROM module_levels ORDER BY display_order');
      const levels = levelsRows as any[];

      const [modulesRows] = await pool.query('SELECT m.* FROM modules m ORDER BY m.level_id, m.sequence');
      const modules = modulesRows as any[];

      // Group modules by level
      const modulesByLevel = levels.map(level => ({
        ...level,
        modules: modules.filter(module => module.level_id === level.id)
      }));

      res.json({ success: true, data: modulesByLevel });

    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ success: false, message: 'Error fetching modules' });
    }
  },

  async getModuleDetail(req: Request, res: Response) {
    try {
      const { levelSlug, moduleSequence } = req.params;

      // Find the module based on level slug and sequence
      const [moduleRows] = await pool.query(
        'SELECT m.* FROM modules m JOIN module_levels ml ON m.level_id = ml.id WHERE ml.slug = ? AND m.sequence = ?',
        [levelSlug, moduleSequence]
      );
      const module = (moduleRows as any[])[0];

      if (!module) {
        return res.status(404).json({ success: false, message: 'Module not found' });
      }

      // Fetch slides for the module
      const [slidesRows] = await pool.query(
        'SELECT * FROM module_slides WHERE module_id = ? ORDER BY sequence',
        [module.id]
      );
      const slides = slidesRows as any[];

      // Fetch quiz questions for the module
      // Note: We'll fetch all questions and the frontend will select 5 randomly
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

  // We will add more functions here later for fetching slides and quizzes
}; 