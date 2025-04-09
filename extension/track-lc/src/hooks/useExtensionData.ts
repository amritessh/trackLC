// src/hooks/useExtensionData.ts
import { useState, useEffect } from "react"
import { useStorage } from "./useStorage"
import { 
  exchangeGitHubCode, 
  getGitHubLoginUrl, 
  loginWithPersonalToken 
} from "../utils/apiService"
import { Storage } from "@plasmohq/storage"

// Create a single storage instance to reuse
const storage = new Storage({ area: "local" })

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
    console.log("useEffect running with token:", githubToken ? "exists" : "none", 
                "repoOwner:", repoOwner, 
                "repoName:", repoName);
    
    if (!githubToken) {
      console.log("No token, setting view to login");
      setCurrentView('login')
    } else if (!repoOwner || !repoName) {
      console.log("Has token but missing repo info, setting view to config");
      setCurrentView('config')
    } else {
      console.log("All info present, setting view to submissions");
      setCurrentView('submissions')
    }
  }, [githubToken, repoOwner, repoName])
  
  // Handle GitHub login with Personal Access Token
  const handlePersonalTokenLogin = async (token: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Logging in with personal access token")
      
      // Validate and get user info with token
      const tokenData = await loginWithPersonalToken(token)
      
      console.log("Personal token validated, saving data")
      
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
      
      console.log("Personal token login successful")
      setIsLoading(false)
    } catch (error) {
      console.error("Error logging in with personal token:", error)
      setError("Invalid personal access token. Make sure it has the 'repo' scope.")
      setIsLoading(false)
    }
    console.log("View should now be:", currentView);
    document.body.style.border = '3px solid green'; 
  }
  
  // Handle GitHub OAuth login
  const handleGitHubLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15)
      
      // Store state for verification
      await storage.set("oauth_state", state)
      
      // Get login URL from backend
      const { login_url } = await getGitHubLoginUrl(state)
      
      console.log("Launching auth flow with URL:", login_url)
      
      // Launch OAuth flow
      chrome.identity.launchWebAuthFlow(
        {
          url: login_url,
          interactive: true
        },
        async (redirectUrl) => {
          console.log("Auth flow completed, redirect URL:", redirectUrl)
          
          if (!redirectUrl || chrome.runtime.lastError) {
            console.error("Auth flow error:", chrome.runtime.lastError)
            setError("Authentication failed. Please try again or use a Personal Access Token instead.")
            setIsLoading(false)
            return
          }
          
          try {
            // Parse redirect URL
            const url = new URL(redirectUrl)
            const params = new URLSearchParams(url.search)
            const code = params.get("code")
            const returnedState = params.get("state")
            
            console.log("Extracted code and state from redirect URL")
            
            // Verify state
            const oauth_state = await storage.get("oauth_state")
            
            if (returnedState !== oauth_state) {
              console.error("State mismatch", {
                returnedState,
                oauth_state
              })
              setError("Security verification failed. Please try again.")
              setIsLoading(false)
              return
            }
            
            if (code) {
              console.log("Got authorization code, exchanging for token")
              
              // Exchange code for token
              const tokenData = await exchangeGitHubCode(code)
              
              if (tokenData.access_token) {
                console.log("Got access token, saving to storage")
                console.log("Token saved successfully, current view:", currentView)
                
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
                console.error("No access token in response", tokenData)
                setError("Failed to get access token. Please try using a Personal Access Token instead.")
                setIsLoading(false)
              }
            } else {
              console.error("No code in redirect URL")
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
    handlePersonalTokenLogin,
    handleLogout,
    saveRepoConfig,
    syncPending,
    openRepository
  }
}