import express from 'express';
import { moduleController } from '../controllers/moduleController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Protected route to get all modules
router.get('/modules', authMiddleware, moduleController.getModules);

// Protected route to get module detail by level slug and sequence
router.get('/modules/:levelSlug/:moduleOrderId', authMiddleware, moduleController.getModuleDetail);

// Protected route to complete a module and award XP
router.post('/modules/:moduleId/complete', authMiddleware, moduleController.completeModule);

// We will add more routes here later for fetching slides and quizzes

export const moduleRouter = router; 