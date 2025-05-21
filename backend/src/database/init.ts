import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaFile = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaFile, 'utf8');
    
    // Read the seed file
    const seedFile = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedFile, 'utf8');

    // Split the SQL files into individual statements
    const schemaStatements = schemaSql.split(';').filter(statement => statement.trim());
    const seedStatements = seedSql.split(';').filter(statement => statement.trim());

    // Execute schema statements
    console.log('Creating tables...');
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Executed schema statement successfully');
      }
    }

    // Execute seed statements
    console.log('Inserting test data...');
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Executed seed statement successfully');
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