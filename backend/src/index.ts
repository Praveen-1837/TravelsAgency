import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Let Next.js frontend configure its own CSP
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration restricted to frontend domain
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matching frontend
      if (!origin || origin === FRONTEND_URL || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global API rate limiting
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', routes);

// Centralized error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.info(`✨ Aariva Voyages API server running at http://localhost:${PORT}`);
  });
}

export default app;
