// src/utils/background.ts
import { Storage } from "@plasmohq/storage"

// Initialize storage
const storage = new Storage()

// Track pending submissions
let pendingSubmissions = []

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "SUBMISSION_DETECTED") {
    await processSubmission(message.data)
    sendResponse({ success: true })
  } else if (message.type === "SYNC_PENDING") {
    await syncPendingSubmissions()
    sendResponse({ success: true })
  }
  
  // Return true to indicate async response
  return true
})

// Process a LeetCode submission
async function processSubmission(submissionData) {
  try {
    // Get GitHub token and repository info
    const githubToken = await storage.get("githubToken")
    const repoOwner = await storage.get("repoOwner")
    const repoName = await storage.get("repoName")
    
    // Check if we have GitHub credentials
    if (!githubToken || !repoOwner || !repoName) {
      console.log("GitHub not configured, saving submission for later")
      
      // Get current pending submissions
      const currentPending = await storage.get("pendingSubmissions") || []
      
      // Add new submission to pending list
      const updatedPending = [...currentPending, {
        ...submissionData,
        timestamp: new Date().toISOString()
      }]
      
      // Save updated pending list
      await storage.set("pendingSubmissions", updatedPending)
      
      // Show notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "../assets/icon.png",
        title: "LeetSync - Submission Saved",
        message: `${submissionData.title} saved for later syncing. Please configure GitHub in the options.`
      })
      
      return
    }
    
    // Sync to GitHub
    await syncToGitHub(submissionData, githubToken, repoOwner, repoName)
    
    // Add to synced submissions history
    const syncedSubmissions = await storage.get("syncedSubmissions") || []
    await storage.set("syncedSubmissions", [
      ...syncedSubmissions, 
      {
        ...submissionData,
        syncedAt: new Date().toISOString()
      }
    ])
    
    // Show success notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "../assets/icon.png",
      title: "LeetSync - Synced!",
      message: `Successfully synced ${submissionData.title} to GitHub!`
    })
  } catch (error) {
    console.error("Error processing submission:", error)
    
    // Show error notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "../assets/icon.png",
      title: "LeetSync - Error",
      message: `Failed to sync: ${error.message}`
    })
  }
}

// Sync a submission to GitHub
async function syncToGitHub(submission, token, owner, repo) {
  const { title, code, language, difficulty } = submission
  
  // Format file path based on difficulty
  const difficultyFolder = difficulty.toLowerCase()
  const sanitizedTitle = title.replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const fileExtension = getFileExtension(language)
  const filePath = `${difficultyFolder}/${sanitizedTitle}.${fileExtension}`
  
  // Commit message
  const commitMessage = `Add solution for ${title}`
  
  // Check if file exists
  const fileExists = await checkFileExists(token, owner, repo, filePath)
  
  // Create or update file
  if (fileExists) {
    await updateFile(token, owner, repo, filePath, code, commitMessage, fileExists.sha)
  } else {
    await createFile(token, owner, repo, filePath, code, commitMessage)
  }
}

// Sync pending submissions
async function syncPendingSubmissions() {
  const pendingSubmissions = await storage.get("pendingSubmissions") || []
  
  if (pendingSubmissions.length === 0) {
    return
  }
  
  const githubToken = await storage.get("githubToken")
  const repoOwner = await storage.get("repoOwner")
  const repoName = await storage.get("repoName")
  
  if (!githubToken || !repoOwner || !repoName) {
    return
  }
  
  // Process one submission at a time
  const submission = pendingSubmissions[0]
  
  try {
    await syncToGitHub(submission, githubToken, repoOwner, repoName)
    
    // Remove from pending and add to synced
    const updatedPending = pendingSubmissions.slice(1)
    await storage.set("pendingSubmissions", updatedPending)
    
    // Add to synced submissions
    const syncedSubmissions = await storage.get("syncedSubmissions") || []
    await storage.set("syncedSubmissions", [
      ...syncedSubmissions,
      {
        ...submission,
        syncedAt: new Date().toISOString()
      }
    ])
    
    // Show notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "../assets/icon.png",
      title: "LeetSync - Synced!",
      message: `Successfully synced ${submission.title} to GitHub!`
    })
    
    // Continue with remaining pending submissions
    if (updatedPending.length > 0) {
      await syncPendingSubmissions()
    }
  } catch (error) {
    console.error("Error syncing pending submission:", error)
    
    // Show error notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "../assets/icon.png",
      title: "LeetSync - Error",
      message: `Failed to sync ${submission.title}: ${error.message}`
    })
  }
}

// GitHub API helpers
async function checkFileExists(token, owner, repo, path) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `token ${token}`
      }
    })
    
    if (response.status === 200) {
      const data = await response.json()
      return { exists: true, sha: data.sha }
    }
    
    return { exists: false }
  } catch (error) {
    console.error("Error checking if file exists:", error)
    return { exists: false }
  }
}

async function createFile(token, owner, repo, path, content, message) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: "main"
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create file")
  }
  
  return response.json()
}

async function updateFile(token, owner, repo, path, content, message, sha) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      sha,
      branch: "main"
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update file")
  }
  
  return response.json()
}

// Get file extension based on language
function getFileExtension(language) {
  const langMap = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    python3: "py",
    java: "java",
    cpp: "cpp",
    "c++": "cpp",
    c: "c",
    csharp: "cs",
    "c#": "cs",
    ruby: "rb",
    swift: "swift",
    go: "go",
    kotlin: "kt",
    rust: "rs",
    scala: "scala",
    php: "php",
    mysql: "sql",
    mssql: "sql"
  }
  
  const normalizedLang = language.toLowerCase().replace(/\s+/g, "")
  return langMap[normalizedLang] || "txt"
}

export {}