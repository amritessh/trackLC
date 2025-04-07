import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch data from the extension's background script
 * @param {Object} options - Configuration options
 * @param {string} options.action - The action to request from the background script
 * @param {Object} options.params - Additional parameters to send with the request
 * @param {boolean} options.autoFetch - Whether to fetch automatically on mount (default: true)
 * @returns {Object} { data, loading, error, refetch }
 */
const useExtensionData = ({ action, params = {}, autoFetch = true }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action, ...params },
        (response) => {
          // Handle potential error in message passing
          if (chrome.runtime.lastError) {
            setError(chrome.runtime.lastError.message);
            setLoading(false);
            resolve(null);
            return;
          }

          // Handle application-specific error
          if (response && response.error) {
            setError(response.error);
            setData(null);
          } else if (response) {
            setError(null);
            setData(response.data || response);
          } else {
            setError('No response received');
            setData(null);
          }

          setLoading(false);
          resolve(response);
        }
      );
    });
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [action, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export default useExtensionData;