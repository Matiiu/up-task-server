import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import projectRotes from './routes/ProjectRoutes';
import corsConfig from './config/cors';

// Call environment variables
dotenv.config();

connectDB();

const app: Application = express();
app.use(cors(corsConfig));

// Login
app.use(morgan('dev'));

// Read form data
app.use(express.json());

// Routes
app.use('/api/projects', projectRotes);

export default app;
