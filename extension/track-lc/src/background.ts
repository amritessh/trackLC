import { Storage } from "@plasmohq/storage"

// Sample data for the extension
const sampleData = [
  { id: 1, name: "Item 1", description: "Description for item 1" },
  { id: 2, name: "Item 2", description: "Description for item 2" },
  { id: 3, name: "Item 3", description: "Description for item 3" }
]

// Initialize default settings when extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  const storage = new Storage()
  const settings = await storage.get("settings")
  
  if (!settings) {
    await storage.set("settings", {
      enableNotifications: true,
      theme: "light",
      refreshInterval: 30
    })
    console.log("Default settings initialized")
  }
})

// Handle messages from popup or options page
export async function handleMessage({ name, body }) {
  if (name === "get-data") {
    // In a real extension, you might fetch data from an API or storage
    return {
      data: sampleData
    }
  }
  
  if (name === "item-selected") {
    const { itemId } = body
    console.log("Item selected:", itemId)
    
    // Get settings to check if notifications are enabled
    const storage = new Storage()
    const settings = await storage.get("settings")
    
    // Show notification if enabled
    if (settings?.enableNotifications) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "/assets/icon48.png",
        title: "Item Selected",
        message: `You selected item #${itemId}`
      })
    }
    
    return { success: true }
  }
}