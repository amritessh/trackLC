// src/config/cors.js
const { ALLOWED_ORIGINS } = require('./env');

// Parse allowed origins from environment variable or use defaults
const allowedOrigins = ALLOWED_ORIGINS 
  ? ALLOWED_ORIGINS.split(',') 
  : ['chrome-extension://your-extension-id', 'http://localhost:8080'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

module.exports = corsOptions;