import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipesRouter from './routes/recipes';
import pantryRouter from './routes/pantry';
import shoppingRouter from './routes/shopping';
import favoritesRouter from './routes/favorites';
import ingredientsRouter from './routes/ingredients';
import aiRouter from './routes/ai';

// Load environment variables from .env if present
dotenv.config();

const app = express();

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'PantryPal AI',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// Mount API Routes
app.use('/api/recipes', recipesRouter);
app.use('/api/pantry', pantryRouter);
app.use('/api/shopping-list', shoppingRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/ai', aiRouter);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected error occurred. Please try again.'
  });
});

export default app;

