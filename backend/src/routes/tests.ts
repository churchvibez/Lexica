import express from 'express';
import { testController } from '../controllers/testController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all tests grouped by level
router.get('/tests', authMiddleware, testController.getAllTests);

// Get test details and questions
router.get('/tests/:testId', authMiddleware, testController.getTestDetail);

// Complete a test and award XP
router.post('/tests/:testId/complete', authMiddleware, testController.completeTest);

export const testRouter = router; 