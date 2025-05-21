import express from 'express';
import { authService } from '../services/authService';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  res.json(result);
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  res.json(result);
});

router.post('/logout', async (req, res) => {
  if (!req.user?.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  const success = await authService.logout(req.user.userId);
  res.json({ success });
});

export const authRouter = router; 