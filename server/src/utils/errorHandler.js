// src/utils/errorHandler.js
const logger = require('./logger');
const { nodeEnv } = require('../config/env');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  // Log the error
  logger.error(`${err.name}: ${err.message}`);
  if (err.stack && nodeEnv !== 'production') {
    logger.error(err.stack);
  }
  
  // CORS error
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Cors Error',
      message: 'Origin not allowed'
    });
  }
  
  // Send error response
  res.status(err.statusCode).json({
    error: err.name || 'Error',
    message: nodeEnv === 'production' && err.statusCode === 500
      ? 'Something went wrong'
      : err.message
  });
};

module.exports = errorHandler;