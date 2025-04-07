import React from 'react';

const Header = ({ title, onMenuClick }) => {
  return (
    <header className='bg-blue-600 text-white p-4 shadow-md flex justify-between items-center'>
      <h1 className='text-xl font-bold m-0'>{title}</h1>
      {onMenuClick && (
        <button
          className='p-1 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white'
          onClick={onMenuClick}
          aria-label='Menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='3' y1='12' x2='21' y2='12'></line>
            <line x1='3' y1='6' x2='21' y2='6'></line>
            <line x1='3' y1='18' x2='21' y2='18'></line>
          </svg>
        </button>
      )}
    </header>
  );
};

export default Header;
