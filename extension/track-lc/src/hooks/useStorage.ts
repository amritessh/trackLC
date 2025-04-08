// src/hooks/useStorage.ts
import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"

// Initialize storage
const storage = new Storage()

/**
 * Hook for Chrome storage operations
 * @param key Storage key
 * @param defaultValue Default value
 */
export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [loaded, setLoaded] = useState(false)
  
  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await storage.get<T>(key)
        
        if (storedValue !== undefined) {
          setValue(storedValue)
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error)
      } finally {
        setLoaded(true)
      }
    }
    
    loadValue()
  }, [key])
  
  // Update function
  const updateValue = async (newValue: T) => {
    try {
      await storage.set(key, newValue)
      setValue(newValue)
      return true
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error)
      return false
    }
  }
  
  // Remove function
  const removeValue = async () => {
    try {
      await storage.remove(key)
      setValue(defaultValue)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error)
      return false
    }
  }
  
  return { value, updateValue, removeValue, loaded }
}