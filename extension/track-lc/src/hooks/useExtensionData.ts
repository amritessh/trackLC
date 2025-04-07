import { useState, useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

export function useExtensionData(autoFetch = true) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState(null)
  
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await sendToBackground({
        name: "get-data"
      })
      
      setData(response.data || [])
      setLoading(false)
      return response.data
    } catch (err) {
      setError("Failed to load data")
      setLoading(false)
      throw err
    }
  }
  
  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [])
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}