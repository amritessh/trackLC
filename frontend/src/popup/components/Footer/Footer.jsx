import React from 'react';

const Footer = ({ primaryAction, secondaryAction }) => {
  return (
    <footer className='p-4 border-t border-gray-200 bg-white mt-auto'>
      <div className='flex gap-2'>
        {primaryAction && (
          <button className='primary-button' onClick={primaryAction.onClick}>
            {primaryAction.label}
          </button>
        )}

        {secondaryAction && (
          <button
            className='secondary-button'
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
