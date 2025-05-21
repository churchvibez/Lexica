import express from 'express';
import { moduleController } from '../controllers/moduleController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Protected route to get all modules
router.get('/modules', authMiddleware, moduleController.getModules);

// Protected route to get module detail by level slug and sequence
router.get('/modules/:levelSlug/:moduleSequence', authMiddleware, moduleController.getModuleDetail);

// We will add more routes here later for fetching slides and quizzes

export const moduleRouter = router; 