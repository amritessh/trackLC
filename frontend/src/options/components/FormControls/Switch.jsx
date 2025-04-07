import React from 'react';

const Switch = ({ id, checked, onChange }) => {
  return (
    <div className='relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in'>
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer'
      />
      <label
        htmlFor={id}
        className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
          checked ? 'bg-blue-600' : ''
        }`}
      ></label>
      <style jsx>{`
        .toggle-checkbox {
          right: 0;
          transition: all 0.2s ease-in;
          z-index: 1;
          border-color: #d1d5db;
          top: 0.25rem;
          left: 0.25rem;
        }
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #3b82f6;
        }
        .toggle-label {
          @apply transition-colors duration-200;
        }
      `}</style>
    </div>
  );
};

export default Switch;
