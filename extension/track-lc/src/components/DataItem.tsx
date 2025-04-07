import React from "react"

type Item = {
  id: number
  name: string
  description?: string
}

type DataItemProps = {
  item: Item
  onClick?: () => void
}

const DataItem: React.FC<DataItemProps> = ({ item, onClick }) => {
  return (
    <li
      className="py-3 px-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer rounded"
      onClick={onClick}>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{item.name}</span>
        {item.description && (
          <span className="text-sm text-gray-500">{item.description}</span>
        )}
      </div>
      <div className="text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </li>
  )
}

export default DataItem
