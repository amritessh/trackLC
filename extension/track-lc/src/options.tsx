import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import "./style.css"

import LoadingState from "./components/LoadingState"

function IndexOptions() {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    theme: "light",
    refreshInterval: 30
  })
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const storage = new Storage()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await storage.get("settings")
        if (savedSettings) {
          setSettings(savedSettings)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error loading settings:", error)
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    try {
      await storage.set("settings", settings)
      setStatus("Settings saved successfully!")
      setTimeout(() => setStatus(""), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setStatus("Error saving settings. Please try again.")
      setTimeout(() => setStatus(""), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState message="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Extension Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your extension preferences
          </p>
        </div>

        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-700">
            General Settings
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="font-medium text-gray-800">
              Enable Notifications
            </label>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  handleChange("enableNotifications", e.target.checked)
                }
                className="opacity-0 w-0 h-0"
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                  settings.enableNotifications ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() =>
                  handleChange(
                    "enableNotifications",
                    !settings.enableNotifications
                  )
                }>
                <span
                  className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-transform duration-200 ${
                    settings.enableNotifications
                      ? "transform translate-x-6"
                      : ""
                  }`}
                />
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="font-medium text-gray-800">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="p-2 pr-8 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <label className="font-medium text-gray-800">
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              min="5"
              max="3600"
              value={settings.refreshInterval}
              onChange={(e) =>
                handleChange("refreshInterval", parseInt(e.target.value) || 30)
              }
              className="w-20 p-2 border border-gray-300 rounded text-right"
            />
          </div>
        </div>

        {status && (
          <div className="mt-4 mb-6 p-3 text-center text-green-700 bg-green-100 rounded-md">
            {status}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default IndexOptions
