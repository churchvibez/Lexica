import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { authController } from './controllers/authController';
import { authRouter } from './routes/auth';
import { protectedRouter } from './routes/protected';
import { authMiddleware } from './middleware/auth';
import { moduleRouter } from './routes/modules';
import usersRouter from './routes/users';
import { testRouter } from './routes/tests';
import { initializeDatabase } from './database/init';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://churchvibez.github.io' // your GitHub Pages site
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

// db connection
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
  username: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "lexica",
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.post('/api/auth/login', authController.login);
app.use('/api/auth', authRouter);
app.use('/api/protected', protectedRouter);
app.use('/api', moduleRouter);
app.use('/api/users', usersRouter);
app.use('/api', testRouter);

// Protected routes
app.use('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

const PORT = process.env.PORT || 8080;

// Initialize database and start server
async function startServer() {
  try {
    // Initialize TypeORM
    await AppDataSource.initialize();
    console.log("Database connection established");

    // Initialize database tables and data
    await initializeDatabase();
    console.log("Database tables and data initialized");

    // Start server only after database is ready
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

// Start the server
startServer(); 