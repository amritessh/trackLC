import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import "./style.css"

import DataList from "./components/DataList"
import Footer from "./components/Footer"
import Header from "./components/Header"
import LoadingState from "./components/LoadingState"

function IndexPopup() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const storage = new Storage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendToBackground({
          name: "get-data"
        })

        setData(response.data || [])
        setLoading(false)
      } catch (err) {
        setError("Failed to load data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleItemClick = (item) => {
    sendToBackground({
      name: "item-selected",
      body: { itemId: item.id }
    })
  }

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    sendToBackground({
      name: "get-data"
    })
      .then((response) => {
        setData(response.data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to refresh data")
        setLoading(false)
      })
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div className="w-[350px] h-[500px] flex flex-col bg-white">
      <Header title="My Extension" onMenuClick={openOptions} />

      <div className="p-4 pt-2 pb-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <main className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 text-red-500">
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Retry
            </button>
          </div>
        ) : (
          <DataList items={filteredData} onItemClick={handleItemClick} />
        )}
      </main>

      <Footer
        primaryAction={{
          label: "Refresh",
          onClick: handleRefresh
        }}
        secondaryAction={{
          label: "Settings",
          onClick: openOptions
        }}
      />
    </div>
  )
}

export default IndexPopup
