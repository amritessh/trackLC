// src/components/DataItem.tsx
import React from "react"

function DataItem({ item }) {
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
            {item.title}
          </div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <span>{item.language}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(item.timestamp)}</span>
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
          {item.difficulty}
        </div>
      </div>
    </div>
  )
}

export default DataItem