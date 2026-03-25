import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sanitizeInput } from './middleware/sanitize.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import bookRoutes from './routes/book.routes';
import exerciseRoutes from './routes/exercise.routes';
import sessionRoutes from './routes/session.routes';
import levelRoutes from './routes/level.routes';
import dashboardRoutes from './routes/dashboard.routes';
import goalRoutes from './routes/goal.routes';
import recommendationRoutes from './routes/recommendation.routes';
import predictionRoutes from './routes/prediction.routes';
import exportRoutes from './routes/export.routes';
import exerciseProgressRoutes from './routes/exercise-progress.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
}));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(apiLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/exercise-progress', exerciseProgressRoutes);

// Serve uploaded files in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', (req, res, next) => {
    // Add CORS headers for PDF files
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }, express.static('uploads'));
}

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
