// extension/src/components/ConfigSection.jsx
import React, { useState } from 'react';
import { setStorageData } from '../services/storageService';
import { useGitHub } from '../hooks/useGitHub';
import StatusMessage from './StatusMessage';

function ConfigSection({ userData, setUserData, onConfigured }) {
  const [repoOwner, setRepoOwner] = useState(userData.repoOwner || '');
  const [repoName, setRepoName] = useState(
    userData.repoName || 'leetcode-solutions'
  );
  const [status, setStatus] = useState({ type: '', message: '' });

  const { createRepo, checkRepo, loading, error } = useGitHub(
    userData.githubToken
  );

  const handleSaveConfig = async () => {
    if (!repoOwner || !repoName) {
      setStatus({
        type: 'error',
        message: 'Please enter both owner and repository name'
      });
      return;
    }

    try {
      // Check if the repository exists
      const repoExists = await checkRepo(repoOwner, repoName);

      if (repoExists) {
        // Save configuration
        await setStorageData({
          repoOwner: repoOwner,
          repoName: repoName
        });

        setUserData({
          ...userData,
          repoOwner,
          repoName
        });

        setStatus({
          type: 'success',
          message: 'Configuration saved successfully!'
        });
        setTimeout(() => onConfigured(), 1000);
      } else {
        setStatus({
          type: 'warning',
          message: 'Repository not found. Would you like to create it?'
        });
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Error checking repository'
      });
    }
  };

  const handleCreateRepo = async () => {
    try {
      await createRepo(repoName);

      // Save configuration
      await setStorageData({
        repoOwner: repoOwner,
        repoName: repoName
      });

      setUserData({
        ...userData,
        repoOwner,
        repoName
      });

      setStatus({
        type: 'success',
        message: 'Repository created successfully!'
      });
      setTimeout(() => onConfigured(), 1000);
    } catch (error) {
      console.error('Error creating repository:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Error creating repository'
      });
    }
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>GitHub Repository Configuration</h2>

      {status.message && (
        <StatusMessage type={status.type} message={status.message} />
      )}

      <div className='space-y-3'>
        <div>
          <label
            htmlFor='repoOwner'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            GitHub Username
          </label>
          <input
            type='text'
            id='repoOwner'
            value={repoOwner}
            onChange={(e) => setRepoOwner(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='e.g., yourusername'
          />
        </div>

        <div>
          <label
            htmlFor='repoName'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Repository Name
          </label>
          <input
            type='text'
            id='repoName'
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='e.g., leetcode-solutions'
          />
        </div>
      </div>

      <div className='flex space-x-3 pt-2'>
        <button
          onClick={handleSaveConfig}
          disabled={loading}
          className='btn btn-primary flex-1'
        >
          {loading ? 'Checking...' : 'Save Configuration'}
        </button>

        <button
          onClick={handleCreateRepo}
          disabled={loading}
          className='btn btn-secondary flex-1'
        >
          {loading ? 'Creating...' : 'Create New Repo'}
        </button>
      </div>
    </div>
  );
}

export default ConfigSection;
