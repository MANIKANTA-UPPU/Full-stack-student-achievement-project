const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const achievementRoutes = require('./routes/achievements');
const teacherRoutes = require('./routes/teachers');
const reportRoutes = require('./routes/reports');
const superadminRoutes = require('./routes/superadmin');

const app = express();

/* ========================
   SECURITY & MIDDLEWARE
======================== */

// Trust proxy (required for Render / cloud platforms)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/* ========================
   CORS CONFIGURATION
======================== */

const allowedOrigin =
  process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

/* ========================
   BODY PARSER
======================== */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ========================
   STATIC FILES
======================== */

app.use('/uploads', express.static('uploads'));

/* ========================
   ROUTES
======================== */

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/superadmin', superadminRoutes);

/* ========================
   HEALTH CHECK
======================== */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ========================
   404 HANDLER
======================== */

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ========================
   GLOBAL ERROR HANDLER
======================== */

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  res.status(err.status || 500).json({
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined,
  });
});

/* ========================
   DATABASE CONNECTION
======================== */

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });