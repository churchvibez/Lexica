import { pool } from '../config/database';

interface LoginResult {
  success: boolean;
  message: string;
  username?: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password]
      );

      const users = rows as any[];
      
      if (users.length > 0) {
        return {
          success: true,
          message: 'Login successful',
          username: users[0].username
        };
      }

      return {
        success: false,
        message: 'Invalid username or password'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }
}; 