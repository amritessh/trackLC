// src/components/DataList.tsx
import React from "react"
import DataItem from "./DataItem"

function DataList({ items, title, emptyMessage = "No items" }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="text-md font-medium mb-2">{title}</h3>}
      
      {items && items.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item, index) => (
            <DataItem key={index} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

export default DataList