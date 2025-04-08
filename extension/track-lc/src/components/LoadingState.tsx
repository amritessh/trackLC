// src/components/LoadingState.tsx
import React from "react"

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f80ed]"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}

export default LoadingState