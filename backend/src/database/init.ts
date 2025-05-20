import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split the SQL file into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log('Database initialized successfully!');
    
    // Verify the admin user was created
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
    console.log('Admin user:', rows);

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 