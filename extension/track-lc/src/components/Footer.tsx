import React from "react"

type Action = {
  label: string
  onClick: () => void
}

type FooterProps = {
  primaryAction?: Action
  secondaryAction?: Action
}

const Footer: React.FC<FooterProps> = ({ primaryAction, secondaryAction }) => {
  return (
    <footer className="p-4 border-t border-gray-200 bg-white mt-auto">
      <div className="flex gap-2">
        {primaryAction && (
          <button
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={primaryAction.onClick}>
            {primaryAction.label}
          </button>
        )}

        {secondaryAction && (
          <button
            className="py-2 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
            onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        )}
      </div>
    </footer>
  )
}

export default Footer
