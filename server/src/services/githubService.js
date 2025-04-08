// src/services/githubService.js
const axios = require('axios');
const { github } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Exchange GitHub OAuth code for access token
 * @param {string} code - The authorization code from GitHub
 * @returns {Promise<object>} Token data
 */
exports.exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: github.clientId,
      client_secret: github.clientSecret,
      code
    }, {
      headers: {
        Accept: 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error('Error exchanging code for token:', error.message);
    throw new Error('Failed to exchange code for token');
  }
};

/**
 * Get user information using GitHub access token
 * @param {string} token - GitHub access token
 * @returns {Promise<object>} User information
 */
exports.getUserInfo = async (token) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error('Error fetching user info:', error.message);
    throw new Error('Failed to fetch user information');
  }
};

/**
 * Verify if a GitHub token is valid
 * @param {string} token - GitHub access token
 * @returns {Promise<boolean>} Whether the token is valid
 */
exports.verifyToken = async (token) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`
      }
    });
    
    return response.status === 200;
  } catch (error) {
    logger.error('Error verifying token:', error.message);
    return false;
  }
};