// src/server.js
const app = require('./app');
const { port } = require('./config/env');
const logger = require('./utils/logger');

// Start the server
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal (e.g., from Heroku)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully.');
  server.close(() => {
    logger.info('Process terminated.');
  });
});