import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import projectRotes from './routes/ProjectRoutes';

// Call environment variables
dotenv.config();

connectDB();

const app: Application = express();

app.use(express.json());

// Routes
app.use('/api/projects', projectRotes);

export default app;
