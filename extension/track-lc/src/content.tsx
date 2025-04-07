import { sendToBackground } from "@plasmohq/messaging"

import "./style.css"

console.log("Content script loaded")

// Example: Find relevant data on the page
function scanPage() {
  const headings = Array.from(document.querySelectorAll("h1, h2, h3")).map(
    (element) => ({
      text: element.textContent,
      tag: element.tagName
    })
  )

  if (headings.length > 0) {
    // Send data to background script
    sendToBackground({
      name: "page-data",
      body: {
        url: window.location.href,
        title: document.title,
        headings
      }
    })
  }
}

// Run scan when page is loaded
window.addEventListener("load", scanPage)

export {}
