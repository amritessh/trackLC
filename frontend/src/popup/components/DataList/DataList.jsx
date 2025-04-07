import React from 'react';
import DataItem from './DataItem';

const DataList = ({ items, onItemClick }) => {
  if (!items || items.length === 0) {
    return (
      <div className='empty-state'>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ul className='data-list'>
      {items.map((item, index) => (
        <DataItem
          key={item.id || index}
          item={item}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </ul>
  );
};

export default DataList;
