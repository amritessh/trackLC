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
    console.log(`Attempting to exchange code for token: ${code.substring(0, 5)}...`);
    
    // Include the redirect URI in the token request (must match what was used in the authorization request)
    const params = {
      client_id: github.clientId,
      client_secret: github.clientSecret,
      code: code
      // Add the redirect URI if needed
      // redirect_uri: github.redirectUri 
    };
    
    console.log(`Making request to GitHub with client ID: ${github.clientId.substring(0, 5)}...`);
    
    const response = await axios.post('https://github.com/login/oauth/access_token', params, {
      headers: {
        Accept: 'application/json'
      }
    });
    
    if (response.data.error) {
      logger.error(`GitHub OAuth error: ${response.data.error} - ${response.data.error_description}`);
      throw new Error(response.data.error_description || response.data.error);
    }
    
    logger.info('Successfully exchanged code for token');
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      logger.error(`GitHub API error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      logger.error('No response received from GitHub', error.request);
    } else {
      // Something happened in setting up the request
      logger.error('Error setting up request:', error.message);
    }
    
    throw new Error('Failed to exchange code for token: ' + (error.message || 'Unknown error'));
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