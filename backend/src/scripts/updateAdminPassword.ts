import { pool } from '../config/database';
import bcrypt from 'bcrypt';

async function updateAdminPassword() {
  try {
    const password = '1234';
    const saltRounds = 10;
    
    // Generate hash
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:', hash);

    // Update database
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hash, 'admin']
    );

    console.log('Update result:', result);
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    process.exit();
  }
}

updateAdminPassword(); 