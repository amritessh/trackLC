// extension/src/components/SubmissionSection.jsx
import React, { useState, useEffect } from 'react';
import {
  getStorageData,
  setStorageData,
  removeStorageData
} from '../services/storageService';
import StatsCard from './StatsCard';
import SubmissionCard from './SubmissionCard';

function SubmissionSection({ userData, onLogout }) {
  const [syncedSubmissions, setSyncedSubmissions] = useState(
    userData.syncedSubmissions || []
  );
  const [pendingSubmissions, setPendingSubmissions] = useState(
    userData.pendingSubmissions || []
  );

  useEffect(() => {
    // Refresh data from storage when component mounts
    getStorageData(['syncedSubmissions', 'pendingSubmissions']).then((data) => {
      setSyncedSubmissions(data.syncedSubmissions || []);
      setPendingSubmissions(data.pendingSubmissions || []);
    });
  }, []);

  const handleOpenRepo = () => {
    const repoUrl = `https://github.com/${userData.repoOwner}/${userData.repoName}`;
    chrome.tabs.create({ url: repoUrl });
  };

  const handleSyncPending = () => {
    // Trigger sync of pending submissions
    chrome.runtime.sendMessage({ type: 'SYNC_PENDING_SUBMISSIONS' });
  };

  const handleLogout = async () => {
    await removeStorageData('githubToken');
    onLogout();
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold'>Your Submissions</h2>
        <button
          onClick={handleOpenRepo}
          className='text-primary hover:text-primary-dark text-sm'
        >
          View Repository
        </button>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <StatsCard
          title='Synced'
          count={syncedSubmissions.length}
          icon='check-circle'
        />
        <StatsCard
          title='Pending'
          count={pendingSubmissions.length}
          icon='clock'
          action={pendingSubmissions.length > 0 ? handleSyncPending : null}
          actionLabel='Sync Now'
        />
      </div>

      <div className='space-y-2'>
        <h3 className='text-md font-medium'>Recent Submissions</h3>

        {syncedSubmissions.length > 0 ? (
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {syncedSubmissions
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 5)
              .map((submission, index) => (
                <SubmissionCard key={index} submission={submission} />
              ))}
          </div>
        ) : (
          <div className='bg-gray-50 rounded-md p-4 text-center text-gray-500'>
            No synced submissions yet
          </div>
        )}
      </div>

      <div className='pt-2 flex justify-between'>
        <span className='text-xs text-gray-500'>
          Syncing to: {userData.repoOwner}/{userData.repoName}
        </span>
        <button
          onClick={handleLogout}
          className='text-gray-500 hover:text-gray-700 text-sm'
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default SubmissionSection;
