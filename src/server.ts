import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import corsConfig from './config/cors';
import authRoutes from './routes/AuthRoutes';
import projectRotes from './routes/ProjectRoutes';
import teamRoutes from './routes/TeamRoutes';
import NoteRoutes from './routes/NoteRoutes';

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
const endpoint = process.env?.END_POINT || '';

app.use(`${endpoint}/auth`, authRoutes);
app.use(`${endpoint}/projects`, projectRotes);
app.use(`${endpoint}/team`, teamRoutes);
app.use(`${endpoint}/notes`, NoteRoutes);

export default app;
