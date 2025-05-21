import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, '../database/init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split the SQL file into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Executed SQL statement successfully');
      }
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit();
  }
}

initDatabase(); 