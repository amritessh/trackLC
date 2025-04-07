import React from "react"

import DataItem from "./DataItem"

type Item = {
  id: number
  name: string
  description?: string
}

type DataListProps = {
  items: Item[]
  onItemClick?: (item: Item) => void
}

const DataList: React.FC<DataListProps> = ({ items, onItemClick }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => (
        <DataItem
          key={item.id}
          item={item}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </ul>
  )
}

export default DataList
