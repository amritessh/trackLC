import React from "react"

type LoadingStateProps = {
  message?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
      <p className="text-gray-600 font-medium mt-2">{message}</p>
    </div>
  )
}

export default LoadingState
