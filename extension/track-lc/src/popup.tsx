// src/popup.tsx
import { useExtensionData } from "./hooks/useExtensionData"
import "./style.css"

import Header from "./components/Header"
import Footer from "./components/Footer"
import LoadingState from "./components/LoadingState"
import DataList from "./components/DataList"

function LoginView({ onLogin, isLoading, error }) {
  return (
    <div className="p-4 flex flex-col items-center">
      <p className="text-center mb-4 text-gray-600">
        Connect with GitHub to sync your LeetCode solutions to a repository.
      </p>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm w-full">
          {error}
        </div>
      )}
      
      <button
        onClick={onLogin}
        disabled={isLoading}
        className="w-full py-2 px-4 bg-[#2f80ed] hover:bg-[#1a56a0] text-white rounded-md flex items-center justify-center"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )}
        Login with GitHub
      </button>
    </div>
  )
}

function ConfigView({ repoOwner, repoName, onSave, isLoading, error }) {
  const [owner, setOwner] = useState(repoOwner)
  const [name, setName] = useState(repoName)
  
  const handleSave = () => {
    onSave(owner, name)
  }
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">GitHub Repository Configuration</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-3 mb-4">
        <div>
          <label htmlFor="repoOwner" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Username
          </label>
          <input
            type="text"
            id="repoOwner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., yourusername"
          />
        </div>
        
        <div>
          <label htmlFor="repoName" className="block text-sm font-medium text-gray-700 mb-1">
            Repository Name
          </label>
          <input
            type="text"
            id="repoName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., leetcode-solutions"
          />
        </div>
      </div>
      
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full py-2 px-4 bg-[#2f80ed] hover:bg-[#1a56a0] text-white rounded-md"
      >
        {isLoading ? "Saving..." : "Save Configuration"}
      </button>
    </div>
  )
}

function SubmissionsView({ 
  syncedSubmissions, 
  pendingSubmissions, 
  onSyncPending, 
  onOpenRepo,
  repoOwner,
  repoName
}) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Submissions</h2>
        <button 
          onClick={onOpenRepo}
          className="text-[#2f80ed] hover:text-[#1a56a0] text-sm"
        >
          View Repository
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Synced Stats */}
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-gray-500 text-sm">Synced</div>
              <div className="text-2xl font-bold">{syncedSubmissions.length}</div>
            </div>
            <div className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Pending Stats */}
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-gray-500 text-sm">Pending</div>
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            </div>
            <div className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          
          {pendingSubmissions.length > 0 && (
            <button
              onClick={onSyncPending}
              className="w-full mt-2 text-xs text-[#2f80ed] hover:text-[#1a56a0] text-center"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>
      
      <h3 className="text-md font-medium mb-2">Recent Submissions</h3>
      
      {syncedSubmissions.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {syncedSubmissions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
            .map((submission, index) => (
              <SubmissionCard key={index} submission={submission} />
            ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
          No synced submissions yet
        </div>
      )}
      
      <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between">
        <span className="text-xs text-gray-500">
          Syncing to: {repoOwner}/{repoName}
        </span>
        <button 
          onClick={onLogout}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

function SubmissionCard({ submission }) {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-[#00af9b] text-white';
      case 'medium':
        return 'bg-[#ffb800] text-white';
      case 'hard':
        return 'bg-[#ff2d55] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium truncate max-w-[180px]">
            {submission.title}
          </div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <span>{submission.language}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(submission.timestamp)}</span>
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(submission.difficulty)}`}>
          {submission.difficulty}
        </div>
      </div>
    </div>
  )
}

function IndexPopup() {
  const {
    githubToken,
    githubUser,
    repoOwner,
    repoName,
    syncedSubmissions,
    pendingSubmissions,
    currentView,
    isLoading,
    error,
    handleGitHubLogin,
    handleLogout,
    saveRepoConfig,
    syncPending,
    openRepository
  } = useExtensionData()

  // Render different views based on state
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginView 
            onLogin={handleGitHubLogin} 
            isLoading={isLoading}
            error={error}
          />
        )
      case 'config':
        return (
          <ConfigView 
            repoOwner={repoOwner} 
            repoName={repoName}
            onSave={saveRepoConfig}
            isLoading={isLoading}
            error={error}
          />
        )
      case 'submissions':
        return (
          <SubmissionsView 
            syncedSubmissions={syncedSubmissions}
            pendingSubmissions={pendingSubmissions}
            onSyncPending={syncPending}
            onOpenRepo={openRepository}
            onLogout={handleLogout}
            repoOwner={repoOwner}
            repoName={repoName}
          />
        )
      case 'loading':
      default:
        return <LoadingState />
    }
  }

  return (
    <div className="w-96 min-h-[400px] bg-white text-gray-800 shadow-md rounded-md overflow-hidden">
      <Header />
      <main>
        {renderView()}
      </main>
      <Footer />
    </div>
  )
}

export default IndexPopup