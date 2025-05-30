import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// This route is protected and requires a valid JWT token
router.get('/test', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'You have access to this protected route',
    user: req.user
  });
});

export const protectedRouter = router; 