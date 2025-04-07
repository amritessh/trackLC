import React from 'react';

const Select = ({ id, value, onChange, options }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className='p-2 pr-8 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none'
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
