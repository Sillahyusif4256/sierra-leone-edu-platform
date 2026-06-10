// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const Tooltip = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-800',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-800',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-800',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-800',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-sl-blue transition"
        aria-label="Help"
      >
        <FiHelpCircle className="w-4 h-4" />
      </button>
      
      {isVisible && (
        <div className={`absolute z-50 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg ${positionClasses[position]}`}>
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
