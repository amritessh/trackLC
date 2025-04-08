// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require('./config/cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Apply security middleware
app.use(helmet());

// Configure CORS
app.use(cors(corsOptions));

// Request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Parse JSON requests
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;