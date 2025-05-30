import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.MYSQLHOST,
  port: parseInt(process.env.MYSQLPORT || "3306"),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export const pool = mysql.createPool(dbConfig);

export default dbConfig; 