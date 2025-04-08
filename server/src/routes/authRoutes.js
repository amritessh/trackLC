// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// GitHub OAuth code exchange
router.post('/exchange-token', authController.exchangeToken);

// GitHub OAuth login URL
router.get('/login-url', authController.getLoginUrl);

// Verify token
router.post('/verify-token', authController.verifyToken);

module.exports = router;