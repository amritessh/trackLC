// src/utils/apiService.ts
// API Base URL - change to your deployed backend URL
const API_BASE_URL = "http://localhost:3000/"

/**
 * Exchange GitHub OAuth code for token
 */
export async function exchangeGitHubCode(code: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/exchange-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to exchange GitHub code")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error exchanging GitHub code:", error)
    throw error
  }
}

/**
 * Get GitHub login URL
 */
export async function getGitHubLoginUrl(state: string) {
  try {
    const redirectUri = chrome.identity.getRedirectURL()
    
    const response = await fetch(
      `${API_BASE_URL}/auth/login-url?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
      { method: "GET" }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to get GitHub login URL")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error getting GitHub login URL:", error)
    throw error
  }
}

/**
 * Verify GitHub token
 */
export async function verifyGitHubToken(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
    
    if (!response.ok) {
      return { valid: false }
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error verifying GitHub token:", error)
    return { valid: false }
  }
}