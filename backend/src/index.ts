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

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

// db connection
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "english_learning_platform",
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

AppDataSource.initialize()
  .then(() => {
    console.log("this message confirms the connection is up");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error)); 