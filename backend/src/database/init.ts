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

async function tableExists(tableName: string): Promise<boolean> {
  try {
    const [rows] = await pool.query(
      'SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ?',
      [process.env.MYSQLDATABASE, tableName]
    );
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

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
    // This regex looks for semicolons that are not inside quotes
    const statements = schemaSQL
      .split(/;(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/)
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (const statement of statements) {
      try {
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.length === 0) {
          continue;
        }

        // Check if this is a CREATE TABLE statement
        if (statement.toUpperCase().startsWith('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?`?(\w+)`?/i)?.[1];
          if (tableName) {
            const exists = await tableExists(tableName);
            if (exists) {
              console.log(`Table ${tableName} already exists, skipping creation`);
              continue;
            }
          }
        }

        // Log the first 100 characters of the statement for debugging
        console.log('Executing statement:', statement.substring(0, 100) + '...');
        
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
        console.error('Problematic statement:', statement);
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