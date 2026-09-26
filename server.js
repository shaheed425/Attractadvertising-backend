import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import logoRoutes from './routes/logoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import couponRoutes from './routes/couponRoutes.js';

// Connect to Database
connectDB();

const app = express();

// CORS Configuration
// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://localhost:5175',
//   'http://localhost:5176',
//   'http://localhost:5177',
//   process.env.FRONTEND_URL
// ].filter(Boolean);

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl) 
//     // or any localhost origin
//     if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.FRONTEND_URL) {
//       callback(null, true);
//     } else {
//       console.log('CORS Blocked for origin:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Comprehensive CORS Middleware supporting all origins & Vercel edge caching
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Dynamic origin or wildcard for dev & prod
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Static file serving for uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/team', employeeRoutes); // Alias
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/portfolios', portfolioRoutes); // Alias
app.use('/api/services', serviceRoutes);
app.use('/api/logos', logoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/coupons', couponRoutes);

app.get('/', (req, res) => {
  res.send('Portfolio Backend API: RUNNING');
});

// Middleware for errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
