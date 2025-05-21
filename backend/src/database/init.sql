-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_module_progress;
DROP TABLE IF EXISTS module_quiz_questions;
DROP TABLE IF EXISTS module_slides;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS module_levels;

-- Create tables
SOURCE schema.sql;

-- Insert test data
SOURCE seed.sql;

-- Drop the existing users table if it exists
DROP TABLE IF EXISTS users;

-- Create users table with refresh_token column
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert temporary admin user with hashed password (password: 1234)
INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$D8bll83m1wdjSpEUET1x5esMPC2nmVx5E9XasHbzIYzmeEI4fQi56')
ON DUPLICATE KEY UPDATE password = '$2b$10$D8bll83m1wdjSpEUET1x5esMPC2nmVx5E9XasHbzIYzmeEI4fQi56'; 