// src/config/cors.js
const { allowedOrigins } = require('./env');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow ALL Chrome extension origins
    if (origin && origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    // Check against allowed origins from config
    if (allowedOrigins && (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*'))) {
      callback(null, true);
    } else {
      console.log(`Origin rejected by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

module.exports = corsOptions;