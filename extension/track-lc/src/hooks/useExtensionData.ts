// src/hooks/useExtensionData.ts
import { useState, useEffect } from "react"
import { useStorage } from "./useStorage"
import { exchangeGitHubCode, getGitHubLoginUrl } from "../utils/apiService"

export function useExtensionData() {
  // Storage values with default states
  const { value: githubToken, updateValue: setGithubToken, removeValue: removeGithubToken } = 
    useStorage<string>("githubToken", null)
    
  const { value: githubUser, updateValue: setGithubUser } = 
    useStorage<any>("githubUser", null)
    
  const { value: repoOwner, updateValue: setRepoOwner } = 
    useStorage<string>("repoOwner", "")
    
  const { value: repoName, updateValue: setRepoName } = 
    useStorage<string>("repoName", "leetcode-solutions")
    
  const { value: syncedSubmissions, updateValue: setSyncedSubmissions } = 
    useStorage<any[]>("syncedSubmissions", [])
    
  const { value: pendingSubmissions, updateValue: setPendingSubmissions } = 
    useStorage<any[]>("pendingSubmissions", [])
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Current view
  const [currentView, setCurrentView] = useState<'loading' | 'login' | 'config' | 'submissions'>('loading')
  
  // Determine current view based on stored data
  useEffect(() => {
    if (!githubToken) {
      setCurrentView('login')
    } else if (!repoOwner || !repoName) {
      setCurrentView('config')
    } else {
      setCurrentView('submissions')
    }
  }, [githubToken, repoOwner, repoName])
  
  // Handle GitHub login
  const handleGitHubLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15)
      
      // Store state for verification
      await new Storage().set("oauth_state", state)
      
      // Get login URL from backend
      const { login_url } = await getGitHubLoginUrl(state)
      
      // Launch OAuth flow
      chrome.identity.launchWebAuthFlow(
        {
          url: login_url,
          interactive: true
        },
        async (redirectUrl) => {
          if (chrome.runtime.lastError) {
            setError("Authentication failed. Please try again.")
            setIsLoading(false)
            return
          }
          
          try {
            // Parse redirect URL
            const url = new URL(redirectUrl)
            const params = new URLSearchParams(url.search)
            const code = params.get("code")
            const returnedState = params.get("state")
            
            // Verify state
            const { oauth_state } = await new Storage().get("oauth_state")
            
            if (returnedState !== oauth_state) {
              setError("Security verification failed. Please try again.")
              setIsLoading(false)
              return
            }
            
            if (code) {
              // Exchange code for token
              const tokenData = await exchangeGitHubCode(code)
              
              if (tokenData.access_token) {
                // Save token
                await setGithubToken(tokenData.access_token)
                
                // Save user info if available
                if (tokenData.user) {
                  await setGithubUser(tokenData.user)
                  
                  // Pre-fill repo owner
                  if (tokenData.user.login) {
                    await setRepoOwner(tokenData.user.login)
                  }
                }
                
                setIsLoading(false)
              } else {
                setError("Failed to get access token. Please try again.")
                setIsLoading(false)
              }
            } else {
              setError("No authorization code received. Please try again.")
              setIsLoading(false)
            }
          } catch (error) {
            console.error("Error processing authentication:", error)
            setError("Authentication error: " + error.message)
            setIsLoading(false)
          }
        }
      )
    } catch (error) {
      console.error("Login error:", error)
      setError("Login error: " + error.message)
      setIsLoading(false)
    }
  }
  
  // Handle logout
  const handleLogout = async () => {
    await removeGithubToken()
  }
  
  // Save repository configuration
  const saveRepoConfig = async (owner: string, name: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate input
      if (!owner || !name) {
        setError("Please enter both owner and repository name")
        setIsLoading(false)
        return false
      }
      
      // Save configuration
      await setRepoOwner(owner)
      await setRepoName(name)
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Error saving configuration:", error)
      setError("Error saving configuration: " + error.message)
      setIsLoading(false)
      return false
    }
  }
  
  // Sync pending submissions
  const syncPending = async () => {
    if (pendingSubmissions && pendingSubmissions.length > 0) {
      chrome.runtime.sendMessage({ type: "SYNC_PENDING" })
    }
  }
  
  // Open GitHub repository
  const openRepository = () => {
    if (repoOwner && repoName) {
      chrome.tabs.create({ url: `https://github.com/${repoOwner}/${repoName}` })
    }
  }
  
  return {
    // State
    githubToken,
    githubUser,
    repoOwner,
    repoName,
    syncedSubmissions,
    pendingSubmissions,
    currentView,
    isLoading,
    error,
    
    // Actions
    handleGitHubLogin,
    handleLogout,
    saveRepoConfig,
    syncPending,
    openRepository
  }
}