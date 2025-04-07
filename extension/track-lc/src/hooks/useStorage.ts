import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)
  const storage = new Storage()
  
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await storage.get(key)
        if (storedValue !== undefined) {
          setValue(storedValue as T)
        }
        setLoading(false)
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error)
        setLoading(false)
      }
    }
    
    loadValue()
  }, [key])
  
  const updateValue = async (newValue: T) => {
    try {
      await storage.set(key, newValue)
      setValue(newValue)
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error)
      throw error
    }
  }
  
  return [value, updateValue, loading]
}