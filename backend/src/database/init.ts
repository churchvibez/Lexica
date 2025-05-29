import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'english_learning_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    console.log('Creating tables...');
    
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = schemaSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await pool.query(statement);
      } catch (error: any) {
        // Skip if table already exists
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`Table already exists, skipping: ${error.sqlMessage}`);
          continue;
        }
        throw error;
      }
    }

    console.log('Inserting seed data...');
    
    // Read and execute seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Split the SQL file into individual statements
    const seedStatements = seedSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of seedStatements) {
      try {
        await pool.query(statement);
      } catch (error: any) {
        // Skip if data already exists
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Data already exists, skipping: ${error.sqlMessage}`);
          continue;
        }
        throw error;
      }
    }

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 