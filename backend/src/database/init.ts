import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: parseInt(process.env.MYSQLPORT || "3306"),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initializeDatabase() {
  try {
    console.log('Initializing database with complete schema...');
    
    // Read the complete schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('Looking for schema.sql at:', schemaPath);
    
    // Check if file exists
    if (!fs.existsSync(schemaPath)) {
      console.error('schema.sql not found at:', schemaPath);
      console.log('Current directory:', __dirname);
      console.log('Directory contents:', fs.readdirSync(__dirname));
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }
    
    console.log('Found schema.sql, reading contents...');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('Successfully read schema.sql');
    
    // Split the SQL file into individual statements
    const statements = schemaSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log('Executed SQL statement successfully');
      } catch (error: any) {
        // Skip if table already exists or if it's a duplicate entry
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_ENTRY') {
          console.log(`Skipping: ${error.sqlMessage}`);
          continue;
        }
        // For other errors, log them but continue
        console.error('Error executing statement:', error.message);
        continue;
      }
    }

    console.log('Database initialized successfully with all tables and data!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
} 