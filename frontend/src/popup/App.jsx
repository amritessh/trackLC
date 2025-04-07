import React, { useState } from 'react';
import Header from './components/Header';
import DataList from './components/DataList';
import LoadingState from './components/LoadingState';
import Footer from './components/Footer';
import useExtensionData from './hooks/useExtensionData';
import useStorage from './hooks/useStorage';
import { formatData, filterData } from './utils/dataHelpers';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [theme] = useStorage('theme', 'light');

  // Fetch data from background script
  const {
    data: rawData,
    loading,
    error,
    refetch
  } = useExtensionData({
    action: 'getData'
  });

  // Process and format the data
  const formattedData = formatData(rawData);
  const filteredData = filterData(formattedData, searchTerm);

  // Handle item click
  const handleItemClick = (item) => {
    chrome.runtime.sendMessage({
      action: 'itemSelected',
      itemId: item.id
    });
  };

  // Open options page
  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  // Render content based on data loading state
  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <div className='flex flex-col items-center justify-center h-40 text-red-500'>
          <p>Error loading data: {error}</p>
          <button
            onClick={refetch}
            className='mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            Retry
          </button>
        </div>
      );
    }

    return <DataList items={filteredData} onItemClick={handleItemClick} />;
  };

  return (
    <div className={`popup-container ${theme}`}>
      <Header title='My Extension' onMenuClick={openSettings} />

      <div className='p-4 pt-2 pb-2'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <main className='flex-1 p-4 overflow-y-auto'>{renderContent()}</main>

      <Footer
        primaryAction={{
          label: 'Refresh',
          onClick: refetch
        }}
        secondaryAction={{
          label: 'Settings',
          onClick: openSettings
        }}
      />
    </div>
  );
}

export default App;
