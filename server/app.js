import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import computerRoutes from './routes/computerRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../images');
const distPath = path.join(__dirname, '../dist');

export function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';

  const corsOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
    : true;

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.use('/images', express.static(imagesDir));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, environment: process.env.NODE_ENV || 'development' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/computers', computerRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/audit', auditRoutes);

  if (isProduction) {
    app.use(express.static(distPath));
    app.get(/^(?!\/api).*/, (req, res, next) => {
      if (req.path.startsWith('/images')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) next();
      });
    });
  } else {
    app.get('/', (_req, res) => {
      res.json({ message: 'Marlboro Library API is running' });
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
