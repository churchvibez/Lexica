import { pool } from '../config/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface LoginResult {
  success: boolean;
  message: string;
  username?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface TokenPayload {
  username: string;
  userId: number;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      console.log('Attempting login for username:', username);
      
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      const users = rows as any[];
      console.log('Found users:', users.length);
      
      if (users.length > 0) {
        const user = users[0];
        console.log('Stored password hash:', user.password);
        console.log('Input password:', password);
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);

        if (passwordMatch) {
          try {
            // Generate tokens
            const accessToken = jwt.sign(
              { username: user.username, userId: user.id } as TokenPayload,
              JWT_SECRET,
              { expiresIn: ACCESS_TOKEN_EXPIRY }
            );

            const refreshToken = jwt.sign(
              { username: user.username, userId: user.id } as TokenPayload,
              JWT_REFRESH_SECRET,
              { expiresIn: REFRESH_TOKEN_EXPIRY }
            );

            // Store refresh token in database
            await pool.query(
              'UPDATE users SET refresh_token = ? WHERE id = ?',
              [refreshToken, user.id]
            );

            return {
              success: true,
              message: 'Login successful',
              username: user.username,
              accessToken,
              refreshToken
            };
          } catch (tokenError) {
            console.error('Token generation error:', tokenError);
            throw new Error('Failed to generate authentication tokens');
          }
        }
      }

      return {
        success: false,
        message: 'Неправильное имя пользователя или пароль'
      };
    } catch (error) {
      console.error('Login error details:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ошибка при входе'
      };
    }
  },

  async refreshToken(refreshToken: string): Promise<LoginResult> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;
      
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? AND refresh_token = ?',
        [decoded.username, refreshToken]
      );

      const users = rows as any[];
      
      if (users.length > 0) {
        const user = users[0];
        
        // Generate new tokens
        const newAccessToken = jwt.sign(
          { username: user.username, userId: user.id } as TokenPayload,
          JWT_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
          { username: user.username, userId: user.id } as TokenPayload,
          JWT_REFRESH_SECRET,
          { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // Update refresh token in database
        await pool.query(
          'UPDATE users SET refresh_token = ? WHERE id = ?',
          [newRefreshToken, user.id]
        );

        return {
          success: true,
          message: 'Token refreshed successfully',
          username: user.username,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        };
      }

      return {
        success: false,
        message: 'Invalid refresh token'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: 'An error occurred during token refresh'
      };
    }
  },

  async logout(userId: number): Promise<boolean> {
    try {
      await pool.query(
        'UPDATE users SET refresh_token = NULL WHERE id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  async signup(username: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!username || !password) {
      return { success: false, message: 'Имя пользователя и пароль обязательны' };
    }
    try {
      const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
      const existingUsers = rows as any[];
      
      if (existingUsers.length > 0) {
        return { success: false, message: 'Имя пользователя уже занято' };
      }

      const hashed = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
      return { success: true, message: 'Аккаунт создан' };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: 'Ошибка при создании аккаунта' };
    }
  }
}; 