// src/utils/apiService.ts
// API Base URL - change to your deployed backend URL
const API_BASE_URL = "http://localhost:3000/api";

// Your GitHub OAuth credentials - for OAuth flow
const GITHUB_CLIENT_ID = "Iv23liJYiyEkZkzGCFcQ";

/**
 * Login with GitHub Personal Access Token
 * @param token Personal access token from GitHub
 */
export async function loginWithPersonalToken(token: string) {
  try {
    // Verify the token works by fetching user info
    const userInfo = await getGitHubUserInfo(token);
    
    // Return an object similar to the OAuth response
    return {
      access_token: token,
      token_type: "bearer",
      user: userInfo
    };
  } catch (error) {
    console.error("Error logging in with personal token:", error);
    throw error;
  }
}

/**
 * Exchange GitHub OAuth code for token
 */
export async function exchangeGitHubCode(code: string) {
  try {
    console.log(`Exchanging code through backend: ${code.substring(0, 5)}...`);
    
    const response = await fetch(`${API_BASE_URL}/auth/exchange-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to exchange GitHub code");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error exchanging GitHub code:", error);
    throw error;
  }
}

/**
 * Get GitHub login URL
 */
export async function getGitHubLoginUrl(state: string) {
  try {
    // Get the redirect URL for Chrome extensions
    const redirectUrl = chrome.identity.getRedirectURL ? 
                        chrome.identity.getRedirectURL() : 
                        `chrome-extension://${chrome.runtime.id}/`;
    
    console.log("Using redirect URL:", redirectUrl);
    
    // Create the URL directly without going through backend
    return {
      login_url: `https://github.com/login/oauth/authorize` +
                `?client_id=${GITHUB_CLIENT_ID}` +
                `&scope=repo` +
                `&state=${state}` +
                `&redirect_uri=${encodeURIComponent(redirectUrl)}`
    };
  } catch (error) {
    console.error("Error creating GitHub login URL:", error);
    throw error;
  }
}

/**
 * Get user information from GitHub
 */
export async function getGitHubUserInfo(token: string) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `token ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub user info:", error);
    throw error;
  }
}

/**
 * Verify GitHub token
 */
export async function verifyGitHubToken(token: string) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `token ${token}`
      }
    });
    
    return { valid: response.ok };
  } catch (error) {
    console.error("Error verifying GitHub token:", error);
    return { valid: false };
  }
}

/**
 * Create a new GitHub repository
 */
export async function createGitHubRepository(token: string, name: string, isPrivate = true) {
  try {
    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        private: isPrivate,
        auto_init: true,
        description: "My LeetCode solutions tracked by LeetSync"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create repository");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating GitHub repository:", error);
    throw error;
  }
}