// extension/src/components/App.jsx
import React, { useState, useEffect } from 'react';
import LoginSection from './LoginSection';
import ConfigSection from './ConfigSection';
import SubmissionSection from './SubmissionSection';
import { getStorageData } from '../services/storageService';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [userData, setUserData] = useState({
    githubToken: null,
    repoOwner: '',
    repoName: '',
    syncedSubmissions: [],
    pendingSubmissions: []
  });

  useEffect(() => {
    // Load initial state from Chrome storage
    getStorageData([
      'githubToken',
      'repoOwner',
      'repoName',
      'syncedSubmissions',
      'pendingSubmissions'
    ]).then((data) => {
      setUserData({
        githubToken: data.githubToken || null,
        repoOwner: data.repoOwner || '',
        repoName: data.repoName || '',
        syncedSubmissions: data.syncedSubmissions || [],
        pendingSubmissions: data.pendingSubmissions || []
      });

      if (!data.githubToken) {
        setCurrentView('login');
      } else if (!data.repoOwner || !data.repoName) {
        setCurrentView('config');
      } else {
        setCurrentView('submissions');
      }
    });
  }, []);

  // Determine which component to show
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginSection onLogin={() => setCurrentView('config')} />;
      case 'config':
        return (
          <ConfigSection
            userData={userData}
            setUserData={setUserData}
            onConfigured={() => setCurrentView('submissions')}
          />
        );
      case 'submissions':
        return (
          <SubmissionSection
            userData={userData}
            onLogout={() => {
              setUserData({ ...userData, githubToken: null });
              setCurrentView('login');
            }}
          />
        );
      default:
        return (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
          </div>
        );
    }
  };

  return (
    <div className='w-96 bg-white text-gray-800 shadow-md rounded-md overflow-hidden'>
      <header className='flex items-center justify-center bg-primary text-white p-4'>
        <img
          src='../assets/icons/icon48.png'
          alt='LeetSync Logo'
          className='w-8 h-8 mr-2'
        />
        <h1 className='text-xl font-bold'>LeetSync</h1>
      </header>
      <main className='p-4'>{renderView()}</main>
    </div>
  );
}

export default App;
