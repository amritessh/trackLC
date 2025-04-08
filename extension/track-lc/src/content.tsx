// src/content.tsx
import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://leetcode.com/*"],
  all_frames: true
}

// Function to extract code from editor
function extractCode() {
  // Monaco editor (newer LeetCode interface)
  const monacoEditor = document.querySelector(".monaco-editor")
  if (monacoEditor) {
    const codeLines = monacoEditor.querySelectorAll(".view-line")
    return Array.from(codeLines)
      .map(line => line.textContent)
      .join("\n")
  }
  
  // Ace editor (older LeetCode interface)
  const aceEditor = document.querySelector(".ace_content")
  if (aceEditor) {
    const aceLines = aceEditor.querySelectorAll(".ace_line")
    return Array.from(aceLines)
      .map(line => line.textContent)
      .join("\n")
  }
  
  return ""
}

// Function to extract problem information
function extractProblemInfo() {
  // Try different selectors for problem title
  const titleElement = 
    document.querySelector(".css-v3d350") || 
    document.querySelector(".title__3BS7") ||
    document.querySelector("[data-cy='question-title']")
  
  const title = titleElement ? titleElement.textContent.trim() : "Unknown Problem"
  
  // Try different selectors for difficulty
  const difficultyElement = 
    document.querySelector(".css-10o4wqw") || 
    document.querySelector(".difficulty-label") ||
    document.querySelector("[diff]")
  
  const difficulty = difficultyElement ? difficultyElement.textContent.trim() : "Medium"
  
  // Try different selectors for language
  const languageElement = 
    document.querySelector(".css-1adwg7h") || 
    document.querySelector(".select-container")
  
  const language = languageElement ? languageElement.textContent.trim() : "JavaScript"
  
  return { title, difficulty, language }
}

// Watch for successful submissions
function watchForSubmissions() {
  // Create a MutationObserver to watch for success messages
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // Look for success message
        const successElement = 
          document.querySelector("[data-cy='submit-success']") || 
          document.querySelector(".success-icon") ||
          document.querySelector(".success__3Ai7")
        
        if (successElement) {
          handleSuccessfulSubmission()
        }
      }
    }
  })
  
  // Find the results container and start observing
  const resultsContainer = 
    document.querySelector(".content__1YuR") || 
    document.querySelector("[role='tabpanel']") ||
    document.body
  
  if (resultsContainer) {
    observer.observe(resultsContainer, { childList: true, subtree: true })
  }
}

// Handle successful submission
function handleSuccessfulSubmission() {
  // Extract problem information
  const { title, difficulty, language } = extractProblemInfo()
  
  // Extract code
  const code = extractCode()
  
  // Create submission data
  const submissionData = {
    title,
    difficulty,
    language,
    code,
    timestamp: new Date().toISOString()
  }
  
  // Send to background script
  chrome.runtime.sendMessage(
    { type: "SUBMISSION_DETECTED", data: submissionData },
    response => {
      console.log("Submission processed:", response)
    }
  )
}

// Initialize the content script
function initialize() {
  console.log("LeetSync content script initialized")
  
  // Start watching for submissions
  watchForSubmissions()
  
  // Also watch for navigation (LeetCode is a SPA)
  let lastUrl = location.href
  
  // Create an observer to detect URL changes
  const bodyObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href
      
      // Re-initialize submission watching
      setTimeout(watchForSubmissions, 1000)
    }
  })
  
  // Start observing
  bodyObserver.observe(document.body, { childList: true, subtree: true })
}

// Initialize the content script when the page loads
if (document.readyState === "complete") {
  initialize()
} else {
  window.addEventListener("load", initialize)
}