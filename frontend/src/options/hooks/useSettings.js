import { useState, useEffect } from 'react';

/**
 * Custom hook to manage extension settings
 * @returns {Array} [settings, setSettings, saveSettings, status, loading]
 */
const useSettings = () => {
  const defaultSettings = {
    enableNotifications: true,
    theme: 'light',
    refreshInterval: 30
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await new Promise(resolve => {
          chrome.storage.sync.get(['settings'], resolve);
        });
        
        if (result.settings) {
          setSettings(result.settings);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to Chrome's storage
  const saveSettings = async () => {
    try {
      await new Promise(resolve => {
        chrome.storage.sync.set({ settings }, resolve);
      });
      setStatus('Settings saved successfully!');
      setTimeout(() => setStatus(''), 3000);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus('Error saving settings. Please try again.');
      setTimeout(() => setStatus(''), 3000);
      return false;
    }
  };

  return [settings, setSettings, saveSettings, status, loading];
};

export default useSettings;