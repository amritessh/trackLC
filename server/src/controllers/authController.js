// src/controllers/authController.js
const githubService = require('../services/githubService');
const { github } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Exchange GitHub OAuth code for access token
 */
exports.exchangeToken = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing code parameter' });
    }

    const tokenData = await githubService.exchangeCodeForToken(code);
    
    // Try to get user info if token was obtained
    if (tokenData.access_token) {
      try {
        const userInfo = await githubService.getUserInfo(tokenData.access_token);
        tokenData.user = {
          login: userInfo.login,
          id: userInfo.id,
          avatar_url: userInfo.avatar_url
        };
      } catch (userError) {
        logger.warn('Error fetching user info, but token was obtained', userError);
      }
    }
    
    res.status(200).json(tokenData);
  } catch (error) {
    logger.error('Error exchanging token:', error);
    next(error);
  }
};

/**
 * Generate GitHub OAuth login URL
 */
exports.getLoginUrl = (req, res) => {
  const { clientId } = github;
  const { redirect_uri, state, scope = 'repo' } = req.query;
  
  const loginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}${redirect_uri ? `&redirect_uri=${redirect_uri}` : ''}${state ? `&state=${state}` : ''}`;
  
  res.status(200).json({ login_url: loginUrl });
};

/**
 * Verify GitHub token
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Missing token parameter' });
    }
    
    const isValid = await githubService.verifyToken(token);
    
    res.status(200).json({ valid: isValid });
  } catch (error) {
    logger.error('Error verifying token:', error);
    next(error);
  }
};