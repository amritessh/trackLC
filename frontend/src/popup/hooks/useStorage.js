import { useState, useEffect } from 'react';

/**
 * Custom hook to work with Chrome's storage API
 * @param {string} key - The key to store/retrieve data
 * @param {any} defaultValue - Default value if no data exists
 * @param {string} storageArea - Which storage area to use ('sync' or 'local')
 * @returns {Array} [storedValue, setStoredValue, loading]
 */
const useStorage = (key, defaultValue, storageArea = 'sync') => {
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  // Get storage area (sync or local)
  const storage = storageArea === 'local' ? chrome.storage.local : chrome.storage.sync;

  // Load the initial value from storage
  useEffect(() => {
    const getStoredValue = async () => {
      try {
        const result = await new Promise(resolve => {
          storage.get([key], resolve);
        });
        
        if (result[key] !== undefined) {
          setStoredValue(result[key]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error reading from storage:', error);
        setLoading(false);
      }
    };

    getStoredValue();
  }, [key, storageArea]);

  // Update the stored value when it changes
  const setValue = (value) => {
    try {
      // If value is a function, use the previous state
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state
      setStoredValue(valueToStore);
      
      // Update Chrome storage
      storage.set({ [key]: valueToStore });
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  return [storedValue, setValue, loading];
};

export default useStorage;